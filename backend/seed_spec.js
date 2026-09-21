const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Update hackathon settings
  const existing = await prisma.hackathon.findFirst();
  if (existing) {
    await prisma.hackathon.update({
      where: { id: existing.id },
      data: {
        name: 'HACK THE HORIZON 2.0',
        startDateTime: new Date('2026-09-24T09:00:00+05:30'),
        endDateTime: new Date('2026-09-25T16:00:00+05:30')
      }
    });
  } else {
    await prisma.hackathon.create({
      data: {
        name: 'HACK THE HORIZON 2.0',
        startDateTime: new Date('2026-09-24T09:00:00+05:30'),
        endDateTime: new Date('2026-09-25T16:00:00+05:30')
      }
    });
  }

  // Clear existing events
  await prisma.event.deleteMany({});

  // Seed new events
  const events = [
    { title: 'TEAM SETUP', startDateTime: new Date('2026-09-24T09:00:00+05:30'), endDateTime: new Date('2026-09-24T10:00:00+05:30') },
    { title: 'HACKATHON BEGINS', startDateTime: new Date('2026-09-24T10:00:00+05:30'), endDateTime: new Date('2026-09-24T11:00:00+05:30') },
    { title: 'PROJECT REVIEW', startDateTime: new Date('2026-09-24T14:00:00+05:30'), endDateTime: new Date('2026-09-24T15:00:00+05:30') },
    { title: 'MENTOR CHECKPOINT', startDateTime: new Date('2026-09-24T18:00:00+05:30'), endDateTime: new Date('2026-09-24T19:00:00+05:30') },
    { title: 'FINAL SUBMISSION', startDateTime: new Date('2026-09-25T10:00:00+05:30'), endDateTime: new Date('2026-09-25T11:00:00+05:30') },
    { title: 'JUDGING & EVALUATION', startDateTime: new Date('2026-09-25T11:00:00+05:30'), endDateTime: new Date('2026-09-25T14:00:00+05:30') },
    { title: 'RESULTS & CLOSING', startDateTime: new Date('2026-09-25T15:00:00+05:30'), endDateTime: new Date('2026-09-25T16:00:00+05:30') },
  ];

  for (const e of events) {
    await prisma.event.create({
      data: {
        title: e.title,
        date: new Date(e.startDateTime.toISOString().slice(0, 10)),
        startDateTime: e.startDateTime,
        endDateTime: e.endDateTime,
        visible: true,
        important: e.title.includes('BEGINS') || e.title.includes('CLOSING')
      }
    });
  }
  
  console.log('Database seeded with spec data');
}

main().catch(console.error).finally(() => prisma.$disconnect());
