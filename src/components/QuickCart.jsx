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
        setCuponMsg(`✓ Cupón aplicado: ${data.valor}${data.tipo === 'PERCENT' ? '%' : '$'} off`);
      } else {
        setDescuento(0);
        setCuponMsg(`✕ ${data.error}`);
      }
    } catch {
      setDescuento(0);
      setCuponMsg('Error al validar cupón');
    }
  };

  const total = Math.max(0, totalPrecio - descuento);

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setOpen(false)} />
      )}

      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-space-black border-l-2 border-neon-cyan/30
                      z-50 transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="font-display text-xl font-black tracking-wider">TU CARRITO</h2>
            <button onClick={() => setOpen(false)} className="text-2xl font-black hover:text-neon-pink transition-colors">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <p className="text-white/40 text-center mt-10 font-body">Carrito vacío</p>
            ) : (
              items.map((item, idx) => (
                <div key={idx} className="card-product p-3 flex gap-3">
                  <img src={item.producto.imagen_url} alt={item.producto.nombre}
                       className="w-20 h-20 object-cover border border-white/10" />
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm truncate">{item.producto.nombre}</p>
                    <p className="text-white/60 text-xs">Talle: {item.talle}</p>
                    <p className="text-neon-cyan font-black">${(item.producto.precio * item.cantidad).toLocaleString('es-CL')}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateCantidad(idx, item.cantidad - 1)}
                              className="border border-white/30 px-2 font-black text-sm hover:bg-white hover:text-space-black transition-colors">−</button>
                      <span className="font-black text-sm">{item.cantidad}</span>
                      <button onClick={() => updateCantidad(idx, item.cantidad + 1)}
                              className="border border-white/30 px-2 font-black text-sm hover:bg-white hover:text-space-black transition-colors">+</button>
                      <button onClick={() => removeItem(idx)}
                              className="ml-auto text-fire-orange font-black text-xs hover:text-red-500 transition-colors">ELIMINAR</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-white/10 p-4 space-y-3">
            <div className="flex gap-2">
              <input value={cupon} onChange={(e) => setCupon(e.target.value.toUpperCase())}
                     placeholder="CUPÓN" className="input-field flex-1 text-sm uppercase" />
              <button onClick={validarCupon}
                      className="btn-secondary text-sm px-4 py-2">APLICAR</button>
            </div>
            {cuponMsg && <p className={`text-xs font-bold ${cuponMsg.includes('✓') ? 'text-neon-cyan' : 'text-fire-orange'}`}>{cuponMsg}</p>}

            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-white/60">
                <span>Subtotal</span>
                <span>${totalPrecio.toLocaleString('es-CL')}</span>
              </div>
              {descuento > 0 && (
                <div className="flex justify-between text-neon-cyan">
                  <span>Descuento</span>
                  <span>-${descuento.toLocaleString('es-CL')}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-lg border-t border-white/20 pt-2 mt-2">
                <span>TOTAL</span>
                <span className="text-neon-cyan">${total.toLocaleString('es-CL')}</span>
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
              className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-neon-cyan to-neon-pink
                         text-white font-black px-6 py-4 border-2 border-white
                         shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]
                         hover:scale-105 transition-all duration-300 z-40">
        CARRITO {items.length > 0 && `(${items.reduce((s, i) => s + i.cantidad, 0)})`}
      </button>
    </>
  );
}
