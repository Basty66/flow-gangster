import { useState } from 'react';

const ESTADOS = {
  PENDIENTE_PAGO: { label: 'Pendiente', desc: 'Pedido recibido, esperando pago', color: '#555' },
  PAGADO: { label: 'Pagado', desc: 'Pago confirmado, preparando pedido', color: '#555' },
  ENVIADO: { label: 'Enviado', desc: 'Producto en camino', color: '#ff5a00' },
  ENTREGADO: { label: 'Entregado', desc: 'Pedido completado', color: '#fff' },
  CANCELADO: { label: 'Cancelado', desc: 'Pedido cancelado', color: '#444' },
};

const STEP_MAP = ['PENDIENTE_PAGO', 'PAGADO', 'ENVIADO', 'ENTREGADO'];

export default function Seguimiento() {
  const [codigo, setCodigo] = useState('');
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const buscar = async () => {
    if (!codigo.trim()) { setError('Ingresa un ID de pedido'); return; }
    setLoading(true);
    setError('');
    setPedido(null);
    try {
      const r = await fetch(`/api/seguimiento?pedido_id=${encodeURIComponent(codigo.trim())}`);
      if (!r.ok) { const d = await r.json(); throw new Error(d.error || 'No encontrado'); }
      const data = await r.json();
      setPedido(data);
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  const isCanceled = pedido?.estado_pedido === 'CANCELADO';
  const currentIdx = isCanceled ? -1 : STEP_MAP.indexOf(pedido?.estado_pedido);
  const estadoInfo = pedido ? ESTADOS[pedido.estado_pedido] || { label: pedido.estado_pedido, desc: '', color: '#555' } : null;

  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#333] mb-5">
            <span className="w-1 h-1 bg-orange" />
            <span className="text-[#666] font-mono text-[9px] tracking-[0.2em] uppercase">Tracking</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-[-0.03em] mb-3">
            DONDE ESTA MI <span className="text-orange">PEDIDO</span>
          </h1>
          <p className="text-[#666] text-sm">Ingresa el ID de tu pedido para ver el estado</p>
        </div>

        <div className="flex gap-0 mb-8">
          <input value={codigo} onChange={(e) => setCodigo(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && buscar()}
                 placeholder="ID del pedido (UUID)"
                 className="input flex-1 text-sm border-r-0 font-mono" />
          <button onClick={buscar} disabled={loading}
                  className={`px-6 py-3 text-xs font-bold tracking-[0.1em] uppercase bg-orange text-black hover:bg-orange-light transition-colors duration-150 ${loading ? 'opacity-30' : ''}`}>
            {loading ? '...' : 'BUSCAR'}
          </button>
        </div>

        {error && (
          <div className="border border-[#333] px-4 py-3 mb-6">
            <p className="text-[#666] text-sm">{error}</p>
          </div>
        )}

        {pedido && (
          <div className="border border-[#333]">
            <div className="p-6 border-b border-[#333]">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-mono text-[9px] text-[#555] tracking-[0.15em] uppercase mb-1">Pedido</p>
                  <p className="font-display font-black text-3xl text-white tracking-[-0.02em]">{pedido.id?.slice(0, 8)}</p>
                </div>
                <span className="px-3 py-1 text-[10px] font-bold tracking-[0.1em] uppercase border border-[#333]"
                      style={{ color: estadoInfo?.color, borderColor: estadoInfo?.color + '33' }}>
                  {estadoInfo?.label}
                </span>
              </div>
              <p className="text-[#666] text-sm">{estadoInfo?.desc}</p>
            </div>

            {/* Progress bar */}
            {!isCanceled && (
              <div className="px-6 py-6 border-b border-[#333]">
                <div className="flex justify-between mb-3">
                  {STEP_MAP.map((s, i) => {
                    const info = ESTADOS[s];
                    return (
                      <div key={s} className="text-center flex-1">
                        <div className={`w-3 h-3 mx-auto mb-1.5 transition-all duration-150 ${
                          i <= currentIdx ? 'bg-orange' : 'bg-[#222]'
                        }`} />
                        <p className={`text-[8px] font-bold tracking-[0.1em] uppercase ${
                          i <= currentIdx ? 'text-white' : 'text-[#444]'
                        }`}>{info.label}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="h-px bg-[#222] mt-[-14px] -z-10 relative">
                  <div className="h-px bg-orange transition-all duration-300"
                       style={{ width: currentIdx >= 0 ? `${(currentIdx / (STEP_MAP.length - 1)) * 100}%` : 0 }} />
                </div>
              </div>
            )}

            {/* Order info */}
            <div className="p-6 space-y-4">
              <p className="font-mono text-[9px] text-[#555] tracking-[0.15em] uppercase">Detalle</p>
              <div className="space-y-3">
                {pedido.items?.map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-[#222] pb-2">
                    <div>
                      <p className="font-display text-sm text-white">{item.nombre}</p>
                      <p className="font-mono text-[8px] text-[#555] tracking-[0.1em] uppercase">{item.marca} — Talle {item.talle}</p>
                    </div>
                    <p className="font-display text-sm text-white">x{item.cantidad}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between border-t border-[#333] pt-3">
                <p className="text-[#666] text-xs">Total</p>
                <p className="font-display font-bold text-orange">
                  ${Number(pedido.total || 0).toLocaleString('es-CL')}
                </p>
              </div>
              <div className="text-[#555] text-xs space-y-1 pt-2">
                <p><span className="text-[#666]">Cliente:</span> {pedido.cliente_nombre}</p>
                {pedido.direccion && <p><span className="text-[#666]">Envio:</span> {pedido.direccion}, {pedido.comuna}, {pedido.region}</p>}
                {pedido.seguimiento_url && (
                  <p className="mt-3">
                    <span className="text-[#666]">Starken:</span>{' '}
                    <a href={pedido.seguimiento_url} target="_blank" rel="noopener noreferrer"
                       className="text-orange underline hover:no-underline transition-all duration-150">
                      Trackear envio
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
