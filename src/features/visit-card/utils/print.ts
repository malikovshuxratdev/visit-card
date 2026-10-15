import * as htmlToImage from 'html-to-image';
import {
    CARD_EXPORT_PIXEL_RATIO,
    CARD_HEIGHT,
    CARD_WIDTH,
    PRINT_COLOR_PROFILE,
    PRINT_PAGE_MM,
} from '@/features/visit-card/constants';

type ColorProfile = typeof PRINT_COLOR_PROFILE;

/** Renders a card DOM node to a high-resolution PNG data URL. */
export const exportCardImage = (node: HTMLElement) =>
    htmlToImage.toPng(node, {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        pixelRatio: CARD_EXPORT_PIXEL_RATIO,
        backgroundColor: '#ffffff',
        cacheBust: true,
        skipFonts: true,
        style: { margin: '0', transform: 'none' },
    });

const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load card image'));
        img.src = src;
    });

const clamp = (value: number) => (value < 0 ? 0 : value > 255 ? 255 : value);

/** Pure pixel transform, exported for testing and tuning. */
export const adjustPixels = (
    data: Uint8ClampedArray,
    profile: ColorProfile = PRINT_COLOR_PROFILE
) => {
    const { saturation, contrast, brightness, blackThreshold, neutralTolerance } =
        profile;

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        if (max <= blackThreshold && max - min <= neutralTolerance) {
            data[i] = data[i + 1] = data[i + 2] = 0;
            continue;
        }

        r = (r * brightness - 128) * contrast + 128;
        g = (g * brightness - 128) * contrast + 128;
        b = (b * brightness - 128) * contrast + 128;

        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        data[i] = clamp(gray + (r - gray) * saturation);
        data[i + 1] = clamp(gray + (g - gray) * saturation);
        data[i + 2] = clamp(gray + (b - gray) * saturation);
    }

    return data;
};

/** Applies the printer colour profile to a PNG data URL. */
export const prepareImageForPrint = async (
    src: string,
    profile: ColorProfile = PRINT_COLOR_PROFILE
): Promise<string> => {
    const img = await loadImage(src);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return src;

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    adjustPixels(imageData.data, profile);
    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL('image/png');
};

const buildPrintDocument = (images: string[]) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Science ID</title>
    <style>
      @page { size: ${PRINT_PAGE_MM.width}mm ${PRINT_PAGE_MM.height}mm; margin: 0; }
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      html, body { margin: 0; padding: 0; background: #ffffff; }
      .page {
        width: ${PRINT_PAGE_MM.width}mm;
        height: ${PRINT_PAGE_MM.height}mm;
        overflow: hidden;
        page-break-after: always;
        break-after: page;
      }
      .page:last-child { page-break-after: auto; break-after: auto; }
      img { display: block; width: 100%; height: 100%; object-fit: cover; }
    </style>
  </head>
  <body>
    ${images.map((src) => `<div class="page"><img src="${src}" alt="" /></div>`).join('')}
  </body>
</html>`;

/**
 * Prints the given images (one per card side) through a hidden iframe.
 * Unlike window.open this is never blocked as a popup and works with
 * Chrome's --kiosk-printing silent mode.
 */
export const printImages = async (images: string[]) => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('aria-hidden', 'true');
    Object.assign(iframe.style, {
        position: 'fixed',
        right: '0',
        bottom: '0',
        width: '0',
        height: '0',
        border: '0',
    });
    document.body.appendChild(iframe);

    const win = iframe.contentWindow;
    const doc = iframe.contentDocument;
    if (!win || !doc) {
        iframe.remove();
        throw new Error('Print frame is not available');
    }

    doc.open();
    doc.write(buildPrintDocument(images));
    doc.close();

    await Promise.all(
        Array.from(doc.images).map((img) =>
            img.decode().catch(() => undefined)
        )
    );

    const cleanup = () => iframe.remove();
    win.addEventListener('afterprint', () => setTimeout(cleanup, 500), {
        once: true,
    });
    // Fallback in case afterprint never fires.
    setTimeout(cleanup, 60_000);

    win.focus();
    win.print();
};
