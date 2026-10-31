'use client';

import React, { useState } from 'react';
import { CreditCard, X, ShieldCheck, Lock } from 'lucide-react';

interface CardPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
}

export default function CardPaymentModal({ isOpen, onClose, onSuccess, amount }: CardPaymentModalProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Format số thẻ theo cụm 4 số
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  // Format hạn thẻ MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpiry(raw);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-800">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">Thanh toán Thẻ Quốc Tế</h3>
            <p className="text-xs text-slate-500">Hỗ trợ Visa, Mastercard, JCB</p>
          </div>
        </div>

        {/* Mock Thẻ ATM mô phỏng */}
        <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-900 text-white rounded-xl p-4 shadow-md mb-5 relative overflow-hidden">
          <div className="flex justify-between items-center text-xs opacity-70">
            <span>DEBIT / CREDIT</span>
            <span className="font-bold tracking-widest">VISA</span>
          </div>
          <div className="my-3 font-mono text-lg tracking-widest">
            {cardNumber || '•••• •••• •••• ••••'}
          </div>
          <div className="flex justify-between text-[11px] uppercase">
            <div>
              <span className="text-[9px] block text-slate-400">Chủ thẻ</span>
              <span className="font-semibold">{cardHolder || 'NGUYEN VAN A'}</span>
            </div>
            <div>
              <span className="text-[9px] block text-slate-400">Hạn thẻ</span>
              <span className="font-semibold">{expiry || 'MM/YY'}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-medium text-slate-700 block mb-1">Số thẻ tín dụng / ghi nợ</label>
            <input 
              type="text" 
              required
              placeholder="4123 4567 8901 2345" 
              value={cardNumber}
              onChange={handleCardNumberChange}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 outline-none focus:border-blue-600 font-mono"
            />
          </div>

          <div>
            <label className="font-medium text-slate-700 block mb-1">Tên in trên thẻ (không dấu)</label>
            <input 
              type="text" 
              required
              placeholder="VD: NGUYEN VAN A" 
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 outline-none focus:border-blue-600 uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Ngày hết hạn</label>
              <input 
                type="text" 
                required
                placeholder="MM/YY" 
                value={expiry}
                onChange={handleExpiryChange}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 outline-none focus:border-blue-600 text-center font-mono"
              />
            </div>
            <div>
              <label className="font-medium text-slate-700 block mb-1">Mã bảo mật (CVV)</label>
              <input 
                type="password" 
                required
                maxLength={3}
                placeholder="•••" 
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 outline-none focus:border-blue-600 text-center font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition shadow-sm flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              {loading ? 'Đang xác thực...' : `Thanh toán ${amount.toLocaleString('vi-VN')} đ`}
            </button>
          </div>

          <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Bảo mật thanh toán chuẩn PCI-DSS 256-bit SSL
          </p>
        </form>
      </div>
    </div>
  );
}