export function renderSink(
  isActive: boolean = false,
  label: string = 'Cống xả 🌀',
  title: string = 'Cống xả nước'
): string {
  return `
    <div class="tool-sink-container ${isActive ? 'sink-draining' : ''}" title="${title}">
      <svg width="90" height="90" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
        <!-- Drain Outer Basin -->
        <ellipse cx="45" cy="45" rx="36" ry="24" fill="#CCDDEE" stroke="#12355B" stroke-width="4" />
        <ellipse cx="45" cy="45" rx="28" ry="18" fill="#5A6772" />

        <!-- Drain Hole Center -->
        <ellipse cx="45" cy="45" rx="16" ry="10" fill="#12355B" />

        <!-- Drain Grate bars -->
        <line x1="33" y1="45" x2="57" y2="45" stroke="#FFFFFF" stroke-width="2.5" opacity="0.8" />
        <line x1="45" y1="38" x2="45" y2="52" stroke="#FFFFFF" stroke-width="2.5" opacity="0.8" />
        <line x1="37" y1="40" x2="53" y2="50" stroke="#FFFFFF" stroke-width="2" opacity="0.6" />
        <line x1="37" y1="50" x2="53" y2="40" stroke="#FFFFFF" stroke-width="2" opacity="0.6" />

        <!-- Water Swirl when active -->
        ${
          isActive
            ? `
          <path d="M 30 35 A 15 10 0 1 1 55 52" fill="none" stroke="#7CC8FF" stroke-width="3" stroke-linecap="round" />
        `
            : ''
        }
      </svg>
      <div class="tool-label">${label}</div>
    </div>
  `;
}
