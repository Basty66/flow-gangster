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
        <div className="w-12 h-12 border-4 border-neon-pink border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4">
        <p className="font-black text-2xl">PRODUCTO NO ENCONTRADO</p>
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
        <Link to="/" className="inline-block font-black uppercase text-sm tracking-wider
                                text-white/60 hover:text-neon-cyan transition-colors mb-8">
          ← VOLVER
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Imagen */}
          <div className="card-product overflow-hidden">
            <img src={producto.imagen_url} alt={producto.nombre}
                 className="w-full aspect-square object-cover" />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              {producto.modalidad === 'STOCK' ? (
                <span className="badge-instant">INSTANT DROP</span>
              ) : (
                <span className="badge-preorder">PRE-ORDER V.01</span>
              )}
            </div>

            <p className="text-white/50 text-sm font-black uppercase tracking-widest">{producto.marca}</p>
            <h1 className="font-display text-4xl md:text-5xl font-black">{producto.nombre}</h1>

            <p className="text-neon-cyan font-black text-4xl">${producto.precio.toLocaleString('es-CL')}</p>

            {producto.modalidad === 'ENCARGO' && (
              <div className="bg-fire-orange/10 border-2 border-fire-orange p-4">
                <p className="font-black text-fire-orange uppercase text-sm tracking-wider">
                  ⚠ Este artículo se trae bajo pedido
                </p>
                <p className="text-white/70 text-sm mt-1">
                  Tiempo estimado de entrega: {producto.tiempo_espera_dias || 15} días hábiles.
                  Al reservar, aseguras tu par.
                </p>
              </div>
            )}

            <p className="text-white/70 text-sm leading-relaxed">{producto.descripcion}</p>

            {/* Selector de talle */}
            <div>
              <p className="font-black uppercase text-sm tracking-wider mb-3">Seleccionar Talle</p>
              <div className="flex flex-wrap gap-2">
                {tallesDisponibles.map((t) => (
                  <button key={t.talle} onClick={() => setTalleSeleccionado(t.talle)}
                          className={`min-w-[60px] px-4 py-3 border-2 font-black text-sm
                                    transition-all duration-200 ${
                                      talleSeleccionado === t.talle
                                        ? 'border-fire-orange text-fire-orange shadow-[0_0_10px_#f97316]'
                                        : 'border-white/20 text-white/60 hover:border-white/50'
                                    }`}>
                    {t.talle}
                  </button>
                ))}
              </div>
            </div>

            {/* Cantidad */}
            <div className="flex items-center gap-4">
              <p className="font-black uppercase text-sm tracking-wider">Cantidad:</p>
              <div className="flex items-center border-2 border-white/20">
                <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                        className="px-4 py-2 font-black hover:bg-white hover:text-space-black transition-colors">−</button>
                <span className="px-4 py-2 font-black border-x border-white/20">{cantidad}</span>
                <button onClick={() => setCantidad(cantidad + 1)}
                        className="px-4 py-2 font-black hover:bg-white hover:text-space-black transition-colors">+</button>
              </div>
            </div>

            {/* Stock info */}
            {producto.modalidad === 'STOCK' && stockTalle && (
              <p className="text-white/50 text-sm">
                Stock disponible:{' '}
                <span className={parseInt(stockTalle.cantidad) <= 2 ? 'text-fire-orange font-black' : 'text-white'}>
                  {stockTalle.cantidad} pares
                </span>
              </p>
            )}

            <button onClick={handleAdd} disabled={!talleSeleccionado}
                    className={`btn-primary w-full text-center text-lg ${
                      added ? '!bg-gradient-to-r !from-neon-cyan !to-neon-pink' : ''
                    }`}>
              {added ? '✓ AGREGADO AL CARRITO' : 'AGREGAR AL CARRITO'}
            </button>

            {added && (
              <Link to="/checkout" className="block text-center text-neon-cyan font-black text-sm underline underline-offset-4">
                IR AL CARRITO →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
