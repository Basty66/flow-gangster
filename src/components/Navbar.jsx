import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0118]/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/logo.svg" alt="Flow Gangster" className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="hidden sm:block">
            <p className="font-display text-xl font-black tracking-tight
                        bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent
                        leading-none">FLOW GANGSTER</p>
            <p className="text-[8px] font-black tracking-[0.3em] text-white/20 uppercase">Sneaker Store</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { to: '/', label: 'Tienda' },
            { to: '/seguimiento', label: 'Tracking' },
            { to: '/admin', label: 'Admin' },
          ].map((l) => (
            <Link key={l.to} to={l.to}
                  className="font-black text-xs tracking-[0.2em] uppercase text-white/40
                           hover:text-white transition-all duration-300 relative group/link">
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-neon-cyan
                            group-hover/link:w-full transition-all duration-300" />
            </Link>
          ))}

          <button onClick={() => {
            const event = new CustomEvent('toggle-cart');
            window.dispatchEvent(event);
          }}
                  className="relative font-black text-xs tracking-[0.2em] uppercase
                           border-2 border-white/20 px-6 py-3
                           hover:bg-white hover:text-[#0a0118] hover:border-white transition-all duration-300
                           group">
            CARRITO
            {totalItems > 0 && (
              <span className="absolute -top-2.5 -right-2.5 bg-neon-cyan text-[#0a0118] text-[9px]
                             font-black w-5 h-5 rounded-full flex items-center justify-center
                             shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 group"
                onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
          <span className={`w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0a0118]/95 backdrop-blur-xl border-t border-white/5 px-4 py-6 space-y-4">
          {[
            { to: '/', label: 'TIENDA' },
            { to: '/seguimiento', label: 'TRACKING' },
            { to: '/admin', label: 'ADMIN' },
          ].map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                  className="block font-black text-sm tracking-[0.2em] uppercase text-white/60 hover:text-white py-2">
              {l.label}
            </Link>
          ))}
          <button onClick={() => setMenuOpen(false)}
                  className="w-full font-black text-sm tracking-[0.2em] uppercase border-2 border-white/30 py-3
                           hover:bg-white hover:text-[#0a0118] transition-all">
            CARRITO ({totalItems})
          </button>
        </div>
      )}
    </nav>
  );
}
