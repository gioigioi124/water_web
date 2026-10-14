export function renderTap(
  isActive: boolean = false,
  label: string = 'Vòi nước 💧',
  title: string = 'Vòi nước cấp'
): string {
  return `
    <div class="tool-tap-container ${isActive ? 'tap-flowing' : ''}" title="${title}">
      <svg width="90" height="90" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
        <!-- Tap Pipe Base -->
        <path d="M 10 25 L 45 25 Q 60 25 60 40 L 60 55" fill="none" stroke="#708090" stroke-width="14" stroke-linecap="round" />
        <path d="M 10 25 L 45 25 Q 60 25 60 40 L 60 55" fill="none" stroke="#A9B7C6" stroke-width="8" stroke-linecap="round" />

        <!-- Tap Handle Knob -->
        <rect x="25" y="8" width="16" height="10" rx="3" fill="#EF476F" stroke="#12355B" stroke-width="2.5" />
        <rect x="30" y="16" width="6" height="10" fill="#708090" />

        <!-- Tap Nozzle Ring -->
        <rect x="52" y="52" width="16" height="8" rx="2" fill="#5A6772" stroke="#12355B" stroke-width="2" />

        <!-- Water Stream Droplets when active -->
        ${
          isActive
            ? `
          <line x1="60" y1="62" x2="60" y2="90" stroke="#7CC8FF" stroke-width="6" stroke-linecap="round" />
          <line x1="60" y1="62" x2="60" y2="88" stroke="#3DA9FC" stroke-width="3" stroke-linecap="round" />
        `
            : ''
        }
      </svg>
      <div class="tool-label">${label}</div>
    </div>
  `;
}
