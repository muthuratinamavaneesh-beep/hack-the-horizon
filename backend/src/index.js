import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { PrismaClient } from '@prisma/client';
import { WebSocketServer } from 'ws';

import authRoutes from './routes/auth.js';
import hackathonRoutes from './routes/hackathon.js';
import eventRoutes from './routes/event.js';
import announcementRoutes from './routes/announcement.js';

const app = new Hono();
const prisma = new PrismaClient(); // Connect to local SQLite DB using DATABASE_URL

app.use('*', cors());

// Inject prisma into context for backward compatibility with existing routes
app.use('*', async (c, next) => {
  c.set('prisma', prisma);
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

const port = process.env.PORT || 3000;

const server = serve({
  fetch: app.fetch,
  port
});

// Attach Native WebSocketServer
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });
});

// Global broadcast function for our REST routes to use
export const broadcastEvent = (eventName, data) => {
  const payload = JSON.stringify({ event: eventName, data });
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // 1 = OPEN
      client.send(payload);
    }
  });
};

console.log(`Node server is running on port ${port}`);
