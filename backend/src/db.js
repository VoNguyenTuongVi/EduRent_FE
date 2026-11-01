// "Cơ sở dữ liệu" dạng file JSON cho gọn, không cần cài thêm phần mềm.
// Muốn đổi sang MySQL/MongoDB thì chỉ cần thay các hàm trong file này.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { seedData } from './seed.js';

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data');
const FILE = path.join(DIR, 'db.json');

let data;

export function load() {
  fs.mkdirSync(DIR, { recursive: true });
  if (!fs.existsSync(FILE)) {
    data = seedData();
    save();
  } else {
    data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  }
  return data;
}

export function save() {
  const tmp = FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, FILE); // ghi file tạm rồi đổi tên để tránh hỏng dữ liệu khi đang ghi
}

export function reset() {
  data = seedData();
  fs.mkdirSync(DIR, { recursive: true });
  save();
}

export const db = () => data;
