import React, { useMemo } from 'react';
import { ASSET_IMAGES } from '../assets/assetPaths';

interface AnimatedBackgroundProps {
  scene?: 'mascots' | 'school' | 'park';
  intensity?: 'subtle' | 'vibrant';
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  scene = 'mascots',
  intensity = 'vibrant',
}) => {
  // Generate stable random particle positions
  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${(i * 5.5 + 3) % 94}%`,
      size: `${(i % 3) * 3 + 4}px`,
      duration: `${14 + (i % 7) * 2}s`,
      delay: `${(i * 1.3) % 12}s`,
      opacity: 0.25 + (i % 4) * 0.15,
      color:
        i % 3 === 0
          ? 'bg-amber-400'
          : i % 3 === 1
          ? 'bg-emerald-400'
          : 'bg-sky-400',
    }));
  }, []);

  const imageSrc =
    scene === 'mascots'
      ? ASSET_IMAGES.heroMascots
      : scene === 'school'
      ? ASSET_IMAGES.schoolScene
      : ASSET_IMAGES.parkScene;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Parallax Breathing Backdrop Image */}
      <img
        src={imageSrc}
        alt="Background Atmosphere"
        className="w-full h-full object-cover object-center animate-bg-drift opacity-40 scale-105"
      />

      {/* Atmospheric Ambient Glowing Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-aura" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-aura" style={{ animationDelay: '1.4s' }} />
      <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-aura" style={{ animationDelay: '2.8s' }} />

      {/* Floating Sparkle Particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className={`floating-particle rounded-full ${p.color} shadow-[0_0_8px_currentColor]`}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: p.opacity,
          }}
        />
      ))}

      {/* High-Contrast Gradient Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50" />
    </div>
  );
};
