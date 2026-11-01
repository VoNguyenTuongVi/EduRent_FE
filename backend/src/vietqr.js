// Tạo chuỗi VietQR theo chuẩn EMVCo/Napas 247 để app ngân hàng quét được.
// ⚠ Thay RECEIVER bằng tài khoản nhận tiền thật của nhóm trước khi demo quét thật.
export const RECEIVER = {
  bankBin: process.env.VIETQR_BANK_BIN || '970422', // MB Bank
  bankName: process.env.VIETQR_BANK_NAME || 'MB Bank',
  accountNo: process.env.VIETQR_ACCOUNT_NO || '0000000000',
  accountName: process.env.VIETQR_ACCOUNT_NAME || 'EDURENT DEMO',
};

const tlv = (id, value) => id + String(value.length).padStart(2, '0') + value;

function crc16(s) {
  let crc = 0xffff;
  for (let i = 0; i < s.length; i++) {
    crc ^= s.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function buildVietQR(amount, addInfo) {
  const merchant = tlv('00', 'A000000727') + tlv('01', tlv('00', RECEIVER.bankBin) + tlv('01', RECEIVER.accountNo)) + tlv('02', 'QRIBFTTA');
  const body =
    tlv('00', '01') + tlv('01', '12') + tlv('38', merchant) + tlv('53', '704') +
    tlv('54', String(Math.round(amount))) + tlv('58', 'VN') + tlv('62', tlv('08', addInfo)) + '6304';
  return body + crc16(body);
}
