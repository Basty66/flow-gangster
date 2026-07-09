import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

const ESTADOS = ['PENDIENTE_PAGO', 'PAGADO', 'ENVIADO', 'CANCELADO'];

export default function Dashboard() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('PENDIENTE_PAGO');
  const [trackingModal, setTrackingModal] = useState(null);
  const [codigoTracking, setCodigoTracking] = useState('');

  const fetchPedidos = async (estado) => {
    setLoading(true);
    try {
      const url = estado ? `/api/admin/pedidos?estado=${estado}` : '/api/admin/pedidos';
      const res = await fetch(url);
      const data = await res.json();
      setPedidos(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPedidos(filtro); }, [filtro]);

  const updateEstado = async (id, nuevoEstado, codigo) => {
    try {
      const body = { id, estado_pedido: nuevoEstado };
      if (codigo) body.codigo_seguimiento = codigo;

      const res = await fetch('/api/admin/pedidos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setTrackingModal(null);
        setCodigoTracking('');
        fetchPedidos(filtro);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const estadoColor = (estado) => {
    const map = {
      PENDIENTE_PAGO: 'text-yellow-400',
      PAGADO: 'text-neon-cyan',
      ENVIADO: 'text-neon-cyan',
      CANCELADO: 'text-red-500',
    };
    return map[estado] || 'text-white';
  };

  return (
    <AdminLayout>
      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-8">
        {ESTADOS.map((e) => (
          <button key={e} onClick={() => setFiltro(e)}
                  className={`admin-btn ${filtro === e ? 'bg-white text-space-black border-white' : 'bg-transparent text-white'}`}>
            {e.replace(/_/g, ' ')}
          </button>
        ))}
        <button onClick={() => setFiltro('')}
                className={`admin-btn ${!filtro ? 'bg-white text-space-black border-white' : 'bg-transparent text-white'}`}>
          TODOS
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : pedidos.length === 0 ? (
        <div className="text-center py-20 text-white/40 font-black text-xl">No hay pedidos en {filtro || 'esta categoría'}</div>
      ) : (
        <div className="space-y-3">
          {pedidos.map((p) => (
            <div key={p.id} className="card-product p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm">#{p.id?.slice(0, 8)}</span>
                    <span className={`font-black text-xs uppercase tracking-wider ${estadoColor(p.estado_pedido)}`}>
                      {p.estado_pedido?.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="font-black">{p.cliente_nombre}</p>
                  <p className="text-white/60 text-sm">WhatsApp: {p.cliente_whatsapp}</p>
                  <p className="text-white/60 text-sm">
                    {p.tipo_entrega === 'ENVIO_STARKEN' ? '📦 Envío Starken' : '🏬 Retiro Showroom'}
                    {p.metodo_pago === 'TRANSFERENCIA' ? ' | 💳 Transferencia' : ' | 💵 Efectivo'}
                  </p>
                  <p className="text-neon-cyan font-black text-lg">${p.total?.toLocaleString('es-CL')}</p>
                  {p.detalle?.length > 0 && (
                    <div className="text-white/50 text-xs space-y-1">
                      {p.detalle.map((d, i) => (
                        <p key={i}>• {d.talle} × {d.cantidad}</p>
                      ))}
                    </div>
                  )}
                  {p.codigo_seguimiento && (
                    <p className="text-fire-orange text-xs font-bold">Tracking: {p.codigo_seguimiento}</p>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {p.estado_pedido === 'PENDIENTE_PAGO' && (
                    <>
                      <button onClick={() => updateEstado(p.id, 'PAGADO')}
                              className="admin-btn bg-neon-cyan/20 text-neon-cyan border-neon-cyan hover:bg-neon-cyan hover:text-space-black">
                        ✓ APROBAR
                      </button>
                      <button onClick={() => updateEstado(p.id, 'CANCELADO')}
                              className="admin-btn bg-red-500/20 text-red-500 border-red-500 hover:bg-red-500 hover:text-white">
                        ✕ CANCELAR
                      </button>
                    </>
                  )}
                  {p.estado_pedido === 'PAGADO' && (
                    <button onClick={() => setTrackingModal(p.id)}
                            className="admin-btn bg-fire-orange/20 text-fire-orange border-fire-orange hover:bg-fire-orange hover:text-space-black">
                      📦 DESPACHAR
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tracking */}
      {trackingModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
             onClick={() => setTrackingModal(null)}>
          <div className="bg-space-black border-2 border-neon-cyan p-6 w-full max-w-md space-y-4"
               onClick={(e) => e.stopPropagation()}>
            <h2 className="font-black text-lg">INGRESAR CÓDIGO STARKEN</h2>
            <input value={codigoTracking} onChange={(e) => setCodigoTracking(e.target.value)}
                   placeholder="N° de Orden de Flete" className="input-field" />
            <div className="flex gap-3">
              <button onClick={() => setTrackingModal(null)}
                      className="btn-secondary flex-1 text-sm">CANCELAR</button>
              <button onClick={() => updateEstado(trackingModal, 'ENVIADO', codigoTracking)}
                      disabled={!codigoTracking}
                      className="btn-primary flex-1 text-sm">CONFIRMAR ENVÍO</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
