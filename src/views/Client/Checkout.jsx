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
        setCuponMsg(`${data.valor}${data.tipo === 'PERCENT' ? '%' : '$'} off aplicado`);
      } else {
        setDescuento(0);
        setCuponMsg(data.error);
      }
    } catch {
      setDescuento(0);
      setCuponMsg('Error al validar');
    }
  };

  const total = Math.max(0, totalPrecio - descuento);

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
        <div className="text-center space-y-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="1.5" className="mx-auto">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <p className="font-semibold text-neutral-500">Tu carrito esta vacio</p>
          <p className="text-neutral-600 text-sm">Agrega productos desde la tienda para iniciar tu compra</p>
          <Link to="/" className="btn-primary text-sm">Ir a Tienda</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-4">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-4 mb-14">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center gap-4">
              <div className={`flex items-center gap-3 ${step >= s.n ? 'text-purple-light' : 'text-neutral-600'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                  step > s.n
                    ? 'bg-purple text-white'
                    : step === s.n
                    ? 'bg-purple/10 text-purple-light border border-purple/30'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-500'
                }`}>
                  {step > s.n ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : s.n}
                </div>
                <span className="hidden sm:block font-semibold text-xs uppercase tracking-[0.1em]">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-10 h-px transition-all ${step > s.n ? 'bg-purple/50' : 'bg-neutral-800'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Form */}
        {step === 1 && (
          <div className="max-w-lg mx-auto space-y-5 animate-fade-up">
            <div className="card p-6 space-y-4">
              <h2 className="font-display font-bold text-base text-white">Tus Datos</h2>
              <div className="space-y-3">
                <input value={form.nombre} onChange={(e) => update('nombre', e.target.value)}
                       placeholder="Nombre completo *" className="input-field" />
                <input value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)}
                       placeholder="WhatsApp (Ej: +56912345678) *" className="input-field" />
              </div>
            </div>

            <div className="card p-6 space-y-4">
              <h2 className="font-display font-bold text-base text-white">Entrega</h2>
              <div className="flex gap-2">
                <button onClick={() => update('tipo_entrega', 'RETIRAR_SHOWROOM')}
                        className={`flex-1 py-3 rounded-lg border font-semibold text-xs uppercase tracking-wider transition-all ${
                          form.tipo_entrega === 'RETIRAR_SHOWROOM'
                            ? 'bg-purple/10 border-purple text-purple-light'
                            : 'border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300'
                        }`}>
                  Retiro Showroom
                </button>
                <button onClick={() => update('tipo_entrega', 'ENVIO_STARKEN')}
                        className={`flex-1 py-3 rounded-lg border font-semibold text-xs uppercase tracking-wider transition-all ${
                          form.tipo_entrega === 'ENVIO_STARKEN'
                            ? 'bg-purple/10 border-purple text-purple-light'
                            : 'border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300'
                        }`}>
                  Envio Starken
                </button>
              </div>
              {form.tipo_entrega === 'ENVIO_STARKEN' && (
                <div className="space-y-3">
                  <input value={form.region} onChange={(e) => update('region', e.target.value)}
                         placeholder="Region" className="input-field" />
                  <input value={form.comuna} onChange={(e) => update('comuna', e.target.value)}
                         placeholder="Comuna" className="input-field" />
                  <input value={form.direccion} onChange={(e) => update('direccion', e.target.value)}
                         placeholder="Direccion completa *" className="input-field" />
                </div>
              )}
            </div>

            <div className="card p-6 space-y-4">
              <h2 className="font-display font-bold text-base text-white">Pago</h2>
              <div className="flex gap-2">
                <button onClick={() => update('metodo_pago', 'TRANSFERENCIA')}
                        className={`flex-1 py-3 rounded-lg border font-semibold text-xs uppercase tracking-wider transition-all ${
                          form.metodo_pago === 'TRANSFERENCIA'
                            ? 'bg-purple/10 border-purple text-purple-light'
                            : 'border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300'
                        }`}>
                  Transferencia
                </button>
                <button onClick={() => update('metodo_pago', 'EFECTIVO')}
                        className={`flex-1 py-3 rounded-lg border font-semibold text-xs uppercase tracking-wider transition-all ${
                          form.metodo_pago === 'EFECTIVO'
                            ? 'bg-purple/10 border-purple text-purple-light'
                            : 'border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300'
                        }`}>
                  Efectivo
                </button>
              </div>
              {form.metodo_pago === 'TRANSFERENCIA' && (
                <div className="bg-surface2 rounded-lg p-4 space-y-1.5 border border-neutral-800">
                  <p className="font-bold text-xs uppercase tracking-[0.1em] text-teal">Datos Bancarios</p>
                  <div className="font-mono text-sm text-neutral-500 space-y-0.5">
                    <p>Banco: <span className="text-neutral-300">Mercado Pago</span></p>
                    <p>Tipo: <span className="text-neutral-300">Cuenta Corriente</span></p>
                    <p>Alias: <span className="text-neutral-300">FLOW.GANGSTER</span></p>
                    <p>RUT: <span className="text-neutral-300">77.123.456-7</span></p>
                    <p>Titular: <span className="text-neutral-300">Flow Gangster SpA</span></p>
                  </div>
                  <p className="text-[10px] text-neutral-600 mt-2">Envia el comprobante por WhatsApp para confirmar tu pedido.</p>
                </div>
              )}
            </div>

            {error && <p className="text-orange text-sm font-semibold text-center">{error}</p>}

            <div className="text-center">
              <button onClick={() => setStep(2)} disabled={!form.nombre || !form.whatsapp}
                      className="btn-primary">
                Continuar al Resumen
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Summary */}
        {step === 2 && (
          <div className="max-w-lg mx-auto space-y-5 animate-fade-up">
            <div className="card p-6 space-y-4">
              <h2 className="font-display font-bold text-base text-white">Resumen del Pedido</h2>
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-surface2 border border-neutral-800/80">
                    <img src={item.producto.imagen_url} alt={item.producto.nombre}
                         className="w-14 h-14 object-cover rounded-md border border-neutral-800 flex-shrink-0"
                         onError={(e) => { e.target.style.display = 'none'; }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-white truncate">{item.producto.nombre}</p>
                      <p className="text-neutral-500 text-xs">Talle: {item.talle} x {item.cantidad}</p>
                      <p className="text-teal font-bold text-sm mt-0.5">${(item.producto.precio * item.cantidad).toLocaleString('es-CL')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6 space-y-4">
              <h2 className="font-display font-bold text-base text-white">Cupon</h2>
              <div className="flex gap-2">
                <input value={cupon} onChange={(e) => setCupon(e.target.value.toUpperCase())}
                       placeholder="Codigo Cupon" className="input-field flex-1 text-xs" />
                <button onClick={validarCupon}
                        className="px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] rounded-lg border border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600 transition-all whitespace-nowrap">
                  Aplicar
                </button>
              </div>
              {cuponMsg && (
                <p className={`text-xs font-semibold ${descuento > 0 ? 'text-teal' : 'text-orange'}`}>{cuponMsg}</p>
              )}
            </div>

            <div className="card p-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Subtotal</span>
                <span className="text-white font-semibold">${totalPrecio.toLocaleString('es-CL')}</span>
              </div>
              {descuento > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Descuento</span>
                  <span className="text-teal font-semibold">-${descuento.toLocaleString('es-CL')}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold pt-3 border-t border-neutral-800">
                <span className="text-white">Total</span>
                <span className="text-teal">${total.toLocaleString('es-CL')}</span>
              </div>
            </div>

            {error && <p className="text-orange text-sm font-semibold text-center">{error}</p>}

            <div className="flex gap-3 justify-center">
              <button onClick={() => setStep(1)} className="btn-secondary text-sm">Editar Datos</button>
              <button onClick={handleSubmit} disabled={submitting}
                      className="btn-primary">
                {submitting ? 'Procesando...' : 'Confirmar Pedido'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 3 && resultado && (
          <div className="max-w-lg mx-auto space-y-6 animate-scale-in">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mx-auto border border-teal/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 className="font-display font-black text-xl text-teal">Pedido Confirmado</h2>
              <p className="text-neutral-500 text-sm">Numero de pedido: <span className="font-mono font-bold text-neutral-300">#{resultado.id?.slice(0, 8).toUpperCase()}</span></p>
            </div>

            <div className="card p-6 space-y-3">
              <h3 className="font-semibold text-xs tracking-[0.1em] uppercase text-neutral-500">Resumen</h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="text-white">${resultado.subtotal?.toLocaleString('es-CL')}</span>
                </div>
                {resultado.descuento > 0 && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Descuento</span>
                    <span className="text-teal">-${resultado.descuento?.toLocaleString('es-CL')}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base pt-2 border-t border-neutral-800">
                  <span className="text-white">Total</span>
                  <span className="text-teal">${resultado.total?.toLocaleString('es-CL')}</span>
                </div>
              </div>
            </div>

            {resultado.whatsapp_url && (
              <div className="text-center space-y-4">
                <a href={resultado.whatsapp_url} target="_blank" rel="noopener noreferrer"
                   className="btn-primary inline-flex items-center gap-2">
                  Enviar Comprobante
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
                </a>
                <p className="text-neutral-500 text-xs">Te redirigiremos a WhatsApp. Envia el comprobante para confirmar tu pedido.</p>
                <Link to="/" className="btn-secondary text-sm inline-block">Volver a Tienda</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
