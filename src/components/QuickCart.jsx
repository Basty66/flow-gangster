import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

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

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setOpen(false)} />}

      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-deep border-l border-[#2a2a2a] z-50 transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
            <h2 className="font-display font-bold text-sm text-[#f5f5f5]">Carrito</h2>
            <button onClick={() => setOpen(false)} className="text-[#666] hover:text-[#f5f5f5] transition-colors p-0.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-16 gap-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                <p className="text-[#666] text-sm">Carrito vacio</p>
              </div>
            ) : (
              items.map((item, idx) => (
                <div key={idx} className="flex gap-3 p-3 rounded border border-[#2a2a2a]">
                  <img src={item.producto.imagen_url} alt={item.producto.nombre}
                       className="w-14 h-14 object-cover rounded border border-[#2a2a2a] flex-shrink-0"
                       onError={(e) => { e.target.style.display = 'none'; }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#f5f5f5] truncate">{item.producto.nombre}</p>
                    <p className="text-[#666] text-xs mt-0.5">Talle: {item.talle}</p>
                    <p className="font-bold text-sm text-[#f5f5f5] mt-1">${(item.producto.precio * item.cantidad).toLocaleString('es-CL')}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateCantidad(idx, item.cantidad - 1)}
                              className="w-6 h-6 rounded border border-[#2a2a2a] text-[#666] hover:text-[#f5f5f5] hover:border-[#555] transition-colors flex items-center justify-center">
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                      <span className="font-semibold text-sm text-[#f5f5f5] w-5 text-center">{item.cantidad}</span>
                      <button onClick={() => updateCantidad(idx, item.cantidad + 1)}
                              className="w-6 h-6 rounded border border-[#2a2a2a] text-[#666] hover:text-[#f5f5f5] hover:border-[#555] transition-colors flex items-center justify-center">
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                      <button onClick={() => removeItem(idx)}
                              className="ml-auto text-[#555] hover:text-amber transition-colors p-0.5">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
            <div className="border-t border-[#2a2a2a] px-5 py-5 space-y-3">
              <div className="flex gap-2">
                <input value={cupon} onChange={(e) => setCupon(e.target.value.toUpperCase())}
                       placeholder="Cupon" className="input flex-1 text-xs" />
                <button onClick={validarCupon}
                        className="btn btn-outline text-[10px] px-3 py-2">Aplicar</button>
              </div>
              {cuponMsg && (
                <p className={`text-xs font-medium ${descuento > 0 ? 'text-[#2dd4bf]' : 'text-amber'}`}>{cuponMsg}</p>
              )}

              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-[#666]">
                  <span>Subtotal</span>
                  <span>${totalPrecio.toLocaleString('es-CL')}</span>
                </div>
                {descuento > 0 && (
                  <div className="flex justify-between text-[#2dd4bf]">
                    <span>Descuento</span>
                    <span>-${descuento.toLocaleString('es-CL')}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base border-t border-[#2a2a2a] pt-2.5 mt-2.5">
                  <span className="text-[#f5f5f5]">Total</span>
                  <span className="text-[#f5f5f5]">${total.toLocaleString('es-CL')}</span>
                </div>
              </div>

              <Link to="/checkout" onClick={() => setOpen(false)}
                    className="btn btn-primary w-full text-center">
                Finalizar Compra
              </Link>
            </div>
          )}
        </div>
      </div>

      <button onClick={() => setOpen(true)}
              className={`fixed bottom-5 right-5 z-40 bg-purple text-white font-bold px-5 py-3 text-xs uppercase tracking-[0.1em] rounded-lg shadow-lg hover:bg-[#6d28d9] hover:scale-105 active:scale-100 transition-all duration-200 ${
                items.length === 0 ? 'opacity-40' : ''
              }`}>
        <span className="flex items-center gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {items.reduce((s, i) => s + i.cantidad, 0)}
        </span>
      </button>
    </>
  );
}
