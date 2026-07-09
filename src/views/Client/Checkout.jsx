import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const steps = [
  { n: 1, label: 'Datos' },
  { n: 2, label: 'Resumen' },
  { n: 3, label: 'Pago' },
];

export default function Checkout() {
  const { items, totalPrecio, clearCart } = useCart();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nombre: '',
    whatsapp: '',
    tipo_entrega: 'RETIRAR_SHOWROOM',
    region: '',
    comuna: '',
    direccion: '',
    metodo_pago: 'TRANSFERENCIA',
  });
  const [cupon, setCupon] = useState('');
  const [descuento, setDescuento] = useState(0);
  const [cuponMsg, setCuponMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const validarCupon = async () => {
    if (!cupon) return;
    setCuponMsg('Validando...');
    try {
      const res = await fetch('/api/validar-cupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: cupon, total_actual: totalPrecio }),
      });
      const data = await res.json();
      if (res.ok) {
        setDescuento(data.descuento);
        setCuponMsg(`${data.valor}${data.tipo === 'PERCENT' ? '%' : '$'} off`);
      } else {
        setDescuento(0);
        setCuponMsg(data.error);
      }
    } catch {
      setDescuento(0);
      setCuponMsg('Error');
    }
  };

  const total = Math.max(0, totalPrecio - descuento);

  const handleSubmit = async () => {
    if (!form.nombre || !form.whatsapp) {
      setError('Completa nombre y WhatsApp');
      return;
    }
    if (form.tipo_entrega === 'ENVIO_STARKEN' && !form.direccion) {
      setError('Completa la direccion');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        items: items.map((i) => ({ producto_id: i.producto.id, talle: i.talle, cantidad: i.cantidad })),
        cliente_nombre: form.nombre,
        cliente_whatsapp: form.whatsapp,
        tipo_entrega: form.tipo_entrega,
        datos_envio: form.tipo_entrega === 'ENVIO_STARKEN' ? { region: form.region, comuna: form.comuna, direccion: form.direccion } : null,
        metodo_pago: form.metodo_pago,
        cupon_codigo: cupon || undefined,
      };
      const res = await fetch('/api/pedidos', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setResultado(data);
        clearCart();
        setStep(3);
      } else {
        setError(data.error || 'Error al procesar');
      }
    } catch {
      setError('Error de conexion');
    }
    setSubmitting(false);
  };

  if (items.length === 0 && !resultado) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" className="mx-auto">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <p className="text-[#666]">Carrito vacio</p>
          <Link to="/" className="btn btn-primary text-sm">Ir a Tienda</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-12">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center gap-3">
              <div className={`flex items-center gap-2.5 ${step >= s.n ? 'text-purple' : 'text-[#555]'}`}>
                <div className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs transition-all ${
                  step > s.n ? 'bg-purple text-white' :
                  step === s.n ? 'bg-purple/10 text-purple border border-purple/30' :
                  'bg-surface2 text-[#555]'
                }`}>
                  {step > s.n ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : s.n}
                </div>
                <span className="hidden sm:block text-xs font-medium uppercase tracking-[0.08em]">{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-8 h-px ${step > s.n ? 'bg-purple/50' : 'bg-[#2a2a2a]'}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="max-w-lg mx-auto space-y-4">
            <div className="card p-6 space-y-4">
              <h2 className="font-display font-bold text-base text-[#f5f5f5]">Datos</h2>
              <div className="space-y-3">
                <input value={form.nombre} onChange={(e) => update('nombre', e.target.value)}
                       placeholder="Nombre *" className="input" />
                <input value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)}
                       placeholder="WhatsApp (Ej: +56912345678) *" className="input" />
              </div>
            </div>

            <div className="card p-6 space-y-4">
              <h2 className="font-display font-bold text-base text-[#f5f5f5]">Entrega</h2>
              <div className="flex gap-2">
                {['RETIRAR_SHOWROOM', 'ENVIO_STARKEN'].map((t) => (
                  <button key={t} onClick={() => update('tipo_entrega', t)}
                          className={`flex-1 py-3 rounded text-xs font-medium uppercase tracking-wider transition-all ${
                            form.tipo_entrega === t
                              ? 'bg-purple text-white'
                              : 'bg-surface2 text-[#666] border border-[#2a2a2a] hover:border-[#555]'
                          }`}>
                    {t === 'RETIRAR_SHOWROOM' ? 'Retiro' : 'Envio Starken'}
                  </button>
                ))}
              </div>
              {form.tipo_entrega === 'ENVIO_STARKEN' && (
                <div className="space-y-3">
                  <input value={form.region} onChange={(e) => update('region', e.target.value)} placeholder="Region" className="input" />
                  <input value={form.comuna} onChange={(e) => update('comuna', e.target.value)} placeholder="Comuna" className="input" />
                  <input value={form.direccion} onChange={(e) => update('direccion', e.target.value)} placeholder="Direccion *" className="input" />
                </div>
              )}
            </div>

            <div className="card p-6 space-y-4">
              <h2 className="font-display font-bold text-base text-[#f5f5f5]">Pago</h2>
              <div className="flex gap-2">
                {['TRANSFERENCIA', 'EFECTIVO'].map((m) => (
                  <button key={m} onClick={() => update('metodo_pago', m)}
                          className={`flex-1 py-3 rounded text-xs font-medium uppercase tracking-wider transition-all ${
                            form.metodo_pago === m
                              ? 'bg-purple text-white'
                              : 'bg-surface2 text-[#666] border border-[#2a2a2a] hover:border-[#555]'
                          }`}>
                    {m === 'TRANSFERENCIA' ? 'Transferencia' : 'Efectivo'}
                  </button>
                ))}
              </div>
              {form.metodo_pago === 'TRANSFERENCIA' && (
                <div className="bg-surface2 rounded p-4 space-y-1 border border-[#2a2a2a]">
                  <p className="font-semibold text-xs uppercase tracking-[0.08em] text-[#f5f5f5]">Datos Bancarios</p>
                  <div className="font-mono text-xs text-[#666] space-y-0.5">
                    <p>Banco: <span className="text-[#ccc]">Mercado Pago</span></p>
                    <p>Alias: <span className="text-[#ccc]">FLOW.GANGSTER</span></p>
                    <p>RUT: <span className="text-[#ccc]">77.123.456-7</span></p>
                    <p>Titular: <span className="text-[#ccc]">Flow Gangster SpA</span></p>
                  </div>
                  <p className="text-[9px] text-[#555] mt-2">Envia el comprobante por WhatsApp.</p>
                </div>
              )}
            </div>

            {error && <p className="text-amber text-sm text-center font-medium">{error}</p>}

            <div className="text-center">
              <button onClick={() => setStep(2)} disabled={!form.nombre || !form.whatsapp}
                      className="btn btn-primary">Continuar</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-lg mx-auto space-y-4">
            <div className="card p-6 space-y-3">
              <h2 className="font-display font-bold text-base text-[#f5f5f5]">Resumen</h2>
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded bg-surface2 border border-[#2a2a2a]">
                    <img src={item.producto.imagen_url} alt={item.producto.nombre}
                         className="w-12 h-12 object-cover rounded border border-[#2a2a2a] flex-shrink-0"
                         onError={(e) => { e.target.style.display = 'none'; }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#f5f5f5] truncate">{item.producto.nombre}</p>
                      <p className="text-[#666] text-xs">Talle: {item.talle} x {item.cantidad}</p>
                      <p className="font-bold text-sm text-[#f5f5f5] mt-0.5">${(item.producto.precio * item.cantidad).toLocaleString('es-CL')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6 space-y-3">
              <h2 className="font-display font-bold text-base text-[#f5f5f5]">Cupon</h2>
              <div className="flex gap-2">
                <input value={cupon} onChange={(e) => setCupon(e.target.value.toUpperCase())}
                       placeholder="Cupon" className="input flex-1 text-xs" />
                <button onClick={validarCupon}
                        className="btn btn-outline text-[10px] px-3 py-2">Aplicar</button>
              </div>
              {cuponMsg && <p className={`text-xs font-medium ${descuento > 0 ? 'text-[#2dd4bf]' : 'text-amber'}`}>{cuponMsg}</p>}
            </div>

            <div className="card p-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#666]">Subtotal</span>
                <span className="text-[#f5f5f5]">${totalPrecio.toLocaleString('es-CL')}</span>
              </div>
              {descuento > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#666]">Descuento</span>
                  <span className="text-[#2dd4bf]">-${descuento.toLocaleString('es-CL')}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold pt-3 border-t border-[#2a2a2a]">
                <span className="text-[#f5f5f5]">Total</span>
                <span className="text-[#f5f5f5]">${total.toLocaleString('es-CL')}</span>
              </div>
            </div>

            {error && <p className="text-amber text-sm text-center font-medium">{error}</p>}

            <div className="flex gap-3 justify-center">
              <button onClick={() => setStep(1)} className="btn btn-outline">Editar</button>
              <button onClick={handleSubmit} disabled={submitting} className="btn btn-primary">
                {submitting ? 'Procesando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && resultado && (
          <div className="max-w-lg mx-auto space-y-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#2dd4bf]/10 flex items-center justify-center mx-auto border border-[#2dd4bf]/20">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <h2 className="font-display font-black text-xl text-[#f5f5f5]">Pedido Confirmado</h2>
              <p className="text-[#666] text-sm mt-1">#{resultado.id?.slice(0, 8).toUpperCase()}</p>
            </div>
            <div className="card p-6 text-left space-y-2">
              <h3 className="font-semibold text-xs uppercase tracking-[0.08em] text-[#666]">Resumen</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-[#666]">Subtotal</span><span className="text-[#f5f5f5]">${resultado.subtotal?.toLocaleString('es-CL')}</span></div>
                {resultado.descuento > 0 && <div className="flex justify-between"><span className="text-[#666]">Descuento</span><span className="text-[#2dd4bf]">-${resultado.descuento?.toLocaleString('es-CL')}</span></div>}
                <div className="flex justify-between font-bold text-base pt-2 border-t border-[#2a2a2a]"><span className="text-[#f5f5f5]">Total</span><span className="text-[#f5f5f5]">${resultado.total?.toLocaleString('es-CL')}</span></div>
              </div>
            </div>
            {resultado.whatsapp_url && (
              <div className="space-y-4">
                <a href={resultado.whatsapp_url} target="_blank" rel="noopener noreferrer"
                   className="btn btn-primary inline-flex items-center gap-2">
                  Enviar Comprobante
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
                </a>
                <Link to="/" className="btn btn-outline inline-block">Volver</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
