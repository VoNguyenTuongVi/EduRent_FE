'use client';

import { useState } from 'react';
import Modal, { Row } from './Modal';
import { PaymentModalProps } from '@/types/payment';
import { vnd } from '@/lib/format';

const BANKS = ['Vietcombank', 'Techcombank', 'MBBank', 'BIDV', 'ACB', 'VPBank'];

export default function AtmPaymentModal({ isOpen, onClose, onSuccess, amount, orderCode }: PaymentModalProps) {
  const [bank, setBank] = useState(BANKS[0]);
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const close = () => { setStep('form'); setOtp(''); onClose(); };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('otp');
  };

  const submitOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('form'); setOtp(''); onSuccess('NAPAS-' + orderCode); }, 1000);
  };

  return (
    <Modal title="Thanh toán qua ngân hàng" subtitle="Thẻ ATM nội địa / Internet Banking qua Napas" onClose={close}>
      {step === 'form' ? (
        <form onSubmit={submitForm} className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {BANKS.map((b) => (
              <button type="button" key={b} onClick={() => setBank(b)}
                className={`text-xs py-2 rounded-lg border ${bank === b ? 'border-neutral-900 font-medium' : 'border-neutral-200 text-neutral-600'}`}>
                {b}
              </button>
            ))}
          </div>
          <input className="input font-mono" required inputMode="numeric" placeholder="Số thẻ (9704 ...)" />
          <input className="input uppercase" required placeholder="Tên chủ thẻ" />
          <Row label="Số tiền" value={vnd(amount)} />
          <button className="btn">Tiếp tục</button>
        </form>
      ) : (
        <form onSubmit={submitOtp} className="space-y-3">
          <p className="text-sm text-neutral-600">{bank} đã gửi mã OTP về số điện thoại của bạn. Bản demo nhập 6 số bất kỳ.</p>
          <input className="input font-mono text-center tracking-[0.4em]" required maxLength={6} minLength={6}
            value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="••••••" />
          <button className="btn" disabled={loading || otp.length < 6}>{loading ? 'Đang xác thực...' : `Xác nhận ${vnd(amount)}`}</button>
        </form>
      )}
    </Modal>
  );
}
