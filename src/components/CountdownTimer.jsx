import { useState, useEffect } from 'react';

export default function CountdownTimer({ endDate, onEnd }) {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    if (!endDate) return;
    const tick = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) { setRemaining(null); onEnd?.(); return; }
      setRemaining(diff);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endDate, onEnd]);

  if (!remaining) return null;

  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="flex items-center gap-2 font-mono">
      <div className="flex items-baseline gap-0.5">
        <span className="text-lg font-bold text-white min-w-[2ch] text-center tabular-nums transition-all duration-200">{pad(h)}</span>
        <span className="text-[#555] text-xs">h</span>
      </div>
      <span className="text-[#555]">:</span>
      <div className="flex items-baseline gap-0.5">
        <span className="text-lg font-bold text-white min-w-[2ch] text-center tabular-nums transition-all duration-200">{pad(m)}</span>
        <span className="text-[#555] text-xs">m</span>
      </div>
      <span className="text-[#555]">:</span>
      <div className="flex items-baseline gap-0.5">
        <span className="text-lg font-bold text-orange min-w-[2ch] text-center tabular-nums transition-all duration-200">{pad(s)}</span>
        <span className="text-[#555] text-xs">s</span>
      </div>
    </div>
  );
}
