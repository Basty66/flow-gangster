import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function QuickCart() {
  const { items, removeItem, updateCantidad, total, clearCart } = useCart();
  const [abierto, setAbierto] = useState(false);
  const [cupon, setCupon] = useState('');
  const [cuponData, setCuponData] = useState(null);
  const [cuponError, setCuponError] = useState('');

  useEffect(() => {
    const handler = () => setAbierto((prev) => !prev);
    window.addEventListener('toggle-cart', handler);
    return () => window.removeEventListener('toggle-cart', handler);
  }, []);

  const validarCupon = async () => {
    setCuponError('');
    setCuponData(null);
    try {
      const r = await fetch('/api/validar-cupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: cupon, total, items }),
      });
      const data = await r.json();
      if (r.ok) setCuponData(data);
      else setCuponError(data.error || 'Codigo invalido');
    } catch { setCuponError('Error al validar'); }
  };

  const descuento = cuponData
    ? cuponData.tipo === 'PERCENT' ? total * (cuponData.valor / 100) : cuponData.valor
    : 0;
  const totalFinal = Math.max(0, total - descuento);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/80" onClick={() => setAbierto(false)} />
      <div className="relative w-full max-w-md bg-black border-l border-[#333] flex flex-col animate-slide-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#333]">
          <h2 className="font-display font-bold text-sm text-white tracking-[0.08em] uppercase">
            Carro <span className="text-[#555] font-normal">({items.length})</span>
          </h2>
          <button onClick={() => setAbierto(false)} className="text-[#666] hover:text-white transition-colors duration-150">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-16 px-6">
              <svg className="w-10 h-10 text-[#333] mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
              <p className="text-[#666] text-sm">Tu carro esta vacio</p>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <div key={item.producto.id} className="flex gap-4 px-6 py-4 border-b border-[#222]">
                  <div className="w-16 h-16 bg-[#0d0d0d] flex-shrink-0 border border-[#333]">
                    {item.producto.imagen ? (
                      <img src={item.producto.imagen} alt={item.producto.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[9px] text-[#555] tracking-[0.15em] uppercase mb-0.5">{item.producto.marca}</p>
                    <p className="font-display font-bold text-sm text-white truncate">{item.producto.nombre}</p>
                    <p className="font-display font-bold text-sm text-orange mt-1">
                      ${Number(item.producto.precio).toLocaleString('es-CL')}
                    </p>
                    {item.producto.modalidad === 'ENCARGO' && (
                      <p className="font-mono text-[8px] text-[#555] tracking-[0.1em] mt-1">PRE-ORDER</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => removeItem(item.producto.id)}
                            className="text-[#555] hover:text-white transition-colors duration-150 text-xs">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                    <div className="flex items-center gap-0 border border-[#333]">
                      <button onClick={() => { if (item.cantidad > 1) updateCantidad(item.producto.id, item.cantidad - 1); }}
                              className="px-2 py-0.5 text-[#666] hover:text-white text-xs transition-colors duration-150">−</button>
                      <span className="px-2 py-0.5 text-white text-xs font-bold">{item.cantidad}</span>
                      <button onClick={() => updateCantidad(item.producto.id, item.cantidad + 1)}
                              className="px-2 py-0.5 text-[#666] hover:text-white text-xs transition-colors duration-150">+</button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Coupon */}
              <div className="px-6 py-4 border-b border-[#222]">
                <p className="font-mono text-[9px] text-[#555] tracking-[0.15em] uppercase mb-2">Tienes un cupon?</p>
                <div className="flex gap-0">
                  <input value={cupon} onChange={(e) => setCupon(e.target.value.toUpperCase())}
                         placeholder="CODIGO"
                         className="input flex-1 text-xs border-r-0" />
                  <button onClick={validarCupon}
                          className="px-4 py-2 text-xs font-bold tracking-[0.1em] uppercase bg-orange text-black hover:bg-orange-light transition-colors duration-150">
                    OK
                  </button>
                </div>
                {cuponData && (
                  <p className={`text-xs font-bold mt-2 ${cuponData.tipo === 'PERCENT' ? 'text-white' : 'text-white'}`}>
                    Descuento: {cuponData.tipo === 'PERCENT' ? `${cuponData.valor}%` : `$${Number(cuponData.valor).toLocaleString('es-CL')}`}
                  </p>
                )}
                {cuponError && <p className="text-xs text-[#666] mt-2">{cuponError}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-[#333] px-6 py-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[#666]">Subtotal</span>
            <span className="text-white font-bold">${Number(total).toLocaleString('es-CL')}</span>
          </div>
          {descuento > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-orange">Descuento</span>
              <span className="text-orange font-bold">-${Number(descuento).toLocaleString('es-CL')}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-[#333] pt-3">
            <span className="font-display font-bold text-white">Total</span>
            <span className="font-display font-bold text-white text-lg">${Number(totalFinal).toLocaleString('es-CL')}</span>
          </div>
          <div className="flex gap-1">
            <Link to="/checkout" onClick={() => setAbierto(false)}
                  className="btn btn-primary flex-1 justify-center text-xs py-3">
              IR A CHECKOUT
            </Link>
            <button onClick={clearCart}
                    className="btn btn-outline px-3 py-3 text-xs">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } } .animate-slide-in { animation: slide-in 0.2s ease-out; }`}</style>
    </div>
  );
}
