import jwt from 'jsonwebtoken';
import { db } from './db.js';

// Bản thật nên đặt khóa này trong biến môi trường (file .env)
export const JWT_SECRET = process.env.JWT_SECRET || 'edurent-dev-secret';

export const publicUser = ({ passwordHash, ...u }) => u;

export const signToken = (user) => jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

// Đọc token trong tiêu đề "Authorization: Bearer <token>" và gắn req.user
export function requireAuth(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer /, '');
  try {
    const { sub } = jwt.verify(token, JWT_SECRET);
    const user = db().users.find((u) => u.id === sub);
    if (!user) throw new Error('not found');
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Vui lòng đăng nhập' });
  }
}

// Chỉ cho các vai trò được liệt kê đi tiếp
export const allow = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ error: 'Bạn không có quyền thực hiện thao tác này' });
