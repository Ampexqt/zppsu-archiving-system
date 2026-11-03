require('dotenv').config({ path: 'backend/.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const userCount = await prisma.users.count();
    const cabinetCount = await prisma.cabinets.count();
    const boxCount = await prisma.file_boxes.count();
    const fileCount = await prisma.files.count();
    console.log('--- DATABASE STATUS ---');
    console.log('PostgreSQL Connection: OK');
    console.log('Users:', userCount);
    console.log('Cabinets:', cabinetCount);
    console.log('File Boxes:', boxCount);
    console.log('Files:', fileCount);

    // Get admin user
    const admin = await prisma.users.findFirst({ where: { role: 'Admin' } });
    if (admin) {
      console.log('Admin user found:', admin.email);
    }
  } catch (err) {
    console.error('DATABASE ERROR:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
