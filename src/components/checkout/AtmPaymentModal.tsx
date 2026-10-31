'use client';

import React, { useState } from 'react';
import { Building2, X, Check, Lock } from 'lucide-react';

interface AtmPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
}

const BANKS = [
  { id: 'vcb', name: 'Vietcombank', short: 'VCB' },
  { id: 'tcb', name: 'Techcombank', short: 'TCB' },
  { id: 'mb', name: 'MBBank', short: 'MB' },
  { id: 'bidv', name: 'BIDV', short: 'BIDV' },
  { id: 'acb', name: 'ACB', short: 'ACB' },
  { id: 'vp', name: 'VPBank', short: 'VPB' },
];

export default function AtmPaymentModal({ isOpen, onClose, onSuccess, amount }: AtmPaymentModalProps) {
  const [selectedBank, setSelectedBank] = useState('tcb');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

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
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">Cổng Thanh Toán Napas (ATM)</h3>
            <p className="text-xs text-slate-500">Internet Banking hơn 40+ ngân hàng Việt Nam</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-medium text-slate-700 block mb-2">Chọn ngân hàng phát hành:</label>
            <div className="grid grid-cols-3 gap-2">
              {BANKS.map((b) => (
                <button
                  type="button"
                  key={b.id}
                  onClick={() => setSelectedBank(b.id)}
                  className={`p-2.5 rounded-lg border text-center font-bold text-xs transition relative ${
                    selectedBank === b.id 
                      ? 'border-blue-600 bg-blue-50 text-blue-600 ring-1 ring-blue-600' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {b.short}
                  {selectedBank === b.id && (
                    <span className="absolute top-1 right-1 w-3 h-3 bg-blue-600 text-white rounded-full flex items-center justify-center text-[8px]">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-medium text-slate-700 block mb-1">Số thẻ ATM / Số tài khoản</label>
            <input 
              type="text" 
              required
              placeholder="VD: 9704 xxxx xxxx" 
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 outline-none focus:border-blue-600 font-mono"
            />
          </div>

          <div>
            <label className="font-medium text-slate-700 block mb-1">Tên chủ tài khoản</label>
            <input 
              type="text" 
              required
              placeholder="VD: NGUYEN VAN A" 
              value={accountName}
              onChange={(e) => setAccountName(e.target.value.toUpperCase())}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 outline-none focus:border-blue-600 uppercase"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between items-center text-xs">
            <span className="text-slate-500">Số tiền cọc & thuê:</span>
            <span className="font-bold text-blue-600 text-sm">{amount.toLocaleString('vi-VN')} đ</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition shadow-sm flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            {loading ? 'Đang chuyển hướng Napas...' : 'Xác thực & Thanh toán'}
          </button>
        </form>
      </div>
    </div>
  );
}