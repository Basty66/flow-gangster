import { useState } from 'react';

export default function Seguimiento() {
  const [pedidoId, setPedidoId] = useState('');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!pedidoId.trim()) return;
    setLoading(true);
    setError('');
    setResultado(null);
    try {
      const res = await fetch(`/api/seguimiento?pedido_id=${pedidoId.trim()}`);
      const data = await res.json();
      if (res.ok) setResultado(data);
      else setError(data.error || 'Pedido no encontrado');
    } catch {
      setError('Error de conexion');
    }
    setLoading(false);
  };

  const estadoConfig = {
    PENDIENTE_PAGO: { label: 'Pendiente de Pago', color: '#f59e0b', width: 'w-1/4' },
    PAGADO: { label: 'Pagado / En Preparacion', color: '#7c3aed', width: 'w-2/4' },
    ENVIADO: { label: 'Enviado', color: '#2dd4bf', width: 'w-3/4' },
    CANCELADO: { label: 'Cancelado', color: '#ef4444', width: 'w-full' },
  };

  const estado = estadoConfig[resultado?.estado_pedido] || { label: 'Desconocido', color: '#666', width: 'w-0' };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-lg mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-display font-black text-4xl md:text-5xl tracking-[-0.02em] mb-3 text-purple">Trackear Pedido</h1>
          <p className="text-[#666] text-sm">Ingresa tu numero de pedido</p>
        </div>

        <form onSubmit={handleSearch} className="max-w-sm mx-auto mb-10">
          <div className="relative">
            <input value={pedidoId} onChange={(e) => setPedidoId(e.target.value)}
                   placeholder="Numero de pedido"
                   className="input pr-12 font-mono text-xs tracking-wider text-center h-12 rounded" />
            <button type="submit" disabled={loading}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded flex items-center justify-center text-[#555] hover:text-[#f5f5f5] hover:bg-surface2 transition-all disabled:opacity-50">
              {loading ? (
                <div className="w-3 h-3 border border-purple border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="text-center animate-fade-in">
            <div className="card p-5 max-w-sm mx-auto">
              <p className="text-amber font-medium text-sm">{error}</p>
              <p className="text-[#555] text-xs mt-1">Verifica e intenta nuevamente</p>
            </div>
          </div>
        )}

        {resultado && (
          <div className="space-y-4 animate-fade-up">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[#666] text-xs">Pedido</p>
                  <p className="font-mono font-bold text-base text-[#f5f5f5]">#{resultado.id?.slice(0, 8).toUpperCase()}</p>
                </div>
                <span className="text-xs font-medium uppercase tracking-wider px-3 py-1.5 rounded border" style={{ color: estado.color, borderColor: estado.color + '30', background: estado.color + '10' }}>
                  {estado.label}
                </span>
              </div>

              <div className="w-full h-1 rounded-full bg-[#2a2a2a] overflow-hidden mb-3">
                <div className={`h-full rounded-full transition-all duration-1000 ${estado.width}`} style={{ background: estado.color }} />
              </div>

              <div className="flex justify-between text-[8px] font-medium text-[#555] uppercase tracking-wider">
                <span>Pedido</span><span>Pagado</span><span>Enviado</span><span>Entregado</span>
              </div>
            </div>

            <div className="card p-6">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[#666] text-xs">Cliente</p><p className="font-semibold text-sm text-[#f5f5f5]">{resultado.cliente_nombre}</p></div>
                <div><p className="text-[#666] text-xs">Total</p><p className="font-semibold text-sm text-[#f5f5f5]">${resultado.total?.toLocaleString('es-CL')}</p></div>
                <div><p className="text-[#666] text-xs">Entrega</p><p className="font-semibold text-sm text-[#f5f5f5]">{resultado.tipo_entrega === 'ENVIO_STARKEN' ? 'Starken' : 'Showroom'}</p></div>
                <div><p className="text-[#666] text-xs">Fecha</p><p className="font-semibold text-sm text-[#f5f5f5]">{resultado.created_at ? new Date(resultado.created_at).toLocaleDateString('es-CL') : '-'}</p></div>
              </div>
            </div>

            {resultado.seguimiento_url && (
              <div className="card p-6 text-center border-[#2dd4bf]/10">
                <p className="font-semibold text-xs uppercase tracking-[0.08em] text-[#2dd4bf] mb-4">Starken</p>
                <a href={resultado.seguimiento_url} target="_blank" rel="noopener noreferrer"
                   className="btn btn-primary inline-flex items-center gap-2">
                  Rastrear
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
