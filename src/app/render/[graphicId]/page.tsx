import { notFound } from 'next/navigation';
import { getFullGraphicData } from '@/lib/db';
import { getTemplate } from '@/lib/templates';
import type { TemplateProps, Photo } from '@/lib/types';

type Props = {
  params: Promise<{ graphicId: string }>;
};

/**
 * Chrome-free render page for Puppeteer screenshots.
 * Mounts the template at exact pixel size with no margins or scroll.
 */
export default async function RenderPage({ params }: Props) {
  const { graphicId } = await params;

  const data = await getFullGraphicData(graphicId);
  if (!data) notFound();

  const { graphic, listing, agent } = data;
  const template = getTemplate(graphic.templateId);
  if (!template) notFound();

  const Component = template.component;

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

  const [width, height] = template.size;

  return (
    <html>
      <head>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body {
            width: ${width}px;
            height: ${height}px;
            overflow: hidden;
            background: transparent;
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
      </head>
      <body>
        <Component {...templateProps} />
        <script dangerouslySetInnerHTML={{ __html: `
          document.fonts.ready.then(() => {
            document.body.dataset.fontsReady = 'true';
          });
        `}} />
      </body>
    </html>
  );
}
