const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default admin if not exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { username: 'admin' },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await prisma.admin.create({
      data: {
        username: 'admin',
        passwordHash,
      },
    });
    console.log('Created default admin (admin / admin123)');
  }

  // Create default hackathon settings if not exists
  const existingSettings = await prisma.hackathon.findFirst();
  
  if (!existingSettings) {
    const startDateTime = new Date();
    startDateTime.setHours(startDateTime.getHours() + 1); // Starts in 1 hour
    
    const endDateTime = new Date();
    endDateTime.setDate(endDateTime.getDate() + 1); // Ends in 1 day
    endDateTime.setHours(endDateTime.getHours() + 1);

    await prisma.hackathon.create({
      data: {
        name: 'HACK THE HORIZON 2.0',
        startDateTime,
        endDateTime,
        timezone: 'Asia/Kolkata',
        description: 'CODE TODAY. CREATE TOMORROW.',
      },
    });
    console.log('Created default hackathon settings');
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
