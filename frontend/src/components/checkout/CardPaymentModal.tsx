'use client';

import { useState } from 'react';
import Modal from './Modal';
import { PaymentModalProps } from '@/types/payment';
import { vnd } from '@/lib/format';

export default function CardPaymentModal({ isOpen, onClose, onSuccess, amount, orderCode }: PaymentModalProps) {
  const [card, setCard] = useState('');
  const [exp, setExp] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const digits = card.replace(/\s/g, '');
  const brand = digits.startsWith('4') ? 'Visa' : /^5[1-5]/.test(digits) ? 'Mastercard' : '';

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess('CARD-' + orderCode); }, 1200);
  };

  return (
    <Modal title="Thẻ Visa / Mastercard" subtitle="Thẻ thử: 4111 1111 1111 1111, hạn bất kỳ" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <div className="relative">
          <input className="input font-mono pr-24" required inputMode="numeric" placeholder="Số thẻ" value={card}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
              setCard(raw.match(/.{1,4}/g)?.join(' ') ?? raw);
            }} />
          {brand && <span className="absolute right-3 top-2.5 text-xs font-semibold text-neutral-500">{brand}</span>}
        </div>
        <input className="input uppercase" required placeholder="Tên in trên thẻ" />
        <div className="grid grid-cols-2 gap-3">
          <input className="input font-mono text-center" required placeholder="MM/YY" value={exp}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
              setExp(raw.length > 2 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw);
            }} />
          <input className="input font-mono text-center" required type="password" maxLength={3} minLength={3} placeholder="CVV" />
        </div>
        <button className="btn" disabled={loading || digits.length < 16 || exp.length < 5}>
          {loading ? 'Đang xác thực 3-D Secure...' : `Thanh toán ${vnd(amount)}`}
        </button>
        <p className="text-[11px] text-center text-neutral-400">Bản demo không lưu và không gửi thông tin thẻ đi đâu cả.</p>
      </form>
    </Modal>
  );
}
