const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get settings (public)
router.get('/', async (req, res) => {
  const settings = await prisma.hackathon.findFirst();
  res.json(settings);
});

// Update settings (admin only)
router.put('/', requireAuth, async (req, res) => {
  const { name, startDateTime, endDateTime, timezone, description } = req.body;
  
  const existingSettings = await prisma.hackathon.findFirst();
  let updatedSettings;

  if (existingSettings) {
    updatedSettings = await prisma.hackathon.update({
      where: { id: existingSettings.id },
      data: { name, startDateTime: new Date(startDateTime), endDateTime: new Date(endDateTime), timezone, description },
    });
  } else {
    updatedSettings = await prisma.hackathon.create({
      data: { name, startDateTime: new Date(startDateTime), endDateTime: new Date(endDateTime), timezone, description },
    });
  }

  // Real-time update
  req.io.emit('settingsUpdated', updatedSettings);

  res.json(updatedSettings);
});

module.exports = router;
