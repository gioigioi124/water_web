import type { Vessel } from '../core/types';

export interface VesselRenderOptions {
  showLiters: boolean;
  isSource?: boolean;
  isTarget?: boolean;
  isSelected?: boolean;
  isHintTarget?: boolean;
  tiltAngle?: number; // Tilt in degrees
  translateX?: number;
  translateY?: number;
  isPouring?: boolean;
  pourDirection?: 'left' | 'right';
  customClass?: string;
  unit?: string;
}

/**
 * Returns shape path and dimensions based on vessel.shape
 */
function getShapeGeometry(shape: string | undefined, baseWidth: number, baseHeight: number) {
  const w = baseWidth;
  const h = baseHeight;

  switch (shape) {
    case 'bottle': {
      // Bottle: narrow neck at top, body below
      const neckW = Math.round(w * 0.38);
      const neckLeft = Math.round((w - neckW) / 2);
      const neckRight = neckLeft + neckW;
      const neckBottom = Math.round(h * 0.3);
      const path = `
        M ${neckLeft} 12 
        L ${neckRight} 12 
        L ${neckRight} ${neckBottom} 
        C ${neckRight + 12} ${neckBottom + 15} ${w - 10} ${neckBottom + 25} ${w - 10} ${neckBottom + 45}
        L ${w - 10} ${h - 16} 
        Q ${w - 10} ${h - 8} ${w - 18} ${h - 8}
        L 18 ${h - 8} 
        Q 10 ${h - 8} 10 ${h - 16}
        L 10 ${neckBottom + 45} 
        C 10 ${neckBottom + 25} ${neckLeft - 12} ${neckBottom + 15} ${neckLeft} ${neckBottom}
        Z
      `;
      return { path, isCustom: true, innerPadding: 10 };
    }
    case 'vase': {
      // Flared rim, narrow waist, bulbous body
      const path = `
        M 18 12 
        Q ${w / 2} 18 ${w - 18} 12 
        C ${w - 24} 35 ${w - 28} 50 ${w - 20} 80
        C ${w - 8} 110 ${w - 8} 140 ${w - 18} ${h - 12}
        Q ${w / 2} ${h - 8} 18 ${h - 12}
        C 8 140 8 110 20 80
        C 28 50 24 35 18 12
        Z
      `;
      return { path, isCustom: true, innerPadding: 12 };
    }
    case 'teapot': {
      // Wide spherical body with spout and handle
      const bodyLeft = 24;
      const bodyRight = w - 24;
      const path = `
        M ${bodyLeft + 15} 25 
        L ${bodyRight - 15} 25 
        C ${w - 8} 45 ${w - 8} ${h - 25} ${bodyRight - 10} ${h - 10}
        L ${bodyLeft + 10} ${h - 10}
        C 8 ${h - 25} 8 45 ${bodyLeft + 15} 25
        Z
      `;
      return { path, isCustom: true, innerPadding: 14, hasHandle: true, hasSpout: true };
    }
    case 'bucket_small':
    case 'bucket_large': {
      // Bucket: trapezoid widening toward top, curved bottom, handle arch
      const path = `
        M 12 20 
        L ${w - 12} 20 
        L ${w - 20} ${h - 12} 
        Q ${w / 2} ${h - 6} 20 ${h - 12} 
        Z
      `;
      return { path, isCustom: true, innerPadding: 16, hasBucketHandle: true };
    }
    case 'standard':
    default: {
      // Standard rounded cylinder beaker with spout
      const path = `
        M 10 14
        L ${w - 14} 14
        L ${w - 14} ${h - 16}
        Q ${w - 14} ${h - 8} ${w - 22} ${h - 8}
        L 22 ${h - 8}
        Q 10 ${h - 8} 10 ${h - 16}
        Z
      `;
      return { path, isCustom: false, innerPadding: 12 };
    }
  }
}

/**
 * Generates an SVG string representation of a Vessel with water level,
 * tick marks, clipPath wave water surface, liter count badge, tilt angle, and facial features.
 */
