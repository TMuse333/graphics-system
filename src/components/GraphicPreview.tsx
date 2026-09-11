'use client';

import { useMemo } from 'react';
import type { Graphic, Listing, Agent, Photo, TemplateProps } from '@/lib/types';
import { getTemplate } from '@/lib/templates';

type Props = {
  graphic: Graphic;
  listing: Listing;
  agent: Agent;
  size?: number; // Preview container size in pixels
};

export function GraphicPreview({ graphic, listing, agent, size = 200 }: Props) {
  // If this is a history graphic with a pre-rendered image, show that
  if (graphic.historyUrl) {
    return (
      <div
        style={{
          width: size,
          height: size,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
        }}
      >
        <img
          src={graphic.historyUrl}
          alt={`${listing.address} - ${graphic.variant}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
    );
  }

  const template = getTemplate(graphic.templateId);

  const templateProps: TemplateProps = useMemo(() => {
    if (!template) return null as unknown as TemplateProps;

    // Resolve photo assignments to actual Photo objects
    const photoMap = new Map(listing.photos.map(p => [p.id, p]));

    const resolvePhoto = (id?: string): Photo | undefined =>
      id ? photoMap.get(id) : undefined;

    const resolvePhotos = (ids?: string[]): Photo[] =>
      ids?.map(id => photoMap.get(id)).filter((p): p is Photo => !!p) || [];

    return {
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
  }, [graphic, listing, agent, template]);

  if (!template) {
    return (
      <div
        style={{
          width: size,
          height: size,
          background: agent.theme.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: agent.theme.accent,
          fontSize: '12px',
        }}
      >
        Template not found
      </div>
    );
  }

  const [width, height] = template.size;
  const scale = size / Math.max(width, height);
  const Component = template.component;

  return (
    <div
      style={{
        width: size,
        height: size,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          pointerEvents: 'none',
        }}
      >
        <Component {...templateProps} />
      </div>
    </div>
  );
}
