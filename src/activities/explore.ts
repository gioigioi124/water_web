import type { Vessel, TextDictionary } from '../core/types';
import { renderVesselSvg } from '../components/vessel';
import { renderTap } from '../components/tap';
import { renderSink } from '../components/sink';

export interface ExploreState {
  vessels: Vessel[];
  selectedVesselId: string | null;
  activeTool: 'tap' | 'sink' | null;
  isPouring: boolean;
  pouringSourceId: string | null;
  pouringTargetId: string | null;
}

export function renderExploreMode(
  state: ExploreState,
  showLiters: boolean,
  text: TextDictionary
): string {
  const { vessels, selectedVesselId, activeTool, isPouring, pouringSourceId } = state;

  const vesselsHtml = vessels
    .map((v) => {
      const isSelected = selectedVesselId === v.id;
      const isCurrentPouringSource = isPouring && pouringSourceId === v.id;

      return `
        <div class="explore-vessel-col" data-vessel-id="${v.id}" style="position: relative;">
          ${renderVesselSvg(v, {
            showLiters,
            isSelected,
            isPouring: isCurrentPouringSource,
            tiltAngle: isCurrentPouringSource ? 45 : 0,
            pourDirection: 'right',
          })}
        </div>
      `;
    })
    .join('');

  return `
    <div class="activity-explore" style="text-align: center; padding: 10px 0;">
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 28px; color: var(--color-text); margin-bottom: 6px;">
          ${text.partB.modeExplore}
        </h2>
        <p style="font-size: 18px; color: var(--color-text-light); max-width: 700px; margin: 0 auto;">
          ${text.partB.exploreWelcome}
        </p>
      </div>

      <!-- Tools row: Tap & Sink -->
      <div style="display: flex; justify-content: center; align-items: center; gap: 40px; margin-bottom: 28px;">
        <div id="tool-tap-btn" class="tool-tap-container ${activeTool === 'tap' ? 'active-tool tap-flowing' : ''}" style="background: #ffffff; border-radius: 20px; padding: 12px 20px; border: 3px solid #7CC8FF; box-shadow: 0 6px 16px var(--color-shadow); cursor: pointer;">
          ${renderTap(activeTool === 'tap')}
        </div>

        <div id="tool-sink-btn" class="tool-sink-container ${activeTool === 'sink' ? 'active-tool sink-draining' : ''}" style="background: #ffffff; border-radius: 20px; padding: 12px 20px; border: 3px solid #FF8FA3; box-shadow: 0 6px 16px var(--color-shadow); cursor: pointer;">
          ${renderSink(activeTool === 'sink')}
        </div>

        <button id="btn-explore-reset" class="btn-big btn-secondary" style="height: 64px;">
          🔄 ${text.common.restart}
        </button>
      </div>

      <!-- Vessels row -->
      <div style="display: flex; justify-content: center; align-items: flex-end; gap: 36px; min-height: 280px; margin-bottom: 28px; flex-wrap: wrap;">
        ${vesselsHtml}
      </div>

      <!-- Quick helper text -->
      <div style="background: rgba(255, 255, 255, 0.85); border-radius: 16px; padding: 12px 24px; display: inline-block; font-size: 16px; font-weight: 700; color: var(--color-text-light); border: 2px solid var(--color-border); box-shadow: 0 4px 10px var(--color-shadow);">
        💡 ${text.partB.dragHelp} hoặc ${text.partB.tapHelp}
      </div>
    </div>
  `;
}
