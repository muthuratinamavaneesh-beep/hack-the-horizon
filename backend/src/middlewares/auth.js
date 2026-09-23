import { verify } from 'hono/jwt';

export const requireAuth = async (c, next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return c.json({ error: 'Unauthorized: Missing token' }, 401);
  }

  try {
    const payload = await verify(token, process.env.JWT_SECRET, 'HS256');
    c.set('adminId', payload.id);
    await next();
  } catch (err) {
    console.error('JWT Error:', err.message);
    return c.json({ error: 'Unauthorized: Invalid token' }, 401);
  }
};
