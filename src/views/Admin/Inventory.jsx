import { useState, useEffect } from 'react';
import ImageUploader from '../../components/ImageUploader';
import { useAuth } from '../../context/AuthContext';

const TALLES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

export default function Inventory() {
  const { getAuthHeaders } = useAuth();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [offerModal, setOfferModal] = useState(null);
  const [offerForm, setOfferForm] = useState({ precio_oferta: '', oferta_hasta: '', etiqueta_oferta: '' });
  const [seeding, setSeeding] = useState(false);

  const seedData = async () => {
    if (!confirm('Esto creara productos demo (Nike, Jordan, etc.). Los productos existentes se mantendran. Continuar?')) return;
    setSeeding(true);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST', headers: { ...getAuthHeaders() } });
      const data = await res.json();
      if (res.ok) { fetchProductos(); alert(data.message); }
      else alert('Error: ' + (data.error || 'desconocido'));
    } catch (e) { alert('Error de conexion'); }
    setSeeding(false);
  };

  const [form, setForm] = useState({
    nombre: '', marca: '', precio: '', descripcion: '', imagen_url: '',
    modalidad: 'STOCK', tiempo_espera_dias: '15',
    talles: TALLES.map((t) => ({ talle: t, cantidad: '0' })),
  });

  const fetchProductos = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/productos', { headers: { ...getAuthHeaders() } });
      const data = await res.json();
      if (res.ok) setProductos(data);
      else setError(data.error || 'Error al cargar productos');
    } catch (e) { setError('Error de conexión'); }
    setLoading(false);
  };

  useEffect(() => { fetchProductos(); }, []);

  const updateStock = async (producto_id, talle, operacion) => {
    try {
      await fetch('/api/admin/stock', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ producto_id, talle, operacion }),
      });
      fetchProductos();
    } catch (e) { console.error(e); }
  };

  const createProducto = async (e) => {
    e.preventDefault();
    if (!form.imagen_url) return alert('Debes subir una imagen');
    try {
      const res = await fetch('/api/admin/productos', {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          ...form, precio: parseInt(form.precio),
          tiempo_espera_dias: form.modalidad === 'ENCARGO' ? parseInt(form.tiempo_espera_dias) : 0,
          talles: form.modalidad === 'ENCARGO' ? form.talles.map((t) => ({ talle: t.talle, cantidad: 999 })) : form.talles,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ nombre: '', marca: '', precio: '', descripcion: '', imagen_url: '', modalidad: 'STOCK', tiempo_espera_dias: '15', talles: TALLES.map((t) => ({ talle: t, cantidad: '0' })) });
        fetchProductos();
      } else { const d = await res.json(); alert('Error: ' + (d.error || 'desconocido')); }
    } catch (e) { console.error(e); }
  };

  const toggleDestacado = async (producto) => {
    try {
      await fetch('/api/admin/productos', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ id: producto.id, destacado: !producto.destacado }),
      });
      fetchProductos();
    } catch (e) { console.error(e); }
  };

  const openOfferModal = (producto) => {
    setOfferModal(producto);
    setOfferForm({
      precio_oferta: producto.precio_oferta || '',
      oferta_hasta: producto.oferta_hasta ? new Date(producto.oferta_hasta).toISOString().slice(0, 16) : '',
      etiqueta_oferta: producto.etiqueta_oferta || '',
    });
  };

  const saveOffer = async () => {
    if (!offerModal) return;
    try {
      await fetch('/api/admin/productos', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          id: offerModal.id,
          precio_oferta: offerForm.precio_oferta ? parseInt(offerForm.precio_oferta) : null,
          oferta_hasta: offerForm.oferta_hasta ? new Date(offerForm.oferta_hasta).toISOString() : null,
          etiqueta_oferta: offerForm.etiqueta_oferta || null,
        }),
      });
      setOfferModal(null);
      fetchProductos();
    } catch (e) { console.error(e); }
  };

  const clearOffer = async (id) => {
    try {
      await fetch('/api/admin/productos', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ id, precio_oferta: null, oferta_hasta: null, etiqueta_oferta: null }),
      });
      fetchProductos();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowForm(!showForm)}
                  className="btn btn-primary text-[10px] flex items-center gap-2">
            {showForm ? 'CERRAR' : '+ NUEVO PRODUCTO'}
          </button>
          {productos.length === 0 && !loading && (
            <button onClick={seedData} disabled={seeding}
                    className="btn btn-outline text-[10px] flex items-center gap-2">
              {seeding ? '...' : 'SEED DEMO'}
            </button>
          )}
        </div>
        <p className="text-[#555] font-mono text-[9px] tracking-[0.15em] uppercase">{productos.length} productos</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 border border-red-900/30 bg-red-950/20">
          <p className="text-red-400 text-xs font-mono">{error}</p>
        </div>
      )}

      {showForm && (
        <form onSubmit={createProducto} className="card p-6 mb-10 space-y-5"
              style={{ animation: 'fadeUp 0.3s ease-out' }}>
          <p className="font-display font-bold text-sm text-white tracking-[0.08em] uppercase">Nuevo Producto</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                     placeholder="Nombre del modelo *" className="input text-xs" required />
              <input value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })}
                     placeholder="Marca *" className="input text-xs" required />
              <input value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })}
                     type="number" placeholder="Precio en CLP *" className="input text-xs" required />
              <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                        placeholder="Descripcion" className="input text-xs resize-none" rows={3} />
            </div>
            <div className="space-y-3">
              <ImageUploader currentUrl={form.imagen_url} onUpload={(url) => setForm({ ...form, imagen_url: url })} />
              <div className="flex gap-2">
                <button type="button" onClick={() => setForm({ ...form, modalidad: 'STOCK' })}
                        className={`flex-1 py-2.5 border text-[10px] font-bold tracking-[0.1em] uppercase transition-all ${
                          form.modalidad === 'STOCK' ? 'bg-orange text-black border-orange' : 'border-[#333] text-[#555] hover:border-[#666]'
                        }`}>STOCK</button>
                <button type="button" onClick={() => setForm({ ...form, modalidad: 'ENCARGO' })}
                        className={`flex-1 py-2.5 border text-[10px] font-bold tracking-[0.1em] uppercase transition-all ${
                          form.modalidad === 'ENCARGO' ? 'bg-orange text-black border-orange' : 'border-[#333] text-[#555] hover:border-[#666]'
                        }`}>ENCARGO</button>
              </div>
              {form.modalidad === 'ENCARGO' && (
                <input value={form.tiempo_espera_dias} onChange={(e) => setForm({ ...form, tiempo_espera_dias: e.target.value })}
                       type="number" placeholder="Dias de espera" className="input text-xs" />
              )}
              {form.modalidad === 'STOCK' && (
                <div className="grid grid-cols-5 gap-2">
                  {form.talles.map((t, idx) => (
                    <div key={t.talle} className="text-center">
                      <p className="text-[9px] font-bold text-[#555] mb-1 font-mono">{t.talle}</p>
                      <input value={t.cantidad} onChange={(e) => { const nt = [...form.talles]; nt[idx].cantidad = e.target.value; setForm({ ...form, talles: nt }); }}
                             type="number" min="0" className="input text-center text-xs p-1" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center text-xs">
            {form.modalidad === 'ENCARGO' ? 'PUBLICAR PRE-ORDER' : 'CREAR PRODUCTO'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-20">
          <div className="w-6 h-6 border border-orange border-t-transparent animate-spin mx-auto mb-3" />
          <p className="font-mono text-[9px] text-[#555] tracking-[0.2em] uppercase">Cargando</p>
        </div>
      ) : (
        <div className="space-y-2">
          {productos.map((p) => (
            <div key={p.id} className="card p-4 transition-all duration-200 hover:border-[#444]"
                 style={{ animation: 'fadeUp 0.25s ease-out' }}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#0d0d0d] border border-[#333] flex-shrink-0 overflow-hidden">
                  {p.imagen_url ? (
                    <img src={p.imagen_url} alt={p.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {p.modalidad === 'STOCK' ? (
                      <span className="font-mono text-[8px] text-white tracking-[0.1em] uppercase">STOCK</span>
                    ) : (
                      <span className="font-mono text-[8px] text-orange tracking-[0.1em] uppercase">PRE-ORDER</span>
                    )}
                    {p.destacado && (
                      <span className="font-mono text-[8px] text-orange tracking-[0.1em] uppercase border border-orange/20 px-1">DESTACADO</span>
                    )}
                    {p.precio_oferta && (
                      <span className="font-mono text-[8px] text-orange tracking-[0.1em] uppercase">OFERTA</span>
                    )}
                  </div>
                  <p className="font-display font-bold text-sm text-white truncate">{p.nombre}</p>
                  <p className="font-mono text-[9px] text-[#555]">{p.marca}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-display font-bold text-sm text-white">
                    ${(p.precio_oferta || p.precio).toLocaleString('es-CL')}
                  </p>
                  {p.precio_oferta && (
                    <p className="font-mono text-[8px] text-[#555] line-through">${p.precio.toLocaleString('es-CL')}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => toggleDestacado(p)}
                          className={`px-2 py-1 text-[9px] font-bold tracking-[0.1em] uppercase border transition-all ${
                            p.destacado ? 'bg-orange text-black border-orange' : 'border-[#333] text-[#555] hover:border-[#666]'
                          }`}>
                    {p.destacado ? '★' : '☆'}
                  </button>
                  <button onClick={() => openOfferModal(p)}
                          className="px-2 py-1 text-[9px] font-bold tracking-[0.1em] uppercase border border-[#333] text-[#555] hover:border-[#666] transition-all">
                    OFERTA
                  </button>
                  {p.precio_oferta && (
                    <button onClick={() => clearOffer(p.id)}
                            className="px-2 py-1 text-[9px] font-bold tracking-[0.1em] uppercase border border-[#333] text-[#555] hover:border-red-400 hover:text-red-400 transition-all">
                      X
                    </button>
                  )}
                </div>
              </div>
              {p.modalidad === 'STOCK' && p.talles?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#222]">
                  {p.talles.filter((t) => t.talle && t.talle !== 'null').map((t) => (
                    <div key={t.id || t.talle} className="flex items-center gap-1 border border-[#333] px-2 py-1">
                      <span className="text-[10px] font-bold text-[#555] font-mono">{t.talle}</span>
                      <span className="text-[8px] text-[#444]">|</span>
                      <span className={`text-[10px] font-bold ${parseInt(t.cantidad) <= 2 ? 'text-orange' : 'text-white'}`}>{t.cantidad}</span>
                      <button onClick={() => updateStock(p.id, t.talle, 'SUMAR')}
                              className="text-white font-bold text-xs px-0.5 hover:text-orange transition-colors">+</button>
                      <button onClick={() => updateStock(p.id, t.talle, 'RESTAR')}
                              className="text-[#555] font-bold text-xs px-0.5 hover:text-orange transition-colors">-</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Offer modal */}
      {offerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
             onClick={() => setOfferModal(null)}
             style={{ animation: 'fadeUp 0.2s ease-out' }}>
          <div className="card p-6 w-full max-w-sm space-y-4"
               onClick={(e) => e.stopPropagation()}>
            <p className="font-display font-bold text-sm text-white tracking-[0.08em] uppercase">Oferta para {offerModal.nombre}</p>
            <input value={offerForm.precio_oferta} onChange={(e) => setOfferForm({ ...offerForm, precio_oferta: e.target.value })}
                   type="number" placeholder="Precio oferta (CLP)" className="input text-xs" />
            <input value={offerForm.oferta_hasta} onChange={(e) => setOfferForm({ ...offerForm, oferta_hasta: e.target.value })}
                   type="datetime-local" className="input text-xs" />
            <input value={offerForm.etiqueta_oferta} onChange={(e) => setOfferForm({ ...offerForm, etiqueta_oferta: e.target.value })}
                   placeholder="Etiqueta (ej: OFERTA RELAMPAGO)" className="input text-xs" />
            <div className="flex gap-2">
              <button onClick={() => setOfferModal(null)} className="btn btn-outline flex-1 justify-center text-[10px]">CANCELAR</button>
              <button onClick={saveOffer} className="btn btn-primary flex-1 justify-center text-[10px]">GUARDAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
