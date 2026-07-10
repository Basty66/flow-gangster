import { useEffect, useState } from 'react';

export default function PageTransition({ children, locationKey }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
  }, [locationKey]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.25s ease-out',
      }}
    >
      {children}
    </div>
  );
}
