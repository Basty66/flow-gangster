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

function extractProducto(data) {
  if (!data) return null;
  if (Array.isArray(data)) return data.length > 0 ? data[0] : null;
  if (typeof data === 'object' && data.id) return data;
  return null;
}

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);
  const [talleSel, setTalleSel] = useState(null);

  useEffect(() => {
    if (!id) { setError('ID de producto no válido'); setLoading(false); return; }
    setLoading(true);
    setError('');
    setTalleSel(null);
    setAdded(false);
    setImgError(false);
    fetch(`/api/productos?id=${encodeURIComponent(id)}`)
      .then(async (r) => {
        if (!r.ok) {
          const d = await r.json().catch(() => ({}));
          throw new Error(d.error || `Error ${r.status}`);
        }
        return r.json();
      })
      .then((data) => {
        const prod = extractProducto(data);
        if (!prod) {
          setError('Producto no encontrado');
        } else {
          setProducto(prod);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Error al cargar producto');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Skeleton />;

  if (error || !producto) return (
    <div className="pt-28 pb-20 text-center px-4">
      <p className="font-display font-black text-7xl text-[#1a1a1a]">404</p>
      <p className="text-[#666] mt-4 mb-6">{error || 'Producto no encontrado'}</p>
      <Link to="/" className="btn btn-primary">Volver a Tienda</Link>
    </div>
  );

  const isStock = producto.modalidad === 'STOCK';
  const isOffer = producto.precio_oferta && producto.oferta_hasta;
  const stockMap = {};
  if (producto.talles) {
    producto.talles.forEach((t) => { stockMap[t.talle] = t.cantidad; });
  }
  const tallesDisponibles = producto.talles ? producto.talles.filter((t) => t.cantidad > 0).map((t) => t.talle) : [];
  const tallesTodos = producto.talles ? producto.talles.map((t) => t.talle) : [];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.08em] uppercase text-[#666] hover:text-white mb-6 transition-all duration-200 hover:gap-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Volver
        </Link>

        <div className="grid md:grid-cols-2 gap-0 border border-[#333]"
             style={{ animation: 'fadeUp 0.35s ease-out' }}>
          <div className="aspect-[4/5] overflow-hidden bg-[#0d0d0d] cursor-crosshair group">
            {producto.imagen_url && !imgError ? (
              <img
                src={producto.imagen_url}
                alt={producto.nombre || ''}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.08]"
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
              <div className="flex items-baseline gap-3 mt-4">
                {isOffer ? (
                  <>
                    <p className="font-display font-black text-3xl sm:text-4xl text-orange">
                      ${Number(producto.precio_oferta).toLocaleString('es-CL')}
                    </p>
                    <p className="font-display font-bold text-lg text-[#555] line-through">
                      ${Number(producto.precio).toLocaleString('es-CL')}
                    </p>
                    <span className="px-2 py-0.5 bg-orange text-black font-mono text-[8px] font-bold tracking-[0.1em]">
                      -{Math.round((1 - producto.precio_oferta / producto.precio) * 100)}%
                    </span>
                  </>
                ) : (
                  <p className="font-display font-black text-3xl sm:text-4xl text-white">
                    ${Number(producto.precio).toLocaleString('es-CL')}
                  </p>
                )}
              </div>
              {!isStock && (
                <p className="text-[#666] text-sm mt-3 font-body leading-relaxed">
                  Tiempo estimado de llegada: <span className="text-white">15-20 dias habiles</span>
                </p>
              )}
            </div>

            <div className="p-6 sm:p-8 border-b border-[#333]">
              <p className="font-mono text-[9px] text-[#555] tracking-[0.15em] uppercase mb-4">
                Seleccionar Talle
                {talleSel && <span className="text-orange ml-2">✓ {talleSel}</span>}
              </p>
              {tallesTodos.length > 0 ? (
                <div className="grid grid-cols-4 gap-1">
                  {tallesTodos.map((t) => {
                    const stock = stockMap[t] || 0;
                    const selected = talleSel === t;
                    const sinStock = stock < 1;
                    return (
                      <button key={t}
                              onClick={() => !sinStock && setTalleSel(t)}
                              disabled={sinStock}
                              className={`py-3 text-xs font-bold tracking-wide transition-all duration-200 border ${
                                selected
                                  ? 'bg-orange text-black border-orange'
                                  : sinStock
                                    ? 'bg-transparent text-[#333] border-[#1a1a1a] cursor-not-allowed line-through'
                                    : 'bg-transparent text-[#666] border-[#333] hover:border-[#666] hover:text-white'
                              }`}>
                        {t}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[#555] text-[10px] font-mono tracking-[0.1em]">Sin talles disponibles</p>
              )}
              {tallesDisponibles.length === 0 && tallesTodos.length > 0 && (
                <p className="text-[#555] text-[10px] font-mono tracking-[0.1em] mt-3">Sin stock disponible</p>
              )}
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              {producto.stock > 0 ? (
                <button onClick={() => {
                  if (!talleSel) return;
                  addItem(producto, talleSel);
                  setAdded(true);
                  setTimeout(() => setAdded(false), 1500);
                }}
                        disabled={!talleSel}
                        className={`btn w-full justify-center py-3 text-xs transition-all duration-200 ${
                          !talleSel
                            ? 'bg-[#111] text-[#444] cursor-default'
                            : added
                              ? 'bg-orange text-black'
                              : 'btn-primary'
                        }`}>
                  {!talleSel ? 'SELECCIONA UN TALLE' : added ? '✓ AGREGADO' : isStock ? 'AGREGAR AL CARRO' : 'ENCARGAR AHORA'}
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
