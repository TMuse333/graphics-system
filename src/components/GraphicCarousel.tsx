'use client';

import { useEffect, useCallback } from 'react';
import type { Graphic, Listing } from '@/lib/types';

type Props = {
  graphics: Graphic[];
  listings: Listing[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

export function GraphicCarousel({ graphics, listings, currentIndex, onIndexChange, onClose }: Props) {
  const graphic = graphics[currentIndex];
  const listing = listings.find(l => l._id === graphic?.listingId);

  const goNext = useCallback(() => {
    if (currentIndex < graphics.length - 1) {
      onIndexChange(currentIndex + 1);
    }
  }, [currentIndex, graphics.length, onIndexChange]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }
  }, [currentIndex, onIndexChange]);

  const handleDownload = useCallback(() => {
    if (graphic?.historyUrl) {
      const link = document.createElement('a');
      link.href = graphic.historyUrl;
      link.download = `${listing?.address.replace(/\s+/g, '-') || 'graphic'}-${graphic.variant}.png`;
      link.click();
    }
  }, [graphic, listing]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          goPrev();
          break;
        case 'ArrowRight':
          goNext();
          break;
        case 'Escape':
          onClose();
          break;
        case 'd':
        case 'D':
          handleDownload();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, onClose, handleDownload]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!graphic) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        style={{
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <p style={{ color: '#fff', fontWeight: 600, marginBottom: '2px' }}>
            {listing?.address || 'Graphic'}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', textTransform: 'capitalize' }}>
            {graphic.variant.replace('-', ' ')}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleDownload}
            style={{
              padding: '8px 16px',
              background: '#22c55e',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Download
          </button>
          <button
            onClick={onClose}
            style={{
              width: '40px',
              height: '40px',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Main image area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 80px',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prev button */}
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          style={{
            position: 'absolute',
            left: '20px',
            width: '48px',
            height: '48px',
            background: currentIndex === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
            color: currentIndex === 0 ? 'rgba(255,255,255,0.3)' : '#fff',
            border: 'none',
            borderRadius: '50%',
            fontSize: '24px',
            cursor: currentIndex === 0 ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ‹
        </button>

        {/* Image */}
        {graphic.historyUrl ? (
          <img
            src={graphic.historyUrl}
            alt={`${listing?.address} - ${graphic.variant}`}
            style={{
              maxWidth: '100%',
              maxHeight: 'calc(100vh - 180px)',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          />
        ) : (
          <div
            style={{
              width: '400px',
              height: '400px',
              background: 'var(--surface)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
            }}
          >
            No preview available
          </div>
        )}

        {/* Next button */}
        <button
          onClick={goNext}
          disabled={currentIndex === graphics.length - 1}
          style={{
            position: 'absolute',
            right: '20px',
            width: '48px',
            height: '48px',
            background: currentIndex === graphics.length - 1 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
            color: currentIndex === graphics.length - 1 ? 'rgba(255,255,255,0.3)' : '#fff',
            border: 'none',
            borderRadius: '50%',
            fontSize: '24px',
            cursor: currentIndex === graphics.length - 1 ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ›
        </button>
      </div>

      {/* Bottom bar - dots */}
      <div
        style={{
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginRight: '16px' }}>
          {currentIndex + 1} of {graphics.length}
        </span>
        {graphics.length <= 20 && graphics.map((_, index) => (
          <button
            key={index}
            onClick={() => onIndexChange(index)}
            style={{
              width: index === currentIndex ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: index === currentIndex ? '#fff' : 'rgba(255,255,255,0.3)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          />
        ))}
      </div>

      {/* Keyboard hints */}
      <div
        style={{
          position: 'absolute',
          bottom: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '16px',
          color: 'rgba(255,255,255,0.4)',
          fontSize: '12px',
        }}
      >
        <span>← → Navigate</span>
        <span>D Download</span>
        <span>ESC Close</span>
      </div>
    </div>
  );
}
