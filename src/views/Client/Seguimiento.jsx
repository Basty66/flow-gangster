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
    PENDIENTE_PAGO: { label: 'Pendiente de Pago', color: 'text-orange', bar: 'bg-orange', width: 'w-1/4' },
    PAGADO: { label: 'Pagado / En Preparacion', color: 'text-purple-light', bar: 'bg-purple', width: 'w-2/4' },
    ENVIADO: { label: 'Enviado', color: 'text-teal', bar: 'bg-teal', width: 'w-3/4' },
    CANCELADO: { label: 'Cancelado', color: 'text-red-400', bar: 'bg-red-400', width: 'w-full' },
  };

  const estado = estadoConfig[resultado?.estado_pedido] || { label: 'Desconocido', color: 'text-neutral-500', bar: 'bg-neutral-600', width: 'w-0' };

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-display font-black text-4xl md:text-5xl tracking-[-0.02em] mb-3">
            <span className="bg-gradient-to-r from-purple-light to-teal bg-clip-text text-transparent">Trackear Pedido</span>
          </h1>
          <p className="text-neutral-500 text-sm">Ingresa tu numero de pedido para ver el estado de envio</p>
        </div>

        <form onSubmit={handleSearch} className="max-w-sm mx-auto mb-12">
          <div className="relative">
            <input value={pedidoId} onChange={(e) => setPedidoId(e.target.value)}
                   placeholder="Numero de pedido"
                   className="input-field pr-12 font-mono text-xs tracking-wider text-center h-12 rounded-xl bg-surface border-neutral-800" />
            <button type="submit" disabled={loading}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center text-neutral-500 hover:text-teal hover:bg-neutral-800/50 transition-all disabled:opacity-50">
              {loading ? (
                <div className="w-3.5 h-3.5 border border-purple border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="text-center animate-fade-in">
            <div className="card p-6 max-w-sm mx-auto">
              <p className="text-orange font-semibold text-sm">{error}</p>
              <p className="text-neutral-500 text-xs mt-2">Verifica el numero e intenta nuevamente</p>
            </div>
          </div>
        )}

        {resultado && (
          <div className="space-y-4 animate-fade-up">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-neutral-500 text-xs">Numero de Pedido</p>
                  <p className="font-mono font-bold text-base text-white">#{resultado.id?.slice(0, 8).toUpperCase()}</p>
                </div>
                <span className={`font-semibold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full border ${estado.color} ${estado.color.replace('text', 'border')}/20 bg-neutral-900`}>
                  {estado.label}
                </span>
              </div>

              <div className="w-full h-1 rounded-full bg-neutral-800 overflow-hidden mb-3">
                <div className={`h-full rounded-full transition-all duration-1000 ${estado.bar} ${estado.width}`} />
              </div>

              <div className="flex justify-between text-[9px] font-medium text-neutral-600 uppercase tracking-wider">
                <span>Pedido</span>
                <span>Pagado</span>
                <span>Enviado</span>
                <span>Entregado</span>
              </div>
            </div>

            <div className="card p-6 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-neutral-500 text-xs">Cliente</p>
                  <p className="font-semibold text-sm text-white">{resultado.cliente_nombre}</p>
                </div>
                <div>
                  <p className="text-neutral-500 text-xs">Total</p>
                  <p className="font-semibold text-sm text-teal">${resultado.total?.toLocaleString('es-CL')}</p>
                </div>
                <div>
                  <p className="text-neutral-500 text-xs">Entrega</p>
                  <p className="font-semibold text-sm text-white">{resultado.tipo_entrega === 'ENVIO_STARKEN' ? 'Envio Starken' : 'Retiro Showroom'}</p>
                </div>
                <div>
                  <p className="text-neutral-500 text-xs">Fecha</p>
                  <p className="font-semibold text-sm text-white">{resultado.created_at ? new Date(resultado.created_at).toLocaleDateString('es-CL') : '-'}</p>
                </div>
              </div>
            </div>

            {resultado.seguimiento_url && (
              <div className="card p-6 text-center border-teal/10">
                <p className="font-semibold text-xs uppercase tracking-[0.1em] text-teal mb-4">Seguimiento Starken</p>
                <a href={resultado.seguimiento_url} target="_blank" rel="noopener noreferrer"
                   className="btn-primary inline-flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
                  Rastrear en Starken
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
