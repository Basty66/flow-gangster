import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';

function Skeleton() {
  return (
    <div className="min-h-[80vh] flex items-center border-b border-[#333]">
      <div className="max-w-7xl mx-auto px-4 w-full pt-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <div className="h-3 w-24 skeleton" />
            <div className="h-16 w-3/4 skeleton" />
            <div className="h-6 w-full skeleton" />
          </div>
          <div className="aspect-[4/5] skeleton" />
        </div>
      </div>
    </div>
  );
}

export default function HeroCarousel() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    fetch('/api/destacados')
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { setSlides(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const goTo = useCallback((i) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % Math.max(slides.length, 1));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(next, 5500);
    return () => clearInterval(id);
  }, [slides.length, next]);

  if (loading) return <Skeleton />;

  /* Default hero when no featured products */
  if (slides.length === 0) {
    return (
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
            <Link to="/seguimiento" className="btn btn-outline">Trackear Pedido</Link>
          </div>
          <div className="flex justify-center gap-16 mt-16">
            <div><p className="font-display font-black text-3xl text-white">—</p><p className="text-[#666] text-xs font-medium tracking-[0.1em] uppercase mt-1">Instant Drop</p></div>
            <div><p className="font-display font-black text-3xl text-white">—</p><p className="text-[#666] text-xs font-medium tracking-[0.1em] uppercase mt-1">Pre-Order</p></div>
            <div><p className="font-display font-black text-3xl text-white">—</p><p className="text-[#666] text-xs font-medium tracking-[0.1em] uppercase mt-1">Marcas</p></div>
          </div>
        </div>
      </section>
    );
  }

  const slide = slides[current];
  const isOffer = slide.precio_oferta && slide.oferta_hasta;

  return (
    <section className="min-h-[80vh] flex items-center border-b border-[#333] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 w-full pt-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text */}
          <div className="order-2 md:order-1" style={{ animation: 'carouselSlideIn 0.4s ease-out' }}>
            {isOffer ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-orange/30 bg-orange/5 mb-6">
                <span className="w-1.5 h-1.5 bg-orange animate-pulse" />
                <span className="text-orange font-mono text-[9px] tracking-[0.2em] uppercase font-bold">
                  {slide.etiqueta_oferta || 'OFERTA LIMITADA'}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#333] mb-6">
                <span className="w-1 h-1 bg-orange" />
                <span className="text-[#666] font-mono text-[9px] tracking-[0.2em] uppercase">DESTACADO</span>
              </div>
            )}

            <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.85] tracking-[-0.04em] mb-4">
              <span className="text-white">{slide.marca}</span>
              <br />
              <span className="text-orange">{slide.nombre}</span>
            </h1>

            <p className="text-[#666] text-base md:text-lg max-w-md mb-6 font-body leading-relaxed">
              {slide.descripcion || `Zapatillas ${slide.marca} — Stock fisico en Melipilla y envios a todo Chile.`}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              {isOffer ? (
                <>
                  <div className="flex items-baseline gap-3">
                    <span className="font-display font-black text-3xl sm:text-4xl text-orange">
                      ${Number(slide.precio_oferta).toLocaleString('es-CL')}
                    </span>
                    <span className="font-display font-bold text-lg text-[#555] line-through">
                      ${Number(slide.precio).toLocaleString('es-CL')}
                    </span>
                  </div>
                  <div className="h-8 w-px bg-[#333]" />
                  <CountdownTimer endDate={slide.oferta_hasta} />
                </>
              ) : (
                <span className="font-display font-black text-3xl sm:text-4xl text-white">
                  ${Number(slide.precio).toLocaleString('es-CL')}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to={`/producto/${slide.id}`}
                    className="btn btn-primary transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]">
                {isOffer ? 'APROVECHAR OFERTA' : 'VER PRODUCTO'}
              </Link>
              <a href="#catalogo"
                 className="btn btn-outline transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
                 onClick={(e) => { e.preventDefault(); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }); }}>
                VER CATALOGO
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 md:order-2" style={{ animation: 'carouselSlideIn 0.5s ease-out' }}>
            <div className="aspect-[4/5] bg-[#0d0d0d] border border-[#333] overflow-hidden group cursor-crosshair">
              {slide.imagen_url ? (
                <img src={slide.imagen_url} alt={slide.nombre}
                     className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.03]" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation dots */}
        {slides.length > 1 && (
          <div className="flex justify-center gap-2 mt-10 pb-8">
            {slides.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                      className={`transition-all duration-300 ${
                        i === current ? 'w-8 h-1 bg-orange' : 'w-4 h-1 bg-[#333] hover:bg-[#555]'
                      }`} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes carouselSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
