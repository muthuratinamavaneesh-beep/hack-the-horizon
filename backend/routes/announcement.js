const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get published announcements (public)
router.get('/', async (req, res) => {
  const announcements = await prisma.announcement.findMany({
    where: { 
      published: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(announcements);
});

// Get all announcements (admin only)
router.get('/all', requireAuth, async (req, res) => {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.json(announcements);
});

// Create announcement
router.post('/', requireAuth, async (req, res) => {
  const { title, message, type, published, pinned, scheduledAt, expiresAt } = req.body;
  const newAnnouncement = await prisma.announcement.create({
    data: {
      title,
      message,
      type: type || 'Normal',
      published: published !== undefined ? published : true,
      pinned: pinned || false,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    }
  });
  
  if (newAnnouncement.published) {
    req.io.emit('announcementsUpdated', newAnnouncement); // Push the new announcement
  }
  res.json(newAnnouncement);
});

// Update announcement
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { title, message, type, published, pinned, expiresAt } = req.body;
  
  const updatedAnnouncement = await prisma.announcement.update({
    where: { id },
    data: {
      title,
      message,
      type,
      published,
      pinned,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    }
  });

  req.io.emit('announcementsUpdated', updatedAnnouncement);
  res.json(updatedAnnouncement);
});

// Delete announcement
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  await prisma.announcement.delete({ where: { id } });
  
  req.io.emit('announcementsUpdated');
  res.json({ success: true });
});

module.exports = router;
