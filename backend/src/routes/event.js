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
  const events = await prisma.event.findMany({
    where: { visible: true },
    orderBy: [{ date: 'asc' }, { startDateTime: 'asc' }]
  });
  return c.json(events);
});

router.get('/all', requireAuth, async (c) => {
  const prisma = c.get('prisma');
  const events = await prisma.event.findMany({
    orderBy: [{ date: 'asc' }, { startDateTime: 'asc' }]
  });
  return c.json(events);
});

router.post('/', requireAuth, async (c) => {
  const prisma = c.get('prisma');
  const { title, description, date, startDateTime, endDateTime, location, visible, important } = await c.req.json();
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

  await broadcast(c, 'scheduleUpdated', newEvent);
  return c.json(newEvent, 201);
});

router.put('/:id', requireAuth, async (c) => {
  const prisma = c.get('prisma');
  const id = c.req.param('id');
  const { title, description, date, startDateTime, endDateTime, location, visible, important } = await c.req.json();
  
  try {
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

    await broadcast(c, 'scheduleUpdated', updatedEvent);
    return c.json(updatedEvent);
  } catch (err) {
    return c.json({ error: 'Event not found' }, 404);
  }
});

router.delete('/:id', requireAuth, async (c) => {
  const prisma = c.get('prisma');
  const id = c.req.param('id');
  
  try {
    await prisma.event.delete({ where: { id } });
    await broadcast(c, 'scheduleUpdated', { id });
    return c.json({ message: 'Event deleted' });
  } catch (err) {
    return c.json({ error: 'Event not found' }, 404);
  }
});

export default router;
