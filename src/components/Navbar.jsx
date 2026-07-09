import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartIcon = ({ className }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

export default function Navbar({ onLogoClick }) {
  const { totalItems } = useCart();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-deep/80 backdrop-blur-2xl border-b border-white/[0.04]" />
      <div className="absolute inset-0 bg-gradient-to-b from-purple/[0.015] to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button onClick={onLogoClick} className="flex items-center gap-2.5 group cursor-pointer">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-purple/20 blur-md rounded-full group-hover:bg-purple/30 transition-all duration-500" />
            <img src="/logo-mark.svg" alt="Flow Gangster" className="relative w-8 h-8 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.4)]" />
          </div>
          <div className="hidden sm:block">
            <p className="font-display font-extrabold text-sm tracking-[0.15em] leading-tight text-[#fafafa] group-hover:text-gradient-purple-cyan transition-all duration-500">FLOW GANGSTER</p>
            <p className="text-[7px] font-medium tracking-[0.25em] text-[#525252] uppercase leading-tight">Zapatillas Urbanas</p>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {[
            { to: '/', label: 'Tienda' },
            { to: '/seguimiento', label: 'Tracking' },
          ].map((l) => (
            <Link key={l.to} to={l.to}
                  className={`px-4 py-2 font-medium text-xs tracking-[0.12em] uppercase rounded-lg transition-all duration-300 ${
                    isActive(l.to)
                      ? 'text-cyan bg-cyan/[0.04]'
                      : 'text-[#525252] hover:text-[#a3a3a3] hover:bg-white/[0.03]'
                  }`}>
              {l.label}
            </Link>
          ))}

          <div className="w-px h-5 bg-white/[0.06] mx-2" />

          <button onClick={() => window.dispatchEvent(new CustomEvent('toggle-cart'))}
                  className="relative p-2.5 rounded-lg transition-all duration-300 text-[#525252] hover:text-cyan hover:bg-white/[0.04]">
            <CartIcon />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-cyan text-deep text-[8px]
                             font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button onClick={() => window.dispatchEvent(new CustomEvent('toggle-cart'))}
                  className="relative p-2 text-[#525252]">
            <CartIcon />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-cyan text-deep text-[7px]
                             font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>
          <button className="relative w-8 h-8 flex flex-col items-center justify-center gap-1 z-10"
                  onClick={() => setMenuOpen(!menuOpen)}>
            <span className={`block w-4 h-[1.5px] bg-[#a3a3a3] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[2.5px]' : ''}`} />
            <span className={`block w-4 h-[1.5px] bg-[#a3a3a3] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-4 h-[1.5px] bg-[#a3a3a3] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[2.5px]' : ''}`} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-deep/95 backdrop-blur-2xl border-t border-white/[0.04] px-4 py-6 space-y-1 animate-fade-in">
          {[
            { to: '/', label: 'TIENDA' },
            { to: '/seguimiento', label: 'TRACKING' },
          ].map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-bold text-xs tracking-[0.15em] uppercase transition-colors ${
                    isActive(l.to) ? 'text-cyan bg-cyan/[0.04]' : 'text-[#525252] hover:text-[#a3a3a3] hover:bg-white/[0.03]'
                  }`}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
