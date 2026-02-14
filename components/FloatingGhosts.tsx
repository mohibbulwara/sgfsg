
import React from 'react';

export const FloatingGhosts: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      <div className="float-ghost absolute top-20 left-[10%] text-6xl opacity-30 blur-[1px]">👻</div>
      <div className="float-ghost absolute top-60 right-[15%] text-7xl opacity-20 blur-[2px]" style={{ animationDelay: '1s' }}>👻</div>
      <div className="float-ghost absolute bottom-40 left-[20%] text-5xl opacity-25 blur-[1px]" style={{ animationDelay: '0.5s' }}>💀</div>
      <div className="float-ghost absolute bottom-80 right-[5%] text-8xl opacity-15 blur-[3px]" style={{ animationDelay: '2s' }}>🤡</div>
      <div className="float-ghost absolute top-[50%] left-[5%] text-4xl opacity-20" style={{ animationDelay: '1.5s' }}>🦇</div>
    </div>
  );
};
