const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = 'evangelista@gmail.com';
    const password = '2005';
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      console.log('User already exists! Promoting to ADMIN...');
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { role: 'ADMIN' }
      });
      console.log('Done!');
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new admin user
    await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        firstName: 'Admin',
        lastName: 'Evangelista',
        role: 'ADMIN'
      }
    });
    
    console.log(`Successfully created admin account: ${email}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
