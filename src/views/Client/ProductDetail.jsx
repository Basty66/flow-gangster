import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [talleSeleccionado, setTalleSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [added, setAdded] = useState(false);

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
        <div className="w-12 h-12 border-2 border-neon-pink border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-6">
        <p className="hero-text text-7xl font-black text-white/10">404</p>
        <p className="font-black text-lg tracking-wider">PRODUCTO NO ENCONTRADO</p>
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
    <div className="pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 font-black text-xs tracking-[0.2em] uppercase
                                text-white/30 hover:text-neon-cyan transition-colors mb-8 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          VOLVER
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image */}
          <div className="card-product aspect-square overflow-hidden border-neon-cyan/10">
            <img src={producto.imagen_url} alt={producto.nombre}
                 className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>

          {/* Info */}
          <div className="space-y-8">
            {/* Badge + Marca */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                {producto.modalidad === 'STOCK' ? (
                  <span className="badge-instant">INSTANT DROP</span>
                ) : (
                  <span className="badge-preorder">PRE-ORDER V.01</span>
                )}
                <span className="text-white/20 text-[10px] font-black tracking-[0.2em]">{producto.marca}</span>
              </div>

              <h1 className="hero-text text-5xl md:text-7xl font-black leading-none tracking-tight mb-4">
                {producto.nombre}
              </h1>

              <p className="font-display text-5xl font-black text-neon-cyan tracking-tight">
                ${producto.precio.toLocaleString('es-CL')}
              </p>
            </div>

            {/* Encargo warning */}
            {producto.modalidad === 'ENCARGO' && (
              <div className="bg-fire-orange/5 border-2 border-fire-orange/30 p-6">
                <p className="font-black text-fire-orange uppercase text-sm tracking-[0.15em] mb-2">
                  ⚠ ARTÍCULO BAJO PEDIDO
                </p>
                <p className="text-white/50 text-sm leading-relaxed">
                  Este modelo se importa exclusivamente para vos. Tiempo estimado de entrega:{' '}
                  <span className="font-black text-white">{producto.tiempo_espera_dias || 15} días hábiles</span>.
                  Al reservar, asegurás tu par y no perdés el drop.
                </p>
              </div>
            )}

            {/* Description */}
            <p className="text-white/40 text-sm leading-relaxed font-body">{producto.descripcion}</p>

            {/* Size selector */}
            <div>
              <p className="font-black text-xs tracking-[0.2em] uppercase text-white/40 mb-4">
                Seleccionar Talle
              </p>
              <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                {tallesDisponibles.map((t) => (
                  <button key={t.talle} onClick={() => setTalleSeleccionado(t.talle)}
                          className={`py-4 border-2 font-black text-sm transition-all duration-300 ${
                            talleSeleccionado === t.talle
                              ? 'border-fire-orange text-fire-orange bg-fire-orange/5 shadow-[0_0_20px_rgba(249,115,22,0.15)]'
                              : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white/70'
                          }`}>
                    {t.talle}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-6">
              <p className="font-black text-xs tracking-[0.2em] uppercase text-white/40">Cantidad</p>
              <div className="flex items-center border-2 border-white/10">
                <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                        className="w-12 h-12 font-black text-lg hover:bg-white hover:text-[#0a0118] transition-colors">−</button>
                <span className="w-12 h-12 font-black text-lg flex items-center justify-center border-x border-white/10">
                  {cantidad}
                </span>
                <button onClick={() => setCantidad(cantidad + 1)}
                        className="w-12 h-12 font-black text-lg hover:bg-white hover:text-[#0a0118] transition-colors">+</button>
              </div>
            </div>

            {/* Stock info */}
            {producto.modalidad === 'STOCK' && stockTalle && (
              <p className="text-xs tracking-wider font-body">
                Stock: {' '}
                <span className={parseInt(stockTalle.cantidad) <= 2 ? 'text-fire-orange font-black' : 'text-white/50'}>
                  {stockTalle.cantidad} pares disponibles
                </span>
                {parseInt(stockTalle.cantidad) <= 2 && (
                  <span className="text-fire-orange font-black ml-2 animate-pulse">¡ÚLTIMOS!</span>
                )}
              </p>
            )}

            {/* Add to cart */}
            <button onClick={handleAdd} disabled={!talleSeleccionado}
                    className={`btn-primary w-full text-center text-lg relative overflow-hidden ${
                      added ? '!bg-gradient-to-r !from-neon-cyan !to-neon-pink' : ''
                    }`}>
              {added ? '✓ AGREGADO AL CARRITO' : !talleSeleccionado ? 'SELECCIONA UN TALLE' : 'AGREGAR AL CARRITO'}
            </button>

            {added && (
              <Link to="/checkout"
                    className="block text-center text-neon-cyan font-black text-sm tracking-wider
                             underline underline-offset-4 decoration-neon-cyan/30 hover:decoration-neon-cyan
                             transition-all">
                IR AL CARRITO →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
