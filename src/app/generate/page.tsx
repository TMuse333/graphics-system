'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAgents, getListings, createGraphic, getActivePackage, getGraphics } from '@/lib/store';
import { TEMPLATE_REGISTRY } from '@/lib/templates';
import { TemplatePickerModal } from '@/components/TemplatePickerModal';
import type { Agent, Listing, Variant, GenerationJob, Graphic } from '@/lib/types';

type Phase = 'queue' | 'preview' | 'generating' | 'complete';

// Extended queue item with per-variant template selection
type QueueItem = {
  agentId: string;
  agent: Agent;
  listings: {
    listing: Listing;
    selected: boolean;
    variants: Variant[];
  }[];
  templatesByVariant: Record<Variant, string>;
};

// Modal state
type ModalState = {
  isOpen: boolean;
  agentId: string;
  variant: Variant;
} | null;

// Default template for each variant
const DEFAULT_TEMPLATE = 'style-b-square';

export default function BulkGeneratePage() {
  const [allAgents, setAllAgents] = useState<Agent[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [phase, setPhase] = useState<Phase>('queue');
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [results, setResults] = useState<Map<string, Graphic[]>>(new Map());
  const [modal, setModal] = useState<ModalState>(null);

  useEffect(() => {
    setAllAgents(getAgents());
  }, []);

  // Agents not yet in queue
  const availableAgents = allAgents.filter(
    a => !queue.some(q => q.agentId === a._id)
  );

  // Add agent to queue with their pending listings
  const addAgentToQueue = (agentId: string) => {
    const agent = allAgents.find(a => a._id === agentId);
    if (!agent) return;

    const listings = getListings(agentId).filter(
      l => l.status === 'pending' || l.status === 'in-progress'
    );

    // If no pending listings, get recent ones for demo
    const listingsToUse = listings.length > 0
      ? listings
      : getListings(agentId).slice(0, 5);

    // Initialize default template for all variants
    const defaultTemplates: Record<Variant, string> = {
      'new-listing': DEFAULT_TEMPLATE,
      'open-house': DEFAULT_TEMPLATE,
      'price-drop': DEFAULT_TEMPLATE,
      'just-sold': DEFAULT_TEMPLATE,
      'coming-soon': DEFAULT_TEMPLATE,
      'sold': DEFAULT_TEMPLATE,
      'featured': DEFAULT_TEMPLATE,
    };

    setQueue([...queue, {
      agentId,
      agent,
      listings: listingsToUse.map(l => ({
        listing: l,
        selected: true,
        variants: l.requestedVariants?.length ? l.requestedVariants : ['new-listing'],
      })),
      templatesByVariant: defaultTemplates,
    }]);
  };

  // Remove agent from queue
  const removeAgentFromQueue = (agentId: string) => {
    setQueue(queue.filter(q => q.agentId !== agentId));
  };

  // Toggle listing selection
  const toggleListing = (agentId: string, listingId: string) => {
    setQueue(queue.map(q => {
      if (q.agentId !== agentId) return q;
      return {
        ...q,
        listings: q.listings.map(l =>
          l.listing._id === listingId
            ? { ...l, selected: !l.selected }
            : l
        ),
      };
    }));
  };

  // Toggle variant for a listing
  const toggleVariant = (agentId: string, listingId: string, variant: Variant) => {
    setQueue(queue.map(q => {
      if (q.agentId !== agentId) return q;
      return {
        ...q,
        listings: q.listings.map(l => {
          if (l.listing._id !== listingId) return l;
          const hasVariant = l.variants.includes(variant);
          return {
            ...l,
            variants: hasVariant
              ? l.variants.filter(v => v !== variant)
              : [...l.variants, variant],
          };
        }),
      };
    }));
  };

  // Set template for a specific variant
  const setTemplateForVariant = (agentId: string, variant: Variant, templateId: string) => {
    setQueue(queue.map(q => {
      if (q.agentId !== agentId) return q;
      return {
        ...q,
        templatesByVariant: {
          ...q.templatesByVariant,
          [variant]: templateId,
        },
      };
    }));
  };

  // Open template picker modal
  const openTemplatePicker = (agentId: string, variant: Variant) => {
    setModal({ isOpen: true, agentId, variant });
  };

  // Handle template selection from modal
  const handleTemplateSelect = (templateId: string) => {
    if (modal) {
      setTemplateForVariant(modal.agentId, modal.variant, templateId);
    }
  };

  // Build job list for preview/generation
  const buildJobList = (): GenerationJob[] => {
    const allJobs: GenerationJob[] = [];
    let jobId = 0;

    for (const item of queue) {
      for (const { listing, selected, variants } of item.listings) {
        if (!selected) continue;
        for (const variant of variants) {
          // Get template for this specific variant
          const templateId = item.templatesByVariant[variant] || DEFAULT_TEMPLATE;
          allJobs.push({
            id: `job-${jobId++}`,
            agentId: item.agentId,
            agentName: item.agent.name,
            listingId: listing._id!,
            listingAddress: listing.address,
            templateId,
            variant,
            status: 'pending',
          });
        }
      }
    }

    return allJobs;
  };

  // Calculate totals
  const getTotals = () => {
    const jobs = buildJobList();
    const listings = new Set(jobs.map(j => j.listingId)).size;
    return { agents: queue.length, listings, graphics: jobs.length };
  };

  // Show preview
  const showPreview = () => {
    setJobs(buildJobList());
    setPhase('preview');
  };

  // Start generation
  const startGeneration = async () => {
    setPhase('generating');
    setCurrentJobIndex(0);
    setResults(new Map());

    const allJobs = [...jobs];

    // Process jobs sequentially
    for (let i = 0; i < allJobs.length; i++) {
      setCurrentJobIndex(i);

      // Update status to generating
      setJobs(prev => prev.map((j, idx) =>
        idx === i ? { ...j, status: 'generating' } : j
      ));

      // Small delay for visual effect
      await new Promise(r => setTimeout(r, 200));

      // Get active package for this agent
      const activePackage = getActivePackage(allJobs[i].agentId);

      // Create the graphic
      const graphic = createGraphic({
        listingId: allJobs[i].listingId,
        templateId: allJobs[i].templateId,
        variant: allJobs[i].variant,
        overrides: {},
        photoAssignments: {},
        packageId: activePackage?._id,
      });

      // Update job with result
      setJobs(prev => prev.map((j, idx) =>
        idx === i ? { ...j, status: 'complete', graphicId: graphic._id } : j
      ));

      // Add to results grouped by agent
      setResults(prev => {
        const newMap = new Map(prev);
        const agentGraphics = newMap.get(allJobs[i].agentId) || [];
        newMap.set(allJobs[i].agentId, [...agentGraphics, graphic]);
        return newMap;
      });
    }

    setPhase('complete');
  };

  const totals = getTotals();
  const variantOptions: Variant[] = ['new-listing', 'open-house', 'price-drop', 'just-sold', 'coming-soon'];

  // Get current template for modal
  const currentModalTemplate = modal
    ? queue.find(q => q.agentId === modal.agentId)?.templatesByVariant[modal.variant]
    : undefined;

  return (
    <>
      <header className="header">
        <Link href="/" className="header-logo">LISTING GRAPHICS</Link>
        <nav className="header-nav">
          <Link href="/">Clients</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/showcase">Showcase</Link>
          <span style={{ color: 'var(--accent)' }}>Generate</span>
        </nav>
      </header>

      <main className="page">
        <div className="container">
          <div className="flex-between mb-lg">
            <div>
              <h1 className="title">Bulk Generation</h1>
              <p className="text-muted">Generate graphics for multiple agents at once</p>
            </div>
            {phase !== 'queue' && (
              <button
                onClick={() => {
                  setPhase('queue');
                  setJobs([]);
                  setResults(new Map());
                }}
                className="btn btn-secondary"
              >
                Start Over
              </button>
            )}
          </div>

          {/* PHASE: QUEUE */}
          {phase === 'queue' && (
            <>
              {/* Queue */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                {queue.map((item) => (
                  <div key={item.agentId} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    {/* Agent header */}
                    <div style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="avatar" style={{ width: '40px', height: '40px' }}>
                          {item.agent.headshotUrl && (
                            <img src={item.agent.headshotUrl} alt={item.agent.name} />
                          )}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{item.agent.name}</h3>
                          <p className="text-muted text-sm">{item.listings.filter(l => l.selected).length} listings selected</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeAgentFromQueue(item.agentId)}
                        className="btn btn-secondary btn-sm"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Listings */}
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                      <p className="text-muted text-sm" style={{ marginBottom: '12px' }}>LISTINGS</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {item.listings.map(({ listing, selected, variants }) => (
                          <div
                            key={listing._id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '8px 12px',
                              background: selected ? 'var(--surface)' : 'transparent',
                              borderRadius: '6px',
                              opacity: selected ? 1 : 0.5,
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => toggleListing(item.agentId, listing._id!)}
                              style={{ width: '18px', height: '18px' }}
                            />
                            <div style={{ flex: 1 }}>
                              <span style={{ fontWeight: 500 }}>{listing.address}</span>
                              <span className="text-muted text-sm" style={{ marginLeft: '8px' }}>
                                {listing.city}, {listing.province}
                              </span>
                            </div>
                            {selected && (
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {variantOptions.map(v => {
                                  const isActive = variants.includes(v);
                                  const templateName = isActive
                                    ? TEMPLATE_REGISTRY[item.templatesByVariant[v]]?.name || 'Template'
                                    : null;
                                  return (
                                    <div key={v} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                      <button
                                        onClick={() => toggleVariant(item.agentId, listing._id!, v)}
                                        style={{
                                          padding: '2px 8px',
                                          fontSize: '11px',
                                          borderRadius: isActive ? '4px 0 0 4px' : '4px',
                                          border: 'none',
                                          cursor: 'pointer',
                                          background: isActive ? 'var(--accent)' : 'var(--border)',
                                          color: isActive ? 'var(--bg)' : 'var(--text-muted)',
                                          textTransform: 'capitalize',
                                        }}
                                      >
                                        {v.replace('-', ' ')}
                                      </button>
                                      {isActive && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openTemplatePicker(item.agentId, v);
                                          }}
                                          title={`Change template (${templateName})`}
                                          style={{
                                            padding: '2px 6px',
                                            fontSize: '10px',
                                            borderRadius: '0 4px 4px 0',
                                            border: 'none',
                                            cursor: 'pointer',
                                            background: 'var(--surface)',
                                            color: 'var(--text-muted)',
                                          }}
                                        >
                                          ▼
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary */}
                    <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="text-muted text-sm">
                        Click ▼ on a variant to change its template
                      </span>
                      <span className="text-muted text-sm">
                        Subtotal: {item.listings.filter(l => l.selected).reduce((sum, l) => sum + l.variants.length, 0)} graphics
                      </span>
                    </div>
                  </div>
                ))}

                {/* Add agent dropdown */}
                {availableAgents.length > 0 && (
                  <div className="card" style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="text-muted">Add agent to queue:</span>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            addAgentToQueue(e.target.value);
                            e.target.value = '';
                          }
                        }}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--border)',
                          background: 'var(--surface)',
                          color: 'var(--text)',
                          fontSize: '14px',
                        }}
                      >
                        <option value="">Select agent...</option>
                        {availableAgents.map(a => (
                          <option key={a._id} value={a._id}>{a.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {queue.length === 0 && (
                  <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                    <p className="text-muted mb-md">No agents in queue</p>
                    <p className="text-muted text-sm">Add agents above to start generating graphics</p>
                  </div>
                )}
              </div>

              {/* Summary footer */}
              {queue.length > 0 && (
                <div
                  style={{
                    position: 'sticky',
                    bottom: '20px',
                    background: 'var(--surface)',
                    borderRadius: '12px',
                    padding: '20px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid var(--accent)',
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '32px' }}>
                    <div>
                      <p className="text-muted text-sm">Agents</p>
                      <p style={{ fontSize: '24px', fontWeight: 700 }}>{totals.agents}</p>
                    </div>
                    <div>
                      <p className="text-muted text-sm">Listings</p>
                      <p style={{ fontSize: '24px', fontWeight: 700 }}>{totals.listings}</p>
                    </div>
                    <div>
                      <p className="text-muted text-sm">Graphics</p>
                      <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent)' }}>{totals.graphics}</p>
                    </div>
                  </div>
                  <button
                    onClick={showPreview}
                    disabled={totals.graphics === 0}
                    className="btn btn-primary"
                    style={{
                      padding: '12px 32px',
                      fontSize: '16px',
                      opacity: totals.graphics === 0 ? 0.5 : 1,
                    }}
                  >
                    Preview Generation Plan
                  </button>
                </div>
              )}
            </>
          )}

          {/* PHASE: PREVIEW (Dry Run) */}
          {phase === 'preview' && (
            <div className="card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
                Generation Plan (Dry Run)
              </h2>
              <p className="text-muted" style={{ marginBottom: '24px' }}>
                Review the {jobs.length} graphics that will be created:
              </p>

              {/* Breakdown by agent */}
              {queue.map((item) => {
                const agentJobs = jobs.filter(j => j.agentId === item.agentId);
                if (agentJobs.length === 0) return null;

                return (
                  <div key={item.agentId} style={{ marginBottom: '24px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid var(--border)',
                    }}>
                      <div className="avatar" style={{ width: '32px', height: '32px' }}>
                        {item.agent.headshotUrl && (
                          <img src={item.agent.headshotUrl} alt={item.agent.name} />
                        )}
                      </div>
                      <span style={{ fontWeight: 600 }}>{item.agent.name}</span>
                      <span className="text-muted text-sm">({agentJobs.length} graphics)</span>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                      gap: '8px',
                    }}>
                      {agentJobs.map((job, idx) => (
                        <div
                          key={job.id}
                          style={{
                            padding: '12px 16px',
                            background: 'var(--surface)',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                          }}
                        >
                          <span style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: 'var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}>
                            {idx + 1}
                          </span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '14px', fontWeight: 500 }}>{job.listingAddress}</p>
                            <p className="text-muted text-sm" style={{ textTransform: 'capitalize' }}>
                              {job.variant.replace('-', ' ')} · {TEMPLATE_REGISTRY[job.templateId]?.name || job.templateId}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Actions */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                marginTop: '24px',
                paddingTop: '24px',
                borderTop: '1px solid var(--border)',
              }}>
                <button
                  onClick={() => setPhase('queue')}
                  className="btn btn-secondary"
                >
                  Back to Edit
                </button>
                <button
                  onClick={startGeneration}
                  className="btn btn-primary"
                  style={{ padding: '12px 32px' }}
                >
                  Generate {jobs.length} Graphics
                </button>
              </div>
            </div>
          )}

          {/* PHASE: GENERATING */}
          {phase === 'generating' && (
            <div className="card" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>
                Generating...
              </h2>

              {/* Progress bar */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span className="text-muted">Progress</span>
                  <span style={{ fontWeight: 600 }}>
                    {jobs.filter(j => j.status === 'complete').length} / {jobs.length}
                  </span>
                </div>
                <div style={{
                  height: '8px',
                  background: 'var(--surface)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(jobs.filter(j => j.status === 'complete').length / jobs.length) * 100}%`,
                    background: 'var(--accent)',
                    transition: 'width 0.2s',
                  }} />
                </div>
              </div>

              {/* Job list */}
              <div style={{
                maxHeight: '400px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}>
                {jobs.map((job, idx) => (
                  <div
                    key={job.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px 12px',
                      background: idx === currentJobIndex ? 'var(--surface)' : 'transparent',
                      borderRadius: '6px',
                    }}
                  >
                    <span style={{ width: '20px', textAlign: 'center' }}>
                      {job.status === 'complete' && <span style={{ color: '#22c55e' }}>✓</span>}
                      {job.status === 'generating' && <span style={{ color: 'var(--accent)' }}>⟳</span>}
                      {job.status === 'pending' && <span style={{ color: 'var(--text-muted)' }}>○</span>}
                    </span>
                    <span className={job.status === 'pending' ? 'text-muted' : ''} style={{ flex: 1 }}>
                      {job.agentName} · {job.listingAddress}
                    </span>
                    <span className="text-muted text-sm" style={{ textTransform: 'capitalize' }}>
                      {job.variant.replace('-', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PHASE: COMPLETE */}
          {phase === 'complete' && (
            <>
              <div className="card" style={{ padding: '32px', textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
                <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
                  Generation Complete
                </h2>
                <p className="text-muted">
                  Created {jobs.length} graphic records for {queue.length} agents
                </p>
              </div>

              {/* What was created */}
              <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
                  What was created:
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {jobs.map((job) => (
                    <li
                      key={job.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px 0',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <span style={{ color: '#22c55e' }}>✓</span>
                      <span style={{ flex: 1 }}>
                        <strong>{job.agentName}</strong> · {job.listingAddress} · <span style={{ textTransform: 'capitalize' }}>{job.variant.replace('-', ' ')}</span>
                      </span>
                      {job.graphicId && (
                        <Link
                          href={`/render/${job.graphicId}`}
                          className="btn btn-secondary btn-sm"
                          target="_blank"
                        >
                          View Render
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Results by agent */}
              <h3 className="section-title">By Agent</h3>
              {Array.from(results.entries()).map(([agentId, graphics]) => {
                const agent = queue.find(q => q.agentId === agentId)?.agent;
                if (!agent) return null;

                return (
                  <div key={agentId} className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '16px' }}>
                    <div style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="avatar" style={{ width: '40px', height: '40px' }}>
                          {agent.headshotUrl && (
                            <img src={agent.headshotUrl} alt={agent.name} />
                          )}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{agent.name}</h3>
                          <p className="text-muted text-sm">{graphics.length} graphics created</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link
                          href={`/agents/${agentId}`}
                          className="btn btn-primary btn-sm"
                        >
                          View Dashboard
                        </Link>
                      </div>
                    </div>

                    {/* Graphics list */}
                    <div style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {graphics.map((g) => (
                          <Link
                            key={g._id}
                            href={`/render/${g._id}`}
                            target="_blank"
                            style={{
                              padding: '8px 16px',
                              borderRadius: '6px',
                              background: 'var(--surface)',
                              fontSize: '13px',
                              textTransform: 'capitalize',
                              textDecoration: 'none',
                              color: 'var(--text)',
                              border: '1px solid var(--border)',
                            }}
                          >
                            {g.variant.replace('-', ' ')}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
                <button
                  onClick={() => {
                    setPhase('queue');
                    setQueue([]);
                    setJobs([]);
                    setResults(new Map());
                  }}
                  className="btn btn-secondary"
                >
                  Generate More
                </button>
                <Link href="/" className="btn btn-primary">
                  Done
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Template Picker Modal */}
      {modal?.isOpen && (
        <TemplatePickerModal
          variant={modal.variant}
          currentTemplateId={currentModalTemplate}
          onSelect={handleTemplateSelect}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
