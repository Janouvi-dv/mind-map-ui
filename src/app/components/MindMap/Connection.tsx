import React from 'react';
import { motion } from 'motion/react';
import { Position } from '../../types';

interface ConnectionProps {
  id: string;
  start: Position;
  end: Position;
  color?: string;
}

export const Connection: React.FC<ConnectionProps> = ({ id, start, end, color = '#0f172a' }) => {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  
  // Decide if horizontal or vertical flow feels more natural based on positions
  const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
  
  let path = '';
  
  if (isHorizontal) {
    // Horizontal S-curve
    const controlPointOffset = Math.abs(deltaX) * 0.5;
    path = `M ${start.x} ${start.y} C ${start.x + controlPointOffset} ${start.y}, ${end.x - controlPointOffset} ${end.y}, ${end.x} ${end.y}`;
  } else {
    // Vertical S-curve
    const controlPointOffset = Math.abs(deltaY) * 0.5;
    path = `M ${start.x} ${start.y} C ${start.x} ${start.y + controlPointOffset}, ${end.x} ${end.y - controlPointOffset}, ${end.x} ${end.y}`;
  }

  // Smooth out weird loops if nodes are very close? No need for simple demo.

  return (
    <motion.path
      d={path}
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1, d: path }}
      transition={{ 
        pathLength: { duration: 0.5, ease: "easeOut" },
        d: { duration: 0 } // instant update for drag
      }}
    />
  );
};