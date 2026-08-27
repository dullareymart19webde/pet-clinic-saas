import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-emerald-500/10 border border-emerald-100 flex flex-col items-center animate-fade-up">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin relative z-10" />
        </div>
        <h2 className="mt-6 text-xl font-bold text-slate-800 font-display">Loading...</h2>
        <p className="text-sm text-slate-500 mt-2 font-medium">Please wait while we prepare your dashboard.</p>
      </div>
    </div>
  );
}
