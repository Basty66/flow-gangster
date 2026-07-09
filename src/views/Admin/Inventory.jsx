import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import ImageUploader from '../../components/ImageUploader';
import { useAuth } from '../../context/AuthContext';

const TALLES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const MinusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
);

export default function Inventory() {
  const { getAuthHeaders } = useAuth();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nombre: '', marca: '', precio: '', descripcion: '', imagen_url: '',
    modalidad: 'STOCK', tiempo_espera_dias: '15',
    talles: TALLES.map((t) => ({ talle: t, cantidad: '0' })),
  });

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/productos', { headers: { ...getAuthHeaders() } });
      const data = await res.json();
      if (res.ok) setProductos(data);
    } catch (e) { console.error(e); }
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

  return (
    <AdminLayout>
      <button onClick={() => setShowForm(!showForm)}
              className="btn-primary text-[10px] mb-8 flex items-center gap-2">
        {showForm ? 'CERRAR' : <><PlusIcon /> NUEVO PRODUCTO</>}
      </button>

      {showForm && (
        <form onSubmit={createProducto} className="glass-card p-8 mb-10 space-y-6 animate-fade-in">
          <h2 className="font-display font-bold text-lg tracking-[-0.02em]">Nuevo Producto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                     placeholder="Nombre del modelo *" className="input-field" required />
              <input value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })}
                     placeholder="Marca *" className="input-field" required />
              <input value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })}
                     type="number" placeholder="Precio en CLP *" className="input-field" required />
              <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                        placeholder="Descripcion del producto" className="input-field" rows={4} />
            </div>
            <div className="space-y-4">
              <ImageUploader currentUrl={form.imagen_url} onUpload={(url) => setForm({ ...form, imagen_url: url })} />
              <div className="flex gap-3">
                <button type="button" onClick={() => setForm({ ...form, modalidad: 'STOCK' })}
                        className={`flex-1 py-3.5 border font-bold text-xs uppercase tracking-wider transition-all ${form.modalidad === 'STOCK' ? 'border-cyan text-cyan' : 'border-white/10 text-[#525252] hover:border-white/30'}`}>
                  STOCK FISICO
                </button>
                <button type="button" onClick={() => setForm({ ...form, modalidad: 'ENCARGO' })}
                        className={`flex-1 py-3.5 border font-bold text-xs uppercase tracking-wider transition-all ${form.modalidad === 'ENCARGO' ? 'border-orange text-orange bg-orange/5' : 'border-white/10 text-[#525252] hover:border-white/30'}`}>
                  POR ENCARGO
                </button>
              </div>
              {form.modalidad === 'ENCARGO' && (
                <input value={form.tiempo_espera_dias} onChange={(e) => setForm({ ...form, tiempo_espera_dias: e.target.value })}
                       type="number" placeholder="Dias de espera estimados" className="input-field" />
              )}
            </div>
          </div>
          {form.modalidad === 'STOCK' && (
            <div>
              <p className="font-bold uppercase text-xs tracking-[0.15em] mb-4 text-[#525252]">Stock por talle</p>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {form.talles.map((t, idx) => (
                  <div key={t.talle} className="text-center">
                    <p className="text-xs font-bold text-[#525252] mb-1">{t.talle}</p>
                    <input value={t.cantidad} onChange={(e) => { const nt = [...form.talles]; nt[idx].cantidad = e.target.value; setForm({ ...form, talles: nt }); }}
                           type="number" min="0" className="input-field text-center text-xs p-2" />
                  </div>
                ))}
              </div>
            </div>
          )}
          <button type="submit" className="btn-primary w-full text-center text-sm">
            {form.modalidad === 'ENCARGO' ? 'PUBLICAR PRE-ORDER' : 'CREAR PRODUCTO'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border border-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-bold tracking-widest text-[#525252]">CARGANDO</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productos.map((p) => (
            <div key={p.id} className="glass-card overflow-hidden group transition-all duration-300">
              <div className="flex">
                <div className="w-28 h-28 flex-shrink-0 overflow-hidden bg-surface">
                  <img src={p.imagen_url} alt={p.nombre}
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                       onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
                <div className="p-4 flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {p.modalidad === 'STOCK' ? <span className="badge-stock text-[8px]">STOCK</span> : <span className="badge-preorder text-[8px]">ENCARGO</span>}
                      </div>
                      <p className="font-bold text-sm truncate">{p.nombre}</p>
                      <p className="text-[#525252] text-xs">{p.marca}</p>
                    </div>
                    <p className="text-cyan font-bold text-sm flex-shrink-0">${p.precio?.toLocaleString('es-CL')}</p>
                  </div>
                </div>
              </div>
              {p.modalidad === 'STOCK' && p.talles?.length > 0 && (
                <div className="px-4 pb-4 flex flex-wrap gap-1.5">
                  {p.talles.filter((t) => t.talle && t.talle !== 'null').map((t) => (
                    <div key={t.id || t.talle} className="flex items-center gap-1 border border-white/10 px-2 py-1 hover:border-white/30 transition-colors group/talle">
                      <span className="text-[10px] font-bold text-[#525252]">{t.talle}</span>
                      <span className="text-[10px] text-white/10">|</span>
                      <span className={`text-[10px] font-bold ${parseInt(t.cantidad) <= 2 ? 'text-orange' : 'text-[#fafafa]'}`}>{t.cantidad}</span>
                      <div className="flex ml-1 opacity-0 group-hover/talle:opacity-100 transition-opacity">
                        <button onClick={() => updateStock(p.id, t.talle, 'SUMAR')}
                                className="text-cyan font-bold text-xs px-0.5 hover:bg-cyan/20 transition-colors">+</button>
                        <button onClick={() => updateStock(p.id, t.talle, 'RESTAR')}
                                className="text-red-400 font-bold text-xs px-0.5 hover:bg-red-400/20 transition-colors">-</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
