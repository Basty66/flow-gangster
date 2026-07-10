import { useEffect, useState } from 'react';

export default function PageTransition({ children, locationKey }) {
  const [state, setState] = useState('enter');

  useEffect(() => {
    setState('exit');
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setState('enter'));
    });
    return () => cancelAnimationFrame(raf);
  }, [locationKey]);

  return (
    <div
      className="transition-all duration-300"
      style={{
        opacity: state === 'enter' ? 1 : 0,
        transform: state === 'enter' ? 'translateY(0)' : 'translateY(12px)',
      }}
    >
      {children}
    </div>
  );
}
