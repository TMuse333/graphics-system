'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Theme } from '@/lib/types';
import { gregTheme } from '@/lib/theme';
import { createAgent } from '@/lib/store';

export default function NewAgentPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    title: '',
    phone: '',
    email: '',
    website: '',
    headshotUrl: '',
    logoUrl: '',
  });

  const [theme, setTheme] = useState<Theme>(gregTheme);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Auto-generate ID from name
    if (name === 'name') {
      setFormData((prev) => ({
        ...prev,
        name: value,
        _id: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
      }));
    }
  };

  const handleThemeChange = (key: keyof Theme, value: string) => {
    setTheme({ ...theme, [key]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const agent = createAgent({ ...formData, theme });
      router.push(`/agents/${agent._id}`);
    } catch (error) {
      console.error('Save error:', error);
      setSaving(false);
    }
  };

  return (
    <>
      <header className="header">
        <Link href="/" className="header-logo">LISTING GRAPHICS</Link>
        <nav className="header-nav">
          <Link href="/gallery">Gallery</Link>
        </nav>
      </header>

      <main className="page">
        <div className="container" style={{ maxWidth: '800px' }}>
          <Link href="/" className="back-link">← All Clients</Link>

          <h1 className="title mb-lg">New Agent</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid-2 mb-lg">
              {/* Profile section */}
              <div className="card">
                <h3 className="section-title">Profile</h3>

                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Greg Caseley"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ID (auto-generated)</label>
                  <input
                    type="text"
                    name="_id"
                    value={formData._id}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="greg-caseley"
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
                    placeholder="902-888-9232"
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
                    placeholder="agent@email.com"
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
                    placeholder="example.com"
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
                {saving ? 'Creating...' : 'Create Agent'}
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
        </div>
      </main>
    </>
  );
}
