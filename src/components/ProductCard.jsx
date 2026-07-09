import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const sizesIcon = (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20h16"/><path d="M9 16l-5-5 5-5"/><path d="M15 16l5-5-5-5"/>
  </svg>
);

export default function ProductCard({ producto, index = 0 }) {
  const { addItem } = useCart();
  const [imgError, setImgError] = useState(false);

  const tallesDisponibles = producto.modalidad === 'ENCARGO'
    ? producto.talles?.filter((t) => t.talle) || []
    : producto.talles?.filter((t) => parseInt(t.cantidad) > 0) || [];

  const isLowStock = producto.modalidad === 'STOCK' &&
    tallesDisponibles.reduce((s, t) => s + parseInt(t.cantidad), 0) <= 5;

  return (
    <Link to={`/producto/${producto.id}`}
          className="glass-card-hover block group animate-slide-up"
          style={{ animationDelay: `${index * 0.08}s`, opacity: 0 }}>
      <div className="relative aspect-square overflow-hidden bg-surface">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-surface">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="9" r="4"/><path d="M4 20h16"/><path d="M9 16l-5-5 5-5"/><path d="M15 16l5-5-5-5"/>
            </svg>
          </div>
        ) : (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-deep via-transparent to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500
                      flex items-end p-5">
          <span className="font-bold text-xs tracking-wider text-[#fafafa] translate-y-2
                         group-hover:translate-y-0 transition-transform duration-500">
            VER DETALLE
          </span>
        </div>

        <div className="absolute top-3 left-3">
          {producto.modalidad === 'STOCK' ? (
            <span className="badge-stock">INSTANT DROP</span>
          ) : (
            <span className="badge-preorder">PRE-ORDER</span>
          )}
        </div>

        {isLowStock && (
          <div className="absolute top-3 right-3">
            <span className="bg-purple/10 text-purple text-[9px] font-bold px-2 py-1 uppercase tracking-[0.1em] border border-purple/20">
              ULTIMOS
            </span>
          </div>
        )}

        {producto.modalidad === 'ENCARGO' && producto.tiempo_espera_dias > 0 && (
          <div className="absolute bottom-3 right-3">
            <span className="bg-orange/10 text-orange text-[9px] font-bold px-2 py-1 uppercase tracking-[0.1em] border border-orange/20">
              {producto.tiempo_espera_dias} DIAS
            </span>
          </div>
        )}
      </div>

      <div className="p-5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[#525252] text-[10px] font-medium uppercase tracking-[0.15em]">{producto.marca}</span>
          {producto.modalidad === 'STOCK' && (
            <span className="text-[#525252] text-[10px] font-mono">#{producto.id?.slice(0, 6).toUpperCase()}</span>
          )}
        </div>

        <h3 className="font-display font-bold text-base md:text-lg leading-tight text-[#fafafa]
                      group-hover:text-gradient-purple-cyan transition-all duration-300">
          {producto.nombre}
        </h3>

        <div className="flex items-center justify-between pt-2.5 border-t border-white/5">
          <p className="font-display font-extrabold text-xl tracking-tight text-cyan">
            ${producto.precio.toLocaleString('es-CL')}
          </p>
          <span className="font-medium text-[10px] uppercase tracking-[0.1em] text-[#525252] flex items-center gap-1.5">
            {sizesIcon}
            {tallesDisponibles.length} TALLES
          </span>
        </div>
      </div>
    </Link>
  );
}
