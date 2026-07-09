import { Link, useLocation } from 'react-router-dom';

export default function AdminLayout({ children }) {
  const location = useLocation();

  const links = [
    { to: '/admin', label: 'Pedidos' },
    { to: '/admin/inventario', label: 'Inventario' },
    { to: '/admin/cupones', label: 'Cupones' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-bold text-xl tracking-[0.02em]">Panel Admin</h1>
          <Link to="/" className="text-[#525252] text-xs font-bold uppercase tracking-[0.15em] hover:text-[#fafafa] transition-colors">
            Ver Tienda
          </Link>
        </div>

        <nav className="flex gap-1 mb-8 border-b border-white/5">
          {links.map((link) => (
            <Link key={link.to} to={link.to}
                  className={`px-5 py-3 font-bold text-xs uppercase tracking-[0.15em] transition-all duration-200 border-b -mb-[1px] ${
                    location.pathname === link.to
                      ? 'border-accent text-accent'
                      : 'border-transparent text-[#525252] hover:text-[#fafafa]'
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
