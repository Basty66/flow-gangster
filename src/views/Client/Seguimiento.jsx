import { useState } from 'react';

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
    PENDIENTE_PAGO: { label: 'Pendiente de Pago', color: 'text-yellow-400' },
    PAGADO: { label: 'Pagado - En Preparación', color: 'text-neon-cyan' },
    ENVIADO: { label: 'Enviado', color: 'text-neon-cyan' },
    CANCELADO: { label: 'Cancelado', color: 'text-red-500' },
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 w-full">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-black mb-4">TRACKING</h1>
          <p className="text-white/60">Ingresá tu número de pedido para ver el estado</p>
        </div>

        <div className="flex gap-3 mb-8">
          <input value={pedidoId} onChange={(e) => setPedidoId(e.target.value)}
                 placeholder="Ej: 123e4567-e89b-12d3-a456-426614174000"
                 className="input-field flex-1 text-sm" />
          <button onClick={buscar} disabled={loading}
                  className="btn-primary text-sm px-6 py-3">
            {loading ? '...' : 'BUSCAR'}
          </button>
        </div>

        {error && (
          <div className="card-product p-6 text-center">
            <p className="text-fire-orange font-black text-lg">{error}</p>
            <p className="text-white/50 text-sm mt-2">Revisá el número e intentá de nuevo</p>
          </div>
        )}

        {resultado && (
          <div className="card-product p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-lg">Pedido #{resultado.id?.slice(0, 8)}</h2>
              {resultado.estado_pedido && (
                <span className={`font-black text-sm uppercase tracking-wider ${estados[resultado.estado_pedido]?.color || 'text-white'}`}>
                  {estados[resultado.estado_pedido]?.label || resultado.estado_pedido}
                </span>
              )}
            </div>

            <p className="text-white/60 text-sm">Cliente: {resultado.cliente_nombre}</p>
            <p className="text-white/60 text-sm">Total: ${resultado.total?.toLocaleString('es-CL')}</p>
            <p className="text-white/60 text-sm">Tipo: {resultado.tipo_entrega === 'ENVIO_STARKEN' ? 'Envío Starken' : 'Retiro Showroom'}</p>

            {resultado.seguimiento_url && (
              <a href={resultado.seguimiento_url} target="_blank" rel="noreferrer"
                 className="btn-primary w-full text-center block text-sm mt-4">
                📦 TRACKEAR EN STARKEN
              </a>
            )}

            {resultado.estado_pedido === 'ENVIADO' && (
              <div className="bg-fire-orange/10 border-2 border-fire-orange p-4 text-center">
                <p className="font-black text-fire-orange text-sm">Código de seguimiento:</p>
                <p className="font-black text-lg">{resultado.codigo_seguimiento}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
