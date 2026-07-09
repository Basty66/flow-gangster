import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function Coupons() {
  const [form, setForm] = useState({
    codigo: '',
    tipo: 'PERCENT',
    valor: '',
    fecha_expiracion: '',
    limite_usos: '',
  });
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    try {
      const res = await fetch('/api/cupones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          valor: parseInt(form.valor),
          limite_usos: parseInt(form.limite_usos),
        }),
      });

      if (res.ok) {
        setMsg({ type: 'success', text: 'Cupon creado exitosamente' });
        setForm({ codigo: '', tipo: 'PERCENT', valor: '', fecha_expiracion: '', limite_usos: '' });
      } else {
        const data = await res.json();
        setMsg({ type: 'error', text: data.error });
      }
    } catch {
      setMsg({ type: 'error', text: 'Error al crear cupon' });
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-lg">
        <h2 className="font-bold text-base mb-6 uppercase tracking-[0.15em]">Crear Cupon de Descuento</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value.toUpperCase() })}
                 placeholder="Codigo (Ej: DROP20)" className="input-field uppercase text-xs" required />

          <div className="flex gap-3">
            <button type="button" onClick={() => setForm({ ...form, tipo: 'PERCENT' })}
                    className={`flex-1 py-3 border font-bold text-xs uppercase tracking-wider transition-all ${
                      form.tipo === 'PERCENT' ? 'border-accent text-accent' : 'border-white/10 text-[#525252]'
                    }`}>
              Porcentaje %
            </button>
            <button type="button" onClick={() => setForm({ ...form, tipo: 'FIXED' })}
                    className={`flex-1 py-3 border font-bold text-xs uppercase tracking-wider transition-all ${
                      form.tipo === 'FIXED' ? 'border-accent text-accent' : 'border-white/10 text-[#525252]'
                    }`}>
              Monto Fijo $
            </button>
          </div>

          <input value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })}
                 type="number" placeholder={form.tipo === 'PERCENT' ? 'Porcentaje (Ej: 20)' : 'Monto en CLP (Ej: 5000)'}
                 className="input-field" required />

          <input value={form.fecha_expiracion} onChange={(e) => setForm({ ...form, fecha_expiracion: e.target.value })}
                 type="date" className="input-field" required />

          <input value={form.limite_usos} onChange={(e) => setForm({ ...form, limite_usos: e.target.value })}
                 type="number" placeholder="Limite de usos" className="input-field" required />

          {msg.text && (
            <p className={`font-bold text-xs ${msg.type === 'success' ? 'text-accent' : 'text-red-400'}`}>
              {msg.text}
            </p>
          )}

          <button type="submit" className="btn-primary w-full">
            CREAR CUPON
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
