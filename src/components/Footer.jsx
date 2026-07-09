import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t-2 border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display text-2xl font-black bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent mb-4">
            FLOW GANGSTER
          </h3>
          <p className="text-white/60 text-sm leading-relaxed">
            Tu tienda de sneakers con estilo urbano. Stock físico y pedidos por encargo con delivery en todo Chile.
          </p>
        </div>
        <div>
          <h4 className="font-black uppercase text-sm tracking-wider mb-4">Navegación</h4>
          <div className="space-y-2 text-white/60 text-sm">
            <Link to="/" className="block hover:text-neon-cyan transition-colors">Tienda</Link>
            <Link to="/seguimiento" className="block hover:text-neon-cyan transition-colors">Tracking Starken</Link>
            <Link to="/checkout" className="block hover:text-neon-cyan transition-colors">Carrito</Link>
          </div>
        </div>
        <div>
          <h4 className="font-black uppercase text-sm tracking-wider mb-4">Contacto</h4>
          <div className="space-y-2 text-white/60 text-sm">
            <p>WhatsApp: +56 9 0000 0000</p>
            <p>Instagram: @flowgangster</p>
            <p>Melipilla, Chile</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-white/40 text-xs font-body">
        © 2026 Flow Gangster — Todos los derechos reservados
      </div>
    </footer>
  );
}
