import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.svg" alt="Flow Gangster" className="w-10 h-10" />
            <div>
              <p className="font-display text-xl font-black tracking-tight
                          bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent
                          leading-none">FLOW GANGSTER</p>
            </div>
          </div>
          <p className="text-white/30 text-sm leading-relaxed max-w-md">
            Tu tienda de sneakers con estilo urbano. Stock físico y pedidos por encargo
            con delivery en todo Chile vía Starken.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-black text-xs tracking-[0.2em] uppercase text-white/40 mb-6">Navegación</h4>
          <div className="space-y-3">
            {[
              { to: '/', label: 'Tienda' },
              { to: '/seguimiento', label: 'Tracking Starken' },
            ].map((l) => (
              <Link key={l.to} to={l.to}
                    className="block text-sm text-white/30 hover:text-neon-cyan transition-colors font-body">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-black text-xs tracking-[0.2em] uppercase text-white/40 mb-6">Contacto</h4>
          <div className="space-y-3 text-sm text-white/30 font-body">
            <p>WhatsApp: +56 9 0000 0000</p>
            <p>Instagram: @flowgangster</p>
            <p>Melipilla, Chile</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs font-body">
            © 2026 Flow Gangster — Todos los derechos reservados
          </p>
          <div className="flex gap-6 text-[10px] font-black tracking-[0.2em] uppercase text-white/20">
            <span>React + Vercel + Neon</span>
            <span>·</span>
            <span>Hecho en Chile</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
