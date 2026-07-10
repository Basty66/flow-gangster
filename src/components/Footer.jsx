export default function Footer() {
  return (
    <footer className="border-t border-[#333] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <img src="/logo-mark.svg" alt="FG" className="w-6 h-6 brightness-0 invert mb-4" />
            <p className="text-[#555] text-xs leading-relaxed font-body">
              Zapatillas urbanas directo de la calle a tus pies. Melipilla — Todo Chile.
            </p>
          </div>
          <div>
            <h3 className="font-mono text-[9px] text-[#555] tracking-[0.15em] uppercase mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-[#666] text-sm hover:text-white transition-colors duration-150">Tienda</a></li>
              <li><a href="/#catalogo" className="text-[#666] text-sm hover:text-white transition-colors duration-150">Catalogo</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-[9px] text-[#555] tracking-[0.15em] uppercase mb-4">Ayuda</h3>
            <ul className="space-y-2">
              <li><a href="/seguimiento" className="text-[#666] text-sm hover:text-white transition-colors duration-150">Tracking</a></li>
              <li><a href="/checkout" className="text-[#666] text-sm hover:text-white transition-colors duration-150">Checkout</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-[9px] text-[#555] tracking-[0.15em] uppercase mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="text-[#666] text-sm">Melipilla, Chile</li>
              <li><a href="#" className="text-[#666] text-sm hover:text-white transition-colors duration-150">WhatsApp</a></li>
              <li><a href="#" className="text-[#666] text-sm hover:text-white transition-colors duration-150">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#222] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#444] text-xs">&copy; 2026 Flow Gangster</p>
          <p className="font-mono text-[8px] text-[#333] tracking-[0.2em] uppercase">Built in Chile</p>
        </div>
      </div>
    </footer>
  );
}
