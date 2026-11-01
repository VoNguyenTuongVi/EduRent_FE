import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { db, save } from '../db.js';
import { allow, requireAuth } from '../auth.js';

const r = Router();
r.use(requireAuth);

const ownerName = (id) => db().users.find((u) => u.id === id)?.fullName ?? '—';
const withOwner = (p) => ({ ...p, ownerName: ownerName(p.ownerId) });

// Admin và người mượn thấy mọi sản phẩm, người cho thuê chỉ thấy sản phẩm của mình
export function visibleProducts(user) {
  const all = db().products;
  return user.role === 'lender' ? all.filter((p) => p.ownerId === user.id) : all;
}

function clean(body) {
  const n = (v) => Math.max(0, Math.round(Number(v) || 0));
  const images = Array.isArray(body.images) ? body.images.filter((s) => typeof s === 'string' && s.trim()) : [];
  const p = {
    title: String(body.title || '').trim(),
    category: String(body.category || '').trim(),
    images,
    rentalPricePerDay: n(body.rentalPricePerDay),
    depositAmount: n(body.depositAmount),
    durationDays: Math.min(30, Math.max(1, n(body.durationDays) || 1)),
  };
  if (!p.title || !p.category) return { error: 'Thiếu tên hoặc danh mục' };
  if (images.length === 0) return { error: 'Cần ít nhất một ảnh' };
  if (p.rentalPricePerDay <= 0) return { error: 'Giá mượn phải lớn hơn 0' };
  return { p };
}

// Chỉ admin hoặc chủ sản phẩm mới được sửa/xóa
function findEditable(req, res) {
  const p = db().products.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' }), null;
  if (req.user.role !== 'admin' && p.ownerId !== req.user.id)
    return res.status(403).json({ error: 'Đây không phải sản phẩm của bạn' }), null;
  return p;
}

// GET /api/products
r.get('/', (req, res) => res.json(visibleProducts(req.user).map(withOwner)));

// GET /api/products/:id
r.get('/:id', (req, res) => {
  const p = visibleProducts(req.user).find((x) => x.id === req.params.id);
  p ? res.json(withOwner(p)) : res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
});

// POST /api/products — người cho thuê đăng đồ của mình, admin có thể chọn chủ sở hữu
r.post('/', allow('admin', 'lender'), (req, res) => {
  const { p, error } = clean(req.body);
  if (error) return res.status(400).json({ error });
  let ownerId = req.user.id;
  if (req.user.role === 'admin' && req.body.ownerId) {
    if (!db().users.some((u) => u.id === req.body.ownerId && u.role === 'lender')) return res.status(400).json({ error: 'Chủ sở hữu không hợp lệ' });
    ownerId = req.body.ownerId;
  }
  const product = { id: 'item-' + randomUUID().slice(0, 8), ownerId, ...p };
  db().products.unshift(product);
  save();
  res.status(201).json(withOwner(product));
});

// PUT /api/products/:id
r.put('/:id', allow('admin', 'lender'), (req, res) => {
  const existing = findEditable(req, res);
  if (!existing) return;
  const { p, error } = clean(req.body);
  if (error) return res.status(400).json({ error });
  Object.assign(existing, p);
  if (req.user.role === 'admin' && req.body.ownerId && db().users.some((u) => u.id === req.body.ownerId && u.role === 'lender'))
    existing.ownerId = req.body.ownerId;
  save();
  res.json(withOwner(existing));
});

// DELETE /api/products/:id
r.delete('/:id', allow('admin', 'lender'), (req, res) => {
  const existing = findEditable(req, res);
  if (!existing) return;
  db().products = db().products.filter((x) => x.id !== existing.id);
  save();
  res.status(204).end();
});

export default r;
