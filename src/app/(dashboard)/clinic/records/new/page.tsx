'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddMedicalRecordPage() {
  const router = useRouter();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    petId: '',
    visitNotes: '',
    diagnosis: '',
    treatment: '',
    nextVaccinationDue: ''
  });

  useEffect(() => {
    fetch('/api/clinic/pets/list')
      .then(res => res.json())
      .then(data => {
        setPets(data);
        if (data.length > 0) setFormData(prev => ({ ...prev, petId: data[0].id }));
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/clinic/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          nextVaccinationDue: formData.nextVaccinationDue ? new Date(formData.nextVaccinationDue).toISOString() : null
        })
      });
      if (res.ok) {
        router.push('/clinic/records');
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Add Medical Record</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Patient (Pet)</label>
          <select className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" value={formData.petId} onChange={e => setFormData({...formData, petId: e.target.value})} required>
            {pets.map((pet: any) => <option key={pet.id} value={pet.id}>{pet.name} ({pet.owner.firstName} {pet.owner.lastName})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Diagnosis</label>
          <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Visit Notes</label>
          <textarea className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" rows={4} value={formData.visitNotes} onChange={e => setFormData({...formData, visitNotes: e.target.value})}></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Treatment Prescribed</label>
          <textarea className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" rows={3} value={formData.treatment} onChange={e => setFormData({...formData, treatment: e.target.value})}></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Next Vaccination Due (Optional)</label>
          <input type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" value={formData.nextVaccinationDue} onChange={e => setFormData({...formData, nextVaccinationDue: e.target.value})} />
        </div>
        
        <div className="flex justify-end gap-4 border-t border-slate-100 pt-6">
          <button type="button" onClick={() => router.back()} className="px-6 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">{loading ? 'Saving...' : 'Save Record'}</button>
        </div>
      </form>
    </div>
  );
}
