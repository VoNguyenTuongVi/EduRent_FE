// Dữ liệu mẫu, được nạp lần đầu chạy (hoặc khi chạy npm run reset-data)
import bcrypt from 'bcryptjs';

const hash = (p) => bcrypt.hashSync(p, 10);

export function seedData() {
  return {
    users: [
      { id: 'u-admin', username: 'admin', passwordHash: hash('admin123'), role: 'admin', fullName: 'Quản trị viên', studentId: '', phone: '', pickupLocation: '' },
      { id: 'u-ct01', username: 'chothue01', passwordHash: hash('123456'), role: 'lender', fullName: 'Lê Minh', studentId: '31221000101', phone: '0911000101', pickupLocation: 'KTX Khu A' },
      { id: 'u-ct02', username: 'chothue02', passwordHash: hash('123456'), role: 'lender', fullName: 'Hoàng Anh', studentId: '31221000102', phone: '0911000102', pickupLocation: 'Thư viện Bách Khoa' },
      { id: 'u-sv01', username: 'sv01', passwordHash: hash('123456'), role: 'renter', fullName: 'Nguyễn Văn An', studentId: '31221020001', phone: '0901234567', pickupLocation: 'Sảnh KTX khu B' },
    ],
    products: [
      { id: 'item-101', ownerId: 'u-ct01', title: 'Máy ảnh Sony Alpha A6400 + Lens Kit 16-50mm', category: 'Máy ảnh & Quay phim', images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80'], rentalPricePerDay: 100000, depositAmount: 1000000, durationDays: 3 },
      { id: 'item-103', ownerId: 'u-ct01', title: 'Bàn phím cơ FL-Esports MK870 (Wireless)', category: 'Phụ kiện PC', images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80'], rentalPricePerDay: 40000, depositAmount: 500000, durationDays: 2 },
      { id: 'item-102', ownerId: 'u-ct02', title: 'Máy tính Casio fx-580VN X', category: 'Học tập', images: ['https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=500&q=80'], rentalPricePerDay: 15000, depositAmount: 200000, durationDays: 1 },
      { id: 'item-104', ownerId: 'u-ct02', title: 'Mic thu âm không dây Boya BY-V2 (Type-C / Lightning)', category: 'Âm thanh & Media', images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80'], rentalPricePerDay: 50000, depositAmount: 300000, durationDays: 1 },
    ],
    orders: [],
  };
}
