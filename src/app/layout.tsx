import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'EduRent – Mượn đồ sinh viên',
  description: 'Mượn đồ trong khuôn viên trường, thanh toán qua VietQR, ngân hàng, thẻ Visa hoặc PayPal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <StoreProvider>
          <Header />
          <main className="max-w-3xl mx-auto px-4 py-8">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
