'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FocalPicker } from './FocalPicker';
import type { Listing, Photo } from '@/lib/types';
import { v4 as uuid } from 'uuid';

type Props = {
  agentId: string;
  listing?: Listing;
};

export function ListingForm({ agentId, listing }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    address: listing?.address || '',
    city: listing?.city || '',
    province: listing?.province || 'PE',
    postal: listing?.postal || '',
    mls: listing?.mls || '',
    price: listing?.price?.toString() || '',
    propertyType: listing?.propertyType || 'residential',
    beds: listing?.beds?.toString() || '',
    baths: listing?.baths?.toString() || '',
    acres: listing?.acres?.toString() || '',
  });

  const [photos, setPhotos] = useState<Photo[]>(listing?.photos || []);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('listingId', listing?._id?.toString() || 'new');

      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();

        if (data.success) {
          const newPhoto: Photo = {
            id: data.id,
            url: data.url,
            focal: { x: 50, y: 50 },
            sort: photos.length,
          };
          setPhotos((prev) => [...prev, newPhoto]);
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }

    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFocalChange = (photoId: string, focal: { x: number; y: number }) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, focal } : p))
    );
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto({ ...selectedPhoto, focal });
    }
  };

  const handleTagChange = (photoId: string, tag: Photo['tag']) => {
    // Remove tag from any other photo
    setPhotos((prev) =>
      prev.map((p) => ({
        ...p,
        tag: p.id === photoId ? tag : (p.tag === tag ? undefined : p.tag),
      }))
    );
  };

  const handleDeletePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      agentId,
      address: formData.address,
      city: formData.city,
      province: formData.province,
      postal: formData.postal || undefined,
      mls: formData.mls,
      price: formData.price ? parseInt(formData.price, 10) : null,
      propertyType: formData.propertyType as 'residential' | 'land',
      beds: formData.beds ? parseFloat(formData.beds) : undefined,
      baths: formData.baths ? parseFloat(formData.baths) : undefined,
      acres: formData.acres ? parseFloat(formData.acres) : undefined,
      photos,
    };

    try {
      const url = listing?._id
        ? `/api/listings/${listing._id}`
        : '/api/listings';
      const method = listing?._id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push(`/agents/${agentId}`);
        router.refresh();
      }
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card mb-lg">
        <h3 className="section-title">Property Details</h3>

        <div className="form-group">
          <label className="form-label">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-input"
            placeholder="278 Basinview Crescent"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="form-input"
              placeholder="Darnley"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Province</label>
            <input
              type="text"
              name="province"
              value={formData.province}
              onChange={handleChange}
              className="form-input"
              placeholder="PE"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Postal</label>
            <input
              type="text"
              name="postal"
              value={formData.postal}
              onChange={handleChange}
              className="form-input"
              placeholder="C0B 1M0"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">MLS #</label>
            <input
              type="text"
              name="mls"
              value={formData.mls}
              onChange={handleChange}
              className="form-input"
              placeholder="202401"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="form-input"
              placeholder="425000"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className="form-select"
            >
              <option value="residential">Residential</option>
              <option value="land">Land</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Beds</label>
            <input
              type="number"
              name="beds"
              value={formData.beds}
              onChange={handleChange}
              className="form-input"
              step="0.5"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Baths</label>
            <input
              type="number"
              name="baths"
              value={formData.baths}
              onChange={handleChange}
              className="form-input"
              step="0.5"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Acres</label>
            <input
              type="number"
              name="acres"
              value={formData.acres}
              onChange={handleChange}
              className="form-input"
              step="0.01"
            />
          </div>
        </div>
      </div>

      <div className="card mb-lg">
        <h3 className="section-title">Photos</h3>

        <div
          className={`dropzone mb-lg ${dragOver ? 'active' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          />
          {uploading ? (
            <p>Uploading...</p>
          ) : (
            <p>Drag & drop photos here, or click to browse</p>
          )}
        </div>

        {photos.length > 0 && (
          <div className="photo-grid">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="photo-thumb"
                onClick={() => setSelectedPhoto(photo)}
                style={{
                  border: selectedPhoto?.id === photo.id ? '2px solid var(--accent)' : undefined,
                }}
              >
                <img
                  src={photo.url}
                  alt=""
                  style={{
                    objectPosition: `${photo.focal.x}% ${photo.focal.y}%`,
                  }}
                />
                {photo.tag && <span className="photo-badge">{photo.tag}</span>}
              </div>
            ))}
          </div>
        )}

        {selectedPhoto && (
          <div className="card" style={{ marginTop: '20px', background: 'var(--bg)' }}>
            <div className="flex-between mb-md">
              <h4>Set Focal Point</h4>
              <button
                type="button"
                onClick={() => handleDeletePhoto(selectedPhoto.id)}
                className="btn btn-danger btn-sm"
              >
                Delete Photo
              </button>
            </div>

            <p className="text-muted text-sm mb-md">
              Click on the image where the crop should center. Current: {selectedPhoto.focal.x}% × {selectedPhoto.focal.y}%
            </p>

            <FocalPicker
              imageUrl={selectedPhoto.url}
              focal={selectedPhoto.focal}
              onFocalChange={(focal) => handleFocalChange(selectedPhoto.id, focal)}
            />

            <div className="flex gap-sm" style={{ marginTop: '16px' }}>
              <label className="text-sm text-muted">Tag:</label>
              {(['hero', 'aerial', 'interior', 'plan'] as const).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`btn btn-sm ${selectedPhoto.tag === tag ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleTagChange(selectedPhoto.id, tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-md">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : listing ? 'Save Changes' : 'Create Listing'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => router.back()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
