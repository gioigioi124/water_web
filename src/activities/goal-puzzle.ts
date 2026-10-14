import type { LevelConfig, Vessel, TextDictionary, Move } from '../core/types';
import { renderVesselSvg } from '../components/vessel';
import { renderTap } from '../components/tap';
import { renderSink } from '../components/sink';

export interface GoalPuzzleState {
  level: LevelConfig;
  totalLevels: number;
  currentLevelIndex: number;
  completedLevelIds: number[];
  vessels: Vessel[];
  movesCount: number;
  selectedVesselId: string | null;
  isCompleted: boolean;
  activeHint: string | null;
  hintMove: Move | null;
  activeTool: 'tap' | 'sink' | null;
  isPouring: boolean;
  pouringSourceId: string | null;
  pouringTargetId?: string | null;
}

export function renderGoalPuzzleMode(
  state: GoalPuzzleState,
  showLiters: boolean,
  text: TextDictionary
): string {
  const {
    level,
    totalLevels,
    currentLevelIndex,
    completedLevelIds,
    vessels,
    movesCount,
    selectedVesselId,
    isCompleted,
    activeHint,
    hintMove,
    activeTool,
    isPouring,
    pouringSourceId,
  } = state;

  // Level selector pills
  let levelTabsHtml = '';
  for (let i = 0; i < totalLevels; i++) {
    const lvlNum = i + 1;
    const isCur = i === currentLevelIndex;
    const isDone = completedLevelIds.includes(lvlNum);

    levelTabsHtml += `
      <button class="level-pill ${isCur ? 'active' : ''} ${isDone ? 'completed' : ''}" 
              data-nav-level="${i}" 
              title="${text.common.level} ${lvlNum}">
        ${isDone ? '✓ ' : ''}${text.common.level} ${lvlNum}
      </button>
    `;
  }

  // Vessel list
  const vesselsHtml = vessels
    .map((v) => {
      const isSelected = selectedVesselId === v.id;
      const isCurrentPouringSource = isPouring && pouringSourceId === v.id;
      const isHintTarget =
        hintMove &&
        ((hintMove.type === 'pour' && (hintMove.from === v.id || hintMove.to === v.id)) ||
          (hintMove.type === 'fill' && hintMove.vessel === v.id) ||
          (hintMove.type === 'empty' && hintMove.vessel === v.id));

      return `
        <div class="puzzle-vessel-col" data-vessel-id="${v.id}" style="position: relative;">
          ${renderVesselSvg(v, {
            showLiters,
            isSelected,
            isHintTarget: Boolean(isHintTarget),
            isPouring: isCurrentPouringSource,
            tiltAngle: isCurrentPouringSource ? 45 : 0,
            pourDirection: 'right',
          })}
        </div>
      `;
    })
    .join('');

  return `
    <div class="activity-goal-puzzle" style="text-align: center; padding: 10px 0;">
      <!-- Level Tabs Bar -->
      <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;">
        ${levelTabsHtml}
      </div>

      <!-- Level Header & Goal Box -->
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 28px; color: var(--color-text); margin-bottom: 6px;">
          ${level.title}
        </h2>
        <p style="font-size: 17px; color: var(--color-text-light); margin-bottom: 12px;">
          ${level.instruction}
        </p>

        <!-- Goal Banner -->
        <div style="display: inline-block; background: #FFF9DB; border: 3px solid #FFD43B; border-radius: 20px; padding: 10px 24px; box-shadow: 0 4px 14px rgba(255, 212, 59, 0.35);">
          <span style="font-size: 22px; margin-right: 6px;">🎯</span>
          <strong style="font-size: 20px; color: #7A5200;">${text.partB.goalLabel}</strong>
          <span style="font-size: 20px; font-weight: 800; color: #5C3B00; margin-left: 6px;">
            ${level.goal.description}
          </span>
        </div>
      </div>

      <!-- Tools & Controls Bar -->
      <div style="display: flex; justify-content: center; align-items: center; gap: 24px; margin-bottom: 24px; flex-wrap: wrap;">
        ${
          level.tools.tap
            ? `
          <div id="puzzle-tap-btn" class="tool-tap-container ${activeTool === 'tap' ? 'active-tool tap-flowing' : ''}" 
               style="background: #ffffff; border-radius: 18px; padding: 8px 16px; border: 3px solid #7CC8FF; box-shadow: 0 4px 12px var(--color-shadow); cursor: pointer;"
               title="${text.partB.tapFullTitle || 'Mở vòi nước đầy bình'}">
            ${renderTap(activeTool === 'tap', text.common.tapDisplay, text.common.tapTitle)}
          </div>
        `
            : ''
        }

        ${
          level.tools.sink
            ? `
          <div id="puzzle-sink-btn" class="tool-sink-container ${activeTool === 'sink' ? 'active-tool sink-draining' : ''}" 
               style="background: #ffffff; border-radius: 18px; padding: 8px 16px; border: 3px solid #FF8FA3; box-shadow: 0 4px 12px var(--color-shadow); cursor: pointer;"
               title="${text.partB.sinkEmptyTitle || 'Xả cống hết nước trong bình'}">
            ${renderSink(activeTool === 'sink', text.common.sinkDisplay, text.common.sinkTitle)}
          </div>
        `
            : ''
        }

        <button id="puzzle-hint-btn" class="btn-big btn-primary" title="${text.partB.bfsHintTitle || 'Tìm bước đi tối ưu ngắn nhất bằng thuật toán BFS'}">
          💡 ${text.partB.hintButton}
        </button>

        <button id="puzzle-reset-btn" class="btn-big btn-secondary" title="${text.partB.resetLevelTitle || 'Chơi lại màn này'}">
          🔄 ${text.common.restart}
        </button>
      </div>

      <!-- Hint Box if activated -->
      ${
        activeHint
          ? `
        <div style="background: #EBF8FF; border: 3px solid #90CDF4; border-radius: 18px; padding: 14px 22px; max-width: 640px; margin: 0 auto 20px; text-align: left; font-size: 18px; color: var(--color-text); box-shadow: 0 6px 16px rgba(61, 169, 252, 0.2);">
          <strong style="color: #2B6CB0;">${text.partB.biHintPrefix || '💡 Bi gợi ý:'}</strong> ${activeHint}
        </div>
      `
          : ''
      }

      <!-- Vessels Stage -->
      <div style="display: flex; justify-content: center; align-items: flex-end; gap: 36px; min-height: 280px; margin-bottom: 24px; flex-wrap: wrap;">
        ${vesselsHtml}
      </div>

      <!-- Move Statistics -->
      <div style="display: flex; justify-content: center; gap: 32px; font-size: 19px; font-weight: 800; color: var(--color-text-light);">
        <div>
          ${text.partB.movesCount}: <span style="color: var(--color-text); font-size: 22px;">${movesCount}</span>
        </div>
        <div>
          ${text.partB.bestMoves}: <span style="color: #06D6A0; font-size: 22px;">${level.minMoves} ${text.partB.stepsUnit || 'bước'}</span>
        </div>
      </div>

      <!-- Win Congratulations Modal / Banner -->
      ${
        isCompleted
          ? `
        <div style="margin-top: 24px; background: #D4EDDA; border: 4px solid #28A745; border-radius: 24px; padding: 24px; max-width: 580px; margin-left: auto; margin-right: auto; box-shadow: 0 12px 30px rgba(40, 167, 69, 0.25); animation: modal-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
          <div style="font-size: 28px; font-weight: 800; color: #155724; margin-bottom: 8px;">
            🎉 ${text.partB.congratsTitle}
          </div>
          <div style="font-size: 18px; color: #1e7e34; margin-bottom: 16px;">
            ${text.partB.completedInMoves || 'Em đã hoàn thành mục tiêu trong'} <strong>${movesCount}</strong> ${text.partB.stepsUnit || 'bước'} (${text.partB.optimalIs || 'Số bước tối ưu:'} ${level.minMoves} ${text.partB.stepsUnit || 'bước'})!
          </div>
          <button id="btn-next-puzzle-level" class="btn-big btn-primary">
            ${currentLevelIndex + 1 < totalLevels ? text.partB.nextLevel : (text.partB.allLevelsMastered || '🏆 Hoàn thành xuất sắc 5 Màn!')}
          </button>
        </div>
      `
          : ''
      }
    </div>
  `;
}
