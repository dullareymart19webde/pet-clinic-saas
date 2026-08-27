import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role === 'PET_OWNER') {
    redirect('/dashboard');
  }

  const billableSnapshot = await db.collection('appointments').where('status', 'in', ['COMPLETED', 'APPROVED']).orderBy('dateTime', 'desc').get();
  const billableAppointments = billableSnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800">Billing & Invoicing</h1>
        <p className="text-slate-500 mt-1">Generate invoices for services rendered.</p>
      </div>

      <div className="p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-200 text-sm font-medium text-slate-500">
              <th className="pb-3 px-4">Date</th>
              <th className="pb-3 px-4">Client</th>
              <th className="pb-3 px-4">Service</th>
              <th className="pb-3 px-4">Amount</th>
              <th className="pb-3 px-4">Status</th>
              <th className="pb-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {billableAppointments.map((apt) => (
              <tr key={apt.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 text-slate-800">
                  {new Date(apt.dateTime).toLocaleDateString()}
                </td>
                <td className="py-4 px-4 text-slate-800">
                  {apt.pet.owner.firstName} {apt.pet.owner.lastName} <br/>
                  <span className="text-sm text-slate-500">Pet: {apt.pet.name}</span>
                </td>
                <td className="py-4 px-4 text-slate-800">{apt.service.name}</td>
                <td className="py-4 px-4 text-slate-800 font-medium">${apt.service.price.toFixed(2)}</td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                    Unpaid
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-100 font-medium transition-colors">
                    Generate Invoice
                  </button>
                </td>
              </tr>
            ))}
            {billableAppointments.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No billable appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
