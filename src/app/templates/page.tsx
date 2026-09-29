'use client';

import { useState } from 'react';
import {
  CAROUSEL_REGISTRY,
  TEMPLATE_REGISTRY,
  TEMPLATE_CATEGORIES,
} from '@/lib/templates';
import { greg } from '@/lib/theme';
import {
  TrendingUp,
  Map,
  Clock,
  Scale,
  MessageCircle,
  GitCompare,
  HelpCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Eye,
  X
} from 'lucide-react';

// Icon mapping
const ICONS: Record<string, React.ComponentType<{ style?: React.CSSProperties }>> = {
  TrendingUp, Map, Clock, Scale, MessageCircle, GitCompare, HelpCircle, Sparkles
};

type Tab = 'carousels' | 'templates';

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('carousels');
  const [selectedCarousel, setSelectedCarousel] = useState<string | null>(null);
  const [previewFrame, setPreviewFrame] = useState(0);

  const carousels = Object.values(CAROUSEL_REGISTRY);
  const templates = Object.values(TEMPLATE_REGISTRY);

  const selectedCarouselData = selectedCarousel ? CAROUSEL_REGISTRY[selectedCarousel] : null;
  const maxFrames = selectedCarouselData
    ? (typeof selectedCarouselData.frameCount === 'number' ? selectedCarouselData.frameCount : 7)
    : 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      color: '#fff',
    }}>
      {/* Header */}
      <header style={{
        padding: '24px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Template Library</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
            {carousels.length} carousels + {templates.length} single templates
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setActiveTab('carousels')}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'carousels' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.1)',
              color: '#fff',
            }}
          >
            Carousels
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'templates' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.1)',
              color: '#fff',
            }}
          >
            Single Templates
          </button>
        </div>
      </header>

      <main style={{ padding: '24px 32px' }}>
        {activeTab === 'carousels' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {carousels.map((carousel) => {
                const IconComponent = ICONS[carousel.icon || 'Sparkles'] || Sparkles;
                const isSelected = selectedCarousel === carousel.type;
                return (
                  <div
                    key={carousel.type}
                    onClick={() => {
                      setSelectedCarousel(isSelected ? null : carousel.type);
                      setPreviewFrame(0);
                    }}
                    style={{
                      background: isSelected ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                      border: isSelected
                        ? `2px solid ${carousel.color}`
                        : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 16,
                      padding: 20,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: `${carousel.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <IconComponent style={{ width: 22, height: 22, color: carousel.color }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{carousel.name}</h3>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: 10,
                            padding: '3px 8px',
                            background: `${carousel.color}30`,
                            color: carousel.color,
                            borderRadius: 4,
                            fontWeight: 600,
                          }}>
                            {carousel.frameCount} frames
                          </span>
                          <span style={{
                            fontSize: 10,
                            padding: '3px 8px',
                            background: 'rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.6)',
                            borderRadius: 4,
                          }}>
                            {carousel.day?.toUpperCase() || 'TUE'}
                          </span>
                          <span style={{
                            fontSize: 10,
                            padding: '3px 8px',
                            background: 'rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.6)',
                            borderRadius: 4,
                          }}>
                            {carousel.audience || 'both'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                      {carousel.blurb}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 14,
                      color: carousel.color,
                      fontSize: 12,
                      fontWeight: 600,
                    }}>
                      <Eye style={{ width: 14, height: 14 }} />
                      {isSelected ? 'Click to collapse' : 'Click to preview'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Carousel Detail */}
            {selectedCarouselData && (
              <div style={{
                marginTop: 32,
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedCarouselData.color}40`,
                borderRadius: 20,
                padding: 28,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700 }}>
                    {selectedCarouselData.name}
                  </h3>
                  <button
                    onClick={() => setSelectedCarousel(null)}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      borderRadius: 8,
                      padding: 8,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X style={{ width: 18, height: 18, color: 'rgba(255,255,255,0.7)' }} />
                  </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Preview */}
                  <div style={{ flex: '0 0 auto' }}>
                    <div style={{
                      background: '#000',
                      borderRadius: 12,
                      overflow: 'hidden',
                      width: 320,
                      aspectRatio: '1080/1350',
                      position: 'relative',
                    }}>
                      {selectedCarouselData.sampleData && (
                        <selectedCarouselData.component
                          agent={greg}
                          carousel={selectedCarouselData.sampleData}
                          frameIndex={previewFrame}
                        />
                      )}
                    </div>
                    {/* Frame navigation */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                      <button
                        onClick={() => setPreviewFrame(Math.max(0, previewFrame - 1))}
                        disabled={previewFrame === 0}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 6,
                          border: 'none',
                          background: 'rgba(255,255,255,0.1)',
                          color: previewFrame === 0 ? 'rgba(255,255,255,0.3)' : '#fff',
                          cursor: previewFrame === 0 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ChevronLeft style={{ width: 18, height: 18 }} />
                      </button>
                      <div style={{ flex: 1, display: 'flex', gap: 4, justifyContent: 'center' }}>
                        {Array.from({ length: maxFrames }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setPreviewFrame(i)}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 6,
                              border: 'none',
                              background: previewFrame === i ? selectedCarouselData.color : 'rgba(255,255,255,0.1)',
                              color: previewFrame === i ? '#fff' : 'rgba(255,255,255,0.6)',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setPreviewFrame(Math.min(maxFrames - 1, previewFrame + 1))}
                        disabled={previewFrame === maxFrames - 1}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 6,
                          border: 'none',
                          background: 'rgba(255,255,255,0.1)',
                          color: previewFrame === maxFrames - 1 ? 'rgba(255,255,255,0.3)' : '#fff',
                          cursor: previewFrame === maxFrames - 1 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ChevronRight style={{ width: 18, height: 18 }} />
                      </button>
                    </div>
                  </div>

                  {/* Questions */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, color: selectedCarouselData.color }}>
                      Questions to Ask Client ({selectedCarouselData.questions?.length || 0})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {selectedCarouselData.questions?.map((q, i) => (
                        <div
                          key={q.id}
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 10,
                            padding: 14,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <span style={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              background: selectedCarouselData.color,
                              color: '#fff',
                              fontSize: 11,
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              {i + 1}
                            </span>
                            <span style={{
                              fontSize: 10,
                              padding: '2px 6px',
                              background: 'rgba(255,255,255,0.1)',
                              borderRadius: 4,
                              color: 'rgba(255,255,255,0.5)',
                            }}>
                              {q.type}
                            </span>
                            {q.required && (
                              <span style={{
                                fontSize: 10,
                                padding: '2px 6px',
                                background: 'rgba(239, 68, 68, 0.2)',
                                borderRadius: 4,
                                color: '#ef4444',
                              }}>
                                required
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{q.label}</p>
                          {q.placeholder && (
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                              e.g., {q.placeholder}
                            </p>
                          )}
                          {q.options && (
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                              {q.options.slice(0, 5).map(opt => (
                                <span key={opt} style={{
                                  fontSize: 10,
                                  padding: '3px 8px',
                                  background: 'rgba(255,255,255,0.06)',
                                  borderRadius: 4,
                                  color: 'rgba(255,255,255,0.5)',
                                }}>
                                  {opt}
                                </span>
                              ))}
                              {q.options.length > 5 && (
                                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                                  +{q.options.length - 5} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'templates' && (
          <div>
            {Object.entries(TEMPLATE_CATEGORIES).map(([category, meta]) => {
              const categoryTemplates = templates.filter(t => t.category === category);
              if (categoryTemplates.length === 0) return null;

              return (
                <div key={category} style={{ marginBottom: 36 }}>
                  <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 14, color: 'rgba(255,255,255,0.9)' }}>
                    {meta.label} <span style={{ color: 'rgba(255,255,255,0.4)' }}>({categoryTemplates.length})</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categoryTemplates.map((template) => (
                      <div
                        key={template.type}
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: 12,
                          padding: 16,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10 }}>
                          <div>
                            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{template.name}</h3>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <span style={{
                                fontSize: 10,
                                padding: '2px 6px',
                                background: template.kind === 'listing' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                                color: template.kind === 'listing' ? '#10b981' : '#8b5cf6',
                                borderRadius: 4,
                                fontWeight: 600,
                              }}>
                                {template.kind}
                              </span>
                              <span style={{
                                fontSize: 10,
                                padding: '2px 6px',
                                background: 'rgba(255,255,255,0.1)',
                                color: 'rgba(255,255,255,0.5)',
                                borderRadius: 4,
                              }}>
                                {template.size[0]}×{template.size[1]}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                          {template.blurb || 'No description'}
                        </p>
                        {template.variants && template.variants.length > 0 && (
                          <div style={{ marginTop: 10, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {template.variants.slice(0, 3).map(v => (
                              <span key={v} style={{
                                fontSize: 9,
                                padding: '2px 6px',
                                background: 'rgba(255,255,255,0.06)',
                                borderRadius: 4,
                                color: 'rgba(255,255,255,0.4)',
                              }}>
                                {v}
                              </span>
                            ))}
                            {template.variants.length > 3 && (
                              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>
                                +{template.variants.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
