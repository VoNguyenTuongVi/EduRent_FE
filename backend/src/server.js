import express from 'express';
import cors from 'cors';
import { load } from './db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';
import uploadRoutes, { UPLOAD_DIR } from './routes/uploads.js';

load();

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/uploads', express.static(UPLOAD_DIR));

app.use((_req, res) => res.status(404).json({ error: 'Không tìm thấy API' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Lỗi máy chủ' });
});

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => console.log(`EduRent API đang chạy tại http://localhost:${PORT}`));
