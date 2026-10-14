export interface MeasuringCupProps {
  currentLevel: number;
  maxCapacity: number;
  showLiters: boolean;
  label?: string;
  unit?: string;
}

export function renderMeasuringCup(props: MeasuringCupProps): string {
  const { currentLevel, maxCapacity = 5, showLiters = true, label = 'Cốc đong chuẩn', unit = 'lít' } = props;
  const width = 160;
  const height = 240;
  const fillRatio = Math.min(1, Math.max(0, currentLevel / maxCapacity));
  const waterHeight = Math.round(fillRatio * 180);
  const waterY = height - 20 - waterHeight;

  let ticksHtml = '';
  for (let i = 1; i <= maxCapacity; i++) {
    const y = height - 20 - (i / maxCapacity) * 180;
    ticksHtml += `
      <line x1="20" y1="${y}" x2="45" y2="${y}" stroke="#12355B" stroke-width="2.5" />
      <text x="52" y="${y + 5}" font-size="14" font-weight="800" fill="#12355B" class="liter-label ${showLiters ? '' : 'hidden-liter'}">${i}L</text>
    `;
  }

  return `
    <div class="measuring-cup-container">
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="measuring-cup-clip">
            <path d="M 20 20 L 140 20 L 125 220 L 35 220 Z" />
          </clipPath>
          <linearGradient id="cup-water-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#7CC8FF" />
            <stop offset="100%" stop-color="#3DA9FC" />
          </linearGradient>
        </defs>

        <!-- Cup Handle -->
        <path d="M 135 50 C 165 60 165 170 120 180" fill="none" stroke="#12355B" stroke-width="8" stroke-linecap="round" />

        <!-- Cup Body Background -->
        <path d="M 20 20 L 140 20 L 125 220 L 35 220 Z" fill="rgba(255, 255, 255, 0.75)" stroke="#BCD7ED" stroke-width="2" />

        <!-- Water Fluid -->
        <g clip-path="url(#measuring-cup-clip)">
          ${currentLevel > 0 ? `
            <rect x="0" y="${waterY}" width="${width}" height="${waterHeight + 30}" fill="url(#cup-water-grad)" />
            <ellipse cx="80" cy="${waterY}" rx="50" ry="6" fill="#A5DBFF" />
          ` : ''}
        </g>

        <!-- Tick marks -->
        ${ticksHtml}

        <!-- Outer Rim and Spout -->
        <path d="M 12 20 L 20 20 L 140 20 L 125 220 L 35 220 L 20 20" fill="none" stroke="#12355B" stroke-width="5" stroke-linejoin="round" />
      </svg>
      <div class="measuring-cup-label font-title">
        ${label} (${currentLevel} ${unit})
      </div>
    </div>
  `;
}
