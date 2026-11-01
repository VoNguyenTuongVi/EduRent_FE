'use client';

import { X } from 'lucide-react';

// Khung modal dùng chung cho 4 phương thức thanh toán
export default function Modal({ title, subtitle, onClose, children }: {
  title: string; subtitle?: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-sm p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] relative max-h-[92vh] overflow-y-auto">
        <button onClick={onClose} className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-700" aria-label="Đóng">
          <X className="w-5 h-5" />
        </button>
        <h3 className="font-semibold">{title}</h3>
        {subtitle && <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>}
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

export function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between text-sm py-1">
      <span className="text-neutral-500">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
