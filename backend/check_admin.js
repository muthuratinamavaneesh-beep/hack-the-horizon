const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const p = new PrismaClient();

async function main() {
  const admins = await p.admin.findMany();
  console.log('Admin users:', JSON.stringify(admins, null, 2));

  if (admins.length === 0) {
    console.log('No admin users found — creating default...');
    const hash = await bcrypt.hash('admin123', 10);
    const created = await p.admin.create({ data: { username: 'admin', passwordHash: hash } });
    console.log('Created:', created);
  } else {
    // Test password
    const match = await bcrypt.compare('admin123', admins[0].passwordHash);
    console.log('Password "admin123" matches:', match);
  }
}

main().catch(console.error).finally(() => p.$disconnect());
