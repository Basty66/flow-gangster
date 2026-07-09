import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-24">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.svg" alt="Flow Gangster" className="w-8 h-8" />
            <p className="font-display font-extrabold text-base tracking-[0.15em]">FLOW GANGSTER</p>
          </div>
          <p className="text-[#525252] text-sm leading-relaxed max-w-md font-body">
            Zapatillas urbanas con estilo. Stock fisico en Melipilla y pedidos por encargo
            con delivery a todo Chile via Starken.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-xs tracking-[0.15em] uppercase text-[#525252] mb-6">Navegacion</h4>
          <div className="space-y-3">
            {[
              { to: '/', label: 'Tienda' },
              { to: '/seguimiento', label: 'Tracking Starken' },
            ].map((l) => (
              <Link key={l.to} to={l.to}
                    className="block text-sm text-[#525252] hover:text-cyan transition-colors font-body">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-xs tracking-[0.15em] uppercase text-[#525252] mb-6">Contacto</h4>
          <div className="space-y-3 text-sm text-[#525252] font-body">
            <p>WhatsApp: +56 9 0000 0000</p>
            <p>Instagram: @flowgangster</p>
            <p>Melipilla, Chile</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#525252] text-xs font-body">
            &copy; 2026 Flow Gangster &mdash; Todos los derechos reservados
          </p>
          <div className="flex gap-4 text-[10px] font-medium tracking-[0.15em] uppercase text-[#525252]">
            <span>Hecho en Chile</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
