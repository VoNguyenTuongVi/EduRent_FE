'use client';

import { useState } from 'react';
import Modal, { Row } from './Modal';
import { PaymentModalProps } from '@/types/payment';
import { USD_RATE, toUsd, vnd } from '@/lib/format';

// Mô phỏng luồng PayPal Checkout (Orders API v2, chế độ chuyển hướng):
// tạo đơn -> khách duyệt trên trang PayPal -> máy chủ capture -> đối chiếu kết quả
type Stage = 'start' | 'approve' | 'capture' | 'cancelled';

const rid = () => Math.random().toString(36).slice(2, 12).toUpperCase();

export default function PayPalModal({ isOpen, onClose, onSuccess, amount, orderCode }: PaymentModalProps) {
  const [stage, setStage] = useState<Stage>('start');
  const [orderId, setOrderId] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const usd = toUsd(amount);
  const close = () => { setStage('start'); setOrderId(''); onClose(); };

  // B5: POST /v2/checkout/orders -> PAYER_ACTION_REQUIRED
  const createOrder = () => {
    setBusy(true);
    setTimeout(() => { setOrderId(rid()); setStage('approve'); setBusy(false); }, 800);
  };

  // B8: POST /v2/checkout/orders/{id}/capture -> COMPLETED, đối chiếu số tiền và reference_id
  const capture = () => {
    setStage('capture');
    setBusy(true);
    setTimeout(() => { setBusy(false); setStage('start'); onSuccess('CAPTURE-' + rid()); }, 1200);
  };

  return (
    <Modal title="Thanh toán PayPal" subtitle="Mô phỏng môi trường Sandbox, không phát sinh tiền thật" onClose={close}>
      {stage === 'start' && (
        <div className="space-y-3">
          <Row label="Mã đơn (reference_id)" value={<span className="font-mono">{orderCode}</span>} />
          <Row label="Số tiền" value={vnd(amount)} />
          <Row label="Quy đổi" value={`${usd} USD`} />
          <p className="text-xs text-neutral-500">PayPal không nhận VND nên đơn được quy đổi sang USD theo tỷ giá tham khảo {USD_RATE.toLocaleString('vi-VN')} đ/USD.</p>
          <button className="btn" onClick={createOrder} disabled={busy}>{busy ? 'Đang tạo đơn...' : 'Tiếp tục với PayPal'}</button>
        </div>
      )}

      {stage === 'approve' && (
        <div className="space-y-3">
          <div className="rounded-lg border border-neutral-200 p-4 space-y-3 bg-neutral-50">
            <p className="text-xs text-neutral-500">sandbox.paypal.com · Order {orderId}</p>
            <input className="input" defaultValue="sb-buyer@personal.example.com" />
            <input className="input" type="password" defaultValue="12345678" />
            <Row label="Bạn sẽ trả" value={`${usd} USD`} />
          </div>
          <button className="btn" onClick={capture}>Duyệt thanh toán</button>
          <button className="w-full text-sm text-neutral-500 py-2" onClick={() => setStage('cancelled')}>Hủy và quay lại cửa hàng</button>
        </div>
      )}

      {stage === 'capture' && (
        <p className="text-sm text-neutral-600 py-6 text-center">Đang chốt thu tiền và đối chiếu số tiền, loại tiền, mã đơn...</p>
      )}

      {stage === 'cancelled' && (
        <div className="space-y-3">
          <p className="text-sm text-neutral-600">Bạn đã hủy trên trang PayPal (cancel_url). Đơn {orderCode} vẫn ở trạng thái chờ thanh toán.</p>
          <button className="btn" onClick={() => setStage('start')}>Thử lại</button>
        </div>
      )}
    </Modal>
  );
}
