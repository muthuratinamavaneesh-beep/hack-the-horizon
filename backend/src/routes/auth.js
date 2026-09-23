import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import bcrypt from 'bcryptjs';

const router = new Hono();

router.post('/login', async (c) => {
  const prisma = c.get('prisma');
  const { username, password } = await c.req.json();

  const admin = await prisma.admin.findUnique({
    where: { username }
  });

  if (!admin) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const token = await sign({ id: admin.id, username: admin.username }, c.env.JWT_SECRET);
  return c.json({ token });
});

router.post('/verify', async (c) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return c.json({ valid: false });

  try {
    const { verify } = await import('hono/jwt');
    await verify(token, c.env.JWT_SECRET, 'HS256');
    return c.json({ valid: true });
  } catch (err) {
    return c.json({ valid: false });
  }
});

export default router;
