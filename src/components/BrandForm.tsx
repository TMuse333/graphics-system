'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Agent, Theme } from '@/lib/types';
import { updateAgent } from '@/lib/store';

type Props = {
  agent: Agent;
};

export function BrandForm({ agent }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: agent.name,
    title: agent.title,
    phone: agent.phone,
    email: agent.email,
    website: agent.website,
    headshotUrl: agent.headshotUrl,
    logoUrl: agent.logoUrl,
  });

  const [theme, setTheme] = useState<Theme>(agent.theme);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleThemeChange = (key: keyof Theme, value: string) => {
    setTheme({ ...theme, [key]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      updateAgent(agent._id, { ...formData, theme });
      router.push(`/agents/${agent._id}`);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid-2 mb-lg">
        {/* Profile section */}
        <div className="card">
          <h3 className="section-title">Profile</h3>

          <div className="flex gap-lg mb-lg">
            <div>
              <div className="avatar" style={{ width: '100px', height: '100px' }}>
                {formData.headshotUrl && (
                  <img src={formData.headshotUrl} alt="Headshot" />
                )}
              </div>
              <p className="text-muted text-sm" style={{ marginTop: '8px', textAlign: 'center' }}>
                Headshot
              </p>
            </div>
            <div>
              <div className="avatar" style={{ width: '100px', height: '100px', borderRadius: '8px' }}>
                {formData.logoUrl && (
                  <img src={formData.logoUrl} alt="Logo" />
                )}
              </div>
              <p className="text-muted text-sm" style={{ marginTop: '8px', textAlign: 'center' }}>
                Logo
              </p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="Realtor · PEI"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Website</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        {/* Theme section */}
        <div className="card">
          <h3 className="section-title">Theme Colors</h3>

          {([
            ['primary', 'Primary'],
            ['primaryAlt', 'Primary Alt'],
            ['accent', 'Accent'],
            ['accentLight', 'Accent Light'],
          ] as const).map(([key, label]) => (
            <div key={key} className="form-group">
              <label className="form-label">{label}</label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={theme[key]}
                  onChange={(e) => handleThemeChange(key, e.target.value)}
                  className="color-swatch-input"
                />
                <input
                  type="text"
                  value={theme[key]}
                  onChange={(e) => handleThemeChange(key, e.target.value)}
                  className="form-input"
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          ))}

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '20px 0' }} />

          <h3 className="section-title">Fonts</h3>

          {([
            ['fontDisplay', 'Display (Headlines)'],
            ['fontNarrow', 'Narrow (Labels)'],
            ['fontScript', 'Script (Signature)'],
          ] as const).map(([key, label]) => (
            <div key={key} className="form-group">
              <label className="form-label">{label}</label>
              <input
                type="text"
                value={theme[key]}
                onChange={(e) => handleThemeChange(key, e.target.value)}
                className="form-input"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-md">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
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
