'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SeedButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      await fetch('/api/seed', { method: 'POST' });
      router.refresh();
    } catch (error) {
      console.error('Seed error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSeed}
      disabled={loading}
      className="text-muted text-sm"
      style={{
        background: 'none',
        border: 'none',
        cursor: loading ? 'wait' : 'pointer',
        textDecoration: 'underline',
      }}
    >
      {loading ? 'Seeding...' : 'or seed demo data'}
    </button>
  );
}
