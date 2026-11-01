import AuthGate from '@/components/AuthGate';

// Mọi trang trong nhóm (main) đều bắt đăng nhập trước

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
