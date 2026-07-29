'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PawPrint } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Custom Modal States
  const [showServices, setShowServices] = useState(false);
  const [showSitters, setShowSitters] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#FDEFD8] p-4 sm:p-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-xl flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left Side - Content & Form */}
        <div className="w-full md:w-[55%] p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-[#FFB000] rounded-2xl flex items-center justify-center text-white shadow-md">
              <PawPrint className="w-7 h-7" />
            </div>
            <span className="font-extrabold text-sm text-[#FFB000] tracking-wider uppercase">Pet Care</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 leading-tight mb-4 tracking-tight">
            Welcome back to your pet's dashboard
          </h1>
          <p className="text-slate-500 mb-10 text-lg leading-relaxed">
            Log in to manage appointments, view medical records, and provide the best professional care for your furry friend!
          </p>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="email"
                required
                placeholder="Email address"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-full focus:ring-4 focus:ring-[#A5CD39]/20 focus:border-[#A5CD39] outline-none transition-all text-slate-700 font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                placeholder="Password"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-full focus:ring-4 focus:ring-[#A5CD39]/20 focus:border-[#A5CD39] outline-none transition-all text-slate-700 font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-10 py-4 bg-[#A5CD39] hover:bg-[#94bd2d] text-white font-bold rounded-full transition-colors disabled:opacity-50 shadow-lg shadow-[#A5CD39]/30 text-lg"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-sm text-slate-500 font-medium">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#FFB000] hover:text-[#e69e00] font-bold transition-colors">
              Create one here
            </Link>
          </div>
        </div>

        {/* Right Side - Image Container */}
        <div className="hidden md:block w-[45%] p-4 lg:p-6">
          <div className="w-full h-full bg-[#FF8C73] rounded-[2rem] overflow-hidden relative shadow-inner group">
            {/* Nav links on top of image */}
            <div className="absolute top-8 left-0 right-0 flex justify-center gap-6 text-white/90 text-sm font-bold z-20 px-4 flex-wrap drop-shadow-md">
              <button 
                onClick={() => setShowBooking(true)} 
                className="cursor-pointer hover:text-white transition-colors"
              >
                Booking
              </button>
              <button 
                onClick={() => setShowServices(true)} 
                className="cursor-pointer hover:text-white transition-colors"
              >
                Our services
              </button>
              <button 
                onClick={() => setShowSitters(true)}
                className="cursor-pointer hover:text-white transition-colors"
              >
                Pet sitters
              </button>
              <a href="mailto:hello@petcare.com" className="cursor-pointer hover:text-white transition-colors">Contact</a>
            </div>

            {/* Custom Booking Modal */}
            {showBooking && (
              <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md text-slate-800 p-6 rounded-3xl shadow-2xl z-30 w-72 border border-white/40 text-center">
                <h3 className="font-extrabold text-lg mb-2 text-[#FFB000] uppercase tracking-wider">Book an Appointment</h3>
                <p className="text-slate-500 text-sm font-medium mb-6">Please create an account or sign in using the form on the left to start booking appointments for your pet!</p>
                <div className="text-4xl mb-6 animate-bounce">📅</div>
                <button onClick={() => setShowBooking(false)} className="w-full bg-[#A5CD39] hover:bg-[#94bd2d] text-white py-3 rounded-2xl transition-colors font-bold shadow-lg shadow-[#A5CD39]/30">Got it!</button>
              </div>
            )}

            {/* Custom Services Modal */}
            {showServices && (
              <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md text-slate-800 p-6 rounded-3xl shadow-2xl z-30 w-64 border border-white/40">
                <h3 className="font-extrabold text-lg mb-4 text-[#FFB000] uppercase tracking-wider text-center">Our Services</h3>
                <ul className="space-y-4 font-bold text-sm text-slate-600">
                  <li className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl"><span className="text-2xl">🐾</span> Boarding</li>
                  <li className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl"><span className="text-2xl">🏥</span> Veterinary</li>
                  <li className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl"><span className="text-2xl">🎾</span> Training</li>
                  <li className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl"><span className="text-2xl">✂️</span> Grooming</li>
                </ul>
                <button onClick={() => setShowServices(false)} className="mt-6 w-full bg-[#A5CD39] hover:bg-[#94bd2d] text-white py-3 rounded-2xl transition-colors font-bold shadow-lg shadow-[#A5CD39]/30">Awesome!</button>
              </div>
            )}

            {/* Custom Sitters Modal */}
            {showSitters && (
              <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md text-slate-800 p-6 rounded-3xl shadow-2xl z-30 w-72 border border-white/40 text-center">
                <h3 className="font-extrabold text-lg mb-2 text-[#FFB000] uppercase tracking-wider">Meet the Team</h3>
                <p className="text-slate-500 text-sm font-medium mb-6">Our professional pet sitters are background-checked and love animals as much as you do!</p>
                <div className="flex justify-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl shadow-inner">👨‍𦾱</div>
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-xl shadow-inner">👩‍𦾱</div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl shadow-inner">👨‍𦾱</div>
                </div>
                <button onClick={() => setShowSitters(false)} className="w-full bg-[#A5CD39] hover:bg-[#94bd2d] text-white py-3 rounded-2xl transition-colors font-bold shadow-lg shadow-[#A5CD39]/30">Close</button>
              </div>
            )}
            
            <img 
              src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=1200" 
              alt="Happy dog" 
              className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
