import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';

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

export default function Home({ onLogoClick }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('TODO');
  const [busqueda, setBusqueda] = useState('');

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

  const marcas = [...new Set(productos.map((p) => p.marca))];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="min-h-[80vh] flex items-center justify-center border-b border-[#333]">
        <div className="text-center px-4 max-w-4xl mx-auto pt-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#333] mb-8">
            <span className="w-1 h-1 bg-orange" />
            <span className="text-[#666] font-mono text-[9px] tracking-[0.2em] uppercase">Coleccion 2026</span>
          </div>

          <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.85] tracking-[-0.04em] mb-6">
            <span className="text-white">NEXT</span>
            <br />
            <span className="text-orange">DROP</span>
          </h1>

          <p className="text-[#666] text-base md:text-lg max-w-lg mx-auto mb-10 font-body leading-relaxed">
            Zapatillas urbanas directo de la calle a tus pies. Stock fisico en Melipilla
            y pedidos por encargo con delivery a todo Chile.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <a href="#catalogo"
               className="btn btn-primary"
               onClick={(e) => { e.preventDefault(); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Explorar Coleccion
            </a>
            <Link to="/seguimiento" className="btn btn-outline">
              Trackear Pedido
            </Link>
          </div>

          <div className="flex justify-center gap-16 mt-16">
            <div>
              <p className="font-display font-black text-3xl text-white">{productos.filter(p => p.modalidad === 'STOCK').length}</p>
              <p className="text-[#666] text-xs font-medium tracking-[0.1em] uppercase mt-1">Instant Drop</p>
            </div>
            <div>
              <p className="font-display font-black text-3xl text-white">{productos.filter(p => p.modalidad === 'ENCARGO').length}</p>
              <p className="text-[#666] text-xs font-medium tracking-[0.1em] uppercase mt-1">Pre-Order</p>
            </div>
            <div>
              <p className="font-display font-black text-3xl text-white">{marcas.length}</p>
              <p className="text-[#666] text-xs font-medium tracking-[0.1em] uppercase mt-1">Marcas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalogo" className="max-w-7xl mx-auto pt-16 pb-20">
        <div className="px-4 pb-6 border-b border-[#333] mb-0">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-0">
              {[
                { key: 'TODO', label: 'Todo' },
                { key: 'STOCK', label: 'Instant Drop' },
                { key: 'ENCARGO', label: 'Pre-Order' },
              ].map((f) => (
                <button key={f.key} onClick={() => setFiltro(f.key)}
                        className={`px-4 py-2 text-xs font-medium tracking-[0.08em] uppercase border border-[#333] transition-colors duration-150 ${
                          filtro === f.key ? 'bg-orange text-black border-orange' : 'text-[#666] hover:text-white'
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
                     className="input pl-9 w-44 text-xs" />
            </div>
          </div>
        </div>

        {error && (
          <div className="text-center py-20 px-4">
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
          <div className="text-center py-20 px-4">
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
              <ProductCard key={p.id} producto={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Pre-order CTA */}
      <section className="border-t border-[#333] py-20">
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
          <button onClick={() => setFiltro('ENCARGO')} className="btn btn-primary">
            Ver Modelos Disponibles
          </button>
        </div>
      </section>
    </div>
  );
}
