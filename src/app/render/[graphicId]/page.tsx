'use client';

import { useParams, notFound } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { getFullGraphicData, type FullGraphicData } from '@/lib/store';
import { getTemplate, type TemplateRegistryEntry } from '@/lib/templates';
import { downloadPng } from '@/lib/downloadPng';
import type { TemplateProps, Photo } from '@/lib/types';

/**
 * Chrome-free render page for Puppeteer screenshots.
 * Mounts the template at exact pixel size with no margins or scroll.
 */
export default function RenderPage() {
  const params = useParams();
  const graphicId = params.graphicId as string;

  const [data, setData] = useState<FullGraphicData | null>(null);
  const [template, setTemplate] = useState<TemplateRegistryEntry | null>(null);
  const [ready, setReady] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const graphicRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const graphicData = getFullGraphicData(graphicId);
    if (!graphicData) return;

    setData(graphicData);

    // History graphics don't need a template
    if (!graphicData.graphic.historyUrl) {
      const tpl = getTemplate(graphicData.graphic.templateId);
      if (!tpl) return;
      setTemplate(tpl);
    }
  }, [graphicId]);

  // Signal fonts are ready
  useEffect(() => {
    if (data && (template || data.graphic.historyUrl)) {
      document.fonts.ready.then(() => {
        document.body.dataset.fontsReady = 'true';
        setReady(true);
      });
    }
  }, [data, template]);

  if (!data || (!template && !data.graphic.historyUrl)) {
    return <div>Loading...</div>;
  }

  const { graphic, listing, agent } = data;

  // History graphic - show static image
  if (graphic.historyUrl) {
    const handleHistoryDownload = () => {
      const link = document.createElement('a');
      link.href = graphic.historyUrl!;
      link.download = `${listing.address.replace(/\s+/g, '-')}-${graphic.variant}.png`;
      link.click();
    };

    return (
      <>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { overflow: auto; background: #111; }
        `}</style>

        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          display: 'flex',
          gap: '12px',
        }}>
          <button
            onClick={handleHistoryDownload}
            style={{
              padding: '12px 24px',
              background: '#22c55e',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            Download PNG
          </button>
          <button
            onClick={() => window.close()}
            style={{
              padding: '12px 24px',
              background: '#333',
              color: '#fff',
              border: '1px solid #555',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '80px 20px 20px',
        }}>
          <img
            src={graphic.historyUrl}
            alt={`${listing.address} - ${graphic.variant}`}
            style={{ maxWidth: '100%', maxHeight: 'calc(100vh - 100px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
          />
        </div>
      </>
    );
  }

  const Component = template!.component;

  // Resolve photo assignments to actual Photo objects
  const photoMap = new Map(listing.photos.map(p => [p.id, p]));

  const resolvePhoto = (id?: string): Photo | undefined =>
    id ? photoMap.get(id) : undefined;

  const resolvePhotos = (ids?: string[]): Photo[] =>
    ids?.map(id => photoMap.get(id)).filter((p): p is Photo => !!p) || [];

  const templateProps: TemplateProps = {
    agent,
    listing,
    variant: graphic.variant,
    overrides: graphic.overrides,
    photos: {
      hero: resolvePhoto(graphic.photoAssignments.hero) || listing.photos[0],
      strip: resolvePhotos(graphic.photoAssignments.strip),
      sub: resolvePhotos(graphic.photoAssignments.sub),
      row: resolvePhotos(graphic.photoAssignments.row),
    },
  };

  const [width, height] = template!.size;

  const handleDownload = async () => {
    if (!graphicRef.current || downloading) return;
    setDownloading(true);
    try {
      const filename = `${listing.address.replace(/\s+/g, '-')}-${graphic.variant}.png`;
      await downloadPng(graphicRef.current, filename);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body {
          overflow: auto;
          background: #111;
        }
        @font-face {
          font-family: 'Archivo';
          src: url('/fonts/Archivo-Variable.woff2') format('woff2');
          font-weight: 100 900;
        }
        @font-face {
          font-family: 'Archivo Narrow';
          src: url('/fonts/ArchivoNarrow-Variable.woff2') format('woff2');
          font-weight: 100 900;
        }
        @font-face {
          font-family: 'Yellowtail';
          src: url('/fonts/Yellowtail-Regular.woff2') format('woff2');
          font-weight: 400;
        }
      `}</style>

      {/* Download button */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        gap: '12px',
      }}>
        <button
          onClick={handleDownload}
          disabled={downloading || !ready}
          style={{
            padding: '12px 24px',
            background: ready ? '#22c55e' : '#555',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: ready ? 'pointer' : 'wait',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          {downloading ? 'Downloading...' : ready ? 'Download PNG' : 'Loading...'}
        </button>
        <button
          onClick={() => window.close()}
          style={{
            padding: '12px 24px',
            background: '#333',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>

      {/* Graphic container */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '80px 20px 20px',
      }}>
        <div ref={graphicRef} style={{ width, height }}>
          <Component {...templateProps} />
        </div>
      </div>
    </>
  );
}
