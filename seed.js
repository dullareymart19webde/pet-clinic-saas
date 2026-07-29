const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('Seeding default services...');
    
    const services = [
      { name: 'General Checkup', description: 'Comprehensive physical exam.', duration: 30, price: 50.00 },
      { name: 'Vaccination', description: 'Core and non-core vaccines.', duration: 15, price: 35.00 },
      { name: 'Dental Cleaning', description: 'Professional teeth cleaning.', duration: 60, price: 150.00 },
      { name: 'Spay/Neuter', description: 'Routine surgical sterilization.', duration: 120, price: 250.00 },
      { name: 'Microchipping', description: 'Implant identification microchip.', duration: 15, price: 25.00 },
    ];

    for (const service of services) {
      await prisma.service.create({ data: service });
    }
    
    console.log('Services seeded successfully!');
  } catch (error) {
    console.error('Error seeding services:', error);
  } finally {
    await prisma.$disconnect();
  }
}
seed();
