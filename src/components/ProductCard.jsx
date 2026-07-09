import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ producto, index = 0 }) {
  const { addItem } = useCart();

  const tallesDisponibles = producto.modalidad === 'ENCARGO'
    ? producto.talles?.filter((t) => t.talle) || []
    : producto.talles?.filter((t) => parseInt(t.cantidad) > 0) || [];

  return (
    <Link to={`/producto/${producto.id}`}
          className="card-product group block animate-[fadeIn_0.5s_ease-out]"
          style={{ animationDelay: `${index * 0.05}s` }}>
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-[#0d0221]">
        <img src={producto.imagen_url} alt={producto.nombre}
             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />

        {/* Hover info overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0118] via-transparent to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500
                      flex items-end p-5">
          <span className="font-black text-sm text-neon-cyan tracking-wider translate-y-4
                         group-hover:translate-y-0 transition-transform duration-500">
            VER DETALLE →
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {producto.modalidad === 'STOCK' ? (
            <span className="badge-instant">INSTANT DROP</span>
          ) : (
            <span className="badge-preorder">PRE-ORDER</span>
          )}
        </div>

        {/* Stock count bubble */}
        {producto.modalidad === 'STOCK' && (
          <div className="absolute top-3 right-3">
            <div className="bg-[#0a0118]/80 border border-neon-cyan/30 rounded-full px-3 py-1
                          text-[10px] font-black text-neon-cyan">
              {tallesDisponibles.length} TALLES
            </div>
          </div>
        )}

        {/* Delivery time for pre-order */}
        {producto.modalidad === 'ENCARGO' && producto.tiempo_espera_dias > 0 && (
          <div className="absolute bottom-3 right-3">
            <div className="bg-fire-orange/90 text-black text-[9px] font-black px-3 py-1.5 uppercase tracking-[0.15em]">
              ≈ {producto.tiempo_espera_dias} DÍAS
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">{producto.marca}</p>
          {producto.modalidad === 'STOCK' && (
            <p className="text-white/20 text-[10px] font-black">SKU: {producto.id?.slice(0, 6).toUpperCase()}</p>
          )}
        </div>

        <h3 className="font-black text-base md:text-lg leading-tight group-hover:text-neon-cyan transition-colors duration-300">
          {producto.nombre}
        </h3>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <p className="font-display text-2xl font-black text-neon-cyan tracking-tight">
            ${producto.precio.toLocaleString('es-CL')}
          </p>

          {producto.modalidad === 'ENCARGO' && (
            <span className="text-[10px] font-black text-fire-orange tracking-wider">RESERVAR</span>
          )}
        </div>
      </div>
    </Link>
  );
}
