import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { PrismaClient } from '@prisma/client';
import { WebSocketServer } from 'ws';

import authRoutes from './routes/auth';
import hackathonRoutes from './routes/hackathon';
import eventRoutes from './routes/event';
import announcementRoutes from './routes/announcement';

const app = new Hono();
app.use('*', cors());

// Initialize standard Prisma client for PostgreSQL
const prisma = new PrismaClient();

app.use('*', async (c, next) => {
  c.set('prisma', prisma);
  await next();
});

app.get('/api/time', (c) => {
  return c.json({ serverTime: new Date().toISOString() });
});

app.route('/api/auth', authRoutes);
app.route('/api/hackathon', hackathonRoutes);
app.route('/api/events', eventRoutes);
app.route('/api/announcements', announcementRoutes);

const port = process.env.PORT || 3000;
const server = serve({
  fetch: app.fetch,
  port
});

// Setup native WebSocket Server
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  ws.on('error', console.error);
});

// Export a global broadcast helper for the routes to use
export const broadcastEvent = (eventName, data) => {
  const payload = JSON.stringify({ event: eventName, data });
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // 1 = OPEN
      client.send(payload);
    }
  });
};

console.log(`Server is running on port ${port}`);
