'use client';

import html2canvas from 'html2canvas';

export async function downloadPng(
  element: HTMLElement,
  filename: string = 'graphic.png'
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 1, // Keep at native resolution
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
