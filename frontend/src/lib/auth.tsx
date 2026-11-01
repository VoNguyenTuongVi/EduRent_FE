'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, post, setToken } from './api';
import { User } from './types';

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<User>;
  register: (data: Record<string, string>) => Promise<User>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Có token cũ thì hỏi backend xem còn hợp lệ không
  useEffect(() => {
    if (!getToken()) return setLoading(false);
    api<{ user: User }>('/auth/me')
      .then((r) => setUser(r.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const accept = (r: { token: string; user: User }) => {
    setToken(r.token);
    setUser(r.user);
    return r.user;
  };

  const value: AuthCtx = {
    user,
    loading,
    login: async (username, password) => accept(await post('/auth/login', { username, password })),
    register: async (data) => accept(await post('/auth/register', data)),
    logout: () => { setToken(null); setUser(null); },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth phải nằm trong AuthProvider');
  return c;
}
