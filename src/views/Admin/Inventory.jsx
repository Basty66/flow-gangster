import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

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
      }
    } catch (e) { console.error(e); }
  };

  return (
    <AdminLayout>
      <button onClick={() => setShowForm(!showForm)}
              className="btn-primary text-sm mb-8">
        {showForm ? '✕ CERRAR' : '+ NUEVO PRODUCTO'}
      </button>

      {/* Formulario crear producto */}
      {showForm && (
        <form onSubmit={createProducto} className="card-product p-6 mb-8 space-y-4">
          <h2 className="font-black text-lg text-neon-cyan uppercase tracking-wider">Nuevo Producto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                   placeholder="Nombre *" className="input-field" required />
            <input value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })}
                   placeholder="Marca *" className="input-field" required />
            <input value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })}
                   type="number" placeholder="Precio *" className="input-field" required />
            <input value={form.imagen_url} onChange={(e) => setForm({ ...form, imagen_url: e.target.value })}
                   placeholder="URL de imagen *" className="input-field" required />
          </div>
          <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    placeholder="Descripción" className="input-field" rows={3} />

          <div className="flex gap-4">
            <button type="button" onClick={() => setForm({ ...form, modalidad: 'STOCK' })}
                    className={`flex-1 py-3 border-2 font-black text-sm uppercase tracking-wider
                              ${form.modalidad === 'STOCK' ? 'border-neon-cyan text-neon-cyan' : 'border-white/20'}`}>
              Stock Físico
            </button>
            <button type="button" onClick={() => setForm({ ...form, modalidad: 'ENCARGO' })}
                    className={`flex-1 py-3 border-2 font-black text-sm uppercase tracking-wider
                              ${form.modalidad === 'ENCARGO' ? 'border-fire-orange text-fire-orange' : 'border-white/20'}`}>
              Por Encargo
            </button>
          </div>

          {form.modalidad === 'ENCARGO' && (
            <input value={form.tiempo_espera_dias} onChange={(e) => setForm({ ...form, tiempo_espera_dias: e.target.value })}
                   type="number" placeholder="Días de espera estimados" className="input-field" />
          )}

          {form.modalidad === 'STOCK' && (
            <div>
              <p className="font-black uppercase text-sm tracking-wider mb-3">Stock por Talle</p>
              <div className="grid grid-cols-5 gap-2">
                {form.talles.map((t, idx) => (
                  <div key={t.talle} className="text-center">
                    <p className="text-xs font-black text-white/60 mb-1">{t.talle}</p>
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

          <button type="submit" className="btn-primary w-full">
            CREAR PRODUCTO
          </button>
        </form>
      )}

      {/* Lista productos */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="space-y-4">
          {productos.map((p) => (
            <div key={p.id} className="card-product p-4">
              <div className="flex items-start gap-4">
                <img src={p.imagen_url} alt={p.nombre}
                     className="w-16 h-16 object-cover border border-white/10 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black">{p.nombre}</span>
                    {p.modalidad === 'STOCK'
                      ? <span className="badge-instant text-[10px]">STOCK</span>
                      : <span className="badge-preorder text-[10px]">ENCARGO</span>}
                  </div>
                  <p className="text-white/50 text-sm">{p.marca} — ${p.precio?.toLocaleString('es-CL')}</p>
                </div>
              </div>

              {p.modalidad === 'STOCK' && p.talles?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.talles.filter((t) => t.talle).map((t) => (
                    <div key={t.id || t.talle}
                         className="flex items-center gap-1 border border-white/10 px-2 py-1">
                      <span className="text-xs font-black">{t.talle}</span>
                      <span className="text-xs text-white/60">|</span>
                      <span className="text-xs font-black">{t.cantidad}</span>
                      <button onClick={() => updateStock(p.id, t.talle, 'SUMAR')}
                              className="text-neon-cyan font-black text-sm hover:bg-neon-cyan hover:text-space-black px-1 transition-colors">+</button>
                      <button onClick={() => updateStock(p.id, t.talle, 'RESTAR')}
                              className="text-fire-orange font-black text-sm hover:bg-fire-orange hover:text-space-black px-1 transition-colors">−</button>
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
