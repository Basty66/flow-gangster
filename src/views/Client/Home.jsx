import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('TODO');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetch('/api/productos')
      .then((r) => r.json())
      .then((data) => { setProductos(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtrados = productos.filter((p) => {
    if (filtro !== 'TODO' && p.modalidad !== filtro) return false;
    if (busqueda && !p.nombre.toLowerCase().includes(busqueda.toLowerCase()) && !p.marca.toLowerCase().includes(busqueda.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-black text-neon-cyan animate-pulse">CARGANDO DROP...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <div className="relative overflow-hidden mb-12">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter mb-4
                         bg-gradient-to-r from-neon-cyan via-gangster-purple to-neon-pink bg-clip-text text-transparent">
            NEXT DROP
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-body">
            Stock físico directo y pedidos por encargo. Directo de la calle a tus pies.
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 mb-8 space-y-4">
        <div className="flex flex-wrap gap-3">
          {['TODO', 'STOCK', 'ENCARGO'].map((f) => (
            <button key={f} onClick={() => setFiltro(f)}
                    className={`font-black uppercase text-sm tracking-wider px-6 py-3 border-2
                              transition-all duration-200 ${
                                filtro === f
                                  ? 'bg-white text-space-black border-white'
                                  : 'bg-transparent text-white border-white/30 hover:border-white'
                              }`}>
              {f === 'TODO' ? 'TODOS' : f === 'STOCK' ? 'INSTANT DROP' : 'PRE-ORDER'}
            </button>
          ))}
          <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                 placeholder="Buscar por modelo o marca..."
                 className="input-field flex-1 min-w-[200px]" />
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4">
        {filtrados.length === 0 ? (
          <p className="text-center text-white/40 font-body text-lg py-20">No hay productos disponibles</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtrados.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
