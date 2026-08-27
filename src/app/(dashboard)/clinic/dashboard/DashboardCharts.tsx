'use client';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

export function RevenueChart({ data }: { data: any[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(15, 23, 42, 0.05)" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12, fontFamily: 'var(--font-sans)'}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12, fontFamily: 'var(--font-sans)'}} tickFormatter={(val) => `$${val}`} />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontFamily: 'var(--font-sans)' }}
            formatter={(value: any) => [`$${value}`, 'Revenue']}
          />
          <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#fff', stroke: '#10b981'}} activeDot={{r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2}} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AppointmentsChart({ data }: { data: any[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(15, 23, 42, 0.05)" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12, fontFamily: 'var(--font-sans)'}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12, fontFamily: 'var(--font-sans)'}} />
          <Tooltip 
            cursor={{fill: 'rgba(16, 185, 129, 0.05)'}}
            contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontFamily: 'var(--font-sans)' }}
          />
          <Bar dataKey="appointments" fill="#0f172a" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
