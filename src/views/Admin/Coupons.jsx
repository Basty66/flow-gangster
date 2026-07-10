import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Coupons() {
  const { getAuthHeaders } = useAuth();
  const [form, setForm] = useState({ codigo: '', tipo: 'PERCENT', valor: '', fecha_expiracion: '', limite_usos: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/cupones', {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ ...form, valor: parseInt(form.valor), limite_usos: parseInt(form.limite_usos) }),
      });
      if (res.ok) {
        setMsg({ type: 'success', text: 'Cupon creado exitosamente' });
        setForm({ codigo: '', tipo: 'PERCENT', valor: '', fecha_expiracion: '', limite_usos: '' });
      } else { const d = await res.json(); setMsg({ type: 'error', text: d.error }); }
    } catch { setMsg({ type: 'error', text: 'Error al crear cupon' }); }
  };

  return (
    <div className="max-w-lg">
      <p className="font-display font-bold text-sm text-white tracking-[0.08em] uppercase mb-6">Crear Cupon de Descuento</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value.toUpperCase() })}
               placeholder="Codigo (Ej: DROP20)" className="input text-xs" required />
        <div className="flex gap-1">
          <button type="button" onClick={() => setForm({ ...form, tipo: 'PERCENT' })}
                  className={`flex-1 py-3 text-xs font-bold tracking-[0.1em] uppercase border transition-all ${
                    form.tipo === 'PERCENT' ? 'bg-orange text-black border-orange' : 'border-[#333] text-[#555] hover:border-[#666]'
                  }`}>
            Porcentaje %
          </button>
          <button type="button" onClick={() => setForm({ ...form, tipo: 'FIXED' })}
                  className={`flex-1 py-3 text-xs font-bold tracking-[0.1em] uppercase border transition-all ${
                    form.tipo === 'FIXED' ? 'bg-orange text-black border-orange' : 'border-[#333] text-[#555] hover:border-[#666]'
                  }`}>
            Monto Fijo $
          </button>
        </div>
        <input value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })}
               type="number" placeholder={form.tipo === 'PERCENT' ? 'Porcentaje (Ej: 20)' : 'Monto en CLP (Ej: 5000)'} className="input text-xs" required />
        <input value={form.fecha_expiracion} onChange={(e) => setForm({ ...form, fecha_expiracion: e.target.value })}
               type="date" className="input text-xs" required />
        <input value={form.limite_usos} onChange={(e) => setForm({ ...form, limite_usos: e.target.value })}
               type="number" placeholder="Limite de usos" className="input text-xs" required />
        {msg.text && <p className={`text-xs font-bold ${msg.type === 'success' ? 'text-white' : 'text-[#666]'}`}>{msg.text}</p>}
        <button type="submit" className="btn btn-primary w-full justify-center text-xs">CREAR CUPON</button>
      </form>
    </div>
  );
}
