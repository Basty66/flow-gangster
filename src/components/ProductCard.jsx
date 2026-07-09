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
          style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[7px]">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-surface2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1">
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

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {producto.modalidad === 'STOCK' ? (
            <span className="tag tag-stock">Instant Drop</span>
          ) : (
            <span className="tag tag-preorder">Pre-Order</span>
          )}
          {isLowStock && (
            <span className="tag" style={{ background: 'rgba(245, 158, 11, 0.08)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
              Ultimos
            </span>
          )}
          {sinStock && (
            <span className="tag" style={{ background: 'rgba(153, 153, 153, 0.08)', color: '#999', border: '1px solid rgba(153, 153, 153, 0.15)' }}>
              Sin Stock
            </span>
          )}
        </div>

        {producto.modalidad === 'ENCARGO' && producto.tiempo_espera_dias > 0 && (
          <div className="absolute bottom-3 right-3">
            <span className="text-[9px] font-medium px-2 py-1 rounded bg-[#141414] text-[#999] border border-[#2a2a2a]">
              ~{producto.tiempo_espera_dias} dias
            </span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <p className="text-[#666] text-[9px] font-medium uppercase tracking-[0.12em]">{producto.marca}</p>
        <h3 className="font-display font-bold text-sm text-[#f5f5f5]">{producto.nombre}</h3>

        <div className="flex items-center justify-between pt-2 border-t border-[#2a2a2a]">
          <p className="font-display font-black text-base text-[#f5f5f5]">
            ${producto.precio.toLocaleString('es-CL')}
          </p>
          {!sinStock && (
            <span className="text-[9px] font-medium text-[#555]">
              {tallesDisponibles.length} talles
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
