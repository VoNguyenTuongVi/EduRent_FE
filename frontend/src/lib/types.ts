export type Role = 'admin' | 'lender' | 'renter';

export const ROLE_LABEL: Record<Role, string> = {
  admin: 'Quản trị',
  lender: 'Người cho thuê',
  renter: 'Người mượn',
};

export interface User {
  id: string;
  username: string;
  role: Role;
  fullName: string;
  studentId: string;
  phone: string;
  pickupLocation: string;
}

export interface Product {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  category: string;
  images: string[]; // ảnh đầu tiên là ảnh đại diện
  rentalPricePerDay: number;
  depositAmount: number;
  durationDays: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  ownerId: string;
  days: number;
  pricePerDay: number;
  rent: number;
  deposit: number;
  subtotal: number;
}

export interface Order {
  id: string;
  code: string;
  renterId: string;
  renterName: string;
  borrower: { fullName: string; studentId: string; phone: string; pickupLocation: string };
  items: OrderItem[];
  total: number;
  method: string;
  status: 'pending' | 'paid';
  paymentRef: string | null;
  createdAt: string;
  paidAt: string | null;
}
