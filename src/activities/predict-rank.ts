import type { ItemRound, Vessel, TextDictionary } from '../core/types';
import { renderVesselSvg } from '../components/vessel';

export interface PredictRankProps {
  round: ItemRound;
  totalRounds: number;
  currentRoundIndex: number;
  selectedItemId: string | null;
  showLiters: boolean;
  text?: TextDictionary;
}

export function renderPredictRankStep(props: PredictRankProps): string {
  const { round, totalRounds, currentRoundIndex, selectedItemId, showLiters, text } = props;
  const roundPrefix = text?.common?.round || 'Lượt';

  // Render round switcher pills
  let roundPillsHtml = '';
  for (let i = 0; i < totalRounds; i++) {
    const isCur = i === currentRoundIndex;
    roundPillsHtml += `
      <button class="level-pill ${isCur ? 'active' : ''}" data-nav-round="${i}" title="${roundPrefix} ${i + 1}">
        ${roundPrefix} ${i + 1}
      </button>
    `;
  }

  // Render items as interactive cartoon cards with SVG vessels
  const itemsHtml = round.items
    .map((item) => {
      const isSelected = selectedItemId === item.id;
      const vessel: Vessel = {
        id: item.id,
        name: item.name,
        capacity: item.capacity,
        level: 0, // Empty for prediction
        shape: item.shape,
        width: item.width,
        height: item.height,
        color: item.color,
      };

      return `
        <div class="predict-item-card ${isSelected ? 'selected' : ''}" 
             data-predict-item-id="${item.id}"
             style="background: #ffffff; border-radius: 24px; padding: 20px 16px; border: 4px solid ${
               isSelected ? 'var(--color-primary)' : 'var(--color-border)'
             }; cursor: pointer; text-align: center; min-width: 170px; max-width: 220px; box-shadow: ${
               isSelected ? '0 12px 28px rgba(255, 210, 63, 0.45)' : '0 8px 18px var(--color-shadow)'
             }; transition: transform 0.15s ease, border-color 0.15s ease;">
          
          <div style="min-height: 190px; display: flex; align-items: flex-end; justify-content: center; margin-bottom: 12px;">
            ${renderVesselSvg(vessel, {
              showLiters,
              isSelected,
            })}
          </div>

          <div class="font-title" style="font-size: 20px; color: var(--color-text); margin-bottom: 4px;">
            ${item.name}
          </div>
          <div style="font-size: 15px; color: var(--color-text-light); min-height: 40px;">
            ${item.description}
          </div>

          ${
            isSelected
              ? `<div style="margin-top: 12px; font-weight: 800; font-size: 16px; color: #d97706; background: #fef3c7; padding: 6px 12px; border-radius: 12px; border: 2px solid #fde68a;">
                  ${text?.partA?.selectedBadge || '⭐ Em chọn cái này'}
                 </div>`
              : `<div style="margin-top: 12px; font-weight: 700; font-size: 14px; color: #64748b; background: #f1f5f9; padding: 6px 12px; border-radius: 12px;">
                  ${text?.partA?.tapToSelect || 'Chạm để chọn'}
                 </div>`
          }
        </div>
      `;
    })
    .join('');

  return `
    <div class="activity-predict-rank" style="text-align: center; padding: 10px 0;">
      <!-- Round switcher bar -->
      <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;">
        ${roundPillsHtml}
      </div>

      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 28px; color: var(--color-text); margin-bottom: 6px;">
          ${round.title}
        </h2>
        <p style="font-size: 19px; color: var(--color-text-light); max-width: 700px; margin: 0 auto;">
          ${round.instruction}
        </p>
      </div>

      <!-- Items Grid -->
      <div style="display: flex; justify-content: center; align-items: flex-end; gap: 28px; flex-wrap: wrap; margin-bottom: 32px;">
        ${itemsHtml}
      </div>

      <!-- Next Step Button -->
      <div>
        <button id="btn-predict-next" class="btn-big btn-primary" ${
          !selectedItemId ? 'disabled style="opacity: 0.45; cursor: not-allowed;"' : ''
        }>
          ${text?.partA?.step2Button || 'Tiếp tục: Bước 2 - Đổ nước đối chiếu ➜'}
        </button>
      </div>
    </div>
  `;
}
