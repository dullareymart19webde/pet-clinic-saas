const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function promote() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('No user found in the database.');
      return;
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' }
    });
    console.log('Successfully promoted ' + user.email + ' to ADMIN!');
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}
promote();
