import { useMemo } from 'react';

const STARS_COUNT = 120;
const SHOOTING_STARS = 3;

export default function StarsBackground() {
  const stars = useMemo(() => {
    return Array.from({ length: STARS_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() < 0.2 ? 2.5 : Math.random() < 0.5 ? 2 : 1.2,
      delay: Math.random() * 8,
      duration: 2 + Math.random() * 4,
    }));
  }, []);

  const shootingStars = useMemo(() => {
    return Array.from({ length: SHOOTING_STARS }, (_, i) => ({
      id: i,
      top: 5 + Math.random() * 40,
      left: 50 + Math.random() * 45,
      delay: 5 + i * 8 + Math.random() * 5,
      duration: 2 + Math.random(),
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
      {shootingStars.map((s) => (
        <div
          key={s.id}
          className="shooting-star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            animation: `shoot ${s.duration}s ease-in ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
