import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

function Skeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-20">
      <div className="grid md:grid-cols-2 gap-0 border border-[#333]">
        <div><div className="aspect-[4/5] skeleton" /></div>
        <div className="p-8 space-y-4"><div className="h-3 w-20 skeleton" /><div className="h-8 w-3/4 skeleton" /><div className="h-12 w-1/3 skeleton" /></div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);
  const [talleSel, setTalleSel] = useState(null);

  const talles = ['38','39','40','41','42','43','44','45'];

  useEffect(() => {
    setLoading(true);
    fetch(`/api/productos?id=${id}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => { setProducto(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <Skeleton />;
  if (!producto) return (
    <div className="pt-28 pb-20 text-center px-4">
      <p className="font-display font-black text-7xl text-[#1a1a1a]">404</p>
      <p className="text-[#666] mt-4 mb-6">Producto no encontrado</p>
      <Link to="/" className="btn btn-primary">Volver a Tienda</Link>
    </div>
  );

  const isStock = producto.modalidad === 'STOCK';

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.08em] uppercase text-[#666] hover:text-white mb-6 transition-colors duration-150">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Volver
        </Link>

        <div className="grid md:grid-cols-2 gap-0 border border-[#333]">
          <div className="aspect-[4/5] overflow-hidden bg-[#0d0d0d] cursor-crosshair group">
            {producto.imagen && !imgError ? (
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.05]"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-12 h-12 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                </svg>
              </div>
            )}
          </div>

          <div className="border-t md:border-t-0 md:border-l border-[#333]">
            <div className="p-6 sm:p-8 border-b border-[#333]">
              <div className="flex items-center gap-3 mb-3">
                <span className={isStock ? 'tag tag-stock' : 'tag tag-preorder'}>
                  {isStock ? 'INSTANT DROP' : 'PRE-ORDER'}
                </span>
                <span className="font-mono text-[9px] text-[#555] tracking-[0.15em] uppercase">{producto.marca}</span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white leading-tight tracking-[-0.02em]">{producto.nombre}</h1>
              <p className="font-display font-black text-3xl sm:text-4xl text-orange mt-4">
                ${Number(producto.precio).toLocaleString('es-CL')}
              </p>
              {!isStock && (
                <p className="text-[#666] text-sm mt-3 font-body leading-relaxed">
                  Tiempo estimado de llegada: <span className="text-white">15-20 dias habiles</span>
                </p>
              )}
            </div>

            <div className="p-6 sm:p-8 border-b border-[#333]">
              <p className="font-mono text-[9px] text-[#555] tracking-[0.15em] uppercase mb-4">Seleccionar Talle</p>
              <div className="grid grid-cols-4 gap-1">
                {talles.map((t) => {
                  const selected = talleSel === t;
                  return (
                    <button key={t} onClick={() => setTalleSel(t)}
                            className={`py-3 text-xs font-bold tracking-wide transition-all duration-150 border ${
                              selected
                                ? 'bg-orange text-black border-orange'
                                : 'bg-transparent text-[#666] border-[#333] hover:border-[#666] hover:text-white'
                            }`}>
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              {producto.stock > 0 ? (
                <button onClick={() => { addItem(producto); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
                        className="btn btn-primary w-full py-3 text-xs">
                  {added ? '✓ AGREGADO' : isStock ? 'AGREGAR AL CARRO' : 'ENCARGAR AHORA'}
                </button>
              ) : (
                <button disabled className="btn w-full py-3 text-xs bg-[#111] text-[#444] cursor-default">
                  AGOTADO
                </button>
              )}
              <div className="grid grid-cols-2 gap-1">
                <div className="border border-[#333] px-4 py-3 text-center">
                  <p className="text-[#666] font-mono text-[8px] tracking-[0.15em] uppercase">Stock</p>
                  <p className="text-white font-bold text-sm mt-0.5">{producto.stock > 0 ? 'Disponible' : 'Agotado'}</p>
                </div>
                <div className="border border-[#333] px-4 py-3 text-center">
                  <p className="text-[#666] font-mono text-[8px] tracking-[0.15em] uppercase">Envio</p>
                  <p className="text-white font-bold text-sm mt-0.5">Todo Chile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
