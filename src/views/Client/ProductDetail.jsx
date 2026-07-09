import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

function DetailSkeleton() {
  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-4 w-20 skeleton mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="aspect-[4/5] skeleton" />
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="h-5 w-28 skeleton" />
              <div className="h-10 w-3/4 skeleton" />
              <div className="h-8 w-36 skeleton" />
            </div>
            <div className="h-20 skeleton" />
            <div className="h-12 skeleton" />
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 7 }).map((_, i) => <div key={i} className="h-12 skeleton" />)}
            </div>
            <div className="h-14 skeleton" />
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
        if (!r.ok) throw new Error('Error al cargar producto');
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
        <p className="text-neutral-500 text-sm">{error}</p>
        <button onClick={fetchProducto} className="btn-primary">Reintentar</button>
        <Link to="/" className="btn-secondary">Volver a Tienda</Link>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4">
        <p className="font-display font-black text-8xl text-neutral-800 tracking-[-0.04em]">404</p>
        <p className="font-bold text-neutral-500">Producto no encontrado</p>
        <Link to="/" className="btn-primary">Volver a Tienda</Link>
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
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] uppercase
                                text-neutral-500 hover:text-white transition-colors mb-8">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Volver
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div className="card overflow-hidden">
            {imgError ? (
              <div className="aspect-[4/5] flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="1">
                  <circle cx="9" cy="9" r="4"/><path d="M4 20h16"/><path d="M9 16l-5-5 5-5"/><path d="M15 16l5-5-5-5"/>
                </svg>
              </div>
            ) : (
              <img src={producto.imagen_url} alt={producto.nombre}
                   className="w-full aspect-[4/5] object-cover"
                   onError={() => setImgError(true)} />
            )}
          </div>

          {/* Info */}
          <div className="space-y-7">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {producto.modalidad === 'STOCK' ? (
                  <span className="badge-stock">Instant Drop</span>
                ) : (
                  <span className="badge-preorder">Pre-Order</span>
                )}
                <span className="text-neutral-600 text-[10px] font-medium tracking-[0.15em] uppercase">{producto.marca}</span>
              </div>

              <h1 className="font-display font-black text-4xl md:text-5xl leading-tight tracking-[-0.02em] text-white">
                {producto.nombre}
              </h1>

              <p className="font-display font-black text-3xl text-teal">
                ${producto.precio.toLocaleString('es-CL')}
              </p>
            </div>

            {producto.modalidad === 'ENCARGO' && (
              <div className="card p-5 space-y-2">
                <p className="font-bold text-orange uppercase text-[11px] tracking-[0.1em]">Articulo Bajo Pedido</p>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  Este modelo se importa exclusivamente para ti. Tiempo estimado:{' '}
                  <span className="font-semibold text-white">{producto.tiempo_espera_dias || 15} dias habiles</span>.
                  Al reservar aseguras tu par.
                </p>
              </div>
            )}

            <p className="text-neutral-500 text-sm leading-relaxed font-body">{producto.descripcion}</p>

            {/* Size grid */}
            <div>
              <p className="font-semibold text-xs tracking-[0.1em] uppercase text-neutral-500 mb-3">Seleccionar Talle</p>
              <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                {todosTalles.map((t) => {
                  const disponible = !!tallesDisponibles.find((dt) => dt.talle === t.talle);
                  const selected = talleSeleccionado === t.talle;
                  return (
                    <button key={t.talle}
                            onClick={() => disponible && setTalleSeleccionado(t.talle)}
                            disabled={!disponible}
                            className={`h-12 rounded-lg border font-semibold text-sm transition-all ${
                              selected
                                ? 'bg-purple/10 border-purple text-purple-light'
                                : disponible
                                ? 'bg-neutral-900/50 border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:text-white cursor-pointer'
                                : 'bg-transparent border-neutral-800/30 text-neutral-700 cursor-not-allowed line-through'
                            }`}>
                      {t.talle}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity + CTA */}
            <div className="flex items-center gap-4">
              <p className="font-semibold text-xs tracking-[0.1em] uppercase text-neutral-500">Cantidad</p>
              <div className="flex items-center rounded-lg border border-neutral-800 overflow-hidden">
                <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                        className="w-10 h-10 font-semibold text-sm text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-colors">-</button>
                <span className="w-10 h-10 font-semibold text-sm text-white flex items-center justify-center border-x border-neutral-800">{cantidad}</span>
                <button onClick={() => setCantidad(cantidad + 1)}
                        className="w-10 h-10 font-semibold text-sm text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-colors">+</button>
              </div>
            </div>

            {/* Stock info */}
            {producto.modalidad === 'STOCK' && stockTalle && (
              <p className="text-xs text-neutral-500">
                Stock: <span className={parseInt(stockTalle.cantidad) <= 2 ? 'text-orange font-semibold' : 'text-neutral-400'}>
                  {stockTalle.cantidad} pares disponibles
                </span>
                {parseInt(stockTalle.cantidad) <= 2 && <span className="text-orange font-semibold ml-1 animate-pulse">Ultimos!</span>}
              </p>
            )}

            {producto.modalidad === 'STOCK' && tallesDisponibles.length === 0 && (
              <p className="text-xs font-semibold text-neutral-500">Producto agotado</p>
            )}

            <button onClick={handleAdd} disabled={!talleSeleccionado}
                    className={`btn-primary w-full ${added ? 'bg-teal hover:bg-teal/90' : ''}`}>
              {added ? 'Agregado al Carrito' : !talleSeleccionado ? 'Selecciona un Talle' : 'Agregar al Carrito'}
            </button>

            {added && (
              <Link to="/checkout"
                    className="block text-center text-teal font-semibold text-xs tracking-wider underline underline-offset-4 decoration-teal/30 hover:decoration-teal transition-all uppercase">
                Ir al Carrito &rarr;
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
