import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { RevenueChart, AppointmentsChart } from './DashboardCharts';
import { Users, Calendar as CalendarIcon, Activity, DollarSign } from 'lucide-react';

export default async function ClinicDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role === 'PET_OWNER') {
    redirect('/login');
  }

  // Fetch some real stats
  const totalPets = await prisma.pet.count();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  
  const appointmentsToday = await prisma.appointment.count({
    where: {
      dateTime: {
        gte: todayStart,
        lte: todayEnd,
      }
    }
  });

  const completedAppointments = await prisma.appointment.count({
    where: { status: 'COMPLETED' }
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Clinic Dashboard</h1>
        <p className="text-slate-500">Overview of today's operations and performance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Appointments Today</p>
            <p className="text-2xl font-bold text-slate-800">{appointmentsToday}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Completed Sessions</p>
            <p className="text-2xl font-bold text-slate-800">{completedAppointments}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Registered Pets</p>
            <p className="text-2xl font-bold text-slate-800">{totalPets}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">System Status</p>
            <p className="text-2xl font-bold text-slate-800">Optimal</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Revenue This Week</h2>
          <RevenueChart data={revenueData} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Appointments This Week</h2>
          <AppointmentsChart data={appointmentData} />
        </div>
      </div>
    </div>
  );
}
