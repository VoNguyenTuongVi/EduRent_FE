'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import Modal, { Row } from './Modal';
import { PaymentModalProps } from '@/types/payment';
import { vnd } from '@/lib/format';

export default function VietQRModal({ isOpen, onClose, onSuccess, amount, orderCode }: PaymentModalProps) {
  const [timeLeft, setTimeLeft] = useState(900); // 15 phút
  const [qr, setQr] = useState('');

  // Mã QR mô phỏng sinh ngay trên trình duyệt: nội dung gồm mã đơn và số tiền
  // (bản thật sẽ lấy chuỗi VietQR theo chuẩn Napas 247 do ngân hàng/cổng cung cấp)
  useEffect(() => {
    if (isOpen) QRCode.toDataURL(`VIETQR|${orderCode}|${amount}`, { width: 220, margin: 1 }).then(setQr);
  }, [isOpen, orderCode, amount]);

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
      <div className="flex flex-col items-center">
        {qr ? <img src={qr} alt="Mã VietQR" className="w-48 h-48 border border-neutral-200 rounded-lg p-2" /> : <div className="w-48 h-48" />}
        <p className="text-xs text-neutral-500 mt-2">Hết hạn sau <span className="font-mono text-neutral-900">{mm}:{ss}</span></p>
      </div>
      <div className="mt-4 border-t border-neutral-100 pt-3">
        <Row label="Số tiền" value={vnd(amount)} />
        <Row label="Nội dung CK" value={<span className="font-mono">{orderCode}</span>} />
      </div>
      <button className="btn mt-4" disabled={timeLeft === 0} onClick={() => onSuccess('QR-' + orderCode)}>
        Tôi đã chuyển khoản
      </button>
    </Modal>
  );
}
