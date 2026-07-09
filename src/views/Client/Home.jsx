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
          <div className="w-10 h-10 border border-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-display font-bold text-lg tracking-[0.1em] text-[#525252] animate-pulse">CARGANDO</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Floating logo */}
      <div className="hidden lg:block fixed pointer-events-none z-0 opacity-[0.03]">
        <img src="/logo.svg" alt="" className="w-32 h-32 animate-float" style={{ position: 'fixed', top: '20%', left: '5%' }} />
        <img src="/logo.svg" alt="" className="w-24 h-24 animate-float-reverse" style={{ position: 'fixed', top: '60%', right: '8%' }} />
      </div>

      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 overflow-hidden">
          <div className="blur-circle absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-purple/10 rounded-full blur-[280px] animate-morph" style={{ animationDelay: '0s' }} />
          <div className="blur-circle absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-cyan/10 rounded-full blur-[220px] animate-morph2" style={{ animationDelay: '-3s' }} />
          <div className="blur-circle absolute top-1/2 left-1/2 w-[350px] h-[350px] bg-orange/5 rounded-full blur-[180px] animate-morph3" style={{ animationDelay: '-6s' }} />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-[#525252] font-mono text-xs tracking-[0.3em] mb-6 uppercase animate-fade-in">
            Flow Gangster / Coleccion 2026
          </p>
          <h1 className="hero-text-glow font-display font-extrabold text-7xl md:text-[8rem] lg:text-[10rem] leading-[0.85] tracking-[-0.03em] mb-6
                       animate-slide-up text-gradient-all cursor-default"
              style={{ animationDelay: '0.1s', opacity: 0 }}>
            NEXT<br />DROP
          </h1>
          <p className="text-[#525252] text-base md:text-lg max-w-xl mx-auto mb-10 font-body font-normal leading-relaxed animate-fade-up"
             style={{ animationDelay: '0.3s', opacity: 0 }}>
            Zapatillas urbanas directo de la calle a tus pies. Stock fisico en Melipilla
            y pedidos por encargo con delivery a todo Chile.
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

          <div className="flex justify-center gap-8 md:gap-16 mt-16 animate-fade-up"
               style={{ animationDelay: '0.7s', opacity: 0 }}>
            {[
              { n: productos.filter(p => p.modalidad === 'STOCK').length, l: 'INSTANT DROP' },
              { n: productos.filter(p => p.modalidad === 'ENCARGO').length, l: 'PRE-ORDER' },
              { n: marcas.length, l: 'MARCAS' },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="font-display font-extrabold text-3xl md:text-4xl text-gradient-purple-cyan">{s.n}</p>
                <p className="text-[#525252] text-xs font-medium tracking-[0.15em] uppercase">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-[#525252]">
          <ChevronDown />
        </div>
      </section>

      <section id="catalogo" className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-8 border-b border-white/5"
             style={{ animation: 'fade-up 0.7s ease-out forwards', animationTimeline: 'view()', animationRange: 'entry 0% entry 20%' }}>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'TODO', label: 'TODO' },
              { key: 'STOCK', label: 'INSTANT DROP' },
              { key: 'ENCARGO', label: 'PRE-ORDER' },
            ].map((f) => (
              <button key={f.key} onClick={() => setFiltro(f.key)}
                      className={`px-5 py-2.5 border font-bold text-[11px] tracking-[0.15em] uppercase
                                transition-all duration-300 ${
                        filtro === f.key
                          ? 'bg-purple text-white border-purple'
                          : 'bg-transparent text-[#525252] border-white/10 hover:border-white/30'
                      }`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#525252] pointer-events-none"><SearchIcon /></div>
            <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                   placeholder="Buscar por modelo o marca..."
                   className="input-field pl-10 w-56 text-xs" />
          </div>
        </div>

        {filtrados.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="font-display font-extrabold text-5xl text-white/5">SOLD OUT</p>
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

      <section className="border-t border-white/5 py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="badge-preorder text-xs mb-4 inline-block">PRE-ORDER</span>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl mb-4 tracking-[-0.02em]
                       animate-tilt text-gradient-purple-orange">
            NO ENCUENTRAS TU TALLE?
          </h2>
          <p className="text-[#525252] text-base max-w-xl mx-auto mb-8 font-body leading-relaxed">
            Trabajamos con pedidos por encargo. Si quieres un modelo que no esta en stock,
            lo importamos directo para ti. Tiempo estimado: 15-20 dias habiles.
          </p>
          <button onClick={() => setFiltro('ENCARGO')} className="btn-primary text-sm animate-glow-pulse">
            VER MODELOS DISPONIBLES
          </button>
        </div>
      </section>
    </div>
  );
}
