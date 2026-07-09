import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const ChevronDown = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

export default function Home({ onLogoClick }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('TODO');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetch('/api/productos')
      .then((r) => r.json())
      .then((data) => { setProductos(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtrados = productos.filter((p) => {
    if (filtro !== 'TODO' && p.modalidad !== filtro) return false;
    if (busqueda && !p.nombre.toLowerCase().includes(busqueda.toLowerCase()) && !p.marca.toLowerCase().includes(busqueda.toLowerCase())) return false;
    return true;
  });

  const marcas = [...new Set(productos.map((p) => p.marca))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border border-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-display font-extrabold text-lg tracking-[0.1em] text-[#525252]">CARGANDO</p>
          <p className="text-[#525252]/40 text-xs mt-2 font-mono">Flow Gangster</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Floating logos */}
      <div className="hidden lg:block fixed pointer-events-none z-0 opacity-[0.04]">
        <img src="/logo-mark.svg" alt="" className="w-36 h-36 animate-float" style={{ position: 'fixed', top: '15%', left: '3%' }} />
        <img src="/logo-mark.svg" alt="" className="w-24 h-24 animate-float-reverse" style={{ position: 'fixed', top: '65%', right: '5%' }} />
        <img src="/logo-mark.svg" alt="" className="w-16 h-16 animate-float" style={{ position: 'fixed', top: '45%', left: '80%', animationDelay: '-8s' }} />
      </div>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-white/[0.04]">
        {/* Liquid glass blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="liquid-blob absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-purple/15 via-fuchsia/5 to-transparent blur-[300px] animate-liquid-morph" style={{ animationDelay: '0s', animationDuration: '16s' }} />
          <div className="liquid-blob absolute -bottom-1/4 -right-1/4 w-[700px] h-[700px] bg-gradient-to-tl from-cyan/15 via-teal/5 to-transparent blur-[280px] animate-liquid-morph" style={{ animationDelay: '-5s', animationDuration: '14s' }} />
          <div className="liquid-blob absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-orange/8 via-amber/4 to-transparent blur-[200px] animate-liquid-morph" style={{ animationDelay: '-10s', animationDuration: '18s' }} />
          <div className="liquid-blob absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-bl from-iris/10 via-purple/3 to-transparent blur-[180px] animate-liquid-morph" style={{ animationDelay: '-3s', animationDuration: '12s' }} />
          <div className="liquid-blob absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-gradient-to-br from-pink/8 via-fuchsia/3 to-transparent blur-[150px] animate-liquid-morph" style={{ animationDelay: '-7s', animationDuration: '20s' }} />
        </div>

        {/* Decorative grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/[0.04] bg-white/[0.02] backdrop-blur-sm mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            <span className="text-[#525252] font-mono text-[10px] tracking-[0.3em] uppercase">Flow Gangster &mdash; Coleccion 2026</span>
            <span className="w-2 h-2 rounded-full bg-purple animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <h1 className="hero-text-glow font-display font-extrabold text-7xl md:text-[9rem] lg:text-[12rem] leading-[0.8] tracking-[-0.04em] mb-8
                       animate-slide-up text-gradient-all cursor-default"
              style={{ animationDelay: '0.1s', opacity: 0 }}>
            NEXT<br />DROP
          </h1>

          <p className="text-[#525252] text-base md:text-lg max-w-2xl mx-auto mb-12 font-body font-normal leading-relaxed animate-fade-up"
             style={{ animationDelay: '0.3s', opacity: 0 }}>
            Zapatillas urbanas directo de la calle a tus pies. Stock fisico en Melipilla
            y pedidos por encargo con delivery a todo Chile via Starken.
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-fade-up"
               style={{ animationDelay: '0.5s', opacity: 0 }}>
            <Link to="#catalogo"
                  className="btn-primary text-sm"
                  onClick={(e) => { e.preventDefault(); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }); }}>
              EXPLORAR COLECCION
            </Link>
            <Link to="/seguimiento" className="btn-secondary text-sm">
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
              <div key={s.l} className="text-center group cursor-default">
                <p className={`font-display font-extrabold text-4xl md:text-5xl bg-gradient-to-r ${s.color} bg-clip-text text-transparent transition-all duration-300 group-hover:scale-110`}>
                  {s.n}
                </p>
                <p className="text-[#525252] text-xs font-medium tracking-[0.15em] uppercase mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-[#525252]">
          <div className="w-10 h-10 rounded-full border border-white/[0.06] flex items-center justify-center bg-white/[0.02] backdrop-blur-sm">
            <ChevronDown />
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
                      className={`px-6 py-3 rounded-full border font-bold text-[11px] tracking-[0.15em] uppercase
                                transition-all duration-300 ${
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

        {filtrados.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="font-display font-extrabold text-7xl text-white/[0.03] tracking-[-0.03em]">SOLD OUT</p>
            <p className="text-[#525252] text-sm">No hay productos con esos filtros</p>
          </div>
        ) : (
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
          <h2 className="font-display font-extrabold text-4xl md:text-6xl mb-4 tracking-[-0.02em] leading-tight text-gradient-iris">
            NO ENCUENTRAS<br />TU TALLE?
          </h2>
          <p className="text-[#525252] text-base max-w-xl mx-auto mb-10 font-body leading-relaxed">
            Trabajamos con pedidos por encargo. Si quieres un modelo que no esta en stock,
            lo importamos directo para ti. Tiempo estimado: 15-20 dias habiles.
          </p>
          <button onClick={() => setFiltro('ENCARGO')}
                  className="btn-primary text-sm inline-flex items-center gap-2">
            VER MODELOS DISPONIBLES
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </section>
    </div>
  );
}
