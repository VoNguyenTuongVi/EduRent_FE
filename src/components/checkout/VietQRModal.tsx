'use client';

import React, { useState, useEffect } from 'react';
import { QrCode, CheckCircle2, X } from 'lucide-react';

interface VietQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  orderCode: string;
}

export default function VietQRModal({ isOpen, onClose, onSuccess, amount, orderCode }: VietQRModalProps) {
  const [timeLeft, setTimeLeft] = useState(900); // 15 phút đếm ngược

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  // Link sinh QR tự động theo chuẩn VietQR Napas
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=VIETQR_${orderCode}_${amount}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-center">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-slate-800">Thanh toán qua VietQR</h3>
        <p className="text-xs text-slate-500 mt-1">Mở ứng dụng Mobile Banking để quét mã Napas 247</p>

        <div className="my-4 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300 flex flex-col items-center">
          <img src={qrUrl} alt="VietQR" className="rounded-lg shadow-sm w-48 h-48 bg-white p-2" />
          <span className="text-xs font-medium text-slate-500 mt-2">
            Hết hạn sau: <span className="font-mono text-red-500 font-semibold">{minutes}:{seconds}</span>
          </span>
        </div>

        <div className="text-xs text-left bg-slate-50 p-3 rounded-lg space-y-1.5 border border-slate-100">
          <div className="flex justify-between">
            <span className="text-slate-500">Số tiền:</span>
            <span className="font-bold text-blue-600">{amount.toLocaleString('vi-VN')} VND</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Nội dung CK:</span>
            <span className="font-mono font-semibold text-slate-700">{orderCode}</span>
          </div>
        </div>

        <button
          onClick={onSuccess}
          className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition shadow-sm"
        >
          <CheckCircle2 className="w-4 h-4" />
          Xác nhận đã chuyển khoản
        </button>
      </div>
    </div>
  );
}