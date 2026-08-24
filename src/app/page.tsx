import Link from 'next/link';
import { PawPrint, Calendar, FileText, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-[#A5CD39] selection:text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFB000] rounded-xl flex items-center justify-center text-white shadow-md">
              <PawPrint className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-lg text-slate-800 tracking-tight">PetCare Clinic</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-slate-600 font-semibold hover:text-[#FFB000] transition-colors">
              Log in
            </Link>
            <Link 
              href="/register" 
              className="px-6 py-2.5 bg-[#A5CD39] hover:bg-[#94bd2d] text-white rounded-full font-bold shadow-lg shadow-[#A5CD39]/20 transition-all hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A5CD39]/10 text-[#A5CD39] font-bold text-sm mb-6 border border-[#A5CD39]/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A5CD39] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A5CD39]"></span>
                </span>
                The Modern Standard for Pet Care
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-800 leading-[1.1] mb-6 tracking-tight">
                Premium care for your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A5CD39] to-[#FFB000]">best friend.</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-slate-500 mb-10 leading-relaxed max-w-lg">
                Manage appointments, access detailed medical records, and experience a seamless digital veterinary journey all in one place.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/register" 
                  className="px-8 py-4 bg-[#A5CD39] hover:bg-[#94bd2d] text-white rounded-full font-bold shadow-xl shadow-[#A5CD39]/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 text-lg"
                >
                  Book an Appointment <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-8 text-slate-600 font-medium text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#A5CD39]" /> Certified Vets
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#A5CD39]" /> 24/7 Access
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative lg:h-[600px] flex items-center justify-center animate-in fade-in slide-in-from-right-8 duration-1000">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#A5CD39]/20 to-[#FFB000]/20 rounded-[3rem] blur-3xl transform -rotate-6 scale-105"></div>
              <div className="relative w-full h-[400px] lg:h-full rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-white">
                <Image 
                  src="/hero-bg.jpg" 
                  alt="Modern Veterinary Clinic" 
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mb-4">Everything you need</h2>
            <p className="text-slate-500 text-lg">A fully integrated digital platform for modern veterinary care.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#A5CD39] shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Smart Scheduling</h3>
              <p className="text-slate-500 leading-relaxed">Book, reschedule, or cancel appointments instantly without waiting on hold.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#FFB000] shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Digital Records</h3>
              <p className="text-slate-500 leading-relaxed">Access your pet&apos;s complete medical history, vaccination records, and prescriptions anywhere.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Health Tracking</h3>
              <p className="text-slate-500 leading-relaxed">Monitor your pet&apos;s weight, diet, and vital metrics over time with interactive charts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-white">
              <PawPrint className="w-4 h-4" />
            </div>
            <span className="font-bold text-white tracking-wide">PetCare</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} PetCare Clinic SaaS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
