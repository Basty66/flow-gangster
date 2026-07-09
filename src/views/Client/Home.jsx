import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

function SkeletonCard() {
  return (
    <div className="glass-card overflow-hidden animate-pulse">
      <div className="aspect-square skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-2 w-16 skeleton" />
        <div className="h-4 w-3/4 skeleton" />
        <div className="h-3 w-full skeleton" />
        <div className="h-3 w-2/3 skeleton" />
        <div className="flex justify-between pt-3 border-t border-white/[0.04]">
          <div className="h-6 w-24 skeleton" />
          <div className="h-4 w-16 skeleton" />
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
    <div className="min-h-screen relative">
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden border-b border-white/[0.04]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple/10 via-fuchsia/3 to-transparent blur-[200px]" />
          <div className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-cyan/8 via-teal/2 to-transparent blur-[180px]" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/[0.04] bg-white/[0.02] backdrop-blur-sm mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-soft" />
            <span className="text-[#525252] font-mono text-[10px] tracking-[0.3em] uppercase">Flow Gangster &mdash; Coleccion 2026</span>
          </div>

          <h1 className="font-display font-extrabold text-7xl md:text-[9rem] leading-[0.85] tracking-[-0.04em] mb-8 animate-slide-up text-gradient-purple-cyan"
              style={{ animationDelay: '0.1s', opacity: 0 }}>
            NEXT<br />DROP
          </h1>

          <p className="text-[#525252] text-base md:text-lg max-w-2xl mx-auto mb-12 font-body animate-fade-up"
             style={{ animationDelay: '0.3s', opacity: 0 }}>
            Zapatillas urbanas directo de la calle a tus pies. Stock fisico en Melipilla
            y pedidos por encargo con delivery a todo Chile via Starken.
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-fade-up"
               style={{ animationDelay: '0.5s', opacity: 0 }}>
            <Link to="#catalogo"
                  className="btn-primary"
                  onClick={(e) => { e.preventDefault(); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }); }}>
              EXPLORAR COLECCION
            </Link>
            <Link to="/seguimiento" className="btn-secondary">
              TRACKEAR PEDIDO
            </Link>
          </div>

          <div className="flex justify-center gap-12 md:gap-24 mt-20 animate-fade-up"
               style={{ animationDelay: '0.7s', opacity: 0 }}>
            {[
              { n: productos.filter(p => p.modalidad === 'STOCK').length, l: 'INSTANT DROP', color: 'from-cyan to-teal' },
              { n: productos.filter(p => p.modalidad === 'ENCARGO').length, l: 'PRE-ORDER', color: 'from-purple to-fuchsia' },
              { n: marcas.length, l: 'MARCAS', color: 'from-orange to-amber' },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className={`font-display font-extrabold text-4xl md:text-5xl bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                  {s.n}
                </p>
                <p className="text-[#525252] text-xs font-medium tracking-[0.15em] uppercase mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalogo" className="max-w-7xl mx-auto px-4 py-24 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12 pb-8 border-b border-white/[0.04]">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'TODO', label: 'TODO' },
              { key: 'STOCK', label: 'INSTANT DROP' },
              { key: 'ENCARGO', label: 'PRE-ORDER' },
            ].map((f) => (
              <button key={f.key} onClick={() => setFiltro(f.key)}
                      className={`px-6 py-3 rounded-full border font-bold text-[11px] tracking-[0.15em] uppercase transition-all duration-300 ${
                        filtro === f.key
                          ? 'bg-purple text-white border-purple shadow-lg shadow-purple/20'
                          : 'bg-transparent text-[#525252] border-white/[0.06] hover:border-white/20 hover:text-white/70'
                      }`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#525252] pointer-events-none"><SearchIcon /></div>
            <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                   placeholder="Buscar por modelo o marca..."
                   className="input-field pl-11 w-60 text-xs rounded-full" />
          </div>
        </div>

        {error && (
          <div className="text-center py-20 space-y-4">
            <p className="text-orange font-bold text-sm">{error}</p>
            <button onClick={fetchProductos} className="btn-primary text-sm">REINTENTAR</button>
          </div>
        )}

        {loading && !error && (
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && !error && filtrados.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <p className="font-display font-extrabold text-7xl text-white/[0.03] tracking-[-0.03em]">SOLD OUT</p>
            <p className="text-[#525252] text-sm">
              {busqueda ? `No hay resultados para "${busqueda}"` : 'No hay productos con esos filtros'}
            </p>
            {busqueda && (
              <button onClick={() => setBusqueda('')} className="btn-secondary text-sm">LIMPIAR BUSQUEDA</button>
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
      <section className="relative border-t border-white/[0.04] py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple/[0.03] via-cyan/[0.02] to-orange/[0.03] blur-[200px] rounded-full" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 badge-preorder text-xs mb-6">PRE-ORDER</div>
          <h2 className="font-display font-extrabold text-4xl md:text-6xl mb-4 tracking-[-0.02em] leading-tight text-gradient-purple-cyan">
            NO ENCUENTRAS<br />TU TALLE?
          </h2>
          <p className="text-[#525252] text-base max-w-xl mx-auto mb-10 font-body leading-relaxed">
            Trabajamos con pedidos por encargo. Si quieres un modelo que no esta en stock,
            lo importamos directo para ti. Tiempo estimado: 15-20 dias habiles.
          </p>
          <button onClick={() => setFiltro('ENCARGO')}
                  className="btn-primary inline-flex items-center gap-2">
            VER MODELOS DISPONIBLES
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </section>
    </div>
  );
}
