'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Row } from './Modal';
import { RECEIVER, buildVietQR } from '@/lib/vietqr';
import { vnd } from '@/lib/format';

// Mã QR chuyển khoản dùng chung cho VietQR và phần ngân hàng
export default function BankQR({ amount, orderCode }: { amount: number; orderCode: string }) {
  const [qr, setQr] = useState('');
  useEffect(() => {
    QRCode.toDataURL(buildVietQR(amount, orderCode), { width: 240, margin: 1 }).then(setQr);
  }, [amount, orderCode]);

  return (
    <div>
      <div className="flex justify-center">
        {qr ? <img src={qr} alt="Mã QR chuyển khoản" className="w-48 h-48 border border-neutral-200 rounded-lg p-2" /> : <div className="w-48 h-48" />}
      </div>
      <div className="mt-3 border-t border-neutral-100 pt-2">
        <Row label="Ngân hàng nhận" value={RECEIVER.bankName} />
        <Row label="Số tài khoản" value={<span className="font-mono">{RECEIVER.accountNo}</span>} />
        <Row label="Chủ tài khoản" value={RECEIVER.accountName} />
        <Row label="Số tiền" value={vnd(amount)} />
        <Row label="Nội dung CK" value={<span className="font-mono">{orderCode}</span>} />
      </div>
    </div>
  );
}
