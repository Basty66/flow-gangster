import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const MinusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);

const CartBagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
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
      const res = await fetch('/api/cupones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: cupon, tipo: 'VALIDAR' }),
      });
      const data = await res.json();
      if (res.ok) {
        setDescuento(data.tipo === 'PERCENT'
          ? Math.round((totalPrecio * data.valor) / 100)
          : data.valor);
        setCuponMsg(`${data.valor}${data.tipo === 'PERCENT' ? '%' : '$'} off aplicado`);
      } else {
        setDescuento(0);
        setCuponMsg(data.error);
      }
    } catch {
      setDescuento(0);
      setCuponMsg('Error al validar cupon');
    }
  };

  const total = Math.max(0, totalPrecio - descuento);

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-50 animate-fade-in" onClick={() => setOpen(false)} />
      )}

      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#080808] border-l border-white/5
                      z-50 transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 className="font-display font-bold text-sm tracking-[0.15em] uppercase">Tu Carrito</h2>
            <button onClick={() => setOpen(false)} className="text-[#525252] hover:text-[#fafafa] transition-colors">
              <CloseIcon />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-16 gap-4">
                <div className="text-[#525252]"><CartBagIcon /></div>
                <p className="text-[#525252] text-sm font-body">Carrito vacio</p>
              </div>
            ) : (
              items.map((item, idx) => (
                <div key={idx} className="glass-card p-3 flex gap-3">
                  <img src={item.producto.imagen_url} alt={item.producto.nombre}
                       className="w-20 h-20 object-cover border border-white/5 flex-shrink-0"
                       onError={(e) => { e.target.style.display = 'none'; }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{item.producto.nombre}</p>
                    <p className="text-[#525252] text-xs mt-0.5">Talle: {item.talle}</p>
                    <p className="text-accent font-bold text-sm mt-1">${(item.producto.precio * item.cantidad).toLocaleString('es-CL')}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateCantidad(idx, item.cantidad - 1)}
                              className="w-7 h-7 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <MinusIcon />
                      </button>
                      <span className="font-bold text-sm w-5 text-center">{item.cantidad}</span>
                      <button onClick={() => updateCantidad(idx, item.cantidad + 1)}
                              className="w-7 h-7 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <PlusIcon />
                      </button>
                      <button onClick={() => removeItem(idx)}
                              className="ml-auto text-[#525252] hover:text-red-400 text-[10px] font-bold uppercase tracking-wider transition-colors">
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-white/5 px-6 py-6 space-y-4">
            <div className="flex gap-2">
              <input value={cupon} onChange={(e) => setCupon(e.target.value.toUpperCase())}
                     placeholder="CODIGO CUPON" className="input-field flex-1 text-xs" />
              <button onClick={validarCupon}
                      className="btn-secondary text-[10px] px-4 py-2 whitespace-nowrap">APLICAR</button>
            </div>
            {cuponMsg && (
              <p className={`text-xs font-bold ${descuento > 0 ? 'text-accent' : 'text-red-400'}`}>
                {descuento > 0 ? '' : ''}{cuponMsg}
              </p>
            )}

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#525252]">
                <span>Subtotal</span>
                <span>${totalPrecio.toLocaleString('es-CL')}</span>
              </div>
              {descuento > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Descuento</span>
                  <span>-${descuento.toLocaleString('es-CL')}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t border-white/10 pt-2.5 mt-2.5">
                <span>TOTAL</span>
                <span className="text-accent">${total.toLocaleString('es-CL')}</span>
              </div>
            </div>

            <Link to="/checkout" onClick={() => setOpen(false)}
                  className="btn-primary w-full text-center block text-sm">
              FINALIZAR COMPRA
            </Link>
          </div>
        </div>
      </div>

      <button onClick={() => setOpen(true)}
              className="fixed bottom-6 right-6 z-40 bg-[#fafafa] text-black
                         font-bold px-5 py-3 text-xs uppercase tracking-[0.15em]
                         hover:bg-neutral-200 transition-all duration-300 animate-fade-in shadow-lg"
              style={{ opacity: items.length === 0 ? 0.5 : 1 }}>
        <span className="flex items-center gap-2">
          <CartBagIcon />
          CARRITO ({items.reduce((s, i) => s + i.cantidad, 0)})
        </span>
      </button>
    </>
  );
}
