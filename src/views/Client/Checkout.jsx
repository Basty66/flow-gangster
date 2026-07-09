import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const steps = [
  { n: 1, label: 'DATOS' },
  { n: 2, label: 'RESUMEN' },
  { n: 3, label: 'PAGO' },
];

export default function Checkout() {
  const { items, totalPrecio, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nombre: '',
    whatsapp: '',
    tipo_entrega: 'RETIRAR_SHOWROOM',
    region: '',
    comuna: '',
    direccion: '',
    metodo_pago: 'TRANSFERENCIA',
    cupon: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    if (!form.nombre || !form.whatsapp) {
      setError('Completa nombre y WhatsApp');
      return;
    }
    if (form.tipo_entrega === 'ENVIO_STARKEN' && !form.direccion) {
      setError('Completa la direccion de envio');
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
        cupon_codigo: form.cupon || undefined,
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
        setError(data.error || 'Error al procesar el pedido');
      }
    } catch {
      setError('Error de conexion');
    }
    setSubmitting(false);
  };

  if (items.length === 0 && !resultado) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-full border border-white/[0.06] flex items-center justify-center mx-auto bg-white/[0.02]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          </div>
          <p className="font-bold text-lg text-[#525252]">Tu carrito esta vacio</p>
          <Link to="/" className="btn-primary text-sm">IR A TIENDA</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-4 mb-16">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center gap-4">
              <div className={`flex items-center gap-3 ${step >= s.n ? 'text-purple' : 'text-[#525252]'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  step > s.n
                    ? 'bg-purple text-white'
                    : step === s.n
                    ? 'bg-purple/10 text-purple border border-purple/30'
                    : 'border border-white/[0.06] text-[#525252]'
                }`}>
                  {step > s.n ? <CheckIcon /> : s.n}
                </div>
                <span className="hidden sm:block font-bold text-xs uppercase tracking-[0.15em]">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-12 h-[1px] transition-all duration-300 ${step > s.n ? 'bg-purple/50' : 'bg-white/[0.06]'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Form */}
        {step === 1 && (
          <div className="max-w-xl mx-auto animate-fade-up space-y-8">
            <div className="liquid-card p-8 space-y-5">
              <h2 className="font-display font-bold text-lg tracking-[-0.02em] text-[#fafafa]">Tus Datos</h2>

              <div className="space-y-4">
                <input value={form.nombre} onChange={(e) => update('nombre', e.target.value)}
                       placeholder="Nombre completo *" className="input-field" />
                <input value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)}
                       placeholder="WhatsApp (Ej: +56912345678) *" className="input-field" />
              </div>
            </div>

            <div className="liquid-card p-8 space-y-5">
              <h2 className="font-display font-bold text-lg tracking-[-0.02em] text-[#fafafa]">Entrega</h2>

              <div className="flex gap-3">
                <button onClick={() => update('tipo_entrega', 'RETIRAR_SHOWROOM')}
                        className={`flex-1 py-4 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all ${
                          form.tipo_entrega === 'RETIRAR_SHOWROOM'
                            ? 'border-purple text-purple bg-purple/5 shadow-lg shadow-purple/10'
                            : 'border-white/[0.06] text-[#525252] hover:border-white/20'
                        }`}>
                  RETIRO SHOWROOM
                </button>
                <button onClick={() => update('tipo_entrega', 'ENVIO_STARKEN')}
                        className={`flex-1 py-4 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all ${
                          form.tipo_entrega === 'ENVIO_STARKEN'
                            ? 'border-purple text-purple bg-purple/5 shadow-lg shadow-purple/10'
                            : 'border-white/[0.06] text-[#525252] hover:border-white/20'
                        }`}>
                  ENVIO STARKEN
                </button>
              </div>

              {form.tipo_entrega === 'ENVIO_STARKEN' && (
                <div className="space-y-4 animate-fade-in">
                  <input value={form.region} onChange={(e) => update('region', e.target.value)}
                         placeholder="Region" className="input-field" />
                  <input value={form.comuna} onChange={(e) => update('comuna', e.target.value)}
                         placeholder="Comuna" className="input-field" />
                  <input value={form.direccion} onChange={(e) => update('direccion', e.target.value)}
                         placeholder="Direccion completa *" className="input-field" />
                </div>
              )}
            </div>

            <div className="liquid-card p-8 space-y-5">
              <h2 className="font-display font-bold text-lg tracking-[-0.02em] text-[#fafafa]">Pago</h2>

              <div className="flex gap-3">
                <button onClick={() => update('metodo_pago', 'TRANSFERENCIA')}
                        className={`flex-1 py-4 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all ${
                          form.metodo_pago === 'TRANSFERENCIA'
                            ? 'border-purple text-purple bg-purple/5 shadow-lg shadow-purple/10'
                            : 'border-white/[0.06] text-[#525252] hover:border-white/20'
                        }`}>
                  TRANSFERENCIA
                </button>
                <button onClick={() => update('metodo_pago', 'EFECTIVO')}
                        className={`flex-1 py-4 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all ${
                          form.metodo_pago === 'EFECTIVO'
                            ? 'border-purple text-purple bg-purple/5 shadow-lg shadow-purple/10'
                            : 'border-white/[0.06] text-[#525252] hover:border-white/20'
                        }`}>
                  EFECTIVO
                </button>
              </div>

              {form.metodo_pago === 'TRANSFERENCIA' && (
                <div className="bg-white/[0.02] rounded-xl p-5 space-y-2 border border-white/[0.04] animate-fade-in">
                  <p className="font-bold text-xs uppercase tracking-[0.15em] text-cyan">Datos Bancarios</p>
                  <div className="font-mono text-sm text-[#525252] space-y-1">
                    <p>Banco: Flow Gangster Bank</p>
                    <p>Tipo: Cuenta Corriente</p>
                    <p>Alias: FLOW.GANGSTER</p>
                    <p>RUT: 00.000.000-0</p>
                  </div>
                  <p className="text-[10px] text-[#525252] mt-2 font-body">Envia el comprobante por WhatsApp para confirmar tu pedido.</p>
                </div>
              )}
            </div>

            {error && <p className="text-orange text-sm font-bold text-center">{error}</p>}

            <div className="text-center">
              <button onClick={() => setStep(2)} disabled={!form.nombre || !form.whatsapp}
                      className="btn-primary text-sm">
                CONTINUAR AL RESUMEN
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Summary */}
        {step === 2 && (
          <div className="max-w-xl mx-auto animate-fade-up space-y-8">
            <div className="liquid-card p-8 space-y-4">
              <h2 className="font-display font-bold text-lg tracking-[-0.02em] text-[#fafafa]">Resumen del Pedido</h2>

              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <img src={item.producto.imagen_url} alt={item.producto.nombre}
                         className="w-16 h-16 object-cover rounded-lg border border-white/[0.04]"
                         onError={(e) => { e.target.style.display = 'none'; }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{item.producto.nombre}</p>
                      <p className="text-[#525252] text-xs">Talle: {item.talle} x {item.cantidad}</p>
                      <p className="text-cyan font-bold text-sm mt-1">${(item.producto.precio * item.cantidad).toLocaleString('es-CL')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/[0.04] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#525252]">Subtotal</span>
                  <span className="text-[#fafafa] font-bold">${totalPrecio.toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/[0.04]">
                  <span>TOTAL</span>
                  <span className="text-cyan">${totalPrecio.toLocaleString('es-CL')}</span>
                </div>
              </div>
            </div>

            {error && <p className="text-orange text-sm font-bold text-center">{error}</p>}

            <div className="flex gap-4 justify-center">
              <button onClick={() => setStep(1)} className="btn-secondary text-sm">EDITAR DATOS</button>
              <button onClick={handleSubmit} disabled={submitting}
                      className="btn-primary text-sm">
                {submitting ? 'PROCESANDO...' : 'CONFIRMAR PEDIDO'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 3 && resultado && (
          <div className="max-w-xl mx-auto animate-scale-in space-y-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-cyan/10 flex items-center justify-center mx-auto border border-cyan/20 shadow-lg shadow-cyan/10">
                <CheckIcon />
              </div>
              <h2 className="font-display font-extrabold text-2xl text-cyan tracking-[-0.02em]">PEDIDO CONFIRMADO</h2>
              <p className="text-[#525252] text-sm font-body">Numero de pedido: <span className="font-mono font-bold text-[#fafafa]">#{resultado.id?.slice(0, 8).toUpperCase()}</span></p>
            </div>

            <div className="liquid-card p-8 space-y-4">
              <h3 className="font-bold text-sm tracking-[0.15em] uppercase text-[#525252]">Resumen</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#525252]">Subtotal</span>
                  <span className="text-[#fafafa]">${resultado.subtotal?.toLocaleString('es-CL')}</span>
                </div>
                {resultado.descuento > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#525252]">Descuento</span>
                    <span className="text-cyan">-${resultado.descuento?.toLocaleString('es-CL')}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base pt-2 border-t border-white/[0.04]">
                  <span>TOTAL</span>
                  <span className="text-cyan">${resultado.total?.toLocaleString('es-CL')}</span>
                </div>
              </div>
            </div>

            {resultado.whatsapp_url && (
              <div className="text-center">
                <a href={resultado.whatsapp_url} target="_blank" rel="noopener noreferrer"
                   className="btn-primary text-sm inline-flex items-center gap-2">
                  ENVIAR COMPROBANTE
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
                </a>
                <p className="text-[#525252] text-xs mt-4 font-body">Te redirigiremos a WhatsApp. Envia el comprobante para confirmar tu pedido.</p>
                <Link to="/" className="btn-secondary text-sm mt-6 inline-block">VOLVER A TIENDA</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
