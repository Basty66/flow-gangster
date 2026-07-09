import { useState } from 'react';

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

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
    PENDIENTE_PAGO: { label: 'Pendiente de Pago', color: 'text-orange', bar: 'bg-orange', width: 'w-1/4' },
    PAGADO: { label: 'Pagado / En Preparacion', color: 'text-purple', bar: 'bg-purple', width: 'w-2/4' },
    ENVIADO: { label: 'Enviado', color: 'text-cyan', bar: 'bg-cyan', width: 'w-3/4' },
    CANCELADO: { label: 'Cancelado', color: 'text-red-400', bar: 'bg-red-400', width: 'w-full' },
  };

  const estado = estadoConfig[resultado?.estado_pedido] || { label: 'Desconocido', color: 'text-[#525252]', bar: 'bg-[#525252]', width: 'w-0' };

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-[-0.02em] mb-3 text-gradient-purple-cyan">
            TRACKEAR PEDIDO
          </h1>
          <p className="text-[#525252] text-sm font-body">Ingresa tu numero de pedido para ver el estado de envio</p>
        </div>

        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-12">
          <div className="relative">
            <input value={pedidoId} onChange={(e) => setPedidoId(e.target.value)}
                   placeholder="Numero de pedido (UUID)"
                   className="input-field pr-12 font-mono text-sm tracking-wider text-center h-14 rounded-2xl bg-white/[0.02] border-white/[0.06] focus:border-purple/30" />
            <button type="submit" disabled={loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center
                             text-[#525252] hover:text-cyan hover:bg-white/[0.06] transition-all duration-300 disabled:opacity-50">
              {loading ? (
                <div className="w-4 h-4 border border-purple border-t-transparent rounded-full animate-spin" />
              ) : (
                <SearchIcon />
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="text-center animate-fade-in">
            <div className="liquid-card p-8 max-w-md mx-auto border-red-400/10">
              <p className="text-orange font-bold text-sm">{error}</p>
              <p className="text-[#525252] text-xs mt-2 font-body">Verifica el numero e intenta nuevamente</p>
            </div>
          </div>
        )}

        {resultado && (
          <div className="animate-fade-up space-y-6">
            <div className="liquid-card p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[#525252] text-xs font-body">Numero de Pedido</p>
                  <p className="font-mono font-bold text-lg text-[#fafafa]">#{resultado.id?.slice(0, 8).toUpperCase()}</p>
                </div>
                <span className={`font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-full border ${estado.color} ${estado.color.replace('text', 'border')}/20 bg-white/[0.02]`}>
                  {estado.label}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden mb-4">
                <div className={`h-full rounded-full transition-all duration-1000 ${estado.bar} ${estado.width}`} />
              </div>

              <div className="flex justify-between text-[10px] font-medium text-[#525252] uppercase tracking-wider">
                <span>Pedido</span>
                <span>Pagado</span>
                <span>Enviado</span>
                <span>Entregado</span>
              </div>
            </div>

            <div className="liquid-card p-8 space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[#525252] text-xs font-body">Cliente</p>
                  <p className="font-bold text-sm text-[#fafafa]">{resultado.cliente_nombre}</p>
                </div>
                <div>
                  <p className="text-[#525252] text-xs font-body">Total</p>
                  <p className="font-bold text-sm text-cyan">${resultado.total?.toLocaleString('es-CL')}</p>
                </div>
                <div>
                  <p className="text-[#525252] text-xs font-body">Entrega</p>
                  <p className="font-bold text-sm text-[#fafafa]">{resultado.tipo_entrega === 'ENVIO_STARKEN' ? 'Envio Starken' : 'Retiro Showroom'}</p>
                </div>
                <div>
                  <p className="text-[#525252] text-xs font-body">Fecha</p>
                  <p className="font-bold text-sm text-[#fafafa]">{resultado.created_at ? new Date(resultado.created_at).toLocaleDateString('es-CL') : '-'}</p>
                </div>
              </div>
            </div>

            {resultado.seguimiento_url && (
              <div className="liquid-card p-8 text-center border-cyan/10">
                <p className="font-bold text-xs uppercase tracking-[0.15em] text-cyan mb-4">Seguimiento Starken</p>
                <a href={resultado.seguimiento_url} target="_blank" rel="noopener noreferrer"
                   className="btn-primary text-sm inline-flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
                  RASTREAR EN STARKEN
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
