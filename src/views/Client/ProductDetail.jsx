import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ArrowLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

function DetailSkeleton() {
  return (
    <div className="pt-28 pb-24 animate-pulse">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-4 w-24 skeleton mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          <div className="aspect-square skeleton" />
          <div className="space-y-8">
            <div className="space-y-5">
              <div className="h-6 w-32 skeleton" />
              <div className="h-12 w-3/4 skeleton" />
              <div className="h-10 w-40 skeleton" />
            </div>
            <div className="h-24 skeleton" />
            <div className="h-16 skeleton" />
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 7 }).map((_, i) => <div key={i} className="h-14 skeleton" />)}
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
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-6">
        <p className="text-orange font-bold text-sm">{error}</p>
        <button onClick={fetchProducto} className="btn-primary text-sm">REINTENTAR</button>
        <Link to="/" className="btn-secondary text-sm">VOLVER A TIENDA</Link>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-6">
        <p className="font-display font-extrabold text-8xl text-white/[0.03] tracking-[-0.03em]">404</p>
        <p className="font-bold text-lg text-[#525252]">PRODUCTO NO ENCONTRADO</p>
        <Link to="/" className="btn-primary text-sm">VOLVER A TIENDA</Link>
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
        <Link to="/" className="inline-flex items-center gap-2 font-bold text-xs tracking-[0.15em] uppercase
                                text-[#525252] hover:text-cyan transition-colors mb-10 group">
          <ArrowLeftIcon />
          VOLVER
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          <div className="glass-card aspect-square overflow-hidden">
            {imgError ? (
              <div className="w-full h-full flex items-center justify-center">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="1"><circle cx="9" cy="9" r="4"/><path d="M4 20h16"/><path d="M9 16l-5-5 5-5"/><path d="M15 16l5-5-5-5"/></svg>
              </div>
            ) : (
              <img src={producto.imagen_url} alt={producto.nombre}
                   className="w-full h-full object-cover transition-transform duration-500"
                   onError={() => setImgError(true)} />
            )}
          </div>

          <div className="space-y-8" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                {producto.modalidad === 'STOCK' ? (
                  <span className="badge-stock">INSTANT DROP</span>
                ) : (
                  <span className="badge-preorder">PRE-ORDER</span>
                )}
                <span className="text-[#525252] text-[10px] font-medium tracking-[0.15em] uppercase">{producto.marca}</span>
              </div>

              <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-none tracking-[-0.02em] text-gradient-purple-cyan">
                {producto.nombre}
              </h1>

              <p className="font-display font-extrabold text-4xl text-cyan">
                ${producto.precio.toLocaleString('es-CL')}
              </p>
            </div>

            {producto.modalidad === 'ENCARGO' && (
              <div className="glass-card p-6 border-orange/10">
                <p className="font-bold text-orange uppercase text-xs tracking-[0.15em] mb-2">ARTICULO BAJO PEDIDO</p>
                <p className="text-[#525252] text-sm leading-relaxed">
                  Este modelo se importa exclusivamente para ti. Tiempo estimado:{' '}
                  <span className="font-bold text-[#fafafa]">{producto.tiempo_espera_dias || 15} dias habiles</span>.
                  Al reservar aseguras tu par.
                </p>
              </div>
            )}

            <p className="text-[#525252] text-sm leading-relaxed font-body">{producto.descripcion}</p>

            <div>
              <p className="font-bold text-xs tracking-[0.15em] uppercase text-[#525252] mb-4">Seleccionar Talle</p>
              <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                {todosTalles.map((t) => {
                  const disponible = tallesDisponibles.find((dt) => dt.talle === t.talle);
                  const selected = talleSeleccionado === t.talle;
                  return (
                    <button key={t.talle}
                            onClick={() => disponible && setTalleSeleccionado(t.talle)}
                            disabled={!disponible}
                            className={`py-4 border font-bold text-sm transition-all duration-200 rounded-xl ${
                              selected
                                ? 'border-purple text-purple bg-purple/5'
                                : disponible
                                ? 'border-white/[0.06] text-[#525252] hover:border-white/20 hover:text-white/70 bg-white/[0.02] cursor-pointer'
                                : 'border-white/[0.03] text-white/[0.08] bg-white/[0.01] cursor-not-allowed line-through'
                            }`}>
                      {t.talle}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <p className="font-bold text-xs tracking-[0.15em] uppercase text-[#525252]">Cantidad</p>
              <div className="flex items-center rounded-xl border border-white/[0.06] overflow-hidden">
                <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                        className="w-12 h-12 font-bold text-base hover:bg-white/[0.06] transition-colors flex items-center justify-center">-</button>
                <span className="w-12 h-12 font-bold text-base flex items-center justify-center border-x border-white/[0.06] bg-white/[0.02]">{cantidad}</span>
                <button onClick={() => setCantidad(cantidad + 1)}
                        className="w-12 h-12 font-bold text-base hover:bg-white/[0.06] transition-colors flex items-center justify-center">+</button>
              </div>
            </div>

            {producto.modalidad === 'STOCK' && stockTalle && (
              <p className="text-xs tracking-wider font-body text-[#525252]">
                Stock: {' '}
                <span className={parseInt(stockTalle.cantidad) <= 2 ? 'text-orange font-bold' : 'text-[#a3a3a3]'}>
                  {stockTalle.cantidad} pares disponibles
                </span>
                {parseInt(stockTalle.cantidad) <= 2 && (
                  <span className="text-orange font-bold ml-2 animate-pulse">ULTIMOS!</span>
                )}
              </p>
            )}

            {producto.modalidad === 'STOCK' && tallesDisponibles.length === 0 && (
              <p className="text-xs tracking-wider font-body text-red-400 font-bold">PRODUCTO AGOTADO</p>
            )}

            <button onClick={handleAdd} disabled={!talleSeleccionado}
                    className={`btn-primary w-full text-center text-sm ${added ? 'bg-gradient-to-r from-cyan to-purple' : ''}`}>
              {added ? '✓ AGREGADO AL CARRITO' : !talleSeleccionado ? 'SELECCIONA UN TALLE' : 'AGREGAR AL CARRITO'}
            </button>

            {added && (
              <Link to="/checkout"
                    className="block text-center text-cyan font-bold text-xs tracking-wider underline underline-offset-4 decoration-cyan/30 hover:decoration-cyan transition-all uppercase">
                IR AL CARRITO &rarr;
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
