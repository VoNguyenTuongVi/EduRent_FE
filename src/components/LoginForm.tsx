'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';

export default function LoginForm() {
  const { login, register } = useStore();
  const router = useRouter();
  const next = useSearchParams().get('next') ?? '/';
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [f, setF] = useState({ username: '', password: '', fullName: '', studentId: '', phone: '', pickupLocation: '' });
  const [err, setErr] = useState('');

  const bind = (k: keyof typeof f) => ({ value: f[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value }) });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = mode === 'login' ? login(f.username, f.password) : register(f);
    if (error) return setErr(error);
    router.push(next);
  };

  return (
    <div className="max-w-sm mx-auto space-y-5">
      <div className="grid grid-cols-2 bg-neutral-100 rounded-lg p-1 text-sm">
        {(['login', 'register'] as const).map((m) => (
          <button key={m} type="button" onClick={() => { setMode(m); setErr(''); }}
            className={`py-1.5 rounded-md ${mode === m ? 'bg-white shadow-sm font-medium' : 'text-neutral-500'}`}>
            {m === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-3">
        <input className="input" required placeholder="Tên đăng nhập" autoComplete="username" {...bind('username')} />
        <input className="input" required type="password" placeholder="Mật khẩu" autoComplete="current-password" {...bind('password')} />
        {mode === 'register' && (
          <>
            <input className="input" required placeholder="Họ và tên" {...bind('fullName')} />
            <input className="input" required placeholder="MSSV" {...bind('studentId')} />
            <input className="input" required placeholder="Số điện thoại" {...bind('phone')} />
            <input className="input" required placeholder="Điểm hẹn nhận đồ quen thuộc" {...bind('pickupLocation')} />
          </>
        )}
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="btn">{mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}</button>
      </form>

      <p className="text-xs text-neutral-500 text-center">Tài khoản demo: <b>admin / admin123</b> (quản trị) · <b>sv01 / 123456</b> (người mượn)</p>
    </div>
  );
}
