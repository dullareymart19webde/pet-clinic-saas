'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { PawPrint } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
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

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(JSON.stringify(data));
      }

      // Automatically sign in the user after registration
      const signInRes = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInRes?.error) {
        throw new Error(signInRes.error);
      }

      router.push('/dashboard/owner');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#FDEFD8] p-4 sm:p-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-xl flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left Side - Content & Form */}
        <div className="w-full md:w-[55%] p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#FFB000] rounded-2xl flex items-center justify-center text-white shadow-md">
              <PawPrint className="w-7 h-7" />
            </div>
            <span className="font-extrabold text-sm text-[#FFB000] tracking-wider uppercase">Pet Care</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 leading-tight mb-4 tracking-tight">
            Join the family
          </h1>
          <p className="text-slate-500 mb-8 text-lg leading-relaxed">
            Create an account to book appointments, track medical records, and ensure your pet lives their best life!
          </p>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="firstName"
                  required
                  placeholder="First name"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-full focus:ring-4 focus:ring-[#A5CD39]/20 focus:border-[#A5CD39] outline-none transition-all text-slate-700 font-medium"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="lastName"
                  required
                  placeholder="Last name"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-full focus:ring-4 focus:ring-[#A5CD39]/20 focus:border-[#A5CD39] outline-none transition-all text-slate-700 font-medium"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <input
                type="email"
                name="email"
                required
                placeholder="Email address"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-full focus:ring-4 focus:ring-[#A5CD39]/20 focus:border-[#A5CD39] outline-none transition-all text-slate-700 font-medium"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                required
                placeholder="Password"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-full focus:ring-4 focus:ring-[#A5CD39]/20 focus:border-[#A5CD39] outline-none transition-all text-slate-700 font-medium"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-10 py-4 bg-[#A5CD39] hover:bg-[#94bd2d] text-white font-bold rounded-full transition-colors disabled:opacity-50 shadow-lg shadow-[#A5CD39]/30 text-lg"
              >
                {loading ? 'Registering...' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-sm text-slate-500 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="text-[#FFB000] hover:text-[#e69e00] font-bold transition-colors">
              Sign in here
            </Link>
          </div>
        </div>

        {/* Right Side - Image Container */}
        <div className="hidden md:block w-[45%] p-4 lg:p-6">
          <div className="w-full h-full bg-[#FF8C73] rounded-[2rem] overflow-hidden relative shadow-inner group">
            <div className="absolute top-8 left-0 right-0 flex justify-center gap-3 lg:gap-5 text-white/90 text-xs lg:text-sm font-bold z-20 px-2 drop-shadow-md">
              <button 
                onClick={() => { setShowBooking(true); setShowServices(false); setShowSitters(false); }} 
                className="cursor-pointer hover:text-white transition-colors"
              >
                Booking
              </button>
              <button 
                onClick={() => { setShowServices(true); setShowBooking(false); setShowSitters(false); }} 
                className="cursor-pointer hover:text-white transition-colors"
              >
                Our services
              </button>
              <button 
                onClick={() => { setShowSitters(true); setShowBooking(false); setShowServices(false); }}
                className="cursor-pointer hover:text-white transition-colors"
              >
                Pet sitters
              </button>
              <a href="mailto:hello@petcare.com" className="cursor-pointer hover:text-white transition-colors">Contact</a>
            </div>

            {/* Custom Booking Modal */}
            {showBooking && (
              <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md text-slate-800 p-6 rounded-3xl shadow-2xl z-30 w-11/12 max-w-[280px] border border-white/40 text-center">
                <h3 className="font-extrabold text-lg mb-2 text-[#FFB000] uppercase tracking-wider">Book an Appointment</h3>
                <p className="text-slate-500 text-sm font-medium mb-6">Please create an account or sign in using the form on the left to start booking appointments for your pet!</p>
                <div className="text-4xl mb-6 animate-bounce">📅</div>
                <button onClick={() => setShowBooking(false)} className="w-full bg-[#A5CD39] hover:bg-[#94bd2d] text-white py-3 rounded-2xl transition-colors font-bold shadow-lg shadow-[#A5CD39]/30">Got it!</button>
              </div>
            )}

            {/* Custom Services Modal */}
            {showServices && (
              <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md text-slate-800 p-6 rounded-3xl shadow-2xl z-30 w-11/12 max-w-[280px] border border-white/40">
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
              <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md text-slate-800 p-6 rounded-3xl shadow-2xl z-30 w-11/12 max-w-[280px] border border-white/40 text-center">
                <h3 className="font-extrabold text-lg mb-2 text-[#FFB000] uppercase tracking-wider">Meet the Team</h3>
                <p className="text-slate-500 text-sm font-medium mb-6">Our professional pet sitters are background-checked and love animals as much as you do!</p>
                <div className="flex justify-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl shadow-inner">👨‍⚕️</div>
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-xl shadow-inner">👩‍⚕️</div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl shadow-inner">👨‍⚕️</div>
                </div>
                <button onClick={() => setShowSitters(false)} className="w-full bg-[#A5CD39] hover:bg-[#94bd2d] text-white py-3 rounded-2xl transition-colors font-bold shadow-lg shadow-[#A5CD39]/30">Close</button>
              </div>
            )}
            
            <img 
              src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1200" 
              alt="Happy dog" 
              className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
