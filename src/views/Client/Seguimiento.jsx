import { useState } from 'react';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const TruckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

export default function Seguimiento() {
  const [pedidoId, setPedidoId] = useState('');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const buscar = async () => {
    if (!pedidoId) return;
    setLoading(true);
    setError('');
    setResultado(null);
    try {
      const res = await fetch(`/api/seguimiento?pedido_id=${pedidoId}`);
      const data = await res.json();
      if (res.ok) {
        setResultado(data);
      } else {
        setError(data.error);
      }
    } catch {
      setError('Error al consultar');
    }
    setLoading(false);
  };

  const estados = {
    PENDIENTE_PAGO: { label: 'Pendiente de Pago', color: 'text-amber' },
    PAGADO: { label: 'Pagado - En Preparacion', color: 'text-accent' },
    ENVIADO: { label: 'Enviado', color: 'text-accent' },
    CANCELADO: { label: 'Cancelado', color: 'text-red-400' },
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 w-full">
        <div className="text-center mb-10">
          <h1 className="font-display font-extrabold text-3xl mb-4 tracking-[-0.02em]">TRACKING</h1>
          <p className="text-[#525252] text-sm font-body">Ingresa tu numero de pedido para ver el estado</p>
        </div>

        <div className="flex gap-3 mb-8">
          <input value={pedidoId} onChange={(e) => setPedidoId(e.target.value)}
                 placeholder="Ej: 123e4567-e89b-12d3-a456-426614174000"
                 className="input-field flex-1 text-xs" />
          <button onClick={buscar} disabled={loading}
                  className="btn-primary text-[10px] px-5 py-3">
            {loading ? '...' : 'BUSCAR'}
          </button>
        </div>

        {error && (
          <div className="glass-card p-6 text-center animate-fade-in">
            <p className="text-red-400 font-bold text-sm">{error}</p>
            <p className="text-[#525252] text-xs mt-2 font-body">Revisa el numero e intenta de nuevo</p>
          </div>
        )}

        {resultado && (
          <div className="glass-card p-6 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base">Pedido #{resultado.id?.slice(0, 8)}</h2>
              {resultado.estado_pedido && (
                <span className={`font-bold text-xs uppercase tracking-wider ${estados[resultado.estado_pedido]?.color || 'text-[#525252]'}`}>
                  {estados[resultado.estado_pedido]?.label || resultado.estado_pedido}
                </span>
              )}
            </div>

            <p className="text-[#525252] text-sm font-body">Cliente: {resultado.cliente_nombre}</p>
            <p className="text-[#525252] text-sm font-body">Total: ${resultado.total?.toLocaleString('es-CL')}</p>
            <p className="text-[#525252] text-sm font-body">Tipo: {resultado.tipo_entrega === 'ENVIO_STARKEN' ? 'Envio Starken' : 'Retiro Showroom'}</p>

            {resultado.seguimiento_url && (
              <a href={resultado.seguimiento_url} target="_blank" rel="noreferrer"
                 className="btn-primary w-full text-center block text-xs mt-4 flex items-center justify-center gap-2">
                <TruckIcon />
                TRACKEAR EN STARKEN
              </a>
            )}

            {resultado.estado_pedido === 'ENVIADO' && (
              <div className="glass-card border-amber/10 p-4 text-center">
                <p className="font-bold text-amber text-xs">Codigo de seguimiento:</p>
                <p className="font-bold text-lg tracking-wider">{resultado.codigo_seguimiento}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
