import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

export default function QuickCart() {
  const { items, removeItem, updateCantidad, totalPrecio } = useCart();
  const [open, setOpen] = useState(false);
  const [cupon, setCupon] = useState('');
  const [descuento, setDescuento] = useState(0);
  const [cuponMsg, setCuponMsg] = useState('');

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const toggle = () => setOpen((v) => !v);
    document.addEventListener('keydown', handleKey);
    window.addEventListener('toggle-cart', toggle);
    return () => {
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('toggle-cart', toggle);
    };
  }, []);

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

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-50 animate-fade-in" onClick={() => setOpen(false)} />}

      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-deep border-l border-neutral-800/80 z-50 transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800/80">
            <h2 className="font-display font-bold text-sm tracking-[0.1em] uppercase text-white">Carrito</h2>
            <button onClick={() => setOpen(false)} className="text-neutral-500 hover:text-white transition-colors p-1">
              <CloseIcon />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-16 gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                <p className="text-neutral-500 text-sm">Carrito vacio</p>
              </div>
            ) : (
              items.map((item, idx) => (
                <div key={idx} className="flex gap-3 p-3 rounded-lg bg-surface border border-neutral-800/80">
                  <img src={item.producto.imagen_url} alt={item.producto.nombre}
                       className="w-16 h-16 object-cover rounded-md border border-neutral-800 flex-shrink-0"
                       onError={(e) => { e.target.style.display = 'none'; }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-white truncate">{item.producto.nombre}</p>
                    <p className="text-neutral-500 text-xs mt-0.5">Talle: {item.talle}</p>
                    <p className="text-teal font-bold text-sm mt-1">${(item.producto.precio * item.cantidad).toLocaleString('es-CL')}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateCantidad(idx, item.cantidad - 1)}
                              className="w-6 h-6 rounded border border-neutral-700 text-neutral-500 hover:text-white hover:border-neutral-500 transition-colors flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                      <span className="font-semibold text-sm text-white w-5 text-center">{item.cantidad}</span>
                      <button onClick={() => updateCantidad(idx, item.cantidad + 1)}
                              className="w-6 h-6 rounded border border-neutral-700 text-neutral-500 hover:text-white hover:border-neutral-500 transition-colors flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                      <button onClick={() => removeItem(idx)}
                              className="ml-auto text-neutral-600 hover:text-orange transition-colors p-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-neutral-800/80 px-5 py-5 space-y-4">
              <div className="flex gap-2">
                <input value={cupon} onChange={(e) => setCupon(e.target.value.toUpperCase())}
                       placeholder="Codigo Cupon" className="input-field flex-1 text-xs" />
                <button onClick={validarCupon}
                        className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] rounded-lg border border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600 transition-all whitespace-nowrap">
                  Aplicar
                </button>
              </div>
              {cuponMsg && (
                <p className={`text-xs font-semibold ${descuento > 0 ? 'text-teal' : 'text-orange'}`}>{cuponMsg}</p>
              )}

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal</span>
                  <span>${totalPrecio.toLocaleString('es-CL')}</span>
                </div>
                {descuento > 0 && (
                  <div className="flex justify-between text-teal">
                    <span>Descuento</span>
                    <span>-${descuento.toLocaleString('es-CL')}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base border-t border-neutral-800 pt-2.5 mt-2.5">
                  <span className="text-white">Total</span>
                  <span className="text-teal">${total.toLocaleString('es-CL')}</span>
                </div>
              </div>

              <Link to="/checkout" onClick={() => setOpen(false)}
                    className="btn-primary w-full text-center">
                Finalizar Compra
              </Link>
            </div>
          )}
        </div>
      </div>

      <button onClick={() => setOpen(true)}
              className={`fixed bottom-6 right-6 z-40 bg-purple text-white font-bold px-5 py-3.5 text-xs uppercase tracking-[0.1em] rounded-xl shadow-lg shadow-purple/20 hover:shadow-xl hover:shadow-purple/30 hover:scale-105 active:scale-100 transition-all duration-200 ${
                items.length === 0 ? 'opacity-50' : ''
              }`}>
        <span className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {items.reduce((s, i) => s + i.cantidad, 0)}
        </span>
      </button>
    </>
  );
}
