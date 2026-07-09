import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';

const ESTADOS = ['PENDIENTE_PAGO', 'PAGADO', 'ENVIADO', 'CANCELADO'];

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const TruckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
);

export default function Dashboard() {
  const { getAuthHeaders } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('PENDIENTE_PAGO');
  const [trackingModal, setTrackingModal] = useState(null);
  const [codigoTracking, setCodigoTracking] = useState('');

  const fetchPedidos = async (estado) => {
    setLoading(true);
    try {
      const url = estado ? `/api/admin/pedidos?estado=${estado}` : '/api/admin/pedidos';
      const res = await fetch(url, { headers: { ...getAuthHeaders() } });
      const data = await res.json();
      if (res.ok) setPedidos(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchPedidos(filtro); }, [filtro]);

  const updateEstado = async (id, nuevoEstado, codigo) => {
    try {
      const body = { id, estado_pedido: nuevoEstado };
      if (codigo) body.codigo_seguimiento = codigo;
      const res = await fetch('/api/admin/pedidos', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, body: JSON.stringify(body),
      });
      if (res.ok) { setTrackingModal(null); setCodigoTracking(''); fetchPedidos(filtro); }
    } catch (e) { console.error(e); }
  };

  const estadoColor = (estado) => {
    const map = { PENDIENTE_PAGO: 'text-orange', PAGADO: 'text-purple', ENVIADO: 'text-cyan', CANCELADO: 'text-red-400' };
    return map[estado] || 'text-[#525252]';
  };

  return (
    <AdminLayout>
      <div className="flex flex-wrap gap-2 mb-8">
        {ESTADOS.map((e) => (
          <button key={e} onClick={() => setFiltro(e)}
                  className={`admin-btn ${filtro === e ? 'bg-purple text-white border-purple' : ''}`}>
            {e.replace(/_/g, ' ')}
          </button>
        ))}
        <button onClick={() => setFiltro('')}
                className={`admin-btn ${!filtro ? 'bg-purple text-white border-purple' : ''}`}>TODOS</button>
      </div>

      {loading ? (
        <div className="text-center py-20"><div className="w-8 h-8 border border-purple border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : pedidos.length === 0 ? (
        <div className="text-center py-20 text-[#525252] font-bold text-base">No hay pedidos en {filtro || 'esta categoria'}</div>
      ) : (
        <div className="space-y-3">
          {pedidos.map((p) => (
            <div key={p.id} className="glass-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm font-mono">#{p.id?.slice(0, 8)}</span>
                    <span className={`font-bold text-xs uppercase tracking-wider ${estadoColor(p.estado_pedido)}`}>
                      {p.estado_pedido?.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="font-bold">{p.cliente_nombre}</p>
                  <p className="text-[#525252] text-sm">WhatsApp: {p.cliente_whatsapp}</p>
                  <p className="text-[#525252] text-sm">
                    {p.tipo_entrega === 'ENVIO_STARKEN' ? 'Envio Starken' : 'Retiro Showroom'} | {p.metodo_pago === 'TRANSFERENCIA' ? 'Transferencia' : 'Efectivo'}
                  </p>
                  <p className="text-cyan font-bold text-base">${p.total?.toLocaleString('es-CL')}</p>
                  {p.detalle?.length > 0 && (
                    <div className="text-[#525252] text-xs space-y-0.5 font-body">
                      {p.detalle.map((d, i) => <p key={i}>{d.producto_nombre || ''} &mdash; Talle {d.talle} x {d.cantidad}</p>)}
                    </div>
                  )}
                  {p.codigo_seguimiento && <p className="text-purple text-xs font-bold">Tracking: {p.codigo_seguimiento}</p>}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {p.estado_pedido === 'PENDIENTE_PAGO' && (
                    <>
                      <button onClick={() => updateEstado(p.id, 'PAGADO')}
                              className="admin-btn text-purple border-purple/30 hover:bg-purple/10 hover:border-purple flex items-center gap-1.5">
                        <CheckIcon /> APROBAR
                      </button>
                      <button onClick={() => updateEstado(p.id, 'CANCELADO')}
                              className="admin-btn text-red-400 border-red-400/30 hover:bg-red-400/10 hover:border-red-400 flex items-center gap-1.5">
                        <XIcon /> CANCELAR
                      </button>
                    </>
                  )}
                  {p.estado_pedido === 'PAGADO' && (
                    <button onClick={() => setTrackingModal(p.id)}
                            className="admin-btn text-orange border-orange/30 hover:bg-orange/10 hover:border-orange flex items-center gap-1.5">
                      <TruckIcon /> DESPACHAR
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {trackingModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
             onClick={() => setTrackingModal(null)}>
          <div className="glass-card p-6 w-full max-w-md space-y-4 animate-scale-in"
               onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold text-base">INGRESAR CODIGO STARKEN</h2>
            <input value={codigoTracking} onChange={(e) => setCodigoTracking(e.target.value)}
                   placeholder="N de Orden de Flete" className="input-field font-mono" />
            <div className="flex gap-3">
              <button onClick={() => setTrackingModal(null)} className="btn-secondary flex-1 text-[10px]">CANCELAR</button>
              <button onClick={() => updateEstado(trackingModal, 'ENVIADO', codigoTracking)}
                      disabled={!codigoTracking} className="btn-primary flex-1 text-[10px]">CONFIRMAR ENVIO</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
