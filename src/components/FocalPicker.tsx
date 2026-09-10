'use client';

import { useState, useRef } from 'react';

type Props = {
  imageUrl: string;
  focal: { x: number; y: number };
  onFocalChange: (focal: { x: number; y: number }) => void;
};

export function FocalPicker({ imageUrl, focal, onFocalChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    onFocalChange({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handleMouseDown = () => setDragging(true);
  const handleMouseUp = () => setDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;
    handleClick(e);
  };

  return (
    <div
      ref={containerRef}
      className="focal-picker"
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <img
        src={imageUrl}
        alt="Set focal point"
        draggable={false}
        style={{ userSelect: 'none' }}
      />
      <div
        className="focal-point"
        style={{
          left: `${focal.x}%`,
          top: `${focal.y}%`,
        }}
      />
    </div>
  );
}
