import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-space-black/80 backdrop-blur-md border-b-2 border-transparent"
         style={{ borderImage: 'linear-gradient(90deg, #22d3ee, #ec4899) 1' }}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl font-black tracking-wider
                               bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent">
          FLOW GANGSTER
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="font-black uppercase text-sm tracking-wider hover:text-neon-cyan transition-colors">
            Tienda
          </Link>
          <Link to="/seguimiento" className="font-black uppercase text-sm tracking-wider hover:text-neon-cyan transition-colors">
            Tracking
          </Link>
          <Link to="/admin" className="font-black uppercase text-sm tracking-wider hover:text-neon-pink transition-colors">
            Admin
          </Link>
          <button onClick={() => setMenuOpen(true)}
                  className="relative font-black uppercase text-sm tracking-wider
                           border-2 border-white px-4 py-2 hover:bg-white hover:text-space-black transition-all">
            Carrito
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-fire-orange text-black text-xs
                             font-black w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        <button className="md:hidden font-black text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-space-black border-t border-white/10 px-4 py-4 space-y-4">
          <Link to="/" onClick={() => setMenuOpen(false)}
                className="block font-black uppercase text-sm tracking-wider">
            Tienda
          </Link>
          <Link to="/seguimiento" onClick={() => setMenuOpen(false)}
                className="block font-black uppercase text-sm tracking-wider">
            Tracking
          </Link>
          <Link to="/admin" onClick={() => setMenuOpen(false)}
                className="block font-black uppercase text-sm tracking-wider">
            Admin
          </Link>
          <button onClick={() => { setMenuOpen(false); }}
                  className="block font-black uppercase text-sm tracking-wider border-2 border-white px-4 py-2">
            Carrito ({totalItems})
          </button>
        </div>
      )}
    </nav>
  );
}
