import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import ScrollReveal from '../../components/ScrollReveal';

function Skeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-[4/5] skeleton" />
      <div className="p-4 space-y-2.5">
        <div className="h-2 w-14 skeleton" />
        <div className="h-4 w-3/4 skeleton" />
        <div className="flex justify-between pt-2 border-t border-[#2a2a2a]">
          <div className="h-5 w-16 skeleton" />
          <div className="h-3 w-12 skeleton" />
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
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.06),transparent_60%)]" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#2a2a2a] mb-8"
               style={{ animation: 'fade-up 0.4s ease-out 0.1s both' }}>
            <span className="w-1 h-1 rounded-full bg-[#555]" />
            <span className="text-[#666] font-mono text-[9px] tracking-[0.2em] uppercase">Coleccion 2026</span>
          </div>

          <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.85] tracking-[-0.04em] mb-6"
              style={{ animation: 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both' }}>
            <span className="text-[#f5f5f5]">NEXT</span>
            <br />
            <span className="text-purple">DROP</span>
          </h1>

          <p className="text-[#666] text-base md:text-lg max-w-lg mx-auto mb-10 font-body leading-relaxed"
             style={{ animation: 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both' }}>
            Zapatillas urbanas directo de la calle a tus pies. Stock fisico en Melipilla
            y pedidos por encargo con delivery a todo Chile.
          </p>

          <div className="flex flex-wrap justify-center gap-3"
               style={{ animation: 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both' }}>
            <a href="#catalogo"
               className="btn btn-primary transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
               onClick={(e) => { e.preventDefault(); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Explorar Coleccion
            </a>
            <Link to="/seguimiento" className="btn btn-outline transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]">
              Trackear Pedido
            </Link>
          </div>

          <div className="flex justify-center gap-12 md:gap-16 mt-16"
               style={{ animation: 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both' }}>
            {[
              { n: productos.filter(p => p.modalidad === 'STOCK').length, l: 'Instant Drop' },
              { n: productos.filter(p => p.modalidad === 'ENCARGO').length, l: 'Pre-Order' },
              { n: marcas.length, l: 'Marcas' },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="font-display font-black text-3xl text-[#f5f5f5] transition-all duration-300 hover:scale-110">{s.n}</p>
                <p className="text-[#666] text-xs font-medium tracking-[0.1em] uppercase mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      <ScrollReveal>
        <section id="catalogo" className="max-w-7xl mx-auto px-4 py-20">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-[#2a2a2a]">
            <div className="flex flex-wrap gap-1.5">
              {[
                { key: 'TODO', label: 'Todo' },
                { key: 'STOCK', label: 'Instant Drop' },
                { key: 'ENCARGO', label: 'Pre-Order' },
              ].map((f) => (
                <button key={f.key} onClick={() => setFiltro(f.key)}
                        className={`px-4 py-2 rounded text-xs font-medium tracking-[0.08em] uppercase transition-all duration-200 ${
                          filtro === f.key
                            ? 'bg-purple text-white'
                            : 'text-[#666] hover:text-[#ccc] hover:bg-surface2'
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
                     className="input pl-9 w-48 text-xs transition-all duration-200 focus:w-56" />
            </div>
          </div>

          {error && (
            <div className="text-center py-20 space-y-4">
              <p className="text-[#666] text-sm">{error}</p>
              <button onClick={fetchProductos} className="btn btn-primary transition-all duration-200 hover:scale-[1.02]">Reintentar</button>
            </div>
          )}

          {loading && !error && (
            <div className="grid-products">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
            </div>
          )}

          {!loading && !error && filtrados.length === 0 && (
            <div className="text-center py-20 space-y-4 max-w-sm mx-auto">
              <p className="font-display font-black text-6xl text-[#1a1a1a] tracking-[-0.04em]">SOLD OUT</p>
              <p className="text-[#555] text-sm">
                {busqueda ? `Sin resultados para "${busqueda}"` : 'No hay productos con esos filtros'}
              </p>
              {busqueda && (
                <button onClick={() => setBusqueda('')} className="btn btn-outline transition-all duration-200 hover:scale-[1.02]">Limpiar</button>
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
      </ScrollReveal>

      <ScrollReveal>
        <section className="border-t border-[#2a2a2a] py-20">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <span className="tag tag-preorder mb-5 inline-block transition-all duration-200 hover:scale-105">Pre-Order</span>
            <h2 className="font-display font-black text-4xl md:text-5xl mb-4 tracking-[-0.02em] leading-tight">
              <span className="text-[#f5f5f5]">No Encuentras</span>
              <br />
              <span className="text-purple">Tu Talle?</span>
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
      </ScrollReveal>
    </div>
  );
}