export function renderVesselSvg(vessel: Vessel, options: VesselRenderOptions): string {
  const width = vessel.width || 120;
  const height = vessel.height || 180;
  const capacity = Math.max(1, vessel.capacity);
  const level = Math.max(0, Math.min(capacity, vessel.level));
  const fillRatio = level / capacity;

  const clipId = `water-clip-${vessel.id}`;
  const gradientId = `water-grad-${vessel.id}`;
  const geom = getShapeGeometry(vessel.shape, width, height);

  const waterHeight = Math.round(fillRatio * (height - 28));
  const waterY = height - 12 - waterHeight;

  // Generate tick marks along the vessel wall
  let tickMarksSvg = '';
  for (let i = 1; i <= capacity; i++) {
    const tickY = height - 12 - (i / capacity) * (height - 28);
    const markWidth = i === capacity ? 22 : 14;
    const x2 = width - 14;
    const x1 = x2 - markWidth;

    tickMarksSvg += `
      <line x1="${x1}" y1="${tickY}" x2="${x2}" y2="${tickY}" stroke="#12355B" stroke-width="2.5" stroke-linecap="round" />
      <text x="${x1 - 5}" y="${tickY + 4}" font-size="13" font-weight="800" fill="#12355B" text-anchor="end" class="liter-label ${
        options.showLiters ? '' : 'hidden-liter'
      }">${i}L</text>
    `;
  }

  // Extra cartoon accessories (teapot handle, bucket handle, etc.)
  let accessoriesSvg = '';
  if (geom.hasHandle) {
    accessoriesSvg += `
      <!-- Teapot Handle -->
      <path d="M 18 40 C -8 50 -8 110 18 120" fill="none" stroke="#12355B" stroke-width="8" stroke-linecap="round" />
      <!-- Teapot Spout -->
      <path d="M ${width - 20} 55 Q ${width + 12} 40 ${width + 16} 28 Q ${width + 8} 34 ${width - 18} 75" fill="#FFEBAA" stroke="#12355B" stroke-width="3" stroke-linejoin="round" />
      <!-- Lid Knob -->
      <circle cx="${width / 2}" cy="16" r="6" fill="#FFD23F" stroke="#12355B" stroke-width="2.5" />
    `;
  }
  if (geom.hasBucketHandle) {
    accessoriesSvg += `
      <!-- Bucket Handle Arch -->
      <path d="M 8 25 C ${width / 2} -12 ${width / 2} -12 ${width - 8} 25" fill="none" stroke="#708090" stroke-width="5" stroke-linecap="round" />
      <circle cx="8" cy="25" r="4" fill="#12355B" />
      <circle cx="${width - 8}" cy="25" r="4" fill="#12355B" />
    `;
  }

  const tilt = options.tiltAngle || 0;
  const tx = options.translateX || 0;
  const ty = options.translateY || 0;

  // Visual classes
  const classes = [
    'vessel-wrapper',
    options.isSource ? 'vessel-source' : '',
    options.isTarget ? 'vessel-target' : '',
    options.isSelected ? 'selected-source' : '',
    options.isHintTarget ? 'hint-target' : '',
    options.customClass || '',
  ]
    .filter(Boolean)
    .join(' ');

  // Water pouring stream originating from rim when tilting
  let streamSvg = '';
  if (options.isPouring && level > 0) {
    const isPourLeft = options.pourDirection === 'left' || tilt < 0;
    const streamStartX = isPourLeft ? 10 : width - 10;
    const streamStartY = 18;
    const streamEndX = isPourLeft ? -40 : width + 40;
    const streamEndY = height + 40;

    streamSvg = `
      <path d="M ${streamStartX} ${streamStartY} Q ${streamStartX + (isPourLeft ? -25 : 25)} ${streamStartY + 30} ${streamEndX} ${streamEndY}" 
            fill="none" stroke="#3DA9FC" stroke-width="10" stroke-linecap="round" class="water-stream-path" />
      <path d="M ${streamStartX} ${streamStartY} Q ${streamStartX + (isPourLeft ? -25 : 25)} ${streamStartY + 30} ${streamEndX} ${streamEndY}" 
            fill="none" stroke="#7CC8FF" stroke-width="5" stroke-linecap="round" class="water-stream-path" />
    `;
  }

  // Face coordinates
  const faceX = width / 2;
  const faceY = Math.round(height * 0.58);

  return `
    <div class="${classes}" 
         data-vessel-id="${vessel.id}"
         style="transform: translate(${tx}px, ${ty}px) rotate(${tilt}deg); transform-origin: 50% 90%; transition: transform 0.12s cubic-bezier(0.2, 0.9, 0.3, 1);">
      <svg width="${width + (geom.hasHandle ? 36 : 0)}" height="${height}" viewBox="0 0 ${width + (geom.hasHandle ? 36 : 0)} ${height}" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
        <defs>
          <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#7CC8FF" />
            <stop offset="100%" stop-color="#3DA9FC" />
          </linearGradient>
          <clipPath id="${clipId}">
            <path d="${geom.path}" />
          </clipPath>
        </defs>

        <!-- Accessories (Handles, Spouts) behind -->
        ${accessoriesSvg}

        <!-- Vessel Background (Glass / Container interior) -->
        <path d="${geom.path}" fill="rgba(255, 255, 255, 0.72)" stroke="#BCD7ED" stroke-width="2" />

        <!-- Water Fluid with Clip Path -->
        <g clip-path="url(#${clipId})">
          ${
            level > 0
              ? `
            <rect x="0" y="${waterY}" width="${width + 40}" height="${waterHeight + 40}" fill="url(#${gradientId})" class="water-rect" />
            <!-- Water surface highlight wave -->
            <ellipse cx="${faceX}" cy="${waterY}" rx="${width / 2 - 8}" ry="6" fill="#A5DBFF" />
          `
              : ''
          }
        </g>

        <!-- Tick Marks & Liter Numbers -->
        ${tickMarksSvg}

        <!-- Outer Border -->
        <path d="${geom.path}" fill="none" stroke="#12355B" stroke-width="4.5" stroke-linejoin="round" />

        <!-- Cute Mascot Face (only when not pouring heavily) -->
        <circle cx="${faceX - 12}" cy="${faceY}" r="3.5" fill="#12355B" />
        <circle cx="${faceX + 12}" cy="${faceY}" r="3.5" fill="#12355B" />
        <circle cx="${faceX - 13}" cy="${faceY - 1}" r="1.2" fill="#FFFFFF" />
        <circle cx="${faceX + 11}" cy="${faceY - 1}" r="1.2" fill="#FFFFFF" />
        <path d="M ${faceX - 6} ${faceY + 6} Q ${faceX} ${faceY + 11} ${faceX + 6} ${faceY + 6}" fill="none" stroke="#12355B" stroke-width="2.2" stroke-linecap="round" />

        <!-- Stream Flow (if currently pouring) -->
        ${streamSvg}
      </svg>

      <!-- Caption -->
      <div class="vessel-caption">
        <div class="vessel-name">${vessel.name}</div>
        <div class="vessel-badge liter-label ${options.showLiters ? '' : 'hidden-liter'}">
          ${level} / ${capacity} ${options.unit || 'lít'}
        </div>
      </div>
    </div>
  `;
}
