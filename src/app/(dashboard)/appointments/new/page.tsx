'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BookAppointmentPage() {
  const router = useRouter();
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    petId: '',
    serviceId: '',
    vetId: '',
    dateTime: '',
    notes: ''
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/pets/list').then(res => res.json()),
      fetch('/api/services').then(res => res.json()),
      fetch('/api/vets/list').then(res => res.json())
    ]).then(([petsData, servicesData, vetsData]) => {
      setPets(petsData);
      setServices(servicesData);
      setVets(vetsData);
      if (petsData.length > 0) setFormData(prev => ({ ...prev, petId: petsData[0].id }));
      if (servicesData.length > 0) setFormData(prev => ({ ...prev, serviceId: servicesData[0].id }));
      if (vetsData.length > 0) setFormData(prev => ({ ...prev, vetId: vetsData[0].id }));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          dateTime: new Date(formData.dateTime).toISOString()
        })
      });
      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Book an Appointment</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Select Pet</label>
          <select className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" value={formData.petId} onChange={e => setFormData({...formData, petId: e.target.value})} required>
            {pets.map((pet: any) => <option key={pet.id} value={pet.id}>{pet.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Select Service</label>
          <select className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" value={formData.serviceId} onChange={e => setFormData({...formData, serviceId: e.target.value})} required>
            {services.map((svc: any) => <option key={svc.id} value={svc.id}>{svc.name} (${svc.price})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Select Veterinarian</label>
          <select className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" value={formData.vetId} onChange={e => setFormData({...formData, vetId: e.target.value})} required>
            {vets.length === 0 && <option value="" disabled>No veterinarians available</option>}
            {vets.map((vet: any) => <option key={vet.id} value={vet.id}>{vet.name} ({vet.specialty})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Date & Time</label>
          <input type="datetime-local" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" required value={formData.dateTime} onChange={e => setFormData({...formData, dateTime: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes</label>
          <textarea className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">{loading ? 'Booking...' : 'Confirm Booking'}</button>
        </div>
      </form>
    </div>
  );
}
