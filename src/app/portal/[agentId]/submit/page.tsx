'use client';

import Link from 'next/link';
import { useParams, useRouter, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAgent, createListing } from '@/lib/store';
import type { Agent, Variant, Photo } from '@/lib/types';

const VARIANT_OPTIONS: { value: Variant; label: string }[] = [
  { value: 'new-listing', label: 'Just Listed' },
  { value: 'open-house', label: 'Open House' },
  { value: 'coming-soon', label: 'Coming Soon' },
  { value: 'price-drop', label: 'Price Drop' },
  { value: 'just-sold', label: 'Just Sold' },
  { value: 'featured', label: 'Featured' },
];

export default function SubmitListingPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.agentId as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('PE');
  const [postal, setPostal] = useState('');
  const [mls, setMls] = useState('');
  const [price, setPrice] = useState('');
  const [propertyType, setPropertyType] = useState<'residential' | 'land'>('residential');
  const [beds, setBeds] = useState('');
  const [baths, setBaths] = useState('');
  const [acres, setAcres] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [requestedVariants, setRequestedVariants] = useState<Variant[]>(['new-listing']);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const foundAgent = getAgent(agentId);
    if (!foundAgent) {
      setLoading(false);
      return;
    }
    setAgent(foundAgent);
    setLoading(false);
  }, [agentId]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const reader = new FileReader();
      reader.onload = () => {
        const newPhoto: Photo = {
          id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          url: reader.result as string,
          focal: { x: 50, y: 50 },
          sort: photos.length,
        };
        setPhotos(prev => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  const handleVariantToggle = (variant: Variant) => {
    setRequestedVariants(prev =>
      prev.includes(variant)
        ? prev.filter(v => v !== variant)
        : [...prev, variant]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent) return;

    setSubmitting(true);
    try {
      createListing({
        agentId: agent._id,
        address,
        city,
        province,
        postal,
        mls,
        price: price ? parseInt(price.replace(/\D/g, ''), 10) : null,
        propertyType,
        beds: beds ? parseInt(beds, 10) : undefined,
        baths: baths ? parseFloat(baths) : undefined,
        acres: acres ? parseFloat(acres) : undefined,
        photos,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        requestedVariants,
        notes,
      });

      router.push(`/portal/${agentId}`);
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <header className="header">
          <span className="header-logo">LISTING GRAPHICS</span>
        </header>
        <main className="page">
          <div className="container">
            <p className="text-muted">Loading...</p>
          </div>
        </main>
      </>
    );
  }

  if (!agent) {
    notFound();
  }

  return (
    <>
      <header className="header">
        <span className="header-logo">LISTING GRAPHICS</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="text-muted">{agent.name}</span>
          <div className="avatar" style={{ width: '36px', height: '36px' }}>
            {agent.headshotUrl && <img src={agent.headshotUrl} alt={agent.name} />}
          </div>
        </div>
      </header>

      <main className="page">
        <div className="container" style={{ maxWidth: '700px' }}>
          <Link href={`/portal/${agentId}`} className="back-link">
            ← Back to Dashboard
          </Link>

          <h1 className="title mb-lg">Submit New Listing</h1>

          <form onSubmit={handleSubmit}>
            {/* Property Details */}
            <div className="card mb-lg">
              <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Property Details</h2>

              <div className="form-group">
                <label className="form-label">Address *</label>
                <input
                  type="text"
                  className="form-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Charlottetown"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Province</label>
                  <input
                    type="text"
                    className="form-input"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    placeholder="PE"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Postal</label>
                  <input
                    type="text"
                    className="form-input"
                    value={postal}
                    onChange={(e) => setPostal(e.target.value)}
                    placeholder="C1A 1A1"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">MLS # *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={mls}
                    onChange={(e) => setMls(e.target.value)}
                    placeholder="202401234"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Price</label>
                  <input
                    type="text"
                    className="form-input"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="$425,000"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Property Type</label>
                <div className="flex gap-sm">
                  <label className={`variant-option ${propertyType === 'residential' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="propertyType"
                      value="residential"
                      checked={propertyType === 'residential'}
                      onChange={() => setPropertyType('residential')}
                    />
                    <span>Residential</span>
                  </label>
                  <label className={`variant-option ${propertyType === 'land' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="propertyType"
                      value="land"
                      checked={propertyType === 'land'}
                      onChange={() => setPropertyType('land')}
                    />
                    <span>Land</span>
                  </label>
                </div>
              </div>

              {propertyType === 'residential' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Beds</label>
                    <input
                      type="number"
                      className="form-input"
                      value={beds}
                      onChange={(e) => setBeds(e.target.value)}
                      placeholder="3"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Baths</label>
                    <input
                      type="number"
                      step="0.5"
                      className="form-input"
                      value={baths}
                      onChange={(e) => setBaths(e.target.value)}
                      placeholder="2"
                    />
                  </div>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Acres</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    value={acres}
                    onChange={(e) => setAcres(e.target.value)}
                    placeholder="5.5"
                  />
                </div>
              )}
            </div>

            {/* Photos */}
            <div className="card mb-lg">
              <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Photos</h2>
              <p className="text-muted text-sm mb-md">
                Upload your listing photos. The first photo will be used as the hero image.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    style={{
                      position: 'relative',
                      aspectRatio: '1',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: index === 0 ? '2px solid var(--accent)' : '1px solid var(--border)',
                    }}
                  >
                    <img
                      src={photo.url}
                      alt={`Photo ${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {index === 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '4px',
                          left: '4px',
                          background: 'var(--accent)',
                          color: 'var(--bg)',
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 600,
                        }}
                      >
                        HERO
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(photo.id)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'rgba(0,0,0,0.7)',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        lineHeight: '24px',
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <label
                  style={{
                    aspectRatio: '1',
                    borderRadius: '8px',
                    border: '2px dashed var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>+</span>
                  <span style={{ fontSize: '12px' }}>Add</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            {/* Graphics Requested */}
            <div className="card mb-lg">
              <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Graphics Requested</h2>
              <p className="text-muted text-sm mb-md">
                Select which graphics you'd like created for this listing.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {VARIANT_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`variant-option ${requestedVariants.includes(option.value) ? 'active' : ''}`}
                    style={{ justifyContent: 'flex-start', padding: '12px' }}
                  >
                    <input
                      type="checkbox"
                      checked={requestedVariants.includes(option.value)}
                      onChange={() => handleVariantToggle(option.value)}
                      style={{ marginRight: '8px' }}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="card mb-lg">
              <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Notes</h2>
              <textarea
                className="form-input form-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests or notes for this listing..."
                rows={4}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={submitting || !address || !city || !mls}
            >
              {submitting ? 'Submitting...' : 'Submit Listing'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
