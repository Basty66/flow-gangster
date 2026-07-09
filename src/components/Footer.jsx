import { Link } from 'react-router-dom';

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
  </svg>
);
const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple/[0.01] to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-purple/20 blur-lg rounded-full" />
                <img src="/logo.svg" alt="Flow Gangster" className="relative w-10 h-10" />
              </div>
              <div>
                <p className="font-display font-extrabold text-lg tracking-[0.15em] text-[#fafafa]">FLOW GANGSTER</p>
                <p className="text-[9px] font-medium tracking-[0.3em] text-[#525252] uppercase">Est. 2026</p>
              </div>
            </div>
            <p className="text-[#525252] text-sm leading-relaxed max-w-md font-body">
              Zapatillas urbanas con estilo. Stock fisico en Melipilla y pedidos por encargo
              con delivery a todo Chile via Starken. Directo de la calle a tus pies.
            </p>
            <div className="flex gap-3">
              <span className="w-9 h-9 rounded-full border border-white/[0.06] flex items-center justify-center text-[#525252] hover:text-cyan hover:border-cyan/30 transition-all duration-300 cursor-pointer">
                <InstagramIcon />
              </span>
              <span className="w-9 h-9 rounded-full border border-white/[0.06] flex items-center justify-center text-[#525252] hover:text-cyan hover:border-cyan/30 transition-all duration-300 cursor-pointer">
                <WhatsAppIcon />
              </span>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-xs tracking-[0.2em] uppercase text-[#525252] mb-8">Navegacion</h4>
            <div className="space-y-4">
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

          <div className="md:col-span-3">
            <h4 className="font-bold text-xs tracking-[0.2em] uppercase text-[#525252] mb-8">Contacto</h4>
            <div className="space-y-4 text-sm text-[#525252] font-body">
              <div className="flex items-center gap-3">
                <WhatsAppIcon />
                <span>+56 9 0000 0000</span>
              </div>
              <div className="flex items-center gap-3">
                <InstagramIcon />
                <span>@flowgangster</span>
              </div>
              <div className="flex items-center gap-3">
                <LocationIcon />
                <span>Melipilla, Chile</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-bold text-xs tracking-[0.2em] uppercase text-[#525252] mb-8">Metodos de Pago</h4>
            <div className="space-y-3 text-sm text-[#525252] font-body">
              <p>Transferencia Bancaria</p>
              <p>Efectivo (Retiro Showroom)</p>
              <div className="pt-3 border-t border-white/[0.04]">
                <p className="font-bold text-xs tracking-[0.15em] uppercase text-[#525252]">Envio</p>
                <p className="mt-1">Starken a todo Chile</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#525252] text-xs font-body">
            &copy; 2026 Flow Gangster &mdash; Todos los derechos reservados
          </p>
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-purple/50" />
            <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#525252]">Hecho en Chile</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan/50" />
          </div>
        </div>
      </div>
    </footer>
  );
}
