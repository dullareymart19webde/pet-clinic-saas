import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase-admin';
import Link from 'next/link';
import { Calendar, Plus } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const petsSnapshot = await db.collection('pets').where('ownerId', '==', session?.user.id || '').get();
  const pets = petsSnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));

  const appointmentsSnapshot = await db.collection('appointments').where('userId', '==', session?.user.id || '').get();
  
  // Sort manually to avoid requiring a composite index right away, and fetch relations
  const rawAppointments = appointmentsSnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
  const appointments = await Promise.all(
    rawAppointments
      .filter((a: any) => a.status !== 'COMPLETED')
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
      .slice(0, 5)
      .map(async (apt) => {
        let pet = { name: 'Unknown Pet' };
        let service = { name: 'Unknown Service' };
        
        if (apt.petId) {
          const petDoc = await db.collection('pets').doc(apt.petId).get();
          if (petDoc.exists) pet = { ...pet, ...(petDoc.data() as any) };
        }
        
        if (apt.serviceId) {
          const serviceDoc = await db.collection('services').doc(apt.serviceId).get();
          if (serviceDoc.exists) service = { ...service, ...(serviceDoc.data() as any) };
        }
        
        return { ...apt, pet, service };
      })
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 font-medium">My Pets</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">{pets.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 font-medium">Upcoming Appointments</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">{appointments.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pets Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">My Pets</h2>
            <Link
              href="/pets/new"
              className="text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Pet
            </Link>
          </div>
          <div className="p-6">
            {pets.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                You haven&apos;t added any pets yet.
              </div>
            ) : (
              <ul className="space-y-4">
                {pets.map((pet) => (
                  <li key={pet.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl overflow-hidden shrink-0">
                      {pet.profilePhoto ? (
                        <img src={pet.profilePhoto} alt={pet.name} className="w-full h-full object-cover" />
                      ) : (
                        pet.species === 'Dog' ? '🐶' : pet.species === 'Cat' ? '🐱' : '🐾'
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{pet.name}</p>
                      <p className="text-sm text-slate-500">{pet.breed} • {pet.age} yrs</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Appointments Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Upcoming Appointments</h2>
            <Link
              href="/appointments/new"
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Book Now
            </Link>
          </div>
          <div className="p-6">
            {appointments.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No upcoming appointments.
              </div>
            ) : (
              <ul className="space-y-4">
                {appointments.map((apt) => (
                  <li key={apt.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                    <div>
                      <p className="font-semibold text-slate-800">{apt.pet.name} - {apt.service.name}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(apt.dateTime).toLocaleDateString()} at {new Date(apt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-50 text-yellow-700">
                      {apt.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
