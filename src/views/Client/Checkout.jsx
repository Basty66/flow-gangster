import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

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
      setError('Completa la dirección de envío');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        items: items.map((i) => ({
          producto_id: i.producto.id,
          talle: i.talle,
          cantidad: i.cantidad,
        })),
        cliente_nombre: form.nombre,
        cliente_whatsapp: form.whatsapp,
        tipo_entrega: form.tipo_entrega,
        datos_envio: form.tipo_entrega === 'ENVIO_STARKEN'
          ? { region: form.region, comuna: form.comuna, direccion: form.direccion }
          : null,
        metodo_pago: form.metodo_pago,
        cupon_codigo: form.cupon || undefined,
      };

      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setSubmitting(false);
        return;
      }

      setResultado(data);
      clearCart();
      setStep(4);
    } catch {
      setError('Error al procesar el pedido. Intenta de nuevo.');
    }
    setSubmitting(false);
  };

  if (items.length === 0 && !resultado) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4">
        <p className="font-black text-2xl">CARRITO VACÍO</p>
        <Link to="/" className="btn-primary text-sm">IR A LA TIENDA</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 border-2 flex items-center justify-center font-black text-sm
                              ${step >= s ? 'border-neon-cyan text-neon-cyan' : 'border-white/20 text-white/30'}`}>
                {s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-neon-cyan' : 'bg-white/20'}`} />}
            </div>
          ))}
        </div>

        {/* Paso 1: Resumen */}
        {step === 1 && (
          <div className="space-y-6">
            <h1 className="font-display text-3xl font-black">RESUMEN DEL PEDIDO</h1>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="card-product p-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img src={item.producto.imagen_url} alt={item.producto.nombre}
                         className="w-16 h-16 object-cover border border-white/10" />
                    <div>
                      <p className="font-black">{item.producto.nombre}</p>
                      <p className="text-white/60 text-sm">Talle: {item.talle} × {item.cantidad}</p>
                    </div>
                  </div>
                  <p className="font-black text-neon-cyan">${(item.producto.precio * item.cantidad).toLocaleString('es-CL')}</p>
                </div>
              ))}
            </div>
            <div className="text-right">
              <p className="text-white/60">Subtotal: ${totalPrecio.toLocaleString('es-CL')}</p>
              <p className="font-display text-2xl font-black text-neon-cyan">TOTAL: ${totalPrecio.toLocaleString('es-CL')}</p>
            </div>
            <button onClick={() => setStep(2)} className="btn-primary w-full">CONTINUAR</button>
          </div>
        )}

        {/* Paso 2: Datos */}
        {step === 2 && (
          <div className="space-y-6">
            <h1 className="font-display text-3xl font-black">TUS DATOS</h1>

            <div className="space-y-4">
              <input value={form.nombre} onChange={(e) => update('nombre', e.target.value)}
                     placeholder="Nombre completo *" className="input-field" />
              <input value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)}
                     placeholder="WhatsApp +56 *" className="input-field" />

              <div>
                <p className="font-black uppercase text-sm tracking-wider mb-3">Tipo de entrega</p>
                <div className="flex gap-3">
                  <button onClick={() => update('tipo_entrega', 'RETIRAR_SHOWROOM')}
                          className={`flex-1 py-4 border-2 font-black uppercase text-sm tracking-wider transition-all ${
                            form.tipo_entrega === 'RETIRAR_SHOWROOM'
                              ? 'border-neon-cyan text-neon-cyan'
                              : 'border-white/20 text-white/60 hover:border-white/50'
                          }`}>
                    RETIRO EN SHOWROOM
                  </button>
                  <button onClick={() => update('tipo_entrega', 'ENVIO_STARKEN')}
                          className={`flex-1 py-4 border-2 font-black uppercase text-sm tracking-wider transition-all ${
                            form.tipo_entrega === 'ENVIO_STARKEN'
                              ? 'border-neon-cyan text-neon-cyan'
                              : 'border-white/20 text-white/60 hover:border-white/50'
                          }`}>
                    ENVÍO STARKEN
                  </button>
                </div>
              </div>

              {form.tipo_entrega === 'ENVIO_STARKEN' && (
                <div className="space-y-4 border-2 border-neon-cyan/20 p-4">
                  <p className="font-black uppercase text-sm tracking-wider text-neon-cyan">Dirección de envío</p>
                  <input value={form.region} onChange={(e) => update('region', e.target.value)}
                         placeholder="Región" className="input-field" />
                  <input value={form.comuna} onChange={(e) => update('comuna', e.target.value)}
                         placeholder="Comuna" className="input-field" />
                  <input value={form.direccion} onChange={(e) => update('direccion', e.target.value)}
                         placeholder="Dirección completa *" className="input-field" />
                </div>
              )}

              <div>
                <p className="font-black uppercase text-sm tracking-wider mb-3">Método de pago</p>
                <div className="flex gap-3">
                  <button onClick={() => update('metodo_pago', 'TRANSFERENCIA')}
                          className={`flex-1 py-4 border-2 font-black uppercase text-sm tracking-wider transition-all ${
                            form.metodo_pago === 'TRANSFERENCIA'
                              ? 'border-neon-cyan text-neon-cyan'
                              : 'border-white/20 text-white/60 hover:border-white/50'
                          }`}>
                    TRANSFERENCIA
                  </button>
                  <button onClick={() => update('metodo_pago', 'EFECTIVO')}
                          className={`flex-1 py-4 border-2 font-black uppercase text-sm tracking-wider transition-all ${
                            form.metodo_pago === 'EFECTIVO'
                              ? 'border-neon-cyan text-neon-cyan'
                              : 'border-white/20 text-white/60 hover:border-white/50'
                          }`}>
                    EFECTIVO
                  </button>
                </div>
              </div>

              <input value={form.cupon} onChange={(e) => update('cupon', e.target.value.toUpperCase())}
                     placeholder="Cupón de descuento (opcional)" className="input-field uppercase" />
            </div>

            {error && <p className="text-fire-orange font-black text-sm">{error}</p>}

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">ATRÁS</button>
              <button onClick={() => setStep(3)} className="btn-primary flex-1">REVISAR PEDIDO</button>
            </div>
          </div>
        )}

        {/* Paso 3: Confirmar */}
        {step === 3 && (
          <div className="space-y-6">
            <h1 className="font-display text-3xl font-black">CONFIRMAR PEDIDO</h1>

            <div className="card-product p-4 space-y-2">
              <p><span className="text-white/60 text-sm">Nombre:</span> <span className="font-black">{form.nombre}</span></p>
              <p><span className="text-white/60 text-sm">WhatsApp:</span> <span className="font-black">{form.whatsapp}</span></p>
              <p><span className="text-white/60 text-sm">Entrega:</span> <span className="font-black">{form.tipo_entrega === 'RETIRAR_SHOWROOM' ? 'Retiro en Showroom' : 'Envío Starken'}</span></p>
              {form.tipo_entrega === 'ENVIO_STARKEN' && (
                <p><span className="text-white/60 text-sm">Dirección:</span> <span className="font-black">{form.direccion}</span></p>
              )}
              <p><span className="text-white/60 text-sm">Pago:</span> <span className="font-black">{form.metodo_pago === 'TRANSFERENCIA' ? 'Transferencia Bancaria' : 'Efectivo al Retirar'}</span></p>
              {form.cupon && <p><span className="text-white/60 text-sm">Cupón:</span> <span className="font-black text-neon-cyan">{form.cupon}</span></p>}
            </div>

            <div className="card-product p-4">
              <p className="font-black text-2xl text-neon-cyan">TOTAL: ${totalPrecio.toLocaleString('es-CL')}</p>
            </div>

            {error && <p className="text-fire-orange font-black text-sm">{error}</p>}

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1">ATRÁS</button>
              <button onClick={handleSubmit} disabled={submitting}
                      className="btn-primary flex-1">
                {submitting ? 'PROCESANDO...' : 'CONFIRMAR PEDIDO'}
              </button>
            </div>
          </div>
        )}

        {/* Paso 4: Confirmación */}
        {step === 4 && resultado && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 rounded-full border-4 border-neon-cyan flex items-center justify-center mx-auto">
              <span className="text-4xl">✓</span>
            </div>

            <h1 className="font-display text-4xl font-black">PEDIDO CONFIRMADO</h1>
            <p className="text-white/60 text-lg">Pedido #{resultado.id?.slice(0, 8)}</p>

            {form.metodo_pago === 'TRANSFERENCIA' && (
              <div className="card-product p-6 max-w-md mx-auto space-y-3">
                <p className="font-black text-fire-orange uppercase tracking-wider text-sm">
                  ⚠ IMPORTANTE: Tenés 2 horas para transferir
                </p>
                <p className="text-white/60 text-sm">Datos para transferencia:</p>
                <p className="font-black text-lg">Banco: ___</p>
                <p className="font-black text-lg">Titular: ___</p>
                <p className="font-black text-lg">RUT: ___</p>
                <p className="font-black text-lg">Cuenta Corriente: ___</p>
                <p className="font-black text-neon-cyan">Alias: FLOW.GANGSTER</p>
                <p className="font-black">Monto: ${resultado.total?.toLocaleString('es-CL')}</p>
              </div>
            )}

            <a href={resultado.whatsapp_url} target="_blank" rel="noreferrer"
               className="btn-primary inline-block">
              ENVIAR COMPROBANTE POR WHATSAPP
            </a>

            <p className="text-white/50 text-sm">
              Tu par queda reservado. Si no transferís dentro del plazo, el stock se libera automáticamente.
            </p>

            <Link to="/" className="btn-secondary inline-block">SEGUIR COMPRANDO</Link>
          </div>
        )}
      </div>
    </div>
  );
}
