import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setSubmitting(false); return; }
      setResultado(data);
      clearCart();
      setStep(4);
    } catch { setError('Error al procesar. Intenta de nuevo.'); }
    setSubmitting(false);
  };

  if (items.length === 0 && !resultado) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4">
        <p className="font-bold text-2xl tracking-[-0.02em]">CARRITO VACIO</p>
        <Link to="/" className="btn-primary text-sm">IR A LA TIENDA</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`stepper-dot ${step >= s ? 'border-purple text-purple' : 'border-white/10 text-[#525252]'}`}>
                {step > s ? <CheckIcon /> : s}
              </div>
              {s < 3 && <div className={`w-10 h-[1px] ${step > s ? 'bg-purple' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h1 className="font-display font-bold text-2xl tracking-[-0.02em]">RESUMEN DEL PEDIDO</h1>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="glass-card p-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img src={item.producto.imagen_url} alt={item.producto.nombre}
                         className="w-14 h-14 object-cover border border-white/5 flex-shrink-0"
                         onError={(e) => { e.target.style.display = 'none'; }} />
                    <div>
                      <p className="font-bold text-sm">{item.producto.nombre}</p>
                      <p className="text-[#525252] text-xs">Talle: {item.talle} x {item.cantidad}</p>
                    </div>
                  </div>
                  <p className="font-bold text-sm text-cyan">${(item.producto.precio * item.cantidad).toLocaleString('es-CL')}</p>
                </div>
              ))}
            </div>
            <div className="text-right">
              <p className="text-[#525252] text-sm">Subtotal: ${totalPrecio.toLocaleString('es-CL')}</p>
              <p className="font-display font-extrabold text-xl text-cyan">TOTAL: ${totalPrecio.toLocaleString('es-CL')}</p>
            </div>
            <button onClick={() => setStep(2)} className="btn-primary w-full">CONTINUAR</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h1 className="font-display font-bold text-2xl tracking-[-0.02em]">TUS DATOS</h1>
            <div className="space-y-4">
              <input value={form.nombre} onChange={(e) => update('nombre', e.target.value)}
                     placeholder="Nombre completo *" className="input-field" />
              <input value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)}
                     placeholder="WhatsApp +56 *" className="input-field" />
              <div>
                <p className="font-bold uppercase text-xs tracking-[0.15em] text-[#525252] mb-3">Tipo de entrega</p>
                <div className="flex gap-3">
                  <button onClick={() => update('tipo_entrega', 'RETIRAR_SHOWROOM')}
                          className={`flex-1 py-3.5 border font-bold text-xs uppercase tracking-wider transition-all ${form.tipo_entrega === 'RETIRAR_SHOWROOM' ? 'border-purple text-purple' : 'border-white/10 text-[#525252] hover:border-white/30'}`}>
                    RETIRO EN SHOWROOM
                  </button>
                  <button onClick={() => update('tipo_entrega', 'ENVIO_STARKEN')}
                          className={`flex-1 py-3.5 border font-bold text-xs uppercase tracking-wider transition-all ${form.tipo_entrega === 'ENVIO_STARKEN' ? 'border-purple text-purple' : 'border-white/10 text-[#525252] hover:border-white/30'}`}>
                    ENVIO STARKEN
                  </button>
                </div>
              </div>
              {form.tipo_entrega === 'ENVIO_STARKEN' && (
                <div className="glass-card p-5 space-y-4 animate-fade-in">
                  <p className="font-bold uppercase text-xs tracking-wider text-purple">Direccion de envio</p>
                  <input value={form.region} onChange={(e) => update('region', e.target.value)}
                         placeholder="Region" className="input-field" />
                  <input value={form.comuna} onChange={(e) => update('comuna', e.target.value)}
                         placeholder="Comuna" className="input-field" />
                  <input value={form.direccion} onChange={(e) => update('direccion', e.target.value)}
                         placeholder="Direccion completa *" className="input-field" />
                </div>
              )}
              <div>
                <p className="font-bold uppercase text-xs tracking-[0.15em] text-[#525252] mb-3">Metodo de pago</p>
                <div className="flex gap-3">
                  <button onClick={() => update('metodo_pago', 'TRANSFERENCIA')}
                          className={`flex-1 py-3.5 border font-bold text-xs uppercase tracking-wider transition-all ${form.metodo_pago === 'TRANSFERENCIA' ? 'border-purple text-purple' : 'border-white/10 text-[#525252] hover:border-white/30'}`}>
                    TRANSFERENCIA
                  </button>
                  <button onClick={() => update('metodo_pago', 'EFECTIVO')}
                          className={`flex-1 py-3.5 border font-bold text-xs uppercase tracking-wider transition-all ${form.metodo_pago === 'EFECTIVO' ? 'border-purple text-purple' : 'border-white/10 text-[#525252] hover:border-white/30'}`}>
                    EFECTIVO
                  </button>
                </div>
              </div>
              <input value={form.cupon} onChange={(e) => update('cupon', e.target.value.toUpperCase())}
                     placeholder="Cupon de descuento (opcional)" className="input-field uppercase text-xs" />
            </div>
            {error && <p className="text-orange font-bold text-xs">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">ATRAS</button>
              <button onClick={() => setStep(3)} className="btn-primary flex-1">REVISAR PEDIDO</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h1 className="font-display font-bold text-2xl tracking-[-0.02em]">CONFIRMAR PEDIDO</h1>
            <div className="glass-card p-5 space-y-2">
              <p><span className="text-[#525252] text-sm">Nombre:</span> <span className="font-bold">{form.nombre}</span></p>
              <p><span className="text-[#525252] text-sm">WhatsApp:</span> <span className="font-bold">{form.whatsapp}</span></p>
              <p><span className="text-[#525252] text-sm">Entrega:</span> <span className="font-bold">{form.tipo_entrega === 'RETIRAR_SHOWROOM' ? 'Retiro en Showroom' : 'Envio Starken'}</span></p>
              {form.tipo_entrega === 'ENVIO_STARKEN' && <p><span className="text-[#525252] text-sm">Direccion:</span> <span className="font-bold">{form.direccion}</span></p>}
              <p><span className="text-[#525252] text-sm">Pago:</span> <span className="font-bold">{form.metodo_pago === 'TRANSFERENCIA' ? 'Transferencia' : 'Efectivo'}</span></p>
              {form.cupon && <p><span className="text-[#525252] text-sm">Cupon:</span> <span className="font-bold text-purple">{form.cupon}</span></p>}
            </div>
            <div className="glass-card p-5">
              <p className="font-display font-extrabold text-2xl text-cyan">TOTAL: ${totalPrecio.toLocaleString('es-CL')}</p>
            </div>
            {error && <p className="text-orange font-bold text-xs">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1">ATRAS</button>
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex-1">
                {submitting ? 'PROCESANDO...' : 'CONFIRMAR PEDIDO'}
              </button>
            </div>
          </div>
        )}

        {step === 4 && resultado && (
          <div className="text-center space-y-6 animate-scale-in">
            <div className="w-16 h-16 rounded-full border-2 border-purple flex items-center justify-center mx-auto text-purple">
              <CheckIcon />
            </div>
            <h1 className="font-display font-extrabold text-3xl">PEDIDO CONFIRMADO</h1>
            <p className="text-[#525252] text-base font-body">Pedido #{resultado.id?.slice(0, 8)}</p>
            {form.metodo_pago === 'TRANSFERENCIA' && (
              <div className="glass-card p-6 max-w-md mx-auto space-y-3">
                <p className="font-bold text-orange uppercase tracking-wider text-xs">IMPORTANTE: Tienes 2 horas para transferir</p>
                <p className="text-[#525252] text-sm font-body">Datos para transferencia:</p>
                <p className="font-bold text-lg">Banco: ___</p>
                <p className="font-bold text-lg">Titular: ___</p>
                <p className="font-bold text-lg">RUT: ___</p>
                <p className="font-bold text-lg">Cta. Corriente: ___</p>
                <p className="font-bold text-purple">Alias: FLOW.GANGSTER</p>
                <p className="font-bold">Monto: ${resultado.total?.toLocaleString('es-CL')}</p>
              </div>
            )}
            <a href={resultado.whatsapp_url} target="_blank" rel="noreferrer"
               className="btn-primary inline-block text-sm">
              ENVIAR COMPROBANTE POR WHATSAPP
            </a>
            <p className="text-[#525252] text-xs font-body">
              Tu par queda reservado. Si no transfieres dentro del plazo, el stock se libera automaticamente.
            </p>
            <Link to="/" className="btn-secondary inline-block text-sm">SEGUIR COMPRANDO</Link>
          </div>
        )}
      </div>
    </div>
  );
}
