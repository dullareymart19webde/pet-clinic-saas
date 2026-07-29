'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, List } from 'lucide-react';

export default function AppointmentList({ initialAppointments }: { initialAppointments: any[] }) {
  const router = useRouter();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/clinic/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setAppointments(appointments.map(apt => apt.id === id ? { ...apt, status } : apt));
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4 gap-2">
        <button 
          onClick={() => setView('list')}
          className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${view === 'list' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <List className="w-4 h-4" /> List
        </button>
        <button 
          onClick={() => setView('calendar')}
          className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${view === 'calendar' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <CalendarIcon className="w-4 h-4" /> Calendar
        </button>
      </div>

      {view === 'list' ? (
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-200 text-sm font-medium text-slate-500">
              <th className="pb-3 px-4">Date & Time</th>
              <th className="pb-3 px-4">Client</th>
              <th className="pb-3 px-4">Pet</th>
              <th className="pb-3 px-4">Service</th>
              <th className="pb-3 px-4">Status</th>
              <th className="pb-3 px-4">Actions</th>
            </tr>
          </thead>
      <tbody>
        {appointments.map((apt) => (
          <tr key={apt.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
            <td className="py-4 px-4 text-slate-800">
              {new Date(apt.dateTime).toLocaleDateString()} <br />
              <span className="text-sm text-slate-500">
                {new Date(apt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </td>
            <td className="py-4 px-4 text-slate-800">{apt.user.firstName} {apt.user.lastName}</td>
            <td className="py-4 px-4 text-slate-800">{apt.pet.name}</td>
            <td className="py-4 px-4 text-slate-800">{apt.service.name}</td>
            <td className="py-4 px-4">
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                apt.status === 'APPROVED' ? 'bg-green-50 text-green-700' :
                apt.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700' :
                apt.status === 'CANCELLED' ? 'bg-red-50 text-red-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {apt.status}
              </span>
            </td>
            <td className="py-4 px-4">
              <div className="flex gap-2">
                {apt.status === 'PENDING' && (
                  <button onClick={() => updateStatus(apt.id, 'APPROVED')} className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-md hover:bg-green-100 font-medium">Approve</button>
                )}
                {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                  <button onClick={() => updateStatus(apt.id, 'CANCELLED')} className="text-xs bg-red-50 text-red-700 px-3 py-1 rounded-md hover:bg-red-100 font-medium">Cancel</button>
                )}
              </div>
            </td>
          </tr>
        ))}
        {appointments.length === 0 && (
          <tr>
            <td colSpan={6} className="py-8 text-center text-slate-500">
              No appointments found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {appointments.length === 0 ? (
          <div className="col-span-full py-8 text-center text-slate-500">No appointments found.</div>
        ) : (
          appointments.map((apt) => (
            <div key={apt.id} className="border border-slate-200 rounded-xl p-4 bg-white hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-semibold text-slate-800">{new Date(apt.dateTime).toLocaleDateString()}</div>
                  <div className="text-sm text-slate-500">{new Date(apt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                  apt.status === 'APPROVED' ? 'bg-green-50 text-green-700' :
                  apt.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700' :
                  apt.status === 'CANCELLED' ? 'bg-red-50 text-red-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {apt.status}
                </span>
              </div>
              <div className="mb-4 space-y-1">
                <div className="text-sm"><span className="text-slate-500">Client:</span> <span className="font-medium text-slate-800">{apt.user.firstName} {apt.user.lastName}</span></div>
                <div className="text-sm"><span className="text-slate-500">Pet:</span> <span className="font-medium text-slate-800">{apt.pet.name}</span></div>
                <div className="text-sm"><span className="text-slate-500">Service:</span> <span className="font-medium text-slate-800">{apt.service.name}</span></div>
              </div>
              <div className="flex gap-2 pt-4 border-t border-slate-100">
                {apt.status === 'PENDING' && (
                  <button onClick={() => updateStatus(apt.id, 'APPROVED')} className="flex-1 text-xs bg-green-50 text-green-700 px-3 py-2 rounded-lg hover:bg-green-100 font-medium transition-colors">Approve</button>
                )}
                {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                  <button onClick={() => updateStatus(apt.id, 'CANCELLED')} className="flex-1 text-xs bg-red-50 text-red-700 px-3 py-2 rounded-lg hover:bg-red-100 font-medium transition-colors">Cancel</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    )}
    </div>
  );
}
