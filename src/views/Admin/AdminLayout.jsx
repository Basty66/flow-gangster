import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="text-center">
          <p className="font-display font-black text-4xl text-[#1a1a1a] mb-4">RESTRICTED</p>
          <p className="text-[#555] text-sm mb-6">Debes iniciar sesion como administrador</p>
          <Link to="/" className="btn btn-primary">Volver a Tienda</Link>
        </div>
      </div>
    );
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-black">
      <nav className="border-b border-[#333] px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo-mark.svg" alt="FG" className="w-4 h-4 brightness-0 invert" />
            <span className="font-display font-bold text-xs tracking-[0.25em] text-white">FLOW GANGSTER</span>
          </Link>
          <span className="text-[#555] font-mono text-[8px] tracking-[0.2em] uppercase border-l border-[#333] pl-4">Admin</span>
        </div>
        <div className="flex items-center gap-1">
          <Link to="/admin"
                className={`px-3 py-1.5 text-[10px] font-bold tracking-[0.1em] uppercase transition-colors duration-150 ${
                  isActive('/admin') ? 'text-white bg-[#1a1a1a]' : 'text-[#555] hover:text-white'
                }`}>
            Pedidos
          </Link>
          <Link to="/admin/inventario"
                className={`px-3 py-1.5 text-[10px] font-bold tracking-[0.1em] uppercase transition-colors duration-150 ${
                  isActive('/admin/inventario') ? 'text-white bg-[#1a1a1a]' : 'text-[#555] hover:text-white'
                }`}>
            Inventario
          </Link>
          <button onClick={logout}
                  className="ml-4 px-3 py-1.5 text-[10px] font-bold tracking-[0.1em] uppercase text-[#555] hover:text-white transition-colors duration-150">
            Salir
          </button>
        </div>
      </nav>
      <main className="pb-20">
        <Outlet />
      </main>
    </div>
  );
}
