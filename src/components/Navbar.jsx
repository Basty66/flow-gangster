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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      scrolled ? 'bg-black border-b border-[#333]' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <button onClick={onLogoClick} className="flex items-center gap-3 cursor-pointer group">
          <img src="/logo-mark.svg" alt="Flow Gangster" className="w-5 h-5 brightness-0 invert" />
          <span className="font-display font-bold text-xs tracking-[0.25em] text-white">FLOW GANGSTER</span>
        </button>

        <div className="hidden md:flex items-center gap-0">
          <Link to="/"
                className={`px-5 py-1.5 text-xs font-medium tracking-[0.08em] uppercase transition-colors duration-150 ${
                  isActive('/') ? 'text-white bg-[#1a1a1a]' : 'text-[#666] hover:text-white'
                }`}>
            Tienda
          </Link>
          <Link to="/seguimiento"
                className={`px-5 py-1.5 text-xs font-medium tracking-[0.08em] uppercase transition-colors duration-150 ${
                  isActive('/seguimiento') ? 'text-white bg-[#1a1a1a]' : 'text-[#666] hover:text-white'
                }`}>
            Tracking
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => window.dispatchEvent(new CustomEvent('toggle-cart'))}
                  className="relative p-2 text-[#666] hover:text-white transition-colors duration-150">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-orange text-black text-[7px] font-bold w-3.5 h-3.5 flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

          <button className="md:hidden w-7 h-7 flex flex-col items-center justify-center gap-[3px]"
                  onClick={() => setMenuOpen(!menuOpen)}>
            <span className={`block w-3.5 h-px bg-[#666] transition-all duration-150 ${menuOpen ? 'rotate-45 translate-y-[2px]' : ''}`} />
            <span className={`block w-3.5 h-px bg-[#666] transition-all duration-150 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-3.5 h-px bg-[#666] transition-all duration-150 ${menuOpen ? '-rotate-45 -translate-y-[2px]' : ''}`} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-black border-t border-[#333] px-4 py-2">
          <Link to="/" onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 text-xs font-medium tracking-[0.08em] uppercase ${isActive('/') ? 'text-white bg-[#1a1a1a]' : 'text-[#666]'}`}>
            Tienda
          </Link>
          <Link to="/seguimiento" onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 text-xs font-medium tracking-[0.08em] uppercase ${isActive('/seguimiento') ? 'text-white bg-[#1a1a1a]' : 'text-[#666]'}`}>
            Tracking
          </Link>
        </div>
      )}
    </nav>
  );
}
