import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ producto }) {
  const { addItem } = useCart();

  const tallesDisponibles = producto.modalidad === 'ENCARGO'
    ? producto.talles?.filter((t) => t.talle) || []
    : producto.talles?.filter((t) => parseInt(t.cantidad) > 0) || [];

  const primerTalle = tallesDisponibles[0]?.talle;

  return (
    <Link to={`/producto/${producto.id}`} className="card-product group block">
      <div className="relative overflow-hidden">
        <img src={producto.imagen_url} alt={producto.nombre}
             className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-3 left-3">
          {producto.modalidad === 'STOCK' ? (
            <span className="badge-instant">INSTANT DROP</span>
          ) : (
            <span className="badge-preorder">PRE-ORDER</span>
          )}
        </div>
        {producto.modalidad === 'ENCARGO' && producto.tiempo_espera_dias > 0 && (
          <div className="absolute bottom-3 left-3 bg-fire-orange/90 text-black text-[10px] font-black px-2 py-1 uppercase tracking-wider">
            {producto.tiempo_espera_dias} días
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <p className="text-white/50 text-xs font-black uppercase tracking-widest">{producto.marca}</p>
        <h3 className="font-black text-lg truncate">{producto.nombre}</h3>
        <p className="text-neon-cyan font-black text-xl">${producto.precio.toLocaleString('es-CL')}</p>
        {producto.modalidad === 'STOCK' ? (
          <p className="text-white/40 text-xs">{tallesDisponibles.length} talles disponibles</p>
        ) : (
          <p className="text-fire-orange text-xs font-bold">Disponible por encargo</p>
        )}
      </div>
    </Link>
  );
}
