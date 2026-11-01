export interface Product {
  id: string;
  title: string;
  category: string;
  images: string[]; // ảnh đầu tiên là ảnh đại diện
  rentalPricePerDay: number;
  depositAmount: number;
  durationDays: number; // số ngày mượn gợi ý
  owner: string;
}

export interface User {
  username: string;
  password: string; // demo: lưu thẳng trong trình duyệt, bản thật phải băm và lưu ở máy chủ
  role: 'admin' | 'user';
  fullName: string;
  studentId: string;
  phone: string;
  pickupLocation: string;
}

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'item-101',
    title: 'Máy ảnh Sony Alpha A6400 + Lens Kit 16-50mm',
    category: 'Máy ảnh & Quay phim',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80'],
    rentalPricePerDay: 100000,
    depositAmount: 1000000,
    durationDays: 3,
    owner: 'Lê Minh (KTX Khu A)',
  },
  {
    id: 'item-102',
    title: 'Máy tính Casio fx-580VN X',
    category: 'Học tập',
    images: ['https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=500&q=80'],
    rentalPricePerDay: 15000,
    depositAmount: 200000,
    durationDays: 1,
    owner: 'Hoàng Anh (Bách Khoa)',
  },
  {
    id: 'item-103',
    title: 'Bàn phím cơ FL-Esports MK870 (Wireless)',
    category: 'Phụ kiện PC',
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80'],
    rentalPricePerDay: 40000,
    depositAmount: 500000,
    durationDays: 2,
    owner: 'Bảo Ny (KTX Khu B)',
  },
  {
    id: 'item-104',
    title: 'Mic thu âm không dây Boya BY-V2 (Type-C / Lightning)',
    category: 'Âm thanh & Media',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80'],
    rentalPricePerDay: 50000,
    depositAmount: 300000,
    durationDays: 1,
    owner: 'Minh Hiếu (Nhóm G3)',
  },
];

// Tài khoản mẫu để demo
export const SEED_USERS: User[] = [
  { username: 'admin', password: 'admin123', role: 'admin', fullName: 'Quản trị viên', studentId: '', phone: '', pickupLocation: '' },
  { username: 'sv01', password: '123456', role: 'user', fullName: 'Nguyễn Văn An', studentId: '31221020001', phone: '0901234567', pickupLocation: 'Sảnh KTX khu B' },
];
