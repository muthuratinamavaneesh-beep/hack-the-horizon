const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const hackathonRoutes = require('./routes/hackathon');
const eventRoutes = require('./routes/event');
const announcementRoutes = require('./routes/announcement');

async function createServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: '*' },
  });

  // Middleware to inject Socket.io instance into requests so controllers can emit events
  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/hackathon', hackathonRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/announcements', announcementRoutes);

  // Server time endpoint for frontend synchronization
  app.get('/api/time', (req, res) => {
    res.json({ serverTime: new Date().toISOString() });
  });

  // Real-time connections
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Send current server time upon connection
    socket.emit('serverTime', { serverTime: new Date().toISOString() });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Vite Integration in Middleware Mode
  try {
    const { createServer: createViteServer } = require('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: path.resolve(__dirname, '../frontend')
    });

    app.use(vite.middlewares);
    console.log('Vite middleware initialized');
  } catch (err) {
    console.error('Failed to initialize Vite middleware', err);
  }

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Unified server running on port ${PORT}`);
  });
}

createServer();
