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
          className="glass-card-hover block group animate-slide-up"
          style={{ animationDelay: `${index * 0.08}s`, opacity: 0 }}>
      <div className="relative aspect-square overflow-hidden rounded-t-xl">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-white/[0.02]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="9" r="4"/><path d="M4 20h16"/><path d="M9 16l-5-5 5-5"/><path d="M15 16l5-5-5-5"/>
            </svg>
          </div>
        ) : (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep/60 via-transparent to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
          <span className="font-bold text-xs tracking-wider text-white translate-y-4
                         group-hover:translate-y-0 transition-transform duration-300
                         px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
            VER DETALLE
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {producto.modalidad === 'STOCK' ? (
            <span className="badge-stock">INSTANT DROP</span>
          ) : (
            <span className="badge-preorder">PRE-ORDER</span>
          )}
          {isLowStock && (
            <span className="text-[10px] font-mono font-medium tracking-[0.15em] uppercase px-3 py-1 rounded-md bg-orange/10 text-orange border border-orange/20">
              ULTIMOS
            </span>
          )}
          {sinStock && (
            <span className="text-[10px] font-mono font-medium tracking-[0.15em] uppercase px-3 py-1 rounded-md bg-red-400/10 text-red-400 border border-red-400/20">
              SIN STOCK
            </span>
          )}
        </div>

        {producto.modalidad === 'ENCARGO' && producto.tiempo_espera_dias > 0 && (
          <div className="absolute bottom-4 right-4">
            <span className="text-[9px] font-bold px-2.5 py-1.5 uppercase tracking-[0.1em] rounded-full backdrop-blur-sm bg-orange/10 text-orange border border-orange/20">
              ~{producto.tiempo_espera_dias} DIAS
            </span>
          </div>
        )}
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[#525252] text-[10px] font-medium uppercase tracking-[0.2em]">{producto.marca}</span>
        </div>

        <h3 className="font-display font-bold text-lg leading-tight text-[#fafafa]">
          {producto.nombre}
        </h3>

        <p className="text-[#525252] text-xs leading-relaxed font-body line-clamp-2">
          {producto.descripcion || 'Zapatillas urbanas de edicion limitada.'}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
          <p className="font-display font-extrabold text-xl tracking-tight text-cyan">
            ${producto.precio.toLocaleString('es-CL')}
          </p>
          {!sinStock && (
            <span className="font-medium text-[10px] uppercase tracking-[0.1em] text-[#525252] flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-full">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 20h16"/><path d="M9 16l-5-5 5-5"/><path d="M15 16l5-5-5-5"/></svg>
              {tallesDisponibles.length} TALLES
            </span>
          )}
          {sinStock && (
            <span className="font-medium text-[10px] uppercase tracking-[0.1em] text-red-400/60">AGOTADO</span>
          )}
        </div>
      </div>
    </Link>
  );
}
