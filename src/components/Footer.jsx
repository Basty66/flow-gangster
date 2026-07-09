import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800/80 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo-mark.svg" alt="" className="w-7 h-7" />
              <p className="font-display font-extrabold text-sm tracking-[0.15em] text-white">FLOW GANGSTER</p>
            </div>
            <p className="text-neutral-600 text-xs leading-relaxed max-w-xs">
              Zapatillas urbanas, stock fisico en Melipilla y pedidos por encargo con delivery a todo Chile.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.1em] text-neutral-500 mb-4">Cliente</h4>
            <div className="space-y-2">
              <Link to="/seguimiento" className="block text-xs text-neutral-600 hover:text-white transition-colors">Trackear Pedido</Link>
              <Link to="/" className="block text-xs text-neutral-600 hover:text-white transition-colors">Catalogo</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.1em] text-neutral-500 mb-4">Contacto</h4>
            <div className="space-y-2 text-xs text-neutral-600">
              <p>Melipilla, Chile</p>
              <p>Flow Gangster SpA</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.1em] text-neutral-500 mb-4">Pagos</h4>
            <div className="flex flex-wrap gap-2">
              <span className="text-[9px] font-medium px-2 py-1 rounded border border-neutral-800 text-neutral-600">Transferencia</span>
              <span className="text-[9px] font-medium px-2 py-1 rounded border border-neutral-800 text-neutral-600">Efectivo</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-700 text-[10px] tracking-wider uppercase">
            &copy; {new Date().getFullYear()} Flow Gangster. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-neutral-700">
            <a href="#" className="hover:text-white transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
