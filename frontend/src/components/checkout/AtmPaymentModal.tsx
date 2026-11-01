'use client';

import { useState } from 'react';
import Modal, { Row } from './Modal';
import BankQR from './BankQR';
import { PaymentModalProps } from '@/types/payment';
import { vnd } from '@/lib/format';

const BANKS = ['Vietcombank', 'Techcombank', 'MBBank', 'BIDV', 'ACB', 'VPBank'];

export default function AtmPaymentModal({ isOpen, onClose, onSuccess, amount, orderCode, orderId }: PaymentModalProps) {
  const [bank, setBank] = useState(BANKS[0]);
  const [mode, setMode] = useState<'qr' | 'card'>('qr');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const reset = () => { setStep('form'); setOtp(''); setLoading(false); };
  const close = () => { reset(); onClose(); };

  const submitOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { reset(); onSuccess('NAPAS-' + orderCode); }, 1000);
  };

  return (
    <Modal title="Thanh toán qua ngân hàng" subtitle="Quét mã QR bằng app ngân hàng hoặc nhập thẻ ATM nội địa" onClose={close}>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {BANKS.map((b) => (
          <button type="button" key={b} onClick={() => setBank(b)}
            className={`text-xs py-2 rounded-lg border ${bank === b ? 'border-neutral-900 font-medium' : 'border-neutral-200 text-neutral-600'}`}>
            {b}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 bg-neutral-100 rounded-lg p-1 mb-4 text-sm">
        {(['qr', 'card'] as const).map((m) => (
          <button key={m} type="button" onClick={() => { setMode(m); reset(); }}
            className={`py-1.5 rounded-md ${mode === m ? 'bg-white shadow-sm font-medium' : 'text-neutral-500'}`}>
            {m === 'qr' ? 'Quét mã QR' : 'Nhập thẻ ATM'}
          </button>
        ))}
      </div>

      {mode === 'qr' && (
        <>
          <p className="text-xs text-neutral-500 mb-3 text-center">Mở app {bank}, chọn Quét QR và hướng vào mã bên dưới</p>
          <BankQR orderId={orderId} />
          <button className="btn mt-4" onClick={() => onSuccess('QR-' + orderCode)}>Tôi đã chuyển khoản</button>
        </>
      )}

      {mode === 'card' && step === 'form' && (
        <form onSubmit={(e) => { e.preventDefault(); setStep('otp'); }} className="space-y-3">
          <input className="input font-mono" required inputMode="numeric" placeholder="Số thẻ (9704 ...)" />
          <input className="input uppercase" required placeholder="Tên chủ thẻ" />
          <Row label="Số tiền" value={vnd(amount)} />
          <button className="btn">Tiếp tục</button>
        </form>
      )}

      {mode === 'card' && step === 'otp' && (
        <form onSubmit={submitOtp} className="space-y-3">
          <p className="text-sm text-neutral-600">{bank} đã gửi mã OTP về điện thoại của bạn. Bản demo nhập 6 số bất kỳ.</p>
          <input className="input font-mono text-center tracking-[0.4em]" required maxLength={6} minLength={6}
            value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="••••••" />
          <button className="btn" disabled={loading || otp.length < 6}>{loading ? 'Đang xác thực...' : `Xác nhận ${vnd(amount)}`}</button>
        </form>
      )}
    </Modal>
  );
}
