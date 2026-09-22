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
  let hackathon = await prisma.hackathon.findFirst();
  
  if (!hackathon) {
    hackathon = await prisma.hackathon.create({
      data: {
        name: 'My Hackathon',
        startDateTime: new Date(),
        endDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });
  }
  return c.json(hackathon);
});

router.put('/', requireAuth, async (c) => {
  const prisma = c.get('prisma');
  const { name, startDateTime, endDateTime, description } = await c.req.json();
  
  let hackathon = await prisma.hackathon.findFirst();
  
  if (hackathon) {
    hackathon = await prisma.hackathon.update({
      where: { id: hackathon.id },
      data: {
        name,
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(endDateTime),
        description
      }
    });
  } else {
    hackathon = await prisma.hackathon.create({
      data: {
        name,
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(endDateTime),
        description
      }
    });
  }

  // NOTE: A real implementation would push to the DO if needed. We skip real-time updates for hackathon settings to save bandwidth.
  return c.json(hackathon);
});

export default router;
