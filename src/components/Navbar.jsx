import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar({ onLogoClick }) {
  const { totalItems } = useCart();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-deep/95 backdrop-blur-xl border-b border-neutral-800/50' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button onClick={onLogoClick} className="flex items-center gap-2.5 group cursor-pointer">
          <img src="/logo-mark.svg" alt="Flow Gangster" className="w-7 h-7" />
          <div className="hidden sm:block">
            <p className="font-display font-extrabold text-sm tracking-[0.15em] text-white">FLOW GANGSTER</p>
            <p className="text-[7px] font-medium tracking-[0.2em] text-neutral-600 uppercase">Zapatillas Urbanas</p>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-1">
          <Link to="/"
                className={`px-4 py-2 font-medium text-xs tracking-[0.1em] uppercase rounded-lg transition-colors ${
                  isActive('/') ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                }`}>
            Tienda
          </Link>
          <Link to="/seguimiento"
                className={`px-4 py-2 font-medium text-xs tracking-[0.1em] uppercase rounded-lg transition-colors ${
                  isActive('/seguimiento') ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                }`}>
            Tracking
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => window.dispatchEvent(new CustomEvent('toggle-cart'))}
                  className="relative p-2 text-neutral-500 hover:text-white transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-purple text-white text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

          <button className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1"
                  onClick={() => setMenuOpen(!menuOpen)}>
            <span className={`block w-4 h-[1.5px] bg-neutral-500 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-[2.5px]' : ''}`} />
            <span className={`block w-4 h-[1.5px] bg-neutral-500 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-4 h-[1.5px] bg-neutral-500 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-[2.5px]' : ''}`} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-deep border-t border-neutral-800 px-4 py-4 space-y-1">
          <Link to="/" onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium text-xs tracking-[0.1em] uppercase transition-colors ${
                  isActive('/') ? 'text-white bg-neutral-800/50' : 'text-neutral-500 hover:text-neutral-300'
                }`}>
            Tienda
          </Link>
          <Link to="/seguimiento" onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium text-xs tracking-[0.1em] uppercase transition-colors ${
                  isActive('/seguimiento') ? 'text-white bg-neutral-800/50' : 'text-neutral-500 hover:text-neutral-300'
                }`}>
            Tracking
          </Link>
        </div>
      )}
    </nav>
  );
}
