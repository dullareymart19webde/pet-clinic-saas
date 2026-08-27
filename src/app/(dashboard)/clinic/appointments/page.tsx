import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import AppointmentList from '@/components/clinic/AppointmentList';

export default async function ClinicAppointmentsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role === 'PET_OWNER') {
    redirect('/dashboard');
  }

  const aptsSnapshot = await db.collection('appointments').orderBy('dateTime', 'asc').get();
  
  const rawAppointments = aptsSnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
  const appointments = await Promise.all(
    rawAppointments.map(async (apt) => {
      let pet = { name: 'Unknown Pet' };
      let service = { name: 'Unknown Service' };
      let user = { firstName: 'Unknown', lastName: 'User' };
      
      if (apt.petId) {
        const petDoc = await db.collection('pets').doc(apt.petId).get();
        if (petDoc.exists) pet = { ...pet, ...(petDoc.data() as any) };
      }
      if (apt.serviceId) {
        const serviceDoc = await db.collection('services').doc(apt.serviceId).get();
        if (serviceDoc.exists) service = { ...service, ...(serviceDoc.data() as any) };
      }
      if (apt.userId) {
        const userDoc = await db.collection('users').doc(apt.userId).get();
        if (userDoc.exists) user = { ...user, ...(userDoc.data() as any) };
      }
      return { ...apt, pet, service, user };
    })
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800">Master Schedule</h1>
        <p className="text-slate-500 mt-1">Manage all clinic appointments.</p>
      </div>
      <div className="p-6 overflow-x-auto">
        <AppointmentList initialAppointments={appointments} />
      </div>
    </div>
  );
}
