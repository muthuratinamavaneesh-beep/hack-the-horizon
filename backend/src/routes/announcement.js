import { Hono } from 'hono';
import { requireAuth } from '../middlewares/auth';
import { broadcastEvent } from '../index';

const router = new Hono();

const broadcast = async (c, eventName, data) => {
  try {
    broadcastEvent(eventName, data);
  } catch (err) {
    console.error('Broadcast failed:', err);
  }
};

router.get('/', async (c) => {
  const prisma = c.get('prisma');
  const announcements = await prisma.announcement.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  });
  return c.json(announcements);
});

router.get('/all', requireAuth, async (c) => {
  const prisma = c.get('prisma');
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return c.json(announcements);
});

router.post('/', requireAuth, async (c) => {
  const prisma = c.get('prisma');
  const { title, message, type, published, pinned } = await c.req.json();
  const newAnnouncement = await prisma.announcement.create({
    data: { title, message, type, published, pinned }
  });
  await broadcast(c, 'announcementAdded', newAnnouncement);
  return c.json(newAnnouncement, 201);
});

router.put('/:id', requireAuth, async (c) => {
  const prisma = c.get('prisma');
  const id = c.req.param('id');
  const { title, message, type, published, pinned } = await c.req.json();
  
  try {
    const updatedAnnouncement = await prisma.announcement.update({
      where: { id },
      data: { title, message, type, published, pinned }
    });
    await broadcast(c, 'announcementsUpdated', updatedAnnouncement);
    return c.json(updatedAnnouncement);
  } catch (err) {
    return c.json({ error: 'Announcement not found' }, 404);
  }
});

router.delete('/:id', requireAuth, async (c) => {
  const prisma = c.get('prisma');
  const id = c.req.param('id');
  
  try {
    await prisma.announcement.delete({ where: { id } });
    await broadcast(c, 'announcementsUpdated', { id });
    return c.json({ message: 'Announcement deleted' });
  } catch (err) {
    return c.json({ error: 'Announcement not found' }, 404);
  }
});

export default router;
