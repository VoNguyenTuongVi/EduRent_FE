export interface RentItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  rentalPricePerDay: number;
  depositAmount: number;
  durationDays: number;
  status: 'available' | 'rented';
  owner: string;
  rating: number;
}

export const MOCK_ITEMS: RentItem[] = [
  {
    id: "item-101",
    title: "Máy ảnh Sony Alpha A6400 + Lens Kit 16-50mm",
    category: "Máy ảnh & Quay phim",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
    rentalPricePerDay: 100000,
    depositAmount: 1000000,
    durationDays: 3,
    status: "available",
    owner: "Lê Minh (KTX Khu A)",
    rating: 4.9,
  },
  {
    id: "item-102",
    title: "Máy tính Casio fx-580VN X",
    category: "Học tập",
    imageUrl: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=500&q=80",
    rentalPricePerDay: 15000,
    depositAmount: 200000,
    durationDays: 1,
    status: "available",
    owner: "Hoàng Anh (Bách Khoa)",
    rating: 5.0,
  },
  {
    id: "item-103",
    title: "Bàn phím cơ FL-Esports MK870 (Wireless)",
    category: "Phụ kiện PC",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80",
    rentalPricePerDay: 40000,
    depositAmount: 500000,
    durationDays: 2,
    status: "available",
    owner: "Bảo Ny (KTX Khu B)",
    rating: 4.8,
  },
  {
    id: "item-104",
    title: "Mic thu âm không dây Boya BY-V2 (Type-C / Lightning)",
    category: "Âm thanh & Media",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80",
    rentalPricePerDay: 50000,
    depositAmount: 300000,
    durationDays: 1,
    status: "available",
    owner: "Minh Hiếu (Nhóm G3)",
    rating: 4.7,
  },
];

export const MOCK_RENT_ITEM: RentItem = MOCK_ITEMS[0];