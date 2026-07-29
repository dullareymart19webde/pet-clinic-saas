import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function MedicalRecordsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role === 'PET_OWNER') {
    redirect('/dashboard');
  }

  const records = await prisma.medicalRecord.findMany({
    include: { pet: { include: { owner: true } }, vet: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Medical Records</h1>
          <p className="text-slate-500 mt-1">View and manage patient histories.</p>
        </div>
        <Link href="/clinic/records/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Record
        </Link>
      </div>

      <div className="p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-200 text-sm font-medium text-slate-500">
              <th className="pb-3 px-4">Date</th>
              <th className="pb-3 px-4">Pet (Owner)</th>
              <th className="pb-3 px-4">Diagnosis</th>
              <th className="pb-3 px-4">Attending Vet</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 text-slate-800">
                  {new Date(rec.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-4 text-slate-800">
                  <span className="font-semibold">{rec.pet.name}</span> <br/>
                  <span className="text-sm text-slate-500">{rec.pet.owner.firstName} {rec.pet.owner.lastName}</span>
                </td>
                <td className="py-4 px-4 text-slate-800 max-w-xs truncate" title={rec.diagnosis || ''}>
                  {rec.diagnosis || 'No diagnosis recorded'}
                </td>
                <td className="py-4 px-4 text-slate-800">Dr. {rec.vet.lastName}</td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">
                  No medical records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
