'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddPetPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    weight: '',
    allergies: '',
    profilePhoto: '',
  });
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 256;
        const MAX_HEIGHT = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with 0.7 quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setPhotoPreview(dataUrl);
        setFormData(prev => ({ ...prev, profilePhoto: dataUrl }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: formData.age ? parseInt(formData.age) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
        }),
      });

      if (!res.ok) throw new Error('Failed to add pet');
      
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-12 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-[#A5CD39]/20 text-[#A5CD39] rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Pet Added Successfully!</h2>
        <p className="text-slate-500 text-lg">Redirecting you back to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#A5CD39]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
      
      <h1 className="text-3xl font-extrabold text-slate-800 mb-8 tracking-tight">Add a New Pet</h1>
      {error && <div className="text-red-500 bg-red-50 p-4 rounded-xl mb-6 font-medium border border-red-100 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        {error}
      </div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col items-center gap-4 p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-200 border-4 border-white shadow-sm flex items-center justify-center relative group">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">📸</span>
              )}
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-white text-xs font-medium">Upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
            <p className="text-xs text-slate-500 text-center">Click to upload a cute photo!<br/>(JPG, PNG)</p>
          </div>
          
          <div className="md:col-span-2 grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <input type="text" required className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-[#A5CD39] focus:ring-4 focus:ring-[#A5CD39]/20 transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Species</label>
              <select className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-[#A5CD39] focus:ring-4 focus:ring-[#A5CD39]/20 transition-all appearance-none bg-white" value={formData.species} onChange={e => setFormData({...formData, species: e.target.value})}>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Breed</label>
            <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-[#A5CD39] focus:ring-4 focus:ring-[#A5CD39]/20 transition-all" value={formData.breed} onChange={e => setFormData({...formData, breed: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
            <input type="number" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-[#A5CD39] focus:ring-4 focus:ring-[#A5CD39]/20 transition-all" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Weight (kg)</label>
            <input type="number" step="0.1" className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-[#A5CD39] focus:ring-4 focus:ring-[#A5CD39]/20 transition-all" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Allergies / Notes</label>
          <textarea className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-[#A5CD39] focus:ring-4 focus:ring-[#A5CD39]/20 transition-all" rows={3} value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} />
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <button type="button" onClick={() => router.back()} className="px-6 py-3 text-slate-500 hover:bg-slate-100 rounded-xl font-bold transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="px-8 py-3 bg-[#A5CD39] hover:bg-[#94bd2d] text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-[#A5CD39]/30 flex items-center justify-center min-w-[140px]">
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Save Pet'}
          </button>
        </div>
      </form>
    </div>
  );
}
