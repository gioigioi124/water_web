import type { ItemRound, Item, TextDictionary } from '../core/types';
import { renderMeasuringCup } from '../components/measuring-cup';

export interface MeasureState {
  round: ItemRound;
  currentItem: Item;
  measuredLevel: number;
  userGuessId: string | null;
  measuredItems: Record<string, number>; // itemId -> measured capacity
  isLastRound: boolean;
}

export function renderMeasureStep(
  state: MeasureState,
  showLiters: boolean,
  text: TextDictionary
): string {
  const { round, currentItem, measuredLevel, userGuessId, measuredItems, isLastRound } = state;

  const highestItem = round.items.reduce((max, it) => (it.capacity > max.capacity ? it : max));
  const userGuessItem = round.items.find((it) => it.id === userGuessId) || null;
  const isCorrect = userGuessId === highestItem.id;

  // Buttons to measure each item
  const itemMeasureButtonsHtml = round.items
    .map((item) => {
      const isCurrentlyMeasured = currentItem.id === item.id;
      const isAlreadyMeasured = measuredItems[item.id] !== undefined;

      return `
        <div style="background: #ffffff; border-radius: 20px; padding: 16px; border: 3px solid ${
          isCurrentlyMeasured ? 'var(--color-primary)' : 'var(--color-border)'
        }; min-width: 150px; text-align: center; box-shadow: 0 6px 14px var(--color-shadow);">
          <div style="font-size: 32px; margin-bottom: 6px;">
            ${item.shape === 'bottle' ? '🍾' : item.shape === 'vase' ? '🏺' : item.shape === 'teapot' ? '🫖' : '🪣'}
          </div>
          <div class="font-title" style="font-size: 18px; color: var(--color-text); margin-bottom: 4px;">
            ${item.name}
          </div>
          <div style="font-size: 15px; font-weight: 800; color: #0284c7; margin-bottom: 10px;">
            ${isAlreadyMeasured ? `${item.capacity} ${text.common.liters}` : `? ${text.common.liters}`}
          </div>
          <button class="btn-big btn-accent" data-measure-item-id="${item.id}" style="padding: 8px 16px; font-size: 15px; min-height: 48px; width: 100%;">
            ${text.common.measureAction || 'Đong vào cốc 🧪'}
          </button>
        </div>
      `;
    })
    .join('');

  // Evaluation Card comparing with prediction
  let evaluationHtml = '';
  const allMeasured = round.items.every((it) => measuredItems[it.id] !== undefined);

  if (allMeasured) {
    if (isCorrect) {
      evaluationHtml = `
        <div style="background: #D4EDDA; border: 3px solid #C3E6CB; border-radius: 22px; padding: 22px; max-width: 650px; margin: 0 auto 24px; box-shadow: 0 8px 20px rgba(40, 167, 69, 0.2);">
          <div style="font-size: 24px; font-weight: 800; color: #155724; margin-bottom: 8px;">
            🌟 ${text.partA.guessCorrect}
          </div>
          <div style="font-size: 17px; color: #1e7e34;">
            Em đã chọn đúng <strong>${highestItem.name}</strong> (${highestItem.capacity} ${text.common.liters}) là đồ vật đựng được nhiều nước nhất!
          </div>
        </div>
      `;
    } else {
      evaluationHtml = `
        <div style="background: #FFF3CD; border: 3px solid #FFEBAA; border-radius: 22px; padding: 22px; max-width: 650px; margin: 0 auto 24px; box-shadow: 0 8px 20px rgba(255, 193, 7, 0.2);">
          <div style="font-size: 22px; font-weight: 800; color: #856404; margin-bottom: 8px;">
            💡 ${text.partA.guessIncorrect}
          </div>
          <div style="font-size: 17px; color: #856404; line-height: 1.5;">
            Em đã chọn: <strong>${userGuessItem ? userGuessItem.name : 'Chưa chọn'}</strong> (${userGuessItem ? userGuessItem.capacity : '?'} ${text.common.liters}).<br />
            Đồ vật đựng nhiều nhất thực tế là <strong>${highestItem.name}</strong> (${highestItem.capacity} ${text.common.liters})!<br />
            <em>Nhìn chiều cao hoặc bề rộng đôi khi đánh lừa thị giác của chúng mình đấy!</em>
          </div>
        </div>
      `;
    }
  }

  return `
    <div class="activity-measure" style="text-align: center; padding: 10px 0;">
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 28px; color: var(--color-text); margin-bottom: 6px;">
          ${text.partA.step3Title} (${round.title})
        </h2>
        <p style="font-size: 18px; color: var(--color-text-light);">
          ${text.partA.measurePrompt}
        </p>
      </div>

      <!-- Center Measuring Stage -->
      <div style="display: flex; justify-content: center; align-items: center; gap: 40px; margin-bottom: 28px; flex-wrap: wrap;">
        ${renderMeasuringCup({
          currentLevel: measuredLevel,
          maxCapacity: 5,
          showLiters,
          label: text.common.measuringCupName || 'Cốc đong chuẩn',
          unit: text.common.liters || 'lít',
        })}

        <!-- Measured Item Details Card -->
        <div style="background: #ffffff; border-radius: 24px; padding: 24px; border: 3px solid var(--color-border); box-shadow: 0 8px 20px var(--color-shadow); max-width: 300px; text-align: left;">
          <div style="font-size: 14px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">
            ${text.common.measuringTitle || 'Đang đo thể tích'}
          </div>
          <div class="font-title" style="font-size: 22px; color: var(--color-text); margin-bottom: 6px;">
            ${currentItem.name}
          </div>
          <div style="font-size: 15px; color: var(--color-text-light); margin-bottom: 12px;">
            ${currentItem.description}
          </div>
          <div style="font-size: 20px; font-weight: 800; color: #0284c7;">
            ${text.common.capacityLabel || 'Dung tích'}: <span style="font-size: 26px;">${currentItem.capacity}</span> ${text.common.liters}
          </div>
        </div>
      </div>

      <!-- Evaluation Box -->
      ${evaluationHtml}

      <!-- Item Buttons Row -->
      <div style="margin-bottom: 30px;">
        <div style="font-size: 17px; font-weight: 700; color: var(--color-text); margin-bottom: 12px;">
          ${text.partA.measureListPrompt || 'Bấm vào từng đồ vật bên dưới để đong vào cốc chuẩn:'}
        </div>
        <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
          ${itemMeasureButtonsHtml}
        </div>
      </div>

      <!-- Next Navigation -->
      <div style="display: flex; justify-content: center; gap: 16px;">
        <button id="btn-measure-next-round" class="btn-big btn-primary">
          ${isLastRound ? (text.partA.finishPartA || 'Hoàn thành Phần A ➜ Sang Phần B') : text.partA.nextRound}
        </button>
      </div>
    </div>
  `;
}
