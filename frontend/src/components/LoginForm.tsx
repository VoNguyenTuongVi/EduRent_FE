'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const DEMO = [
  ['admin', 'admin123', 'Quản trị'],
  ['chothue01', '123456', 'Người cho thuê'],
  ['sv01', '123456', 'Người mượn'],
];

export default function LoginForm() {
  const { user, login, register } = useAuth();
  const router = useRouter();
  const next = useSearchParams().get('next') || '/';
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [f, setF] = useState({ username: '', password: '', role: 'renter', fullName: '', studentId: '', phone: '', pickupLocation: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) router.replace(next); }, [user, next, router]);

  const bind = (k: keyof typeof f) => ({ value: f[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value }) });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      if (mode === 'login') await login(f.username, f.password);
      else await register(f);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">EduRent</h1>
          <p className="text-sm text-neutral-500 mt-1">Mượn và cho thuê đồ trong khuôn viên trường</p>
        </div>

        <div className="grid grid-cols-2 bg-neutral-100 rounded-lg p-1 text-sm">
          {(['login', 'register'] as const).map((m) => (
            <button key={m} type="button" onClick={() => { setMode(m); setErr(''); }}
              className={`py-1.5 rounded-md ${mode === m ? 'bg-white shadow-sm font-medium' : 'text-neutral-500'}`}>
              {m === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input className="input" required placeholder="Tên đăng nhập" autoComplete="username" autoCapitalize="none" {...bind('username')} />
          <input className="input" required type="password" placeholder="Mật khẩu" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} {...bind('password')} />
          {mode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[['renter', 'Tôi muốn mượn đồ'], ['lender', 'Tôi cho thuê đồ']].map(([v, label]) => (
                  <label key={v} className={`border rounded-lg px-3 py-2.5 cursor-pointer text-center ${f.role === v ? 'border-neutral-900 font-medium' : 'border-neutral-200 text-neutral-600'}`}>
                    <input type="radio" name="role" value={v} checked={f.role === v} onChange={() => setF({ ...f, role: v })} className="sr-only" />
                    {label}
                  </label>
                ))}
              </div>
              <input className="input" required placeholder="Họ và tên" {...bind('fullName')} />
              <input className="input" required placeholder="MSSV" {...bind('studentId')} />
              <input className="input" required placeholder="Số điện thoại" inputMode="tel" {...bind('phone')} />
              <input className="input" required placeholder={f.role === 'lender' ? 'Nơi giao đồ quen thuộc' : 'Điểm hẹn nhận đồ quen thuộc'} {...bind('pickupLocation')} />
            </>
          )}
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button className="btn" disabled={busy}>{busy ? 'Đang xử lý...' : mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}</button>
        </form>

        {mode === 'login' && (
          <div className="text-xs text-neutral-500 space-y-1.5">
            <p className="text-center">Tài khoản demo, bấm để điền nhanh:</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO.map(([u, p, r]) => (
                <button key={u} type="button" onClick={() => setF({ ...f, username: u, password: p })}
                  className="border border-neutral-200 rounded-lg py-2 bg-white hover:border-neutral-400">
                  <span className="block font-medium text-neutral-800">{u}</span>{r}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
