import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const ESTADOS = ['PENDIENTE_PAGO', 'PAGADO', 'ENVIADO', 'CANCELADO'];

export default function Dashboard() {
  const { getAuthHeaders } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [trackingModal, setTrackingModal] = useState(null);
  const [codigoTracking, setCodigoTracking] = useState('');
  const [error, setError] = useState('');

  const fetchPedidos = async (estado) => {
    setLoading(true);
    setError('');
    try {
      const url = estado ? `/api/admin/pedidos?estado=${estado}` : '/api/admin/pedidos';
      const res = await fetch(url, { headers: { ...getAuthHeaders() } });
      const data = await res.json();
      if (res.ok) setPedidos(data);
      else setError(data.error || 'Error al cargar pedidos');
    } catch (e) { setError('Error de conexión'); }
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

  return (
    <div className="max-w-7xl mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <p className="font-display font-bold text-sm text-white tracking-[0.08em] uppercase">Pedidos</p>
        <p className="text-[#555] font-mono text-[9px] tracking-[0.15em] uppercase">{pedidos.length} pedidos</p>
      </div>

      <div className="flex flex-wrap gap-1 mb-6">
        <button onClick={() => setFiltro('')}
                className={`px-3 py-1.5 text-[10px] font-bold tracking-[0.1em] uppercase border transition-all ${
                  !filtro ? 'bg-orange text-black border-orange' : 'border-[#333] text-[#555] hover:text-white hover:border-[#666]'
                }`}>TODOS</button>
        {ESTADOS.map((e) => (
          <button key={e} onClick={() => setFiltro(e)}
                  className={`px-3 py-1.5 text-[10px] font-bold tracking-[0.1em] uppercase border transition-all ${
                    filtro === e ? 'bg-orange text-black border-orange' : 'border-[#333] text-[#555] hover:text-white hover:border-[#666]'
                  }`}>
            {e.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 border border-red-900/30 bg-red-950/20">
          <p className="text-red-400 text-xs font-mono">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20">
          <div className="w-6 h-6 border border-orange border-t-transparent animate-spin mx-auto mb-3" />
          <p className="font-mono text-[9px] text-[#555] tracking-[0.2em] uppercase">Cargando</p>
        </div>
      ) : pedidos.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display font-black text-5xl text-[#1a1a1a]">VACIO</p>
          <p className="text-[#555] text-sm mt-3">No hay pedidos {filtro ? `en ${filtro.replace(/_/g, ' ').toLowerCase()}` : 'aun'}</p>
        </div>
      ) : (
        <div className="space-y-1">
          {pedidos.map((p) => (
            <div key={p.id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-white font-bold">#{p.id?.slice(0, 8)}</span>
                    <span className={`font-mono text-[9px] font-bold tracking-[0.1em] uppercase px-1.5 py-0.5 border ${
                      p.estado_pedido === 'PENDIENTE_PAGO' ? 'text-orange border-orange/20 bg-orange/5' :
                      p.estado_pedido === 'PAGADO' ? 'text-white border-[#555]' :
                      p.estado_pedido === 'ENVIADO' ? 'text-orange border-orange/20' :
                      'text-[#444] border-[#222]'
                    }`}>
                      {p.estado_pedido?.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="font-display font-bold text-sm text-white">{p.cliente_nombre}</p>
                  <p className="text-[#555] text-xs mt-0.5">
                    {p.tipo_entrega === 'ENVIO_STARKEN' ? 'Envio Starken' : 'Retiro'} | {p.metodo_pago === 'TRANSFERENCIA' ? 'Transferencia' : 'Efectivo'}
                  </p>
                  <p className="font-display font-bold text-base text-orange mt-1">${p.total?.toLocaleString('es-CL')}</p>
                  {p.detalle?.length > 0 && (
                    <div className="text-[#555] text-xs space-y-0.5 mt-1">
                      {p.detalle.map((d, i) => <p key={i}>{d.producto_nombre || ''} — Talle {d.talle} x {d.cantidad}</p>)}
                    </div>
                  )}
                  {p.codigo_seguimiento && <p className="text-[#666] text-xs mt-1 font-mono">Tracking: {p.codigo_seguimiento}</p>}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {p.estado_pedido === 'PENDIENTE_PAGO' && (
                    <>
                      <button onClick={() => updateEstado(p.id, 'PAGADO')}
                              className="px-3 py-1.5 text-[9px] font-bold tracking-[0.1em] uppercase border border-[#333] text-white hover:border-[#555] transition-all">APROBAR</button>
                      <button onClick={() => updateEstado(p.id, 'CANCELADO')}
                              className="px-3 py-1.5 text-[9px] font-bold tracking-[0.1em] uppercase border border-[#333] text-[#555] hover:border-[#666] transition-all">CANCELAR</button>
                    </>
                  )}
                  {p.estado_pedido === 'PAGADO' && (
                    <button onClick={() => setTrackingModal(p.id)}
                            className="px-3 py-1.5 text-[9px] font-bold tracking-[0.1em] uppercase border border-orange/30 text-orange hover:bg-orange hover:text-black transition-all">DESPACHAR</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {trackingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
             onClick={() => setTrackingModal(null)}
             style={{ animation: 'fadeUp 0.2s ease-out' }}>
          <div className="card p-6 w-full max-w-md space-y-4"
               onClick={(e) => e.stopPropagation()}>
            <p className="font-display font-bold text-sm text-white tracking-[0.08em] uppercase">Codigo Starken</p>
            <input value={codigoTracking} onChange={(e) => setCodigoTracking(e.target.value)}
                   placeholder="N de Orden de Flete" className="input text-xs" />
            <div className="flex gap-2">
              <button onClick={() => setTrackingModal(null)} className="btn btn-outline flex-1 justify-center text-[10px]">CANCELAR</button>
              <button onClick={() => updateEstado(trackingModal, 'ENVIADO', codigoTracking)}
                      disabled={!codigoTracking} className="btn btn-primary flex-1 justify-center text-[10px]">CONFIRMAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
