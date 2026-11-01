import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { allow, requireAuth } from '../auth.js';

export const UPLOAD_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'uploads');

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) => cb(null, randomUUID() + (path.extname(file.originalname).toLowerCase() || '.jpg')),
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // tối đa 5MB mỗi ảnh
  fileFilter: (_req, file, cb) => cb(null, /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)),
});

const r = Router();

// POST /api/uploads (multipart, field "images") -> { urls: [...] }
r.post('/', requireAuth, allow('admin', 'lender'), upload.array('images', 10), (req, res) => {
  const files = req.files || [];
  if (files.length === 0) return res.status(400).json({ error: 'Chỉ nhận ảnh JPG, PNG, WEBP hoặc GIF' });
  res.status(201).json({ urls: files.map((f) => '/uploads/' + f.filename) });
});

export default r;
