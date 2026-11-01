'use client';

import { useEffect, useState } from 'react';
import Modal from './Modal';
import BankQR from './BankQR';
import { PaymentModalProps } from '@/types/payment';

export default function VietQRModal({ isOpen, onClose, onSuccess, orderCode, orderId }: PaymentModalProps) {
  const [timeLeft, setTimeLeft] = useState(900); // 15 phút

  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(900);
    const t = setInterval(() => setTimeLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [isOpen]);

  if (!isOpen) return null;
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');

  return (
    <Modal title="Chuyển khoản VietQR" subtitle="Mở app ngân hàng bất kỳ và quét mã" onClose={onClose}>
      <BankQR orderId={orderId} />
      <p className="text-xs text-neutral-500 text-center mt-2">Mã hết hạn sau <span className="font-mono text-neutral-900">{mm}:{ss}</span></p>
      <button className="btn mt-4" disabled={timeLeft === 0} onClick={() => onSuccess('QR-' + orderCode)}>Tôi đã chuyển khoản</button>
    </Modal>
  );
}
