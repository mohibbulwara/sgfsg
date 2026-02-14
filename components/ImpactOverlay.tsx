
import React from 'react';
import { SlapImpact } from '../types';

interface ImpactOverlayProps {
  impacts: SlapImpact[];
}

export const ImpactOverlay: React.FC<ImpactOverlayProps> = ({ impacts }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {impacts.map((impact) => (
        <div
          key={impact.id}
          className="absolute impact-text font-comic text-4xl md:text-6xl text-yellow-400 neon-red italic"
          style={{ left: impact.x, top: impact.y }}
        >
          {impact.text}
        </div>
      ))}
    </div>
  );
};
