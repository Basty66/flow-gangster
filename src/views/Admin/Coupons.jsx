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
        setMsg({ type: 'success', text: '✓ Cupón creado exitosamente' });
        setForm({ codigo: '', tipo: 'PERCENT', valor: '', fecha_expiracion: '', limite_usos: '' });
      } else {
        const data = await res.json();
        setMsg({ type: 'error', text: `✕ ${data.error}` });
      }
    } catch {
      setMsg({ type: 'error', text: 'Error al crear cupón' });
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-lg">
        <h2 className="font-black text-lg mb-6 uppercase tracking-wider">Crear Cupón de Descuento</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value.toUpperCase() })}
                 placeholder="Código (Ej: DROP20)" className="input-field uppercase" required />

          <div className="flex gap-3">
            <button type="button" onClick={() => setForm({ ...form, tipo: 'PERCENT' })}
                    className={`flex-1 py-3 border-2 font-black text-sm uppercase tracking-wider transition-all ${
                      form.tipo === 'PERCENT' ? 'border-neon-cyan text-neon-cyan' : 'border-white/20 text-white/60'
                    }`}>
              Porcentaje %
            </button>
            <button type="button" onClick={() => setForm({ ...form, tipo: 'FIXED' })}
                    className={`flex-1 py-3 border-2 font-black text-sm uppercase tracking-wider transition-all ${
                      form.tipo === 'FIXED' ? 'border-neon-cyan text-neon-cyan' : 'border-white/20 text-white/60'
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
                 type="number" placeholder="Límite de usos" className="input-field" required />

          {msg.text && (
            <p className={`font-black text-sm ${msg.type === 'success' ? 'text-neon-cyan' : 'text-fire-orange'}`}>
              {msg.text}
            </p>
          )}

          <button type="submit" className="btn-primary w-full">
            CREAR CUPÓN
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
