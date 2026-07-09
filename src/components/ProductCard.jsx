import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ producto, index = 0 }) {
  const [imgError, setImgError] = useState(false);

  const tallesDisponibles = producto.modalidad === 'ENCARGO'
    ? producto.talles?.filter((t) => t.talle) || []
    : producto.talles?.filter((t) => parseInt(t.cantidad) > 0) || [];

  const isLowStock = producto.modalidad === 'STOCK' &&
    tallesDisponibles.reduce((s, t) => s + parseInt(t.cantidad), 0) <= 5;

  return (
    <Link to={`/producto/${producto.id}`}
          className="liquid-card-hover block group animate-slide-up"
          style={{ animationDelay: `${index * 0.08}s`, opacity: 0 }}>
      <div className="relative aspect-square overflow-hidden rounded-2xl">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-surface2">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="9" r="4"/><path d="M4 20h16"/><path d="M9 16l-5-5 5-5"/><path d="M15 16l5-5-5-5"/>
            </svg>
          </div>
        ) : (
          <>
            <img
              src={producto.imagen_url}
              alt={producto.nombre}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              onError={() => setImgError(true)}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface2/80 via-transparent to-transparent
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-end p-5
                      opacity-0 group-hover:opacity-100 transition-all duration-500">
          <span className="font-bold text-xs tracking-wider text-[#fafafa] translate-y-4
                         group-hover:translate-y-0 transition-transform duration-500
                         px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
            VER DETALLE
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {producto.modalidad === 'STOCK' ? (
            <span className="badge-stock shadow-lg shadow-cyan/5">INSTANT DROP</span>
          ) : (
            <span className="badge-preorder shadow-lg shadow-purple/5">PRE-ORDER</span>
          )}
          {isLowStock && (
            <span className="badge-ultimos">ULTIMOS</span>
          )}
        </div>

        {producto.modalidad === 'ENCARGO' && producto.tiempo_espera_dias > 0 && (
          <div className="absolute bottom-4 right-4">
            <span className="bg-gradient-to-r from-orange/10 to-amber/10 text-orangelight text-[9px] font-bold px-2.5 py-1.5 uppercase tracking-[0.1em] border border-orange/20 rounded-full backdrop-blur-sm">
              ~{producto.tiempo_espera_dias} DIAS
            </span>
          </div>
        )}
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[#525252] text-[10px] font-medium uppercase tracking-[0.2em]">{producto.marca}</span>
          <span className="font-mono text-[10px] text-white/[0.08]">#{producto.id?.slice(0, 4).toUpperCase()}</span>
        </div>

        <h3 className="font-display font-bold text-lg leading-tight text-[#fafafa]
                      group-hover:text-gradient-purple-cyan transition-all duration-300">
          {producto.nombre}
        </h3>

        <p className="text-[#525252] text-xs leading-relaxed font-body line-clamp-2">
          {producto.descripcion || 'Zapatillas urbanas de edicion limitada.'}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
          <p className="font-display font-extrabold text-2xl tracking-tight text-cyan">
            ${producto.precio.toLocaleString('es-CL')}
          </p>
          <span className="font-medium text-[10px] uppercase tracking-[0.1em] text-[#525252] flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-full">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 20h16"/><path d="M9 16l-5-5 5-5"/><path d="M15 16l5-5-5-5"/></svg>
            {tallesDisponibles.length} TALLES
          </span>
        </div>
      </div>
    </Link>
  );
}
