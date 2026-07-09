import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

export default function Navbar() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/80 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/logo.svg" alt="Flow Gangster" className="w-8 h-8 md:w-9 md:h-9 transition-transform duration-500 group-hover:scale-105" />
          <div className="hidden sm:block">
            <p className="font-display font-extrabold text-base md:text-lg tracking-[0.15em] leading-none text-[#fafafa]">FLOW GANGSTER</p>
            <p className="text-[8px] font-medium tracking-[0.3em] text-[#525252] uppercase">Sneaker Store</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            { to: '/', label: 'Tienda' },
            { to: '/seguimiento', label: 'Tracking' },
            { to: '/admin', label: 'Admin' },
          ].map((l) => (
            <Link key={l.to} to={l.to}
                  className="font-medium text-xs tracking-[0.15em] uppercase text-[#525252]
                           hover:text-[#fafafa] transition-all duration-300 relative group/link">
              {l.label.toUpperCase()}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent
                            group-hover/link:w-full transition-all duration-300" />
            </Link>
          ))}

          <button onClick={() => window.dispatchEvent(new CustomEvent('toggle-cart'))}
                  className="relative p-3 border border-white/10 hover:border-white/30 transition-all duration-300 group">
            <CartIcon />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-black text-[9px]
                             font-bold w-4 h-4 flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>
        </div>

        <button className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
                onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`w-5 h-[1.5px] bg-[#fafafa] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
          <span className={`w-5 h-[1.5px] bg-[#fafafa] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-[1.5px] bg-[#fafafa] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#080808]/95 backdrop-blur-2xl border-t border-white/5 px-4 py-6 space-y-4 animate-fade-in">
          {[
            { to: '/', label: 'TIENDA' },
            { to: '/seguimiento', label: 'TRACKING' },
            { to: '/admin', label: 'ADMIN' },
          ].map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                  className="block font-bold text-sm tracking-[0.15em] uppercase text-[#525252] hover:text-[#fafafa] py-2 transition-colors">
              {l.label}
            </Link>
          ))}
          <button onClick={() => { setMenuOpen(false); window.dispatchEvent(new CustomEvent('toggle-cart')); }}
                  className="w-full flex items-center justify-center gap-3 border border-white/20 py-3
                           hover:bg-white hover:text-black transition-all duration-300 group">
            <CartIcon />
            <span className="font-bold text-xs tracking-[0.15em] uppercase">CARRITO ({totalItems})</span>
          </button>
        </div>
      )}
    </nav>
  );
}
