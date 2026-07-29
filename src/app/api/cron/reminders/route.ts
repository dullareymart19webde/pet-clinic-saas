import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const upcomingAppointments = await prisma.appointment.findMany({
    where: {
      dateTime: {
        gte: new Date(),
        lte: tomorrow,
      },
      status: 'APPROVED'
    },
    include: { pet: { include: { owner: true } } }
  });

  const notificationsSent = upcomingAppointments.map(apt => {
    return `[MOCK] Email sent to ${apt.pet.owner.email}: Reminder for ${apt.pet.name}'s appointment on ${new Date(apt.dateTime).toLocaleString()}`;
  });

  return NextResponse.json({
    message: 'Reminders processed successfully',
    notificationsSent,
  });
}
