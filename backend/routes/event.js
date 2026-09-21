const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all visible events (public)
router.get('/', async (req, res) => {
  const events = await prisma.event.findMany({
    where: { visible: true },
    orderBy: [{ date: 'asc' }, { startDateTime: 'asc' }]
  });
  res.json(events);
});

// Get all events (admin only)
router.get('/all', requireAuth, async (req, res) => {
  const events = await prisma.event.findMany({
    orderBy: [{ date: 'asc' }, { startDateTime: 'asc' }]
  });
  res.json(events);
});

// Create event
router.post('/', requireAuth, async (req, res) => {
  const { title, description, date, startDateTime, endDateTime, location, visible, important } = req.body;
  const newEvent = await prisma.event.create({
    data: {
      title,
      description,
      date: new Date(date),
      startDateTime: new Date(startDateTime),
      endDateTime: new Date(endDateTime),
      location,
      visible,
      important
    }
  });
  
  req.io.emit('scheduleUpdated'); // Notify clients to refetch or send the event directly
  res.json(newEvent);
});

// Update event
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { title, description, date, startDateTime, endDateTime, location, visible, important } = req.body;
  
  const updatedEvent = await prisma.event.update({
    where: { id },
    data: {
      title,
      description,
      date: new Date(date),
      startDateTime: new Date(startDateTime),
      endDateTime: new Date(endDateTime),
      location,
      visible,
      important
    }
  });

  req.io.emit('scheduleUpdated');
  res.json(updatedEvent);
});

// Delete event
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  await prisma.event.delete({ where: { id } });
  
  req.io.emit('scheduleUpdated');
  res.json({ success: true });
});

module.exports = router;
