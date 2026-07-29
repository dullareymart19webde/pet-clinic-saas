'use client';
import Link from 'next/link';
import { Home, Calendar, PawPrint, LogOut, FileText, Stethoscope, CreditCard } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isClinicStaff = session?.user?.role && session.user.role !== 'PET_OWNER';

  const ownerLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Pets', href: '/pets/new', icon: PawPrint },
    { name: 'Appointments', href: '/appointments/new', icon: Calendar },
  ];

  const clinicLinks = [
    { name: 'Dashboard', href: '/clinic/dashboard', icon: Home },
    { name: 'Master Schedule', href: '/clinic/appointments', icon: Calendar },
    { name: 'Medical Records', href: '/clinic/records', icon: FileText },
    { name: 'Billing', href: '/clinic/billing', icon: CreditCard },
  ];

  const links = isClinicStaff ? clinicLinks : ownerLinks;

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-full flex flex-col shrink-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <Stethoscope className="w-8 h-8" />
          PetCare Clinic
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href) && (link.href !== '/dashboard' || pathname === '/dashboard');
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200 shrink-0">
        {session?.user && (
          <div className="mb-4 px-4 text-sm text-slate-500">
            Logged in as <br/> <strong className="text-slate-800">{session.user.name}</strong>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
