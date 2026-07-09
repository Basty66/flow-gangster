import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';

export default function Home() {
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
          <div className="w-16 h-16 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="font-display text-4xl font-black text-neon-cyan animate-pulse tracking-tight">CARGANDO DROP</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* HERO — Full bleed impact */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b-2 border-neon-cyan/20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0118] via-gangster-purple/10 to-[#0a0118]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-pink rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <p className="text-neon-cyan font-black text-sm tracking-[0.3em] mb-6 animate-pulse">FLOW GANGSTER / ESTR. 2026</p>
          <h1 className="hero-text text-8xl md:text-[10rem] lg:text-[12rem] font-black leading-none mb-6
                        bg-gradient-to-r from-white via-neon-cyan to-neon-pink bg-clip-text text-transparent">
            NEXT<br />DROP
          </h1>
          <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-body font-light tracking-wide">
            Stock físico directo y pedidos por encargo. Directo de la calle a tus pies.
            Solo ediciones seleccionadas.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="#catalogo" className="btn-primary text-base"
                  onClick={(e) => { e.preventDefault(); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }); }}>
              EXPLORAR COLECCIÓN
            </Link>
            <Link to="/seguimiento" className="btn-secondary text-base">
              TRACKEAR PEDIDO
            </Link>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 md:gap-16 mt-16">
            {[
              { n: productos.filter(p => p.modalidad === 'STOCK').length, l: 'INSTANT DROP' },
              { n: productos.filter(p => p.modalidad === 'ENCARGO').length, l: 'PRE-ORDER' },
              { n: marcas.length, l: 'MARCAS' },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="hero-text text-4xl md:text-5xl font-black text-neon-cyan">{s.n}</p>
                <p className="text-white/30 text-xs font-black tracking-[0.15em]">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-neon-cyan rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* CATÁLOGO */}
      <section id="catalogo" className="max-w-7xl mx-auto px-4 py-20">
        {/* Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-8 border-b border-white/5">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'TODO', label: 'TODO' },
              { key: 'STOCK', label: '📦 INSTANT DROP' },
              { key: 'ENCARGO', label: '🔥 PRE-ORDER' },
            ].map((f) => (
              <button key={f.key} onClick={() => setFiltro(f.key)}
                      className={`px-6 py-3 border-2 font-black text-xs tracking-[0.15em] uppercase
                                transition-all duration-300 ${
                        filtro === f.key
                          ? 'bg-white text-[#0a0118] border-white'
                          : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'
                      }`}>
                {f.label}
              </button>
            ))}
          </div>
          <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                 placeholder="Buscar por modelo o marca..."
                 className="input-field max-w-xs text-sm" />
        </div>

        {/* Grid */}
        {filtrados.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="hero-text text-6xl font-black text-white/10">SOLD OUT</p>
            <p className="text-white/20 text-sm">No hay productos con esos filtros</p>
          </div>
        ) : (
          <div className="urban-grid">
            {filtrados.map((p, i) => (
              <ProductCard key={p.id} producto={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* BANNER ENCARGO */}
      <section className="border-y border-white/5 py-16 mb-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="badge-preorder text-xs mb-4 inline-block">🔥 PRE-ORDER</span>
          <h2 className="hero-text text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
            ¿NO ENCUENTRAS TU TALLE?
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto mb-8 font-body">
            Trabajamos con pedidos por encargo. Si querés un modelo que no está en stock,
            lo importamos directo para vos. Tiempo estimado: 15-20 días hábiles.
          </p>
          <Link to="?modalidad=ENCARGO" className="btn-primary text-sm"
                onClick={(e) => { e.preventDefault(); setFiltro('ENCARGO'); }}>
            VER MODELOS DISPONIBLES
          </Link>
        </div>
      </section>
    </div>
  );
}
