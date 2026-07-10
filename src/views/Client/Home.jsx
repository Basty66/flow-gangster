import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import HeroCarousel from '../../components/HeroCarousel';

function Skeleton() {
  return (
    <div>
      <div className="aspect-[4/5] skeleton" />
      <div className="p-4 space-y-2 border-t border-[#333]">
        <div className="h-2 w-14 skeleton" />
        <div className="h-4 w-3/4 skeleton" />
        <div className="h-5 w-16 skeleton" />
      </div>
    </div>
  );
}

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('TODO');
  const [busqueda, setBusqueda] = useState('');
  const catalogoRef = useRef(null);

  const fetchProductos = () => {
    setLoading(true);
    setError('');
    fetch('/api/productos')
      .then((r) => {
        if (!r.ok) throw new Error('Error al cargar');
        return r.json();
      })
      .then((data) => { setProductos(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  };

  useEffect(() => { fetchProductos(); }, []);

  const filtrados = productos.filter((p) => {
    if (filtro !== 'TODO' && p.modalidad !== filtro) return false;
    if (busqueda && !p.nombre.toLowerCase().includes(busqueda.toLowerCase()) && !p.marca.toLowerCase().includes(busqueda.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen">
      <HeroCarousel />

      {/* Catalog */}
      <section ref={catalogoRef} id="catalogo" className="max-w-7xl mx-auto pt-16 pb-20">
        <div className="px-4 pb-6 border-b border-[#333] mb-0"
             style={{ animation: 'fadeUp 0.4s ease-out' }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-0">
              {[
                { key: 'TODO', label: 'Todo' },
                { key: 'STOCK', label: 'Instant Drop' },
                { key: 'ENCARGO', label: 'Pre-Order' },
              ].map((f) => (
                <button key={f.key} onClick={() => setFiltro(f.key)}
                        className={`px-4 py-2 text-xs font-medium tracking-[0.08em] uppercase border border-[#333] transition-all duration-200 ${
                          filtro === f.key ? 'bg-orange text-black border-orange' : 'text-[#666] hover:text-white hover:border-[#555]'
                        }`}>
                  {f.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                     placeholder="Buscar..."
                     className="input pl-9 w-44 text-xs transition-all duration-200 focus:w-56" />
            </div>
          </div>
        </div>

        {error && (
          <div className="text-center py-20 px-4" style={{ animation: 'fadeUp 0.4s ease-out' }}>
            <p className="text-[#666] text-sm mb-4">{error}</p>
            <button onClick={fetchProductos} className="btn btn-primary">Reintentar</button>
          </div>
        )}

        {loading && !error && (
          <div className="grid-products">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
          </div>
        )}

        {!loading && !error && filtrados.length === 0 && (
          <div className="text-center py-20 px-4" style={{ animation: 'fadeUp 0.4s ease-out' }}>
            <p className="font-display font-black text-6xl text-[#1a1a1a] tracking-[-0.04em]">SOLD OUT</p>
            <p className="text-[#555] text-sm mt-4">
              {busqueda ? `Sin resultados para "${busqueda}"` : 'No hay productos con esos filtros'}
            </p>
            {busqueda && (
              <button onClick={() => setBusqueda('')} className="btn btn-outline mt-4">Limpiar</button>
            )}
          </div>
        )}

        {!loading && !error && filtrados.length > 0 && (
          <div className="grid-products">
            {filtrados.map((p, i) => (
              <div key={p.id} style={{ animation: `fadeUp 0.35s ease-out ${i * 0.03}s both` }}>
                <ProductCard producto={p} index={i} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Pre-order CTA */}
      <section className="border-t border-[#333] py-20"
               style={{ animation: 'fadeUp 0.5s ease-out' }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <span className="tag tag-preorder mb-5">Pre-Order</span>
          <h2 className="font-display font-black text-4xl md:text-5xl mb-4 tracking-[-0.02em] leading-tight">
            <span className="text-white">No Encuentras</span>
            <br />
            <span className="text-orange">Tu Talle?</span>
          </h2>
          <p className="text-[#666] text-base max-w-md mx-auto mb-8 font-body leading-relaxed">
            Trabajamos con pedidos por encargo. Si quieres un modelo que no esta en stock,
            lo importamos directo para ti. Tiempo estimado: 15-20 dias habiles.
          </p>
          <button onClick={() => setFiltro('ENCARGO')} className="btn btn-primary transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]">
            Ver Modelos Disponibles
          </button>
        </div>
      </section>
    </div>
  );
}
