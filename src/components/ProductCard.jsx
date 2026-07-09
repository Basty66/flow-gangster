import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ producto, index = 0 }) {
  const [imgError, setImgError] = useState(false);

  const tallesDisponibles = producto.modalidad === 'ENCARGO'
    ? producto.talles?.filter((t) => t.talle) || []
    : producto.talles?.filter((t) => parseInt(t.cantidad) > 0) || [];

  const sinStock = producto.modalidad === 'STOCK' && tallesDisponibles.length === 0;
  const totalStock = producto.modalidad === 'STOCK'
    ? tallesDisponibles.reduce((s, t) => s + parseInt(t.cantidad), 0)
    : 0;

  const isLowStock = producto.modalidad === 'STOCK' && totalStock > 0 && totalStock <= 5;

  return (
    <Link to={`/producto/${producto.id}`}
          className="card-hover block group animate-fade-up"
          style={{ animationDelay: `${index * 0.06}s`, opacity: 0 }}>
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-surface2">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="1">
              <circle cx="9" cy="9" r="4"/><path d="M4 20h16"/><path d="M9 16l-5-5 5-5"/><path d="M15 16l5-5-5-5"/>
            </svg>
          </div>
        ) : (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        )}

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {producto.modalidad === 'STOCK' ? (
            <span className="badge-stock">Instant Drop</span>
          ) : (
            <span className="badge-preorder">Pre-Order</span>
          )}
          {isLowStock && (
            <span className="text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 rounded-full bg-orange/10 text-orange border border-orange/20">
              Ultimos
            </span>
          )}
          {sinStock && (
            <span className="text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 rounded-full bg-neutral-900/80 text-neutral-400 border border-neutral-700">
              Sin Stock
            </span>
          )}
        </div>

        {/* Delivery time */}
        {producto.modalidad === 'ENCARGO' && producto.tiempo_espera_dias > 0 && (
          <div className="absolute bottom-3 right-3">
            <span className="text-[9px] font-semibold px-2 py-1 rounded-md bg-neutral-900/80 text-neutral-400 border border-neutral-700">
              ~{producto.tiempo_espera_dias} dias
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-neutral-600 text-[9px] font-medium uppercase tracking-[0.15em]">{producto.marca}</span>
        </div>

        <h3 className="font-display font-bold text-[15px] leading-tight text-white group-hover:text-purple-light transition-colors">
          {producto.nombre}
        </h3>

        <p className="text-neutral-600 text-xs leading-relaxed font-body line-clamp-1">
          {producto.descripcion || 'Zapatillas urbanas'}
        </p>

        <div className="flex items-center justify-between pt-2">
          <p className="font-display font-black text-lg tracking-tight text-teal">
            ${producto.precio.toLocaleString('es-CL')}
          </p>
          {!sinStock && (
            <span className="text-[9px] font-medium text-neutral-600 flex items-center gap-1 bg-neutral-800/50 px-2 py-1 rounded-md">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 20h16"/><path d="M9 16l-5-5 5-5"/><path d="M15 16l5-5-5-5"/></svg>
              {tallesDisponibles.length} talles
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
