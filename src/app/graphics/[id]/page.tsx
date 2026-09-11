'use client';

import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getFullGraphicData, type FullGraphicData } from '@/lib/store';
import { getTemplate, type TemplateRegistryEntry } from '@/lib/templates';
import { GraphicEditor } from '@/components/GraphicEditor';

export default function EditGraphicPage() {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<FullGraphicData | null>(null);
  const [template, setTemplate] = useState<TemplateRegistryEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const graphicData = getFullGraphicData(id);
    if (!graphicData) {
      setLoading(false);
      return;
    }

    const tpl = getTemplate(graphicData.graphic.templateId);
    if (!tpl) {
      setLoading(false);
      return;
    }

    setData(graphicData);
    setTemplate(tpl);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <>
        <header className="header">
          <Link href="/" className="header-logo">LISTING GRAPHICS</Link>
          <nav className="header-nav">
            <Link href="/gallery">Gallery</Link>
          </nav>
        </header>
        <main className="page">
          <div className="container">
            <p className="text-muted">Loading...</p>
          </div>
        </main>
      </>
    );
  }

  if (!data || !template) {
    notFound();
  }

  const { graphic, listing, agent } = data;

  return (
    <>
      <header className="header">
        <Link href="/" className="header-logo">LISTING GRAPHICS</Link>
        <nav className="header-nav">
          <Link href="/gallery">Gallery</Link>
        </nav>
      </header>

      <main className="page">
        <div className="container">
          <div className="flex-between mb-lg">
            <Link href={`/agents/${agent._id}`} className="back-link" style={{ marginBottom: 0 }}>
              ← Back to {listing.address}
            </Link>
            <Link href={`/render/${id}`} target="_blank" className="btn btn-secondary">
              Preview Full Size
            </Link>
          </div>

          <GraphicEditor
            graphic={graphic}
            listing={listing}
            agent={agent}
            template={template}
          />
        </div>
      </main>
    </>
  );
}
