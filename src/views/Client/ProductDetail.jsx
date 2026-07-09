import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

function DetailSkeleton() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-3 w-16 skeleton mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="aspect-[4/5] skeleton" />
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="h-4 w-20 skeleton" />
              <div className="h-8 w-3/4 skeleton" />
              <div className="h-7 w-28 skeleton" />
            </div>
            <div className="h-16 skeleton" />
            <div className="h-10 skeleton" />
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 7 }).map((_, i) => <div key={i} className="h-10 skeleton" />)}
            </div>
            <div className="h-12 skeleton" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [talleSeleccionado, setTalleSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fetchProducto = () => {
    setLoading(true);
    setError('');
    fetch('/api/productos')
      .then((r) => {
        if (!r.ok) throw new Error('Error al cargar');
        return r.json();
      })
      .then((data) => {
        const p = data.find((prod) => prod.id === id);
        if (!p) throw new Error('Producto no encontrado');
        setProducto(p);
        setLoading(false);
      })
      .catch((err) => { setError(err.message); setLoading(false); });
  };

  useEffect(() => { fetchProducto(); }, [id]);

  if (loading) return <DetailSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4">
        <p className="text-[#666] text-sm">{error}</p>
        <button onClick={fetchProducto} className="btn btn-primary">Reintentar</button>
        <Link to="/" className="btn btn-outline">Volver</Link>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4">
        <p className="font-display font-black text-8xl text-[#1c1c1c] tracking-[-0.04em]">404</p>
        <p className="text-[#666]">Producto no encontrado</p>
        <Link to="/" className="btn btn-primary">Volver a Tienda</Link>
      </div>
    );
  }

  const tallesDisponibles = producto.modalidad === 'ENCARGO'
    ? producto.talles || []
    : producto.talles?.filter((t) => parseInt(t.cantidad) > 0) || [];

  const todosTalles = producto.talles || [];
  const stockTalle = producto.talles?.find((t) => t.talle === talleSeleccionado);

  const handleAdd = () => {
    if (!talleSeleccionado) return;
    addItem(producto, talleSeleccionado, cantidad);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-1 text-xs font-medium text-[#666] hover:text-[#ccc] transition-colors mb-6">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Volver
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="card overflow-hidden">
            {imgError ? (
              <div className="aspect-[4/5] flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1">
                  <circle cx="9" cy="9" r="4"/><path d="M4 20h16"/><path d="M9 16l-5-5 5-5"/><path d="M15 16l5-5-5-5"/>
                </svg>
              </div>
            ) : (
              <img src={producto.imagen_url} alt={producto.nombre}
                   className="w-full aspect-[4/5] object-cover"
                   onError={() => setImgError(true)} />
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {producto.modalidad === 'STOCK' ? (
                  <span className="tag tag-stock">Instant Drop</span>
                ) : (
                  <span className="tag tag-preorder">Pre-Order</span>
                )}
                <span className="text-[#666] text-[10px] font-medium tracking-[0.12em] uppercase">{producto.marca}</span>
              </div>

              <h1 className="font-display font-black text-3xl md:text-4xl lg:text-5xl leading-tight tracking-[-0.02em] text-[#f5f5f5]">
                {producto.nombre}
              </h1>

              <p className="font-display font-black text-2xl text-[#f5f5f5]">
                ${producto.precio.toLocaleString('es-CL')}
              </p>
            </div>

            {producto.modalidad === 'ENCARGO' && (
              <div className="card p-4 space-y-1.5">
                <p className="font-semibold text-amber text-[11px] tracking-[0.08em] uppercase">Articulo Bajo Pedido</p>
                <p className="text-[#666] text-sm leading-relaxed">
                  Se importa exclusivamente para ti. Tiempo estimado: <span className="font-semibold text-[#f5f5f5]">{producto.tiempo_espera_dias || 15} dias habiles</span>.
                </p>
              </div>
            )}

            <p className="text-[#666] text-sm leading-relaxed">{producto.descripcion}</p>

            <div>
              <p className="font-semibold text-xs tracking-[0.08em] uppercase text-[#666] mb-3">Talle</p>
              <div className="grid grid-cols-5 sm:grid-cols-7 gap-1.5">
                {todosTalles.map((t) => {
                  const disponible = !!tallesDisponibles.find((dt) => dt.talle === t.talle);
                  const selected = talleSeleccionado === t.talle;
                  return (
                    <button key={t.talle}
                            onClick={() => disponible && setTalleSeleccionado(t.talle)}
                            disabled={!disponible}
                            className={`h-11 rounded text-sm font-medium transition-all ${
                              selected
                                ? 'bg-purple text-white'
                                : disponible
                                ? 'bg-surface2 text-[#ccc] border border-[#2a2a2a] hover:border-[#555] cursor-pointer'
                                : 'bg-transparent text-[#333] cursor-not-allowed'
                            }`}>
                      {t.talle}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-semibold text-xs tracking-[0.08em] uppercase text-[#666]">Cantidad</span>
              <div className="flex items-center rounded border border-[#2a2a2a] overflow-hidden">
                <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                        className="w-9 h-9 text-sm text-[#666] hover:text-[#f5f5f5] hover:bg-surface2 transition-colors">-</button>
                <span className="w-9 h-9 text-sm text-[#f5f5f5] flex items-center justify-center border-x border-[#2a2a2a]">{cantidad}</span>
                <button onClick={() => setCantidad(cantidad + 1)}
                        className="w-9 h-9 text-sm text-[#666] hover:text-[#f5f5f5] hover:bg-surface2 transition-colors">+</button>
              </div>
            </div>

            {producto.modalidad === 'STOCK' && stockTalle && (
              <p className="text-xs text-[#555]">
                Stock: {parseInt(stockTalle.cantidad)} pares
                {parseInt(stockTalle.cantidad) <= 2 && <span className="text-amber font-semibold ml-1">Ultimos!</span>}
              </p>
            )}

            {producto.modalidad === 'STOCK' && tallesDisponibles.length === 0 && (
              <p className="text-xs text-[#555]">Producto agotado</p>
            )}

            <button onClick={handleAdd} disabled={!talleSeleccionado}
                    className={`btn btn-primary w-full ${added ? 'bg-[#2dd4bf]' : ''}`}>
              {added ? '✓ Agregado al Carrito' : !talleSeleccionado ? 'Selecciona un Talle' : 'Agregar al Carrito'}
            </button>

            {added && (
              <Link to="/checkout"
                    className="block text-center text-[#f5f5f5] font-medium text-xs tracking-wider underline underline-offset-4 decoration-[#555] hover:decoration-[#f5f5f5] transition-all">
                Ir al Carrito &rarr;
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
