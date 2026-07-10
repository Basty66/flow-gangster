import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function ProductCard({ producto, index }) {
  const { addItem } = useCart();
  const [imgError, setImgError] = useState(false);
  const isStock = producto.modalidad === 'STOCK';

  return (
    <div className="group relative bg-black transition-all duration-200" style={{ animationDelay: `${(index || 0) * 0.02}s` }}>
      <Link to={`/producto/${producto.id}`} className="block">
        <div className="aspect-[4/5] overflow-hidden bg-[#0d0d0d]">
          {producto.imagen && !imgError ? (
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.03]"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
          )}
        </div>
      </Link>

      {isStock ? (
        <div className="absolute top-0 left-0">
          <span className="tag tag-stock bg-black border-0 text-[8px] px-2 py-1 tracking-[0.15em]">INSTANT DROP</span>
        </div>
      ) : (
        <div className="absolute top-0 left-0">
          <span className="tag tag-preorder bg-black border-0 text-[8px] px-2 py-1 tracking-[0.15em]">PRE-ORDER</span>
        </div>
      )}

      <div className="px-4 py-3 border-t border-[#222]">
        <p className="font-mono text-[9px] text-[#555] tracking-[0.15em] uppercase mb-1.5">{producto.marca}</p>
        <Link to={`/producto/${producto.id}`} className="block">
          <h3 className="font-display font-bold text-sm text-white leading-tight transition-colors duration-150 group-hover:text-orange">
            {producto.nombre}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <span className="font-display font-bold text-base text-white">
            ${Number(producto.precio).toLocaleString('es-CL')}
          </span>
          <span className={`font-mono text-[8px] tracking-[0.1em] ${producto.stock > 0 ? 'text-[#555]' : 'text-[#333]'}`}>
            {producto.stock > 0 ? `${producto.stock}u` : '0'}
          </span>
        </div>
      </div>

      <button onClick={() => addItem(producto)}
              disabled={producto.stock < 1}
              className={`btn w-full border-t border-[#222] rounded-none text-[10px] py-2.5 ${
                producto.stock < 1
                  ? 'bg-[#111] text-[#444] cursor-default'
                  : 'bg-[#111] text-[#666] hover:bg-orange hover:text-black'
              }`}>
        {producto.stock < 1 ? 'AGOTADO' : isStock ? 'AGREGAR' : 'ENCARGAR'}
      </button>
    </div>
  );
}
