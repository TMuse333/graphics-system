'use client';

import { useState } from 'react';
import type { Package, Listing, Graphic, Agent } from '@/lib/types';
import { PACKAGE_LIMITS } from '@/lib/types';

type Props = {
  pkg: Package;
  graphics: Graphic[];
  listings: Listing[];
  agent: Agent;
  onGraphicClick: (graphic: Graphic, index: number, allGraphics: Graphic[]) => void;
};

export function PackageCard({ pkg, graphics, listings, agent, onGraphicClick }: Props) {
  const [expanded, setExpanded] = useState(false);

  const limit = PACKAGE_LIMITS[pkg.type];
  const used = graphics.length;
  const remaining = limit - used;
  const progress = (used / limit) * 100;

  const isCompleted = pkg.status === 'completed';
  const purchaseDate = new Date(pkg.purchasedAt).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      className="card"
      style={{
        padding: 0,
        overflow: 'hidden',
        border: isCompleted ? '1px solid var(--border)' : '1px solid var(--accent)',
      }}
    >
      {/* Header - always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          padding: '16px 20px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          color: 'inherit',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '18px', transition: 'transform 0.2s', transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
              ▶
            </span>
            <span style={{ fontSize: '18px', fontWeight: 600 }}>
              {pkg.type.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </span>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                background: isCompleted ? 'var(--surface)' : 'var(--accent)',
                color: isCompleted ? 'var(--text-muted)' : 'var(--bg)',
              }}
            >
              {isCompleted ? 'Completed' : 'Active'}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            {!isCompleted && (
              <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent)' }}>
                {remaining} <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--text-muted)' }}>remaining</span>
              </span>
            )}
            {isCompleted && (
              <span className="text-muted text-sm">{purchaseDate}</span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1, background: 'var(--surface)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
            <div
              style={{
                background: isCompleted ? 'var(--text-muted)' : 'var(--accent)',
                height: '100%',
                width: `${progress}%`,
                transition: 'width 0.3s',
              }}
            />
          </div>
          <span className="text-muted text-sm" style={{ minWidth: '100px' }}>
            {used} graphics · {listings.length} listings
          </span>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)' }}>
          {graphics.length === 0 ? (
            <p className="text-muted" style={{ padding: '20px 0', textAlign: 'center' }}>
              No graphics yet
            </p>
          ) : (
            <>
              {/* Thumbnail grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                  gap: '8px',
                  paddingTop: '16px',
                }}
              >
                {graphics.map((graphic, index) => (
                  <button
                    key={graphic._id}
                    onClick={() => onGraphicClick(graphic, index, graphics)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      background: '#000',
                    }}
                  >
                    {graphic.historyUrl ? (
                      <img
                        src={graphic.historyUrl}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: 'var(--surface)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {graphic.variant}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Download all button */}
              <div style={{ marginTop: '16px', textAlign: 'right' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Download all graphics
                    graphics.forEach((g, i) => {
                      if (g.historyUrl) {
                        setTimeout(() => {
                          const link = document.createElement('a');
                          link.href = g.historyUrl!;
                          link.download = `graphic-${i + 1}.png`;
                          link.click();
                        }, i * 200);
                      }
                    });
                  }}
                >
                  Download All ({graphics.length})
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
