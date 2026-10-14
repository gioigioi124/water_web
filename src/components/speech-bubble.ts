import type { BiMood } from '../core/types';

export interface BiProps {
  mood: BiMood;
  speech: string;
}

export function renderBiMascot(props: BiProps): string {
  const { mood = 'happy', speech } = props;

  // Face SVG elements based on mood
  let eyesSvg = '';
  let mouthSvg = '';

  switch (mood) {
    case 'happy':
      eyesSvg = `
        <circle cx="38" cy="45" r="4.5" fill="#12355B" />
        <circle cx="36" cy="43" r="1.5" fill="#FFFFFF" />
        <circle cx="62" cy="45" r="4.5" fill="#12355B" />
        <circle cx="60" cy="43" r="1.5" fill="#FFFFFF" />
      `;
      mouthSvg = `
        <path d="M 42 53 Q 50 62 58 53" fill="#EF476F" stroke="#12355B" stroke-width="2" stroke-linecap="round" />
      `;
      break;
    case 'celebrating':
      eyesSvg = `
        <path d="M 32 46 Q 38 40 44 46" fill="none" stroke="#12355B" stroke-width="3" stroke-linecap="round" />
        <path d="M 56 46 Q 62 40 68 46" fill="none" stroke="#12355B" stroke-width="3" stroke-linecap="round" />
      `;
      mouthSvg = `
        <path d="M 40 52 Q 50 66 60 52 Z" fill="#EF476F" stroke="#12355B" stroke-width="2" />
      `;
      break;
    case 'surprised':
      eyesSvg = `
        <circle cx="38" cy="44" r="6" fill="#12355B" />
        <circle cx="36" cy="42" r="2" fill="#FFFFFF" />
        <circle cx="62" cy="44" r="6" fill="#12355B" />
        <circle cx="60" cy="42" r="2" fill="#FFFFFF" />
      `;
      mouthSvg = `
        <circle cx="50" cy="56" r="5" fill="#EF476F" stroke="#12355B" stroke-width="2" />
      `;
      break;
    case 'thinking':
      eyesSvg = `
        <circle cx="40" cy="40" r="4" fill="#12355B" />
        <circle cx="64" cy="40" r="4" fill="#12355B" />
        <line x1="33" y1="34" x2="43" y2="36" stroke="#12355B" stroke-width="2.5" stroke-linecap="round" />
      `;
      mouthSvg = `
        <path d="M 44 54 Q 50 50 56 54" fill="none" stroke="#12355B" stroke-width="2.5" stroke-linecap="round" />
      `;
      break;
    case 'sad':
      eyesSvg = `
        <circle cx="38" cy="46" r="4.5" fill="#12355B" />
        <circle cx="62" cy="46" r="4.5" fill="#12355B" />
        <!-- Pouty teardrop -->
        <circle cx="34" cy="54" r="3" fill="#7CC8FF" />
      `;
      mouthSvg = `
        <path d="M 43 57 Q 50 51 57 57" fill="none" stroke="#12355B" stroke-width="2.5" stroke-linecap="round" />
      `;
      break;
    case 'pointing':
      eyesSvg = `
        <circle cx="42" cy="45" r="5" fill="#12355B" />
        <circle cx="44" cy="43" r="1.8" fill="#FFFFFF" />
        <circle cx="66" cy="45" r="5" fill="#12355B" />
        <circle cx="68" cy="43" r="1.8" fill="#FFFFFF" />
      `;
      mouthSvg = `
        <path d="M 46 54 Q 54 62 62 54" fill="#EF476F" stroke="#12355B" stroke-width="2" stroke-linecap="round" />
        <!-- Pointing arm pointing to the right -->
        <g transform="translate(68, 55)">
          <path d="M 0 10 L 22 5 C 26 4 26 -2 22 -3 L 4 0" fill="#7CC8FF" stroke="#12355B" stroke-width="2.5" />
          <path d="M 12 3 L 26 1" stroke="#12355B" stroke-width="2" stroke-linecap="round" />
        </g>
      `;
      break;
    default:
      eyesSvg = `
        <circle cx="38" cy="45" r="4.5" fill="#12355B" />
        <circle cx="62" cy="45" r="4.5" fill="#12355B" />
      `;
      mouthSvg = `
        <path d="M 43 53 Q 50 60 57 53" fill="#EF476F" stroke="#12355B" stroke-width="2" stroke-linecap="round" />
      `;
      break;
  }

  return `
    <div class="bi-container mood-${mood}">
      <div class="bi-avatar">
        <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bi-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#7CC8FF" />
              <stop offset="100%" stop-color="#3DA9FC" />
            </linearGradient>
            <radialGradient id="bi-blush" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FF8FA3" stop-opacity="0.8" />
              <stop offset="100%" stop-color="#FF8FA3" stop-opacity="0" />
            </radialGradient>
          </defs>

          <!-- Water Drop Body -->
          <path d="M 50 8 C 30 35 15 52 15 68 C 15 88 31 95 50 95 C 69 95 85 88 85 68 C 85 52 70 35 50 8 Z" 
                fill="url(#bi-body-grad)" stroke="#12355B" stroke-width="3.5" />

          <!-- Body Highlight -->
          <path d="M 50 15 C 36 38 25 54 24 68 C 23 75 26 82 32 87" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" opacity="0.6" />

          <!-- Cheeks Blush -->
          <circle cx="28" cy="52" r="7" fill="url(#bi-blush)" />
          <circle cx="72" cy="52" r="7" fill="url(#bi-blush)" />

          <!-- Eyes and Mouth -->
          ${eyesSvg}
          ${mouthSvg}
        </svg>
      </div>

      <!-- Speech Bubble -->
      <div class="bi-speech-bubble font-title">
        <div class="bi-speech-content">${speech}</div>
        <div class="bi-bubble-tail"></div>
      </div>
    </div>
  `;
}
