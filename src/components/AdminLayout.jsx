import { Link, useLocation } from 'react-router-dom';

export default function AdminLayout({ children }) {
  const location = useLocation();

  const links = [
    { to: '/admin', label: 'Pedidos' },
    { to: '/admin/inventario', label: 'Inventario' },
    { to: '/admin/cupones', label: 'Cupones' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-black">
            <span className="text-neon-pink">[</span> PANEL ADMIN <span className="text-neon-pink">]</span>
          </h1>
          <Link to="/" className="text-white/40 text-sm font-black uppercase tracking-wider hover:text-white transition-colors">
            ← VER TIENDA
          </Link>
        </div>

        <nav className="flex gap-1 mb-8 border-b-2 border-white/10">
          {links.map((link) => (
            <Link key={link.to} to={link.to}
                  className={`px-6 py-3 font-black uppercase text-sm tracking-wider transition-all duration-200 border-b-2 -mb-[2px] ${
                    location.pathname === link.to
                      ? 'border-neon-cyan text-neon-cyan'
                      : 'border-transparent text-white/40 hover:text-white/70'
                  }`}>
              {link.label}
            </Link>
          ))}
        </nav>

        {children}
      </div>
    </div>
  );
}
