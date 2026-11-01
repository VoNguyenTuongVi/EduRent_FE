// Định dạng tiền và các hằng số dùng chung
export const USD_RATE = 26300; // tỷ giá tham khảo, đồng/USD

export const vnd = (n: number) => `${n.toLocaleString('vi-VN')} đ`;

export const toUsd = (n: number) => (n / USD_RATE).toFixed(2);

export const newOrderCode = () =>
  'ER' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 90 + 10);
