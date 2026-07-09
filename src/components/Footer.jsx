import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-[#2a2a2a] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo-mark.svg" alt="" className="w-6 h-6" />
              <span className="font-display font-bold text-xs tracking-[0.2em] text-[#f5f5f5]">FLOW GANGSTER</span>
            </div>
            <p className="text-[#555] text-xs leading-relaxed max-w-xs">
              Zapatillas urbanas, stock fisico en Melipilla y pedidos por encargo con delivery a todo Chile.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-[0.08em] text-[#666] mb-4">Cliente</h4>
            <div className="space-y-2">
              <Link to="/seguimiento" className="block text-xs text-[#555] hover:text-[#f5f5f5] transition-colors">Trackear</Link>
              <Link to="/" className="block text-xs text-[#555] hover:text-[#f5f5f5] transition-colors">Catalogo</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-[0.08em] text-[#666] mb-4">Contacto</h4>
            <div className="space-y-2 text-xs text-[#555]">
              <p>Melipilla, Chile</p>
              <p>Flow Gangster SpA</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-[0.08em] text-[#666] mb-4">Pagos</h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[8px] font-medium px-2 py-1 rounded border border-[#2a2a2a] text-[#555]">Transferencia</span>
              <span className="text-[8px] font-medium px-2 py-1 rounded border border-[#2a2a2a] text-[#555]">Efectivo</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#2a2a2a] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#444] text-[9px] tracking-wider uppercase">
            &copy; {new Date().getFullYear()} Flow Gangster
          </p>
        </div>
      </div>
    </footer>
  );
}
