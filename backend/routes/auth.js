const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, admin.passwordHash);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({ token, username: admin.username });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ admin: req.admin });
});

module.exports = router;
