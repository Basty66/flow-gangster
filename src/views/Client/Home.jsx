import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';

function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-square skeleton rounded-none" />
      <div className="p-5 space-y-3">
        <div className="h-2.5 w-16 skeleton" />
        <div className="h-4 w-3/4 skeleton" />
        <div className="h-3 w-full skeleton" />
        <div className="flex justify-between pt-3 border-t border-neutral-800/80">
          <div className="h-5 w-20 skeleton" />
          <div className="h-4 w-14 skeleton" />
        </div>
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
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.08),transparent_70%)]" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/80 border border-neutral-800 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
            <span className="text-neutral-500 font-mono text-[9px] tracking-[0.25em] uppercase">Coleccion 2026</span>
          </div>

          <h1 className="font-display font-black text-6xl md:text-8xl lg:text-[10rem] leading-[0.85] tracking-[-0.04em] mb-8 animate-fade-up">
            <span className="bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text text-transparent">NEXT</span>
            <br />
            <span className="bg-gradient-to-r from-purple via-purple-light to-teal bg-clip-text text-transparent">DROP</span>
          </h1>

          <p className="text-neutral-500 text-base md:text-lg max-w-xl mx-auto mb-10 font-body leading-relaxed animate-fade-up"
             style={{ animationDelay: '0.15s', opacity: 0 }}>
            Zapatillas urbanas directo de la calle a tus pies. Stock fisico en Melipilla
            y pedidos por encargo con delivery a todo Chile.
          </p>

          <div className="flex flex-wrap justify-center gap-3 animate-fade-up"
               style={{ animationDelay: '0.3s', opacity: 0 }}>
            <Link to="#catalogo"
                  className="btn-primary"
                  onClick={(e) => { e.preventDefault(); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Explorar Coleccion
            </Link>
            <Link to="/seguimiento" className="btn-secondary">
              Trackear Pedido
            </Link>
          </div>

          <div className="flex justify-center gap-12 md:gap-20 mt-16 animate-fade-up"
               style={{ animationDelay: '0.4s', opacity: 0 }}>
            <div className="text-center">
              <p className="font-display font-black text-3xl md:text-4xl text-teal">{productos.filter(p => p.modalidad === 'STOCK').length}</p>
              <p className="text-neutral-600 text-xs font-medium tracking-[0.12em] uppercase mt-1">Instant Drop</p>
            </div>
            <div className="text-center">
              <p className="font-display font-black text-3xl md:text-4xl text-purple-light">{productos.filter(p => p.modalidad === 'ENCARGO').length}</p>
              <p className="text-neutral-600 text-xs font-medium tracking-[0.12em] uppercase mt-1">Pre-Order</p>
            </div>
            <div className="text-center">
              <p className="font-display font-black text-3xl md:text-4xl text-neutral-400">{marcas.length}</p>
              <p className="text-neutral-600 text-xs font-medium tracking-[0.12em] uppercase mt-1">Marcas</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-600">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalogo" className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-neutral-800/80">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'TODO', label: 'Todo' },
              { key: 'STOCK', label: 'Instant Drop' },
              { key: 'ENCARGO', label: 'Pre-Order' },
            ].map((f) => (
              <button key={f.key} onClick={() => setFiltro(f.key)}
                      className={`px-5 py-2 rounded-lg border font-semibold text-[11px] tracking-[0.1em] uppercase transition-all ${
                        filtro === f.key
                          ? 'bg-purple text-white border-purple'
                          : 'bg-transparent text-neutral-500 border-neutral-800 hover:border-neutral-600 hover:text-neutral-300'
                      }`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                   placeholder="Buscar modelo o marca..."
                   className="input-field pl-10 w-56 text-xs rounded-lg" />
          </div>
        </div>

        {error && (
          <div className="text-center py-20 space-y-4">
            <p className="text-neutral-500 text-sm">{error}</p>
            <button onClick={fetchProductos} className="btn-primary">Reintentar</button>
          </div>
        )}

        {loading && !error && (
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && !error && filtrados.length === 0 && (
          <div className="text-center py-20 space-y-4 max-w-md mx-auto">
            <p className="font-display font-black text-7xl text-neutral-800/60 tracking-[-0.04em]">SOLD OUT</p>
            <p className="text-neutral-500 text-sm">
              {busqueda ? `Sin resultados para "${busqueda}"` : 'No hay productos con esos filtros'}
            </p>
            {busqueda && (
              <button onClick={() => setBusqueda('')} className="btn-secondary text-sm">Limpiar Busqueda</button>
            )}
          </div>
        )}

        {!loading && !error && filtrados.length > 0 && (
          <div className="product-grid">
            {filtrados.map((p, i) => (
              <ProductCard key={p.id} producto={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Pre-order CTA */}
      <section className="border-t border-neutral-800/80 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="badge-preorder text-xs mb-5">Pre-Order</span>
          <h2 className="font-display font-black text-4xl md:text-5xl mb-4 tracking-[-0.02em] leading-tight">
            <span className="text-white">No Encuentras</span>
            <br />
            <span className="bg-gradient-to-r from-purple-light to-teal bg-clip-text text-transparent">Tu Talle?</span>
          </h2>
          <p className="text-neutral-500 text-base max-w-lg mx-auto mb-8 font-body leading-relaxed">
            Trabajamos con pedidos por encargo. Si quieres un modelo que no esta en stock,
            lo importamos directo para ti. Tiempo estimado: 15-20 dias habiles.
          </p>
          <button onClick={() => setFiltro('ENCARGO')} className="btn-primary">
            Ver Modelos Disponibles
          </button>
        </div>
      </section>
    </div>
  );
}
