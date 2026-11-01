'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { ROLE_LABEL, User } from '@/lib/types';
import { RoleOnly } from '@/components/AppShell';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => { api<User[]>('/users').then(setUsers).catch(() => {}); }, []);

  return (
    <RoleOnly roles={['admin']}>
      <div className="space-y-5">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Tài khoản ({users.length})</h1>
        <ul className="divide-y divide-neutral-200 border border-neutral-200 rounded-xl bg-white">
          {users.map((u) => (
            <li key={u.id} className="flex items-center justify-between gap-3 p-3 text-sm">
              <div className="min-w-0">
                <p className="font-medium truncate">{u.fullName} <span className="text-neutral-500 font-normal">@{u.username}</span></p>
                <p className="text-xs text-neutral-500 truncate">{[u.studentId, u.phone, u.pickupLocation].filter(Boolean).join(' · ') || '—'}</p>
              </div>
              <span className="text-xs border border-neutral-200 rounded-full px-2 py-0.5 shrink-0">{ROLE_LABEL[u.role]}</span>
            </li>
          ))}
        </ul>
      </div>
    </RoleOnly>
  );
}
