'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Send, CheckCircle2, Sparkles, HelpCircle, TrendingUp, Scale, Map, GitCompare } from 'lucide-react';

// The actual carousel formats we'll create
const CAROUSEL_FORMATS = [
  {
    id: 'buyer-objections',
    name: 'Buyer Guide',
    description: 'Answer common buyer questions like "What\'s a conditional offer?" or "How much deposit do I need?"',
    icon: HelpCircle,
    color: '#3b82f6',
    example: 'Conditional Offers Explained',
  },
  {
    id: 'market-pulse',
    name: 'Market Stats',
    description: 'Local market updates - average prices, days on market, trends in specific areas.',
    icon: TrendingUp,
    color: '#10b981',
    example: 'PEI Q3 Market Snapshot',
  },
  {
    id: 'myth-vs-fact',
    name: 'Myth vs Fact',
    description: 'Bust common misconceptions. "You need 20% down" → Actually, 5% is often enough.',
    icon: Scale,
    color: '#ef4444',
    example: '5 Pricing Myths Exposed',
  },
  {
    id: 'neighbourhood',
    name: 'Neighbourhood Guide',
    description: 'Spotlight local areas - what makes them special, price ranges, lifestyle.',
    icon: Map,
    color: '#f59e0b',
    example: 'Living in Stratford',
  },
  {
    id: 'this-or-that',
    name: 'This or That',
    description: 'Compare options - Condo vs House, Rural vs Urban, Buy vs Rent.',
    icon: GitCompare,
    color: '#8b5cf6',
    example: 'Cottage vs Year-Round Home',
  },
];

export default function SubmitAnswersPage() {
  const params = useParams();
  const agentId = params.agentId as string;

  const [formatInputs, setFormatInputs] = useState<Record<string, string>>({});
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const submission = {
      agentId,
      formats: formatInputs,
      additionalNotes,
      submittedAt: new Date().toISOString(),
    };

    console.log('Submission:', submission);

    // TODO: Save to database or send via email
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitted(true);
    setSubmitting(false);
  };

  const filledCount = Object.values(formatInputs).filter(v => v.trim().length > 0).length;

  if (submitted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20,
          padding: 48,
          textAlign: 'center',
          maxWidth: 500,
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <CheckCircle2 style={{ width: 40, height: 40, color: '#fff' }} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
            Got it!
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            Thanks! I&apos;ll create your carousel drafts and send them over for review.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      padding: '40px 24px',
    }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: 20,
            padding: '6px 14px',
            marginBottom: 16,
          }}>
            <Sparkles style={{ width: 14, height: 14, color: '#3b82f6' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#3b82f6' }}>Carousel Content</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
            What should your carousels cover?
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', maxWidth: 500, margin: '0 auto', lineHeight: 1.5 }}>
            Here are the formats I&apos;ll create. Tell me what subjects or questions you want each one to cover.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Format Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {CAROUSEL_FORMATS.map((format) => {
              const Icon = format.icon;
              const hasInput = formatInputs[format.id]?.trim().length > 0;

              return (
                <div
                  key={format.id}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: hasInput ? `2px solid ${format.color}40` : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 16,
                    padding: 24,
                    transition: 'border 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: `${format.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon style={{ width: 24, height: 24, color: format.color }} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <h3 style={{ fontSize: 17, fontWeight: 600, color: '#fff', margin: 0 }}>
                          {format.name}
                        </h3>
                        <span style={{
                          fontSize: 11,
                          padding: '3px 8px',
                          background: `${format.color}20`,
                          color: format.color,
                          borderRadius: 6,
                        }}>
                          e.g. {format.example}
                        </span>
                      </div>
                      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5 }}>
                        {format.description}
                      </p>
                    </div>
                  </div>

                  <textarea
                    value={formatInputs[format.id] || ''}
                    onChange={(e) => setFormatInputs(prev => ({ ...prev, [format.id]: e.target.value }))}
                    placeholder={`What subjects or questions do you want this format to cover?`}
                    rows={2}
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 10,
                      padding: 12,
                      fontSize: 14,
                      color: '#fff',
                      resize: 'vertical',
                      outline: 'none',
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Additional Notes */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: 24,
            marginTop: 24,
          }}>
            <label style={{ fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: 8 }}>
              Anything else? (optional)
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Style preferences, specific requests, ideas..."
              rows={2}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                padding: 12,
                fontSize: 14,
                color: '#fff',
                resize: 'vertical',
                outline: 'none',
              }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || filledCount === 0}
            style={{
              width: '100%',
              marginTop: 24,
              padding: '16px 24px',
              background: filledCount > 0
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              color: '#fff',
              cursor: filledCount > 0 ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? 'Sending...' : (
              <>
                <Send style={{ width: 18, height: 18 }} />
                Submit ({filledCount} format{filledCount !== 1 ? 's' : ''} filled)
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
