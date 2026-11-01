import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { db, save } from '../db.js';
import { allow, requireAuth } from '../auth.js';
import { RECEIVER, buildVietQR } from '../vietqr.js';

const r = Router();
r.use(requireAuth);

const METHODS = ['vietqr', 'bank', 'visa', 'paypal'];
const newCode = () => 'ER' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 90 + 10);

// Người cho thuê chỉ thấy phần đơn có đồ của mình, người mượn thấy đơn của mình, admin thấy hết
function view(order, user) {
  const renter = db().users.find((u) => u.id === order.renterId);
  const base = { ...order, renterName: renter?.fullName ?? '—' };
  if (user.role !== 'lender') return base;
  const items = order.items.filter((i) => i.ownerId === user.id);
  return { ...base, items, total: items.reduce((s, i) => s + i.subtotal, 0) };
}

// GET /api/orders
r.get('/', (req, res) => {
  const u = req.user;
  const list = db().orders.filter((o) =>
    u.role === 'admin' ? true : u.role === 'renter' ? o.renterId === u.id : o.items.some((i) => i.ownerId === u.id));
  res.json(list.map((o) => view(o, u)));
});

// POST /api/orders — tạo đơn "Chờ thanh toán". Tiền được máy chủ tự tính lại từ giá trong CSDL,
// không tin con số do trình duyệt gửi lên.
r.post('/', allow('renter'), (req, res) => {
  const { items = [], borrower = {}, method } = req.body;
  if (!METHODS.includes(method)) return res.status(400).json({ error: 'Phương thức thanh toán không hợp lệ' });
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Túi đồ đang trống' });
  for (const k of ['fullName', 'studentId', 'phone', 'pickupLocation'])
    if (!String(borrower[k] || '').trim()) return res.status(400).json({ error: 'Thiếu thông tin người mượn' });

  const lines = [];
  for (const it of items) {
    const p = db().products.find((x) => x.id === it.productId);
    if (!p) return res.status(400).json({ error: 'Có sản phẩm không còn tồn tại, hãy kiểm tra lại túi đồ' });
    const days = Math.min(30, Math.max(1, Math.round(Number(it.days) || 1)));
    const rent = p.rentalPricePerDay * days;
    lines.push({ productId: p.id, title: p.title, ownerId: p.ownerId, days, pricePerDay: p.rentalPricePerDay, rent, deposit: p.depositAmount, subtotal: rent + p.depositAmount });
  }

  const order = {
    id: randomUUID(), code: newCode(), renterId: req.user.id,
    borrower: { fullName: borrower.fullName, studentId: borrower.studentId, phone: borrower.phone, pickupLocation: borrower.pickupLocation },
    items: lines, total: lines.reduce((s, l) => s + l.subtotal, 0),
    method, status: 'pending', paymentRef: null, createdAt: new Date().toISOString(), paidAt: null,
  };
  db().orders.unshift(order);
  save();
  res.status(201).json(view(order, req.user));
});

// GET /api/orders/:id/vietqr — chuỗi VietQR để trình duyệt vẽ thành mã QR
r.get('/:id/vietqr', allow('renter'), (req, res) => {
  const o = db().orders.find((x) => x.id === req.params.id && x.renterId === req.user.id);
  if (!o) return res.status(404).json({ error: 'Không tìm thấy đơn' });
  res.json({ payload: buildVietQR(o.total, o.code), receiver: RECEIVER, amount: o.total, content: o.code });
});

// POST /api/orders/:id/pay — bản demo: trình duyệt báo đã thanh toán.
// Bản thật phải chờ cổng thanh toán gửi webhook và xác minh chữ ký trước khi đổi trạng thái.
r.post('/:id/pay', allow('renter'), (req, res) => {
  const o = db().orders.find((x) => x.id === req.params.id && x.renterId === req.user.id);
  if (!o) return res.status(404).json({ error: 'Không tìm thấy đơn' });
  if (o.status !== 'paid') {
    // lũy đẳng: gọi lại nhiều lần cũng không đổi kết quả
    o.status = 'paid';
    o.paymentRef = String(req.body.ref || '').slice(0, 64) || null;
    o.paidAt = new Date().toISOString();
    save();
  }
  res.json(view(o, req.user));
});

export default r;
