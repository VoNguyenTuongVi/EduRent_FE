import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { db, save } from '../db.js';
import { publicUser, requireAuth, signToken } from '../auth.js';

const r = Router();

// POST /api/auth/login
r.post('/login', (req, res) => {
  const { username = '', password = '' } = req.body;
  const user = db().users.find((u) => u.username === username.trim());
  if (!user || !bcrypt.compareSync(password, user.passwordHash))
    return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' });
  res.json({ token: signToken(user), user: publicUser(user) });
});

// POST /api/auth/register — tự đăng ký chỉ được chọn người mượn hoặc người cho thuê
r.post('/register', (req, res) => {
  const { username = '', password = '', role, fullName = '', studentId = '', phone = '', pickupLocation = '' } = req.body;
  if (!['renter', 'lender'].includes(role)) return res.status(400).json({ error: 'Vai trò không hợp lệ' });
  if (username.trim().length < 3 || password.length < 6)
    return res.status(400).json({ error: 'Tên đăng nhập từ 3 ký tự, mật khẩu từ 6 ký tự' });
  if (db().users.some((u) => u.username === username.trim())) return res.status(409).json({ error: 'Tên đăng nhập đã tồn tại' });

  const user = {
    id: 'u-' + randomUUID().slice(0, 8), username: username.trim(), passwordHash: bcrypt.hashSync(password, 10),
    role, fullName: fullName.trim(), studentId: studentId.trim(), phone: phone.trim(), pickupLocation: pickupLocation.trim(),
  };
  db().users.push(user);
  save();
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

// GET /api/auth/me
r.get('/me', requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));

export default r;
