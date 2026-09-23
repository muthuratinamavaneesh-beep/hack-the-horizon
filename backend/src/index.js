import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

import authRoutes from './routes/auth';
import hackathonRoutes from './routes/hackathon';
import eventRoutes from './routes/event';
import announcementRoutes from './routes/announcement';
import { WebSocketRoom } from './DurableObject';

const app = new Hono();

app.use('*', cors());

// Initialize Prisma client with D1 Adapter per request
app.use('*', async (c, next) => {
  if (!c.get('prisma')) {
    const adapter = new PrismaD1(c.env.DB);
    const prisma = new PrismaClient({ adapter });
    c.set('prisma', prisma);
  }
  await next();
});

// Real-time server time API
app.get('/api/time', (c) => {
  return c.json({ serverTime: new Date().toISOString() });
});

app.route('/api/auth', authRoutes);
app.route('/api/hackathon', hackathonRoutes);
app.route('/api/events', eventRoutes);
app.route('/api/announcements', announcementRoutes);

// WebSockets via Durable Object
app.get('/ws', (c) => {
  const id = c.env.WEBSOCKET_ROOM.idFromName('global-room');
  const obj = c.env.WEBSOCKET_ROOM.get(id);
  return obj.fetch(c.req.raw);
});

export default app;
export { WebSocketRoom };
