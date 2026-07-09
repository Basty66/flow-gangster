import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import ImageUploader from '../../components/ImageUploader';

const TALLES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

export default function Inventory() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    marca: '',
    precio: '',
    descripcion: '',
    imagen_url: '',
    modalidad: 'STOCK',
    tiempo_espera_dias: '15',
    talles: TALLES.map((t) => ({ talle: t, cantidad: '0' })),
  });

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/productos');
      const data = await res.json();
      setProductos(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchProductos(); }, []);

  const updateStock = async (producto_id, talle, operacion) => {
    try {
      await fetch('/api/admin/stock', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          precio: parseInt(form.precio),
          tiempo_espera_dias: form.modalidad === 'ENCARGO' ? parseInt(form.tiempo_espera_dias) : 0,
          talles: form.modalidad === 'ENCARGO'
            ? form.talles.map((t) => ({ talle: t.talle, cantidad: 999 }))
            : form.talles,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({
          nombre: '', marca: '', precio: '', descripcion: '', imagen_url: '',
          modalidad: 'STOCK', tiempo_espera_dias: '15',
          talles: TALLES.map((t) => ({ talle: t, cantidad: '0' })),
        });
        fetchProductos();
      } else {
        const d = await res.json();
        alert('Error: ' + (d.error || 'desconocido'));
      }
    } catch (e) { console.error(e); }
  };

  return (
    <AdminLayout>
      <button onClick={() => setShowForm(!showForm)}
              className="btn-primary text-sm mb-8">
        {showForm ? '✕ CERRAR' : '+ NUEVO PRODUCTO'}
      </button>

      {showForm && (
        <form onSubmit={createProducto} className="glass-panel p-8 mb-10 space-y-6 border border-neon-cyan/10">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
            <h2 className="font-display text-2xl font-black tracking-tight text-neon-cyan">NUEVO PRODUCTO</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                     placeholder="Nombre del modelo *" className="input-field" required />
              <input value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })}
                     placeholder="Marca *" className="input-field" required />
              <input value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })}
                     type="number" placeholder="Precio en CLP *" className="input-field" required />
              <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                        placeholder="Descripción del producto" className="input-field" rows={4} />
            </div>
            <div className="space-y-4">
              <ImageUploader
                currentUrl={form.imagen_url}
                onUpload={(url) => setForm({ ...form, imagen_url: url })}
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setForm({ ...form, modalidad: 'STOCK' })}
                        className={`flex-1 py-4 border-2 font-black text-sm tracking-[0.15em] uppercase transition-all duration-300 ${
                          form.modalidad === 'STOCK'
                            ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/5'
                            : 'border-white/10 text-white/40 hover:border-white/30'
                        }`}>
                  📦 STOCK FÍSICO
                </button>
                <button type="button" onClick={() => setForm({ ...form, modalidad: 'ENCARGO' })}
                        className={`flex-1 py-4 border-2 font-black text-sm tracking-[0.15em] uppercase transition-all duration-300 ${
                          form.modalidad === 'ENCARGO'
                            ? 'border-fire-orange text-fire-orange bg-fire-orange/5'
                            : 'border-white/10 text-white/40 hover:border-white/30'
                        }`}>
                  🔥 POR ENCARGO
                </button>
              </div>
              {form.modalidad === 'ENCARGO' && (
                <input value={form.tiempo_espera_dias} onChange={(e) => setForm({ ...form, tiempo_espera_dias: e.target.value })}
                       type="number" placeholder="Días de espera estimados" className="input-field" />
              )}
            </div>
          </div>

          {form.modalidad === 'STOCK' && (
            <div>
              <p className="font-black uppercase text-xs tracking-[0.2em] mb-4 text-white/40">Stock por talle</p>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {form.talles.map((t, idx) => (
                  <div key={t.talle} className="text-center">
                    <p className="text-xs font-black text-white/30 mb-1">{t.talle}</p>
                    <input value={t.cantidad} onChange={(e) => {
                      const newTalles = [...form.talles];
                      newTalles[idx].cantidad = e.target.value;
                      setForm({ ...form, talles: newTalles });
                    }} type="number" min="0" className="input-field text-center text-sm p-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary w-full text-center block">
            {form.modalidad === 'ENCARGO' ? '🔥 PUBLICAR PRE-ORDER' : '📦 CREAR PRODUCTO'}
          </button>
        </form>
      )}

      {/* Lista */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-12 h-12 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-black tracking-widest text-white/30">CARGANDO INVENTARIO</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productos.map((p) => (
            <div key={p.id} className="glass-panel border border-white/5 hover:border-neon-cyan/20 transition-all duration-300 overflow-hidden group">
              <div className="flex">
                <div className="w-28 h-28 flex-shrink-0 overflow-hidden">
                  <img src={p.imagen_url} alt={p.nombre}
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-4 flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {p.modalidad === 'STOCK'
                          ? <span className="badge-instant text-[9px]">STOCK</span>
                          : <span className="badge-preorder text-[9px]">ENCARGO</span>}
                      </div>
                      <p className="font-black text-sm truncate">{p.nombre}</p>
                      <p className="text-white/30 text-xs">{p.marca}</p>
                    </div>
                    <p className="text-neon-cyan font-black text-sm flex-shrink-0">${p.precio?.toLocaleString('es-CL')}</p>
                  </div>
                </div>
              </div>

              {p.modalidad === 'STOCK' && p.talles?.length > 0 && (
                <div className="px-4 pb-4 flex flex-wrap gap-1.5">
                  {p.talles.filter((t) => t.talle && t.talle !== 'null').map((t) => (
                    <div key={t.id || t.talle}
                         className="flex items-center gap-1 border border-white/10 px-2 py-1
                                   hover:border-white/30 transition-colors group/talle">
                      <span className="text-[10px] font-black text-white/50">{t.talle}</span>
                      <span className="text-[10px] text-white/20">·</span>
                      <span className={`text-[10px] font-black ${parseInt(t.cantidad) <= 2 ? 'text-fire-orange' : 'text-white/70'}`}>
                        {t.cantidad}
                      </span>
                      <div className="flex ml-1 opacity-0 group-hover/talle:opacity-100 transition-opacity">
                        <button onClick={() => updateStock(p.id, t.talle, 'SUMAR')}
                                className="text-neon-cyan font-black text-xs px-0.5 hover:bg-neon-cyan/20 transition-colors">+</button>
                        <button onClick={() => updateStock(p.id, t.talle, 'RESTAR')}
                                className="text-fire-orange font-black text-xs px-0.5 hover:bg-fire-orange/20 transition-colors">−</button>
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
