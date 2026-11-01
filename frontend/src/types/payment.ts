export type PaymentMethod = 'vietqr' | 'bank' | 'visa' | 'paypal';

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (ref: string) => void; // ref: mã giao dịch trả về từ cổng
  amount: number;
  orderCode: string;
  orderId: string;
}

export const METHOD_LABEL: Record<PaymentMethod, string> = {
  vietqr: 'VietQR',
  bank: 'Ngân hàng (ATM / Napas)',
  visa: 'Thẻ Visa / Mastercard',
  paypal: 'PayPal',
};
