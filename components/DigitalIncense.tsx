
import React from 'react';

const Particle: React.FC<{ style: React.CSSProperties }> = ({ style }) => {
  return <div className="absolute rounded-full bg-red-900/20" style={style} />;
};

export const DigitalIncense: React.FC = () => {
  const particles = Array.from({ length: 25 }).map((_, i) => {
    const size = Math.random() * 5 + 2;
    const duration = Math.random() * 20 + 15;
    const delay = Math.random() * -20;
    const left = Math.random() * 100;
    
    const style: React.CSSProperties = {
      width: `${size}px`,
      height: `${size}px`,
      left: `${left}%`,
      animation: `rise ${duration}s infinite linear`,
      animationDelay: `${delay}s`,
      opacity: Math.random() * 0.5 + 0.1,
    };
    
    return <Particle key={i} style={style} />;
  });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes rise {
          0% {
            transform: translateY(100vh) scale(0.5);
            opacity: 0;
          }
          10% {
             opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-10vh) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
      {particles}
    </div>
  );
};
