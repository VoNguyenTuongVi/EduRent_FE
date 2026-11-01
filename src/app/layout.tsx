import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'EduRent – Mượn đồ sinh viên',
  description: 'Mượn đồ trong khuôn viên trường, thanh toán qua VietQR, ngân hàng, thẻ Visa hoặc PayPal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <header className="border-b border-neutral-200 bg-white">
          <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold tracking-tight">EduRent</Link>
            <span className="text-xs text-neutral-500">Mượn đồ sinh viên</span>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
