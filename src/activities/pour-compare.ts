import type { ItemRound, Vessel, TextDictionary } from '../core/types';
import { renderVesselSvg } from '../components/vessel';

export interface PourCompareState {
  round: ItemRound;
  sourceVessel: Vessel;
  targetVessel: Vessel;
  outcome: 'none' | 'overflow' | 'exact' | 'underflow';
  isPouring: boolean;
  isSwapped: boolean;
}

export function renderPourCompareStep(
  state: PourCompareState,
  showLiters: boolean,
  text: TextDictionary
): string {
  const { round, sourceVessel, targetVessel, outcome, isPouring } = state;

  // Outcome banner
  let outcomeBannerHtml = '';
  if (outcome === 'overflow') {
    outcomeBannerHtml = `
      <div style="background: #FFF5F5; border: 3px solid #FEB2B2; border-radius: 18px; padding: 16px 24px; max-width: 650px; margin: 0 auto 20px; box-shadow: 0 6px 16px rgba(239, 71, 111, 0.15);">
        <div style="font-size: 20px; font-weight: 800; color: #C53030; margin-bottom: 4px;">
          🌊 ${text.partA.resultOverflow}
        </div>
        <div style="font-size: 16px; color: #742A2A;">
          (${sourceVessel.name} chứa nhiều hơn ${targetVessel.name})
        </div>
      </div>
    `;
  } else if (outcome === 'exact') {
    outcomeBannerHtml = `
      <div style="background: #F0FFF4; border: 3px solid #9AE6B4; border-radius: 18px; padding: 16px 24px; max-width: 650px; margin: 0 auto 20px; box-shadow: 0 6px 16px rgba(6, 214, 160, 0.15);">
        <div style="font-size: 20px; font-weight: 800; color: #22543D; margin-bottom: 4px;">
          ✨ ${text.partA.resultExact}
        </div>
        <div style="font-size: 16px; color: #276749;">
          (${sourceVessel.name} và ${targetVessel.name} có sức chứa ngang nhau)
        </div>
      </div>
    `;
  } else if (outcome === 'underflow') {
    outcomeBannerHtml = `
      <div style="background: #EBF8FF; border: 3px solid #90CDF4; border-radius: 18px; padding: 16px 24px; max-width: 650px; margin: 0 auto 20px; box-shadow: 0 6px 16px rgba(61, 169, 252, 0.15);">
        <div style="font-size: 20px; font-weight: 800; color: #2B6CB0; margin-bottom: 4px;">
          💧 ${text.partA.resultUnderflow}
        </div>
        <div style="font-size: 16px; color: #2C5282;">
          (${sourceVessel.name} chứa ít hơn ${targetVessel.name})
        </div>
      </div>
    `;
  } else {
    outcomeBannerHtml = `
      <div style="background: #FFFBEB; border: 2.5px solid #FDE68A; border-radius: 16px; padding: 12px 20px; max-width: 600px; margin: 0 auto 20px; font-size: 17px; font-weight: 700; color: #92400E;">
        ${text.partA.dragToPourInstruction || '👉 Kéo hoặc chạm vào đồ vật bên trái để đổ sang đồ vật bên phải!'}
      </div>
    `;
  }

  return `
    <div class="activity-pour-compare" style="text-align: center; padding: 10px 0;">
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 28px; color: var(--color-text); margin-bottom: 6px;">
          ${text.partA.step2Title} (${round.title})
        </h2>
        <p style="font-size: 18px; color: var(--color-text-light);">
          ${text.partA.pourPrompt}
        </p>
      </div>

      <!-- Outcome Banner -->
      ${outcomeBannerHtml}

      <!-- Pouring Arena -->
      <div style="position: relative; background: #ffffff; border-radius: 28px; padding: 36px 20px 24px; max-width: 720px; margin: 0 auto 28px; border: 3px solid var(--color-border); box-shadow: 0 10px 25px var(--color-shadow); min-height: 280px; display: flex; align-items: flex-end; justify-content: space-around;">
        
        <!-- Source Vessel -->
        <div id="compare-source-container" style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="font-size: 14px; font-weight: 800; color: #3b82f6; background: #eff6ff; padding: 4px 12px; border-radius: 12px; margin-bottom: 8px;">
            ${text.common.sourceVessel || 'Đồ vật rót'}
          </div>
          ${renderVesselSvg(sourceVessel, {
            showLiters,
            isPouring,
            tiltAngle: isPouring ? 45 : 0,
            pourDirection: 'right',
          })}
        </div>

        <!-- Center Action / Stream indicator -->
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 60px;">
          <div style="font-size: 44px; color: var(--color-accent); font-weight: 900; animation: bounce-x 1.2s infinite alternate;">
            ➔
          </div>
          <button id="btn-do-pour" class="btn-big btn-accent" style="padding: 10px 20px; font-size: 18px; margin-top: 10px;">
            ${text.common.pourAction || '💧 Rót nước'}
          </button>
        </div>

        <!-- Target Vessel -->
        <div id="compare-target-container" style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="font-size: 14px; font-weight: 800; color: #10b981; background: #ecfdf5; padding: 4px 12px; border-radius: 12px; margin-bottom: 8px;">
            ${text.common.targetVessel || 'Đồ vật nhận'}
          </div>
          ${renderVesselSvg(targetVessel, {
            showLiters,
            isTarget: true,
          })}

          <!-- Spilled Water Puddle if overflow -->
          ${outcome === 'overflow' ? '<div class="spill-puddle"></div>' : ''}
        </div>
      </div>

      <!-- Action Buttons Row -->
      <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
        <button id="btn-swap-roles" class="btn-big btn-secondary">
          🔄 ${text.partA.swapVessels}
        </button>
        <button id="btn-reset-pour" class="btn-big btn-primary">
          ↺ ${text.partA.pourAgain}
        </button>
        <button id="btn-proceed-measure" class="btn-big btn-primary" ${
          outcome === 'none' ? 'disabled style="opacity: 0.45; cursor: not-allowed;"' : ''
        }>
          ${text.partA.step3Title} ➜
        </button>
      </div>
    </div>
  `;
}
