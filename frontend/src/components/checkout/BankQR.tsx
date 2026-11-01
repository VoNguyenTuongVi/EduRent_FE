'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Row } from './Modal';
import { api } from '@/lib/api';
import { vnd } from '@/lib/format';

interface QRInfo {
  payload: string;
  amount: number;
  content: string;
  receiver: { bankName: string; accountNo: string; accountName: string };
}

// Backend tạo chuỗi VietQR theo đơn hàng, trình duyệt chỉ vẽ thành mã QR
export default function BankQR({ orderId }: { orderId: string }) {
  const [info, setInfo] = useState<QRInfo | null>(null);
  const [img, setImg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    api<QRInfo>(`/orders/${orderId}/vietqr`)
      .then(async (i) => { setInfo(i); setImg(await QRCode.toDataURL(i.payload, { width: 240, margin: 1 })); })
      .catch((e) => setErr(e.message));
  }, [orderId]);

  if (err) return <p className="text-sm text-red-600">{err}</p>;

  return (
    <div>
      <div className="flex justify-center">
        {img ? <img src={img} alt="Mã QR chuyển khoản" className="w-48 h-48 border border-neutral-200 rounded-lg p-2" /> : <div className="w-48 h-48" />}
      </div>
      {info && (
        <div className="mt-3 border-t border-neutral-100 pt-2">
          <Row label="Ngân hàng nhận" value={info.receiver.bankName} />
          <Row label="Số tài khoản" value={<span className="font-mono">{info.receiver.accountNo}</span>} />
          <Row label="Chủ tài khoản" value={info.receiver.accountName} />
          <Row label="Số tiền" value={vnd(info.amount)} />
          <Row label="Nội dung CK" value={<span className="font-mono">{info.content}</span>} />
        </div>
      )}
    </div>
  );
}
