import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const STEPS = ['DATOS', 'RESUMEN', 'PAGO'];

const regiones = [
  'Metropolitana', 'Valparaíso', 'Biobío', 'Antofagasta',
  'Maule', 'La Araucanía', 'Coquimbo', 'Los Lagos',
  'O\'Higgins', 'Tarapacá', 'Los Ríos', 'Atacama',
  'Ñuble', 'Aysén', 'Magallanes', 'Arica y Parinacota',
];

export default function Checkout() {
  const { items, total, clearCart, cupon, setCupon, cuponData, setCuponData } = useCart();
  const navigate = useNavigate();
  const [paso, setPaso] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    nombre: '', email: '', telefono: '',
    region: 'Metropolitana', comuna: '', direccion: '',
    notas: '',
  });
  const [cuponInput, setCuponInput] = useState('');

  useEffect(() => {
    if (total === 0 && !success) navigate('/');
  }, [total, success, navigate]);

  useEffect(() => { window.scrollTo(0, 0); }, [paso]);

  const set = (k) => (e) => setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const validarPaso1 = () => {
    if (!form.nombre.trim()) return 'Nombre requerido';
    if (!form.email.includes('@')) return 'Email invalido';
    if (!form.telefono.trim()) return 'Telefono requerido';
    if (!form.comuna.trim()) return 'Comuna requerida';
    if (!form.direccion.trim()) return 'Dirección requerida';
    return null;
  };

  const validarCuponClick = async () => {
    setError('');
    try {
      const r = await fetch('/api/validar-cupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: cuponInput, total, items }),
      });
      const data = await r.json();
      if (r.ok) { setCupon(cuponInput); setCuponData(data); }
      else { setError(data.error || 'Codigo invalido'); setCupon(''); setCuponData(null); }
    } catch { setError('Error al validar el cupon'); }
  };

  const descuento = cuponData
    ? cuponData.tipo === 'PERCENT' ? total * (cuponData.valor / 100) : cuponData.valor
    : 0;
  const totalFinal = Math.max(0, total - descuento);

  const handleSubmit = async () => {
    const v = validarPaso1();
    if (v) { setError(v); return; }
    setSubmitting(true);
    setError('');
    try {
      const r = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_nombre: form.nombre,
          cliente_email: form.email,
          cliente_whatsapp: form.telefono,
          tipo_entrega: 'ENVIO_STARKEN',
          datos_envio: { region: form.region, comuna: form.comuna, direccion: form.direccion },
          metodo_pago: 'TRANSFERENCIA',
          items: items.map((i) => ({ producto_id: i.producto.id, talle: i.talle, cantidad: i.cantidad })),
          cupon_codigo: cupon || undefined,
        }),
      });
      if (!r.ok) {
        const d = await r.json();
        throw new Error(d.error || 'Error al crear pedido');
      }
      const data = await r.json();
      setSuccess(data);
      clearCart();
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="pt-28 pb-20 px-4">
        <div className="max-w-xl mx-auto text-center border border-[#333] p-10">
          <p className="font-display font-black text-6xl text-orange tracking-[-0.04em] mb-4">HECHO!</p>
          <p className="text-white font-bold text-lg mb-2">Pedido #{success.id}</p>
          <p className="text-[#666] text-sm mb-2">Recibiras un email con los detalles a <strong className="text-white">{form.email}</strong></p>
          <p className="text-[#555] text-xs mb-8">Te contactaremos por WhatsApp cuando el pedido este listo.</p>
          <div className="border border-[#333] p-4 mb-8 text-left">
            <p className="font-mono text-[9px] text-[#555] tracking-[0.15em] uppercase mb-3">Datos de Transferencia</p>
            <div className="space-y-1.5 text-sm">
              <p><span className="text-[#555]">Banco:</span> <span className="text-white">Mercado Pago</span></p>
              <p><span className="text-[#555]">Alias:</span> <span className="text-white">FLOW.GANGSTER</span></p>
              <p><span className="text-[#555]">CBU:</span> <span className="font-mono text-white">0000003100088776543219</span></p>
              <p><span className="text-[#555]">Titular:</span> <span className="text-white">Flow Gangster SpA</span></p>
              <p className="text-[#555] text-xs mt-3">Monto: <span className="font-bold text-white">${Number(total).toLocaleString('es-CL')}</span></p>
            </div>
          </div>
          <div className="flex gap-2 justify-center">
            <button onClick={() => navigate('/')} className="btn btn-primary">Volver a Tienda</button>
            <button onClick={() => navigate('/seguimiento')} className="btn btn-outline">Trackear Pedido</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-6 tracking-[-0.02em]">CHECKOUT</h1>

        {/* Stepper */}
        <div className="flex mb-10 border border-[#333]">
          {STEPS.map((s, i) => (
            <div key={s} className={`flex-1 py-3 text-center text-xs font-bold tracking-[0.1em] uppercase border-r last:border-r-0 border-[#333] transition-all duration-150 ${
              i === paso ? 'bg-orange text-black' : i < paso ? 'text-[#555]' : 'text-[#444]'
            }`}>
              {s}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 border border-[#333] px-4 py-3">
            <p className="text-[#666] text-sm">{error}</p>
          </div>
        )}

        {/* Paso 1: Datos */}
        {paso === 0 && (
          <div className="space-y-0 border border-[#333]">
            <div className="border-b border-[#333]">
              <label className="block px-6 pt-5 pb-1">
                <span className="font-mono text-[9px] text-[#555] tracking-[0.15em] uppercase">Nombre Completo</span>
              </label>
              <input value={form.nombre} onChange={set('nombre')} placeholder="ej: Bastian Rojas" className="input border-0 border-t border-[#333] px-6 pb-4 pt-1 text-sm" />
            </div>
            <div className="border-b border-[#333]">
              <label className="block px-6 pt-5 pb-1">
                <span className="font-mono text-[9px] text-[#555] tracking-[0.15em] uppercase">Email</span>
              </label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="ej: bastian@correo.cl" className="input border-0 border-t border-[#333] px-6 pb-4 pt-1 text-sm" />
            </div>
            <div className="border-b border-[#333]">
              <label className="block px-6 pt-5 pb-1">
                <span className="font-mono text-[9px] text-[#555] tracking-[0.15em] uppercase">Telefono</span>
              </label>
              <input type="tel" value={form.telefono} onChange={set('telefono')} placeholder="+569 1234 5678" className="input border-0 border-t border-[#333] px-6 pb-4 pt-1 text-sm" />
            </div>
            <div className="border-b border-[#333]">
              <label className="block px-6 pt-5 pb-1">
                <span className="font-mono text-[9px] text-[#555] tracking-[0.15em] uppercase">Region</span>
              </label>
              <select value={form.region} onChange={set('region')} className="input border-0 border-t border-[#333] px-6 pb-4 pt-1 text-sm appearance-none cursor-pointer">
                {regiones.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="border-b border-[#333]">
              <label className="block px-6 pt-5 pb-1">
                <span className="font-mono text-[9px] text-[#555] tracking-[0.15em] uppercase">Comuna</span>
              </label>
              <input value={form.comuna} onChange={set('comuna')} placeholder="ej: Melipilla" className="input border-0 border-t border-[#333] px-6 pb-4 pt-1 text-sm" />
            </div>
            <div className="border-b border-[#333]">
              <label className="block px-6 pt-5 pb-1">
                <span className="font-mono text-[9px] text-[#555] tracking-[0.15em] uppercase">Direccion</span>
              </label>
              <input value={form.direccion} onChange={set('direccion')} placeholder="Calle, numero, depto" className="input border-0 border-t border-[#333] px-6 pb-4 pt-1 text-sm" />
            </div>
            <div>
              <label className="block px-6 pt-5 pb-1">
                <span className="font-mono text-[9px] text-[#555] tracking-[0.15em] uppercase">Notas (opcional)</span>
              </label>
              <textarea value={form.notas} onChange={set('notas')} rows={2} placeholder="Alguna indicacion especial?" className="input border-0 border-t border-[#333] px-6 pb-4 pt-1 text-sm resize-none" />
            </div>
            <div className="px-6 py-4 border-t border-[#333]">
              <button onClick={() => { const v = validarPaso1(); if (v) setError(v); else setPaso(1); }}
                      className="btn btn-primary w-full justify-center py-3">
                CONTINUAR AL RESUMEN
              </button>
            </div>
          </div>
        )}

        {/* Paso 2: Resumen */}
        {paso === 1 && (
          <div>
            <div className="border border-[#333] mb-4">
              {items.map((item) => (
                <div key={item.producto.id} className="flex items-center gap-4 px-6 py-4 border-b border-[#333] last:border-b-0">
                  <div className="w-14 h-14 bg-[#0d0d0d] border border-[#333] flex-shrink-0">
                    {item.producto.imagen_url ? (
                      <img src={item.producto.imagen_url} alt={item.producto.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                      </div>
                    )}
                  </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[8px] text-[#555] tracking-[0.15em] uppercase">{item.producto.marca}</p>
                      <p className="font-display font-bold text-sm text-white truncate">{item.producto.nombre}</p>
                      {item.talle && <p className="font-mono text-[8px] text-[#555] tracking-[0.1em] mt-0.5">Talle: {item.talle}</p>}
                    </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-display font-bold text-sm text-white">x{item.cantidad}</p>
                    <p className="font-display font-bold text-sm text-orange">${Number(item.producto.precio * item.cantidad).toLocaleString('es-CL')}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon in checkout */}
            <div className="border border-[#333] px-6 py-4 mb-4">
              <p className="font-mono text-[9px] text-[#555] tracking-[0.15em] uppercase mb-2">Cupon de descuento</p>
              <div className="flex gap-0">
                <input value={cuponInput} onChange={(e) => setCuponInput(e.target.value.toUpperCase())} placeholder="CODIGO" className="input flex-1 text-xs border-r-0" />
                <button onClick={validarCuponClick} className="px-4 py-2 text-xs font-bold tracking-[0.1em] uppercase bg-orange text-black hover:bg-orange-light transition-colors duration-150">
                  OK
                </button>
              </div>
              {cuponData && (
                <p className="text-xs font-bold text-white mt-2">
                  Descuento: -${Number(descuento).toLocaleString('es-CL')}
                </p>
              )}
            </div>

            <div className="border border-[#333] px-6 py-4 mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#666]">Subtotal</span>
                <span className="text-white font-bold">${Number(total).toLocaleString('es-CL')}</span>
              </div>
              {descuento > 0 && (
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-orange">Descuento</span>
                  <span className="text-orange font-bold">-${Number(descuento).toLocaleString('es-CL')}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-[#333] pt-3">
                <span className="font-display font-bold text-white">Total</span>
                <span className="font-display font-bold text-orange text-xl">${Number(totalFinal).toLocaleString('es-CL')}</span>
              </div>
            </div>

            <div className="flex gap-1">
              <button onClick={() => setPaso(0)} className="btn btn-outline flex-1 justify-center py-3">VOLVER</button>
              <button onClick={() => setPaso(2)} className="btn btn-primary flex-1 justify-center py-3">IR A PAGO</button>
            </div>
          </div>
        )}

        {/* Paso 3: Pago */}
        {paso === 2 && (
          <div>
            <div className="border border-[#333] px-6 py-6 mb-4">
              <p className="font-display font-black text-2xl text-white mb-6 tracking-[-0.02em]">Transferencia Bancaria</p>
              <div className="space-y-3 text-sm border border-[#333] p-5">
                <p><span className="text-[#555]">Banco:</span> <span className="text-white">Mercado Pago</span></p>
                <p><span className="text-[#555]">Alias:</span> <span className="text-white">FLOW.GANGSTER</span></p>
                <p><span className="text-[#555]">CBU:</span> <span className="font-mono text-white">0000003100088776543219</span></p>
                <p><span className="text-[#555]">Titular:</span> <span className="text-white">Flow Gangster SpA</span></p>
              </div>
              <div className="flex justify-between mt-4 pb-2 border-b border-[#333]">
                <span className="font-display font-bold text-white text-lg">Total a pagar</span>
                <span className="font-display font-bold text-orange text-lg">${Number(totalFinal).toLocaleString('es-CL')}</span>
              </div>
              <p className="text-[#555] text-xs mt-4 leading-relaxed">
                Una vez realizado el pago, envianos el comprobante por WhatsApp para confirmar tu pedido.
                Los productos <strong className="text-white">INSTANT DROP</strong> se retiran en Melipilla o se envian por Starken dentro de 24-48h.
                Los <strong className="text-white">PRE-ORDER</strong> se importan en 15-20 dias habiles.
              </p>
            </div>

            <div className="border border-[#333] px-6 py-4 mb-4">
              <p className="font-display font-bold text-sm text-white mb-1">Resumen</p>
              <p className="text-[#666] text-xs">{form.nombre} — {form.email}</p>
              <p className="text-[#666] text-xs">{form.direccion}, {form.comuna}, {form.region}</p>
            </div>

            {error && <div className="border border-[#333] px-4 py-3 mb-4"><p className="text-[#666] text-sm">{error}</p></div>}

            <div className="flex gap-1">
              <button onClick={() => setPaso(1)} disabled={submitting} className="btn btn-outline flex-1 justify-center py-3">VOLVER</button>
              <button onClick={handleSubmit} disabled={submitting} className={`btn btn-primary flex-1 justify-center py-3 ${submitting ? 'opacity-30' : ''}`}>
                {submitting ? 'PROCESANDO...' : 'CONFIRMAR PEDIDO'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
