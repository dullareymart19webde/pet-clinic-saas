import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/firebase-admin';
import { RevenueChart, AppointmentsChart } from './DashboardCharts';
import { Users, Calendar as CalendarIcon, Activity, CheckCircle, Sparkles } from 'lucide-react';

export default async function ClinicDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role === 'PET_OWNER') {
    redirect('/login');
  }

  // 1. Total Pets
  const petsSnapshot = await db.collection('pets').count().get();
  const totalPets = petsSnapshot.data().count;

  // 2. Appointments Today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  
  // In a real app we'd query by date range. For now we fetch all and filter in memory 
  // since Firestore requires composite indexes for range queries on non-document ID fields.
  const appointmentsSnapshot = await db.collection('appointments').get();
  let appointmentsToday = 0;
  let completedAppointments = 0;

  appointmentsSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.status === 'COMPLETED') completedAppointments++;
    
    if (data.dateTime) {
      const dt = new Date(data.dateTime);
      if (dt >= todayStart && dt <= todayEnd) {
        appointmentsToday++;
      }
    }
  });

  // Mock data for charts
  const revenueData = [
    { name: 'Mon', revenue: 1200 },
    { name: 'Tue', revenue: 1900 },
    { name: 'Wed', revenue: 1500 },
    { name: 'Thu', revenue: 2200 },
    { name: 'Fri', revenue: 2800 },
    { name: 'Sat', revenue: 3400 },
    { name: 'Sun', revenue: 2100 },
  ];

  const appointmentData = [
    { name: 'Mon', appointments: 12 },
    { name: 'Tue', appointments: 15 },
    { name: 'Wed', appointments: 10 },
    { name: 'Thu', appointments: 18 },
    { name: 'Fri', appointments: 25 },
    { name: 'Sat', appointments: 30 },
    { name: 'Sun', appointments: 20 },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Header with Premium Typography */}
      <div className="animate-fade-up flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-[#10b981]" />
            <span className="text-sm font-semibold tracking-wider text-[#10b981] uppercase">Clinic Overview</span>
          </div>
          <h1 className="text-4xl font-black text-[#0f172a] font-display tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-2 font-medium max-w-xl">
            Real-time insights into your clinic&apos;s operations, patient health, and daily appointments.
          </p>
        </div>
        <div className="hidden md:flex flex-col items-end">
          <p className="text-sm text-slate-400 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-semibold text-emerald-600">System Online</span>
          </div>
        </div>
      </div>

      {/* KPI Cards (Glassmorphism + Magnetic Hover) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-3xl magnetic-card animate-fade-up stagger-1 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="w-12 h-12 bg-white/60 text-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-white/40">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Today&apos;s Schedule</p>
          <p className="text-4xl font-black text-slate-800 font-display">{appointmentsToday}</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl magnetic-card animate-fade-up stagger-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="w-12 h-12 bg-white/60 text-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-white/40">
            <CheckCircle className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Completed Sessions</p>
          <p className="text-4xl font-black text-slate-800 font-display">{completedAppointments}</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl magnetic-card animate-fade-up stagger-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="w-12 h-12 bg-white/60 text-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-white/40">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Patients</p>
          <p className="text-4xl font-black text-slate-800 font-display">{totalPets}</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl magnetic-card animate-fade-up stagger-4 relative overflow-hidden group bg-slate-900 !border-slate-800">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-50"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
              <Activity className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Performance</p>
            <p className="text-4xl font-black text-white font-display">+24%</p>
          </div>
        </div>
      </div>

      {/* Charts (Glassmorphism + Magnetic Hover) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-[2rem] magnetic-card animate-fade-up stagger-3">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-slate-800 font-display">Revenue Overview</h2>
            <select className="bg-white/50 border border-slate-200 text-sm font-medium text-slate-600 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500/50">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <RevenueChart data={revenueData} />
        </div>
        <div className="glass-panel p-8 rounded-[2rem] magnetic-card animate-fade-up stagger-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-slate-800 font-display">Patient Volume</h2>
            <select className="bg-white/50 border border-slate-200 text-sm font-medium text-slate-600 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500/50">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <AppointmentsChart data={appointmentData} />
        </div>
      </div>
    </div>
  );
}
