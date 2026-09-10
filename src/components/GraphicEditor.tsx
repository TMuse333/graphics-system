'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Graphic, Listing, Agent, Variant, Photo, TemplateProps, GraphicOverrides, PhotoAssignments } from '@/lib/types';
import { getFieldsForVariant, FIELD_METADATA, type TemplateRegistryEntry } from '@/lib/templates';

type Props = {
  graphic: Graphic;
  listing: Listing;
  agent: Agent;
  template: TemplateRegistryEntry;
};

export function GraphicEditor({ graphic, listing, agent, template }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [variant, setVariant] = useState<Variant>(graphic.variant);
  const [overrides, setOverrides] = useState<GraphicOverrides>(graphic.overrides);
  const [photoAssignments, setPhotoAssignments] = useState<PhotoAssignments>(graphic.photoAssignments);

  // Get fields for current variant from registry
  const fields = getFieldsForVariant(template.type, variant);

  // Calculate preview scale based on template size
  const [width, height] = template.size;
  const scale = Math.min(600 / width, 600 / height);

  // Resolve photos for preview
  const photoMap = new Map(listing.photos.map(p => [p.id, p]));

  const resolvePhoto = (id?: string): Photo | undefined =>
    id ? photoMap.get(id) : undefined;

  const resolvePhotos = (ids?: string[]): Photo[] =>
    ids?.map(id => photoMap.get(id)).filter((p): p is Photo => !!p) || [];

  const templateProps: TemplateProps = useMemo(() => ({
    agent,
    listing,
    variant,
    overrides,
    photos: {
      hero: resolvePhoto(photoAssignments.hero) || listing.photos[0],
      strip: resolvePhotos(photoAssignments.strip),
      sub: resolvePhotos(photoAssignments.sub),
      row: resolvePhotos(photoAssignments.row),
    },
  }), [agent, listing, variant, overrides, photoAssignments]);

  const Component = template.component;

  const handleOverrideChange = (field: string, value: string) => {
    setOverrides((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoSelect = (slot: keyof PhotoAssignments, value: string | string[]) => {
    setPhotoAssignments((prev) => ({ ...prev, [slot]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/graphics/${graphic._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variant, overrides, photoAssignments }),
      });
      router.refresh();
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="editor-layout">
      {/* Sidebar - Form */}
      <div className="editor-sidebar">
        <h3 className="section-title">{template.name}</h3>

        {/* Variant selector */}
        <div className="form-group">
          <label className="form-label">Variant</label>
          <div className="variant-options">
            {template.variants.map((v) => (
              <label
                key={v}
                className={`variant-option ${variant === v ? 'active' : ''}`}
              >
                <input
                  type="radio"
                  name="variant"
                  value={v}
                  checked={variant === v}
                  onChange={() => setVariant(v)}
                />
                <span style={{ textTransform: 'capitalize' }}>
                  {v.replace('-', ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Dynamic fields based on variant */}
        {fields.length > 0 && (
          <>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '20px 0' }} />
            <h4 className="text-muted text-sm mb-md" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
              {variant.replace('-', ' ')} Fields
            </h4>
            {fields.map((field) => {
              const meta = FIELD_METADATA[field];
              return (
                <div key={field} className="form-group">
                  <label className="form-label">{meta.label}</label>
                  {meta.type === 'textarea' ? (
                    <textarea
                      className="form-input form-textarea"
                      value={(overrides as Record<string, string>)[field] || ''}
                      onChange={(e) => handleOverrideChange(field, e.target.value)}
                      placeholder={`Enter ${meta.label.toLowerCase()}...`}
                    />
                  ) : (
                    <input
                      type="text"
                      className="form-input"
                      value={(overrides as Record<string, string>)[field] || ''}
                      onChange={(e) => handleOverrideChange(field, e.target.value)}
                      placeholder={
                        field === 'date' ? 'Saturday, June 14' :
                        field === 'time' ? '2:00 - 4:00 PM' :
                        field === 'badge' ? 'Sold in 6 days' :
                        `Enter ${meta.label.toLowerCase()}...`
                      }
                    />
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* Photo assignments */}
        {listing.photos.length > 0 && (
          <>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '20px 0' }} />
            <h4 className="text-muted text-sm mb-md" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
              Photos
            </h4>

            {template.photos.hero && (
              <div className="form-group">
                <label className="form-label">Hero Photo</label>
                <select
                  className="form-select"
                  value={photoAssignments.hero || listing.photos[0]?.id || ''}
                  onChange={(e) => handlePhotoSelect('hero', e.target.value)}
                >
                  {listing.photos.map((photo, idx) => (
                    <option key={photo.id} value={photo.id}>
                      Photo {idx + 1} {photo.tag ? `(${photo.tag})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {template.photos.strip && (
              <div className="form-group">
                <label className="form-label">
                  Strip Photos ({template.photos.strip[0]}-{template.photos.strip[1]})
                </label>
                <div className="photo-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                  {listing.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="photo-thumb"
                      style={{
                        border: photoAssignments.strip?.includes(photo.id)
                          ? '2px solid var(--accent)'
                          : undefined,
                        opacity: photoAssignments.strip?.includes(photo.id) ? 1 : 0.6,
                      }}
                      onClick={() => {
                        const current = photoAssignments.strip || [];
                        const max = template.photos.strip![1];
                        if (current.includes(photo.id)) {
                          handlePhotoSelect('strip', current.filter(id => id !== photo.id));
                        } else if (current.length < max) {
                          handlePhotoSelect('strip', [...current, photo.id]);
                        }
                      }}
                    >
                      <img src={photo.url} alt="" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <button
          onClick={handleSave}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '20px' }}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Preview */}
      <div className="editor-preview">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          <Component {...templateProps} />
        </div>
      </div>
    </div>
  );
}
