import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ArrowLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [talleSeleccionado, setTalleSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    fetch('/api/productos')
      .then((r) => r.json())
      .then((data) => {
        const p = data.find((prod) => prod.id === id);
        setProducto(p);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-8 h-8 border border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-6">
        <p className="font-display font-extrabold text-6xl text-white/5">404</p>
        <p className="font-bold text-lg tracking-wider text-[#525252]">PRODUCTO NO ENCONTRADO</p>
        <Link to="/" className="btn-primary text-sm">VOLVER A TIENDA</Link>
      </div>
    );
  }

  const tallesDisponibles = producto.modalidad === 'ENCARGO'
    ? producto.talles || []
    : producto.talles?.filter((t) => parseInt(t.cantidad) > 0) || [];

  const stockTalle = producto.talles?.find((t) => t.talle === talleSeleccionado);

  const handleAdd = () => {
    if (!talleSeleccionado) return;
    addItem(producto, talleSeleccionado, cantidad);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 font-bold text-xs tracking-[0.15em] uppercase
                                text-[#525252] hover:text-[#fafafa] transition-colors mb-8 group">
          <ArrowLeftIcon />
          VOLVER
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="glass-card aspect-square overflow-hidden">
            {imgError ? (
              <div className="w-full h-full flex items-center justify-center">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 20h16"/><path d="M9 16l-5-5 5-5"/><path d="M15 16l5-5-5-5"/>
                </svg>
              </div>
            ) : (
              <img src={producto.imagen_url} alt={producto.nombre}
                   className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                   onError={() => setImgError(true)} />
            )}
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {producto.modalidad === 'STOCK' ? (
                  <span className="badge-stock">INSTANT DROP</span>
                ) : (
                  <span className="badge-preorder">PRE-ORDER</span>
                )}
                <span className="text-[#525252] text-[10px] font-medium tracking-[0.15em] uppercase">{producto.marca}</span>
              </div>

              <h1 className="font-display font-extrabold text-4xl md:text-5xl leading-none tracking-[-0.02em] mb-4">
                {producto.nombre}
              </h1>

              <p className="font-display font-extrabold text-3xl text-accent tracking-tight">
                ${producto.precio.toLocaleString('es-CL')}
              </p>
            </div>

            {producto.modalidad === 'ENCARGO' && (
              <div className="glass-card p-6 border-amber/10">
                <p className="font-bold text-amber uppercase text-xs tracking-[0.15em] mb-2">ARTICULO BAJO PEDIDO</p>
                <p className="text-[#525252] text-sm leading-relaxed">
                  Este modelo se importa exclusivamente para ti. Tiempo estimado de entrega:{' '}
                  <span className="font-bold text-[#fafafa]">{producto.tiempo_espera_dias || 15} dias habiles</span>.
                  Al reservar, aseguras tu par y no pierdes el drop.
                </p>
              </div>
            )}

            <p className="text-[#525252] text-sm leading-relaxed font-body">{producto.descripcion}</p>

            <div>
              <p className="font-bold text-xs tracking-[0.15em] uppercase text-[#525252] mb-4">
                Seleccionar Talle
              </p>
              <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                {tallesDisponibles.map((t) => (
                  <button key={t.talle} onClick={() => setTalleSeleccionado(t.talle)}
                          className={`py-3.5 border font-bold text-sm transition-all duration-300 ${
                            talleSeleccionado === t.talle
                              ? 'border-accent text-accent bg-accent/5'
                              : 'border-white/10 text-[#525252] hover:border-white/30 hover:text-white/70'
                          }`}>
                    {t.talle}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <p className="font-bold text-xs tracking-[0.15em] uppercase text-[#525252]">Cantidad</p>
              <div className="flex items-center border border-white/10">
                <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                        className="w-11 h-11 font-bold text-base hover:bg-white/10 transition-colors flex items-center justify-center">-</button>
                <span className="w-11 h-11 font-bold text-base flex items-center justify-center border-x border-white/10">
                  {cantidad}
                </span>
                <button onClick={() => setCantidad(cantidad + 1)}
                        className="w-11 h-11 font-bold text-base hover:bg-white/10 transition-colors flex items-center justify-center">+</button>
              </div>
            </div>

            {producto.modalidad === 'STOCK' && stockTalle && (
              <p className="text-xs tracking-wider font-body text-[#525252]">
                Stock: {' '}
                <span className={parseInt(stockTalle.cantidad) <= 2 ? 'text-amber font-bold' : 'text-[#525252]'}>
                  {stockTalle.cantidad} pares disponibles
                </span>
                {parseInt(stockTalle.cantidad) <= 2 && (
                  <span className="text-amber font-bold ml-2">ULTIMOS!</span>
                )}
              </p>
            )}

            <button onClick={handleAdd} disabled={!talleSeleccionado}
                    className={`btn-primary w-full text-center text-sm relative overflow-hidden ${
                      added ? 'bg-[#fafafa] text-black' : ''
                    }`}>
              {added ? 'AGREGADO AL CARRITO' : !talleSeleccionado ? 'SELECCIONA UN TALLE' : 'AGREGAR AL CARRITO'}
            </button>

            {added && (
              <Link to="/checkout"
                    className="block text-center text-accent font-bold text-xs tracking-wider
                             underline underline-offset-4 decoration-accent/30 hover:decoration-accent
                             transition-all uppercase">
                IR AL CARRITO
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
