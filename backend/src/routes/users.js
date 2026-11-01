import { Router } from 'express';
import { db } from '../db.js';
import { allow, publicUser, requireAuth } from '../auth.js';

const r = Router();

// GET /api/users — chỉ admin
r.get('/', requireAuth, allow('admin'), (req, res) => {
  const role = req.query.role;
  res.json(db().users.filter((u) => !role || u.role === role).map(publicUser));
});

export default r;
