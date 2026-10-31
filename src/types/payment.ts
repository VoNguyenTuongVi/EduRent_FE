export type PaymentMethod = 'vietqr' | 'visa' | 'atm';

export interface RentItem {
  id: string;
  title: string;
  imageUrl: string;
  rentalPricePerDay: number;
  depositAmount: number;
  durationDays: number;
}

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  studentId: string;
  pickupLocation: string;
  paymentMethod: PaymentMethod;
}