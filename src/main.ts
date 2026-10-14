import './core/theme.css';
import confetti from 'canvas-confetti';
import { capacityLesson, capacityItems, capacityLevels, capacityText } from './lessons/capacity';
import { soundManager } from './core/audio';
import { renderBiMascot } from './components/speech-bubble';
import { VesselInteractionManager } from './core/interaction';
import { solveLevelBfs, isGoalReached } from './activities/bfs';
import { renderPredictRankStep } from './activities/predict-rank';
import { renderPourCompareStep, type PourCompareState } from './activities/pour-compare';
import { renderMeasureStep, type MeasureState } from './activities/measure';
import { renderExploreMode, type ExploreState } from './activities/explore';
import { renderGoalPuzzleMode, type GoalPuzzleState } from './activities/goal-puzzle';
import type { GlobalSettings, RouteState, Vessel, BiMood } from './core/types';

// ==========================================
// 1. Application State
// ==========================================

const settings: GlobalSettings = {
  showLiters: true,
  soundEnabled: true,
  reducedMotion: false,
};

let showTeacherModal = false;

let biState: { mood: BiMood; speech: string } = {
  mood: 'happy',
  speech: capacityText.home.biWelcome,
};

const route: RouteState = {
  view: 'home',
  partAStep: 1,
  partARoundIndex: 0,
  partBMode: 'explore',
  partBLevelIndex: 0,
};

// ==========================================
// 2. Part A Working State
// ==========================================

interface PartAState {
  currentRoundIndex: number;
  userGuessId: string | null;
  pourState: PourCompareState;
  measureState: MeasureState;
}

function initPartARound(roundIndex: number): PartAState {
  const round = capacityItems.rounds[roundIndex] || capacityItems.rounds[0];
  const itemA = round.items.find((it) => it.id === round.focusPair[0]) || round.items[0];
  const itemB = round.items.find((it) => it.id === round.focusPair[1]) || round.items[1];

  const sourceVessel: Vessel = {
    id: itemA.id,
    name: itemA.name,
    capacity: itemA.capacity,
    level: itemA.capacity, // Starts FULL
    shape: itemA.shape,
    width: itemA.width,
    height: itemA.height,
    color: itemA.color,
  };

  const targetVessel: Vessel = {
    id: itemB.id,
    name: itemB.name,
    capacity: itemB.capacity,
    level: 0, // Starts EMPTY
    shape: itemB.shape,
    width: itemB.width,
    height: itemB.height,
    color: itemB.color,
  };

  return {
    currentRoundIndex: roundIndex,
    userGuessId: null,
    pourState: {
      round,
      sourceVessel,
      targetVessel,
      outcome: 'none',
      isPouring: false,
      isSwapped: false,
    },
    measureState: {
      round,
      currentItem: round.items[0],
      measuredLevel: 0,
      userGuessId: null,
      measuredItems: {},
      isLastRound: roundIndex === capacityItems.rounds.length - 1,
    },
  };
}

let partA = initPartARound(0);

// ==========================================
// 3. Part B Working State
// ==========================================

// Free explore vessels (2L, 3L, 5L)
function createExploreVessels(): Vessel[] {
  return [
    { id: 'exp_2l', name: 'Bình 2L', capacity: 2, level: 0, shape: 'standard', color: '#FF70A6' },
    { id: 'exp_3l', name: 'Bình 3L', capacity: 3, level: 0, shape: 'standard', color: '#FF9770' },
    { id: 'exp_5l', name: 'Bình 5L', capacity: 5, level: 0, shape: 'standard', color: '#70D6FF' },
  ];
}

let exploreState: ExploreState = {
  vessels: createExploreVessels(),
  selectedVesselId: null,
  activeTool: null,
  isPouring: false,
  pouringSourceId: null,
  pouringTargetId: null,
};

// 5 Challenge Levels state
const completedPuzzleLevels: number[] = [];

function initPuzzleLevel(levelIndex: number): GoalPuzzleState {
  const level = capacityLevels.levels[levelIndex] || capacityLevels.levels[0];
  const vessels: Vessel[] = level.vessels.map((v) => ({
    id: v.id,
    name: v.name,
    capacity: v.capacity,
    level: v.initialLevel,
    shape: 'standard',
    color: v.color,
  }));

  return {
    level,
    totalLevels: capacityLevels.levels.length,
    currentLevelIndex: levelIndex,
    completedLevelIds: completedPuzzleLevels,
    vessels,
    movesCount: 0,
    selectedVesselId: null,
    isCompleted: false,
    activeHint: null,
    hintMove: null,
    activeTool: null,
    isPouring: false,
    pouringSourceId: null,
  };
}

let puzzleState = initPuzzleLevel(0);

// Interaction manager instance
let currentInteractionManager: VesselInteractionManager | null = null;

// ==========================================
// 4. Render Application Function
// ==========================================

function renderApp() {
  const app = document.getElementById('app');
  if (!app) return;

  const text = capacityText;

  // Cleanup old pointer events manager if existed
  if (currentInteractionManager) {
    currentInteractionManager.destroy();
    currentInteractionManager = null;
  }

  // Top toolbar (Non-fixed, mobile responsive)
  const toolbarHtml = `
    <header class="top-toolbar">
      <div class="toolbar-brand">
        <button id="btn-home" class="btn-big btn-toolbar btn-accent btn-circle" title="${text.toolbar.homeTitle}">
          🏠
        </button>
        <span class="font-title toolbar-title">
          ${text.common.appName}
        </span>
      </div>

      <div class="toolbar-actions">
        <button id="btn-reset" class="btn-big btn-toolbar btn-secondary" title="${text.toolbar.resetTitle}">
          <span>🔄</span>
          <span class="btn-label">${text.common.restart}</span>
        </button>
        <button id="btn-toggle-liters" class="btn-big btn-toolbar btn-primary" title="${text.toolbar.toggleLitersTitle}">
          <span>${settings.showLiters ? '👁️' : '🙈'}</span>
          <span class="btn-label">${settings.showLiters ? 'Hiện số lít' : 'Ẩn số lít'}</span>
        </button>
        <button id="btn-sound" class="btn-big btn-toolbar btn-accent btn-circle" title="${text.toolbar.soundTitle}">
          ${settings.soundEnabled ? '🔊' : '🔇'}
        </button>
        <button id="btn-teacher-guide" class="btn-big btn-toolbar btn-primary btn-teacher" title="${text.toolbar.teacherGuideTitle}">
          <span>👩‍🏫</span>
          <span class="btn-label">${text.home.forTeachers}</span>
        </button>
      </div>
    </header>
  `;

  // Bi Mascot HTML
  const biHtml = `
    <section style="margin-bottom: 24px;">
      ${renderBiMascot(biState)}
    </section>
  `;

  // Views rendering
  let contentHtml = '';

  if (route.view === 'home') {
    contentHtml = renderHomeView(text);
  } else if (route.view === 'partA') {
    contentHtml = renderPartAView(text);
  } else if (route.view === 'partB') {
    contentHtml = renderPartBView(text);
  }

  // Modal dialog for teachers
  const modalHtml = showTeacherModal ? renderTeacherModal(text) : '';

  app.innerHTML = `
    ${toolbarHtml}
    <main id="main-content" style="max-width: 1040px; margin: 24px auto; padding: 0 16px;">
      ${biHtml}
      ${contentHtml}
    </main>
    ${modalHtml}
  `;

  bindToolbarEvents();
  bindViewEvents();
}

// ==========================================
// 5. Views Rendering Helpers
// ==========================================

function renderHomeView(text: typeof capacityText): string {
  return `
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="font-size: 38px; color: var(--color-text); margin-bottom: 8px;">
        ${text.home.welcomeTitle}
      </h1>
      <p style="font-size: 20px; color: var(--color-text-light);">
        ${text.home.welcomeSubtitle}
      </p>
    </div>

    <!-- Navigation cards for Part A and Part B -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 28px; margin-bottom: 32px;">
      <!-- Part A Card -->
      <div id="nav-card-part-a" style="background: #ffffff; border-radius: var(--radius-lg); padding: 32px 24px; box-shadow: 0 10px 24px var(--color-shadow); border: 4px solid #BCD7ED; text-align: center; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-6px)'" onmouseout="this.style.transform='translateY(0)'">
        <div style="font-size: 64px; margin-bottom: 12px;">🏺 🍵 🪣</div>
        <h2 style="font-size: 26px; color: var(--color-text); margin-bottom: 10px;">
          ${text.home.partATitle}
        </h2>
        <p style="font-size: 17px; color: var(--color-text-light); margin-bottom: 24px; line-height: 1.5;">
          ${text.home.partASubtitle}
        </p>
        <button class="btn-big btn-primary" style="width: 100%;">
          ${text.partA.startPartA || 'Bắt đầu Phần A ➜'}
        </button>
      </div>

      <!-- Part B Card -->
      <div id="nav-card-part-b" style="background: #ffffff; border-radius: var(--radius-lg); padding: 32px 24px; box-shadow: 0 10px 24px var(--color-shadow); border: 4px solid #BCD7ED; text-align: center; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-6px)'" onmouseout="this.style.transform='translateY(0)'">
        <div style="font-size: 64px; margin-bottom: 12px;">💧 🧪 🎯</div>
        <h2 style="font-size: 26px; color: var(--color-text); margin-bottom: 10px;">
          ${text.home.partBTitle}
        </h2>
        <p style="font-size: 17px; color: var(--color-text-light); margin-bottom: 24px; line-height: 1.5;">
          ${text.home.partBSubtitle}
        </p>
        <button class="btn-big btn-accent" style="width: 100%;">
          ${text.partB.startPartB || 'Bắt đầu Phần B ➜'}
        </button>
      </div>
    </div>
  `;
}

function renderPartAView(text: typeof capacityText): string {
  const currentStep = route.partAStep || 1;

  // Step indicator navigation
  const stepNavHtml = `
    <div style="display: flex; justify-content: center; gap: 16px; margin-bottom: 24px; flex-wrap: wrap;">
      <button class="step-pill ${currentStep === 1 ? 'active' : 'inactive'}" data-nav-step="1">
        1️⃣ ${text.partA.step1Title}
      </button>
      <button class="step-pill ${currentStep === 2 ? 'active' : 'inactive'}" data-nav-step="2">
        2️⃣ ${text.partA.step2Title}
      </button>
      <button class="step-pill ${currentStep === 3 ? 'active' : 'inactive'}" data-nav-step="3">
        3️⃣ ${text.partA.step3Title}
      </button>
    </div>
  `;

  let stepContentHtml = '';

  if (currentStep === 1) {
    stepContentHtml = renderPredictRankStep({
      round: partA.pourState.round,
      totalRounds: capacityItems.rounds.length,
      currentRoundIndex: partA.currentRoundIndex,
      selectedItemId: partA.userGuessId,
      showLiters: settings.showLiters,
      text,
    });
  } else if (currentStep === 2) {
    stepContentHtml = renderPourCompareStep(partA.pourState, settings.showLiters, text);
  } else if (currentStep === 3) {
    stepContentHtml = renderMeasureStep(partA.measureState, settings.showLiters, text);
  }

  return `
    <div class="part-a-view">
      ${stepNavHtml}
      ${stepContentHtml}
    </div>
  `;
}

function renderPartBView(text: typeof capacityText): string {
  const currentMode = route.partBMode || 'explore';

  const modeNavHtml = `
    <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 24px;">
      <button class="btn-big ${currentMode === 'explore' ? 'btn-accent' : 'btn-primary'}" id="btn-partb-mode-explore">
        🧪 ${text.partB.modeExplore}
      </button>
      <button class="btn-big ${currentMode === 'challenge' ? 'btn-accent' : 'btn-primary'}" id="btn-partb-mode-challenge">
        🎯 ${text.partB.modeChallenge}
      </button>
    </div>
  `;

  let modeContentHtml = '';
  if (currentMode === 'explore') {
    modeContentHtml = renderExploreMode(exploreState, settings.showLiters, text);
  } else {
    modeContentHtml = renderGoalPuzzleMode(puzzleState, settings.showLiters, text);
  }

  return `
    <div class="part-b-view">
      ${modeNavHtml}
      ${modeContentHtml}
    </div>
  `;
}

function renderTeacherModal(text: typeof capacityText): string {
  return `
    <div class="modal-backdrop" id="teacher-modal-backdrop">
      <div class="modal-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="font-size: 26px; color: var(--color-text);">
            👩‍🏫 ${text.teacher.title}
          </h2>
          <button id="btn-close-modal" class="btn-big btn-secondary btn-circle" style="width: 48px; height: 48px; min-width: 48px; min-height: 48px;">
            ✕
          </button>
        </div>

        <div style="font-size: 17px; color: var(--color-text); line-height: 1.6; display: flex; flex-direction: column; gap: 14px;">
          <div style="background: #F0F9FF; border-left: 5px solid #3DA9FC; border-radius: 12px; padding: 12px 16px;">
            ${text.teacher.guide1}
          </div>
          <div style="background: #F0F9FF; border-left: 5px solid #3DA9FC; border-radius: 12px; padding: 12px 16px;">
            ${text.teacher.guide2}
          </div>
          <div style="background: #F0F9FF; border-left: 5px solid #3DA9FC; border-radius: 12px; padding: 12px 16px;">
            ${text.teacher.guide3}
          </div>
          <div style="background: #F0F9FF; border-left: 5px solid #3DA9FC; border-radius: 12px; padding: 12px 16px;">
            ${text.teacher.guide4}
          </div>
          <div style="background: #F0F9FF; border-left: 5px solid #3DA9FC; border-radius: 12px; padding: 12px 16px;">
            ${text.teacher.guide5}
          </div>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <button id="btn-modal-done" class="btn-big btn-primary">
            ${text.teacher.understood || 'Đã hiểu, quay lại lớp học!'}
          </button>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// 6. Event Bindings
// ==========================================

function bindToolbarEvents() {
  // Home
  document.getElementById('btn-home')?.addEventListener('click', () => {
    soundManager.playPop();
    route.view = 'home';
    biState = { mood: 'happy', speech: capacityText.home.biWelcome };
    renderApp();
  });

  // Sound toggle
  document.getElementById('btn-sound')?.addEventListener('click', () => {
    settings.soundEnabled = !settings.soundEnabled;
    soundManager.setEnabled(settings.soundEnabled);
    if (settings.soundEnabled) soundManager.playPop();
    renderApp();
  });

  // Toggle Liters
  document.getElementById('btn-toggle-liters')?.addEventListener('click', () => {
    soundManager.playPop();
    settings.showLiters = !settings.showLiters;
    document.querySelectorAll('.liter-label').forEach((el) => {
      el.classList.toggle('hidden-liter', !settings.showLiters);
    });
    renderApp();
  });

  // Reset current view
  document.getElementById('btn-reset')?.addEventListener('click', () => {
    soundManager.playPop();
    handleReset();
  });

  // Teacher guide modal
  document.getElementById('btn-teacher-guide')?.addEventListener('click', () => {
    soundManager.playPop();
    showTeacherModal = true;
    renderApp();
  });

  // Close modal
  document.getElementById('btn-close-modal')?.addEventListener('click', () => {
    soundManager.playPop();
    showTeacherModal = false;
    renderApp();
  });
  document.getElementById('btn-modal-done')?.addEventListener('click', () => {
    soundManager.playPop();
    showTeacherModal = false;
    renderApp();
  });
  document.getElementById('teacher-modal-backdrop')?.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).id === 'teacher-modal-backdrop') {
      showTeacherModal = false;
      renderApp();
    }
  });
}

function handleReset() {
  if (route.view === 'partA') {
    partA = initPartARound(partA.currentRoundIndex);
    biState = { mood: 'happy', speech: partA.pourState.round.instruction };
  } else if (route.view === 'partB') {
    if (route.partBMode === 'explore') {
      exploreState.vessels = createExploreVessels();
      exploreState.selectedVesselId = null;
      exploreState.activeTool = null;
      biState = { mood: 'happy', speech: capacityText.partB.exploreWelcome };
    } else {
      puzzleState = initPuzzleLevel(puzzleState.currentLevelIndex);
      biState = { mood: 'happy', speech: puzzleState.level.instruction };
    }
  } else {
    biState = { mood: 'happy', speech: capacityText.home.biWelcome };
  }
  renderApp();
}

function bindViewEvents() {
  // Home View Card clicks
  document.getElementById('nav-card-part-a')?.addEventListener('click', () => {
    soundManager.playPop();
    route.view = 'partA';
    route.partAStep = 1;
    biState = { mood: 'happy', speech: partA.pourState.round.instruction };
    renderApp();
  });

  document.getElementById('nav-card-part-b')?.addEventListener('click', () => {
    soundManager.playPop();
    route.view = 'partB';
    route.partBMode = 'explore';
    biState = { mood: 'happy', speech: capacityText.partB.exploreWelcome };
    renderApp();
  });

  // Part A Step Navigation Pills
  document.querySelectorAll('[data-nav-step]').forEach((el) => {
    el.addEventListener('click', () => {
      soundManager.playPop();
      const step = parseInt((el as HTMLElement).dataset.navStep || '1', 10) as 1 | 2 | 3;
      route.partAStep = step;
      updateBiForPartAStep(step);
      renderApp();
    });
  });

  // Part A: Step 1 Round switch
  document.querySelectorAll('[data-nav-round]').forEach((el) => {
    el.addEventListener('click', () => {
      soundManager.playPop();
      const roundIdx = parseInt((el as HTMLElement).dataset.navRound || '0', 10);
      partA = initPartARound(roundIdx);
      route.partAStep = 1;
      biState = { mood: 'happy', speech: partA.pourState.round.instruction };
      renderApp();
    });
  });

  // Part A: Step 1 Select Item Guess
  document.querySelectorAll('[data-predict-item-id]').forEach((el) => {
    el.addEventListener('click', () => {
      soundManager.playPop();
      const itemId = (el as HTMLElement).dataset.predictItemId || null;
      partA.userGuessId = itemId;
      partA.measureState.userGuessId = itemId;
      biState = {
        mood: 'thinking',
        speech: `Em đã chọn ${partA.pourState.round.items.find((i) => i.id === itemId)?.name}! Nhấn "Tiếp tục" để thử đổ nước đối chiếu nhé!`,
      };
      renderApp();
    });
  });

  // Part A: Step 1 Next button
  document.getElementById('btn-predict-next')?.addEventListener('click', () => {
    soundManager.playPop();
    route.partAStep = 2;
    biState = {
      mood: 'happy',
      speech: capacityText.partA.pourPrompt,
    };
    renderApp();
  });

  // Part A: Step 2 Pour action
  document.getElementById('btn-do-pour')?.addEventListener('click', () => {
    executePartAPour();
  });

  // Part A: Step 2 Swap roles
  document.getElementById('btn-swap-roles')?.addEventListener('click', () => {
    soundManager.playPop();
    const temp = partA.pourState.sourceVessel;
    partA.pourState.sourceVessel = {
      ...partA.pourState.targetVessel,
      level: partA.pourState.targetVessel.capacity, // New source starts full
    };
    partA.pourState.targetVessel = {
      ...temp,
      level: 0, // New target starts empty
    };
    partA.pourState.outcome = 'none';
    partA.pourState.isSwapped = !partA.pourState.isSwapped;
    biState = {
      mood: 'happy',
      speech: `Đã đổi chỗ! Bây giờ ${partA.pourState.sourceVessel.name} sẽ đổ sang ${partA.pourState.targetVessel.name}!`,
    };
    renderApp();
  });

  // Part A: Step 2 Reset pour
  document.getElementById('btn-reset-pour')?.addEventListener('click', () => {
    soundManager.playPop();
    partA.pourState.sourceVessel.level = partA.pourState.sourceVessel.capacity;
    partA.pourState.targetVessel.level = 0;
    partA.pourState.outcome = 'none';
    biState = { mood: 'happy', speech: capacityText.partA.pourPrompt };
    renderApp();
  });

  // Part A: Step 2 Proceed to Step 3
  document.getElementById('btn-proceed-measure')?.addEventListener('click', () => {
    soundManager.playPop();
    route.partAStep = 3;
    biState = {
      mood: 'pointing',
      speech: capacityText.partA.measurePrompt,
    };
    renderApp();
  });

  // Part A: Step 3 Measure item buttons
  document.querySelectorAll('[data-measure-item-id]').forEach((el) => {
    el.addEventListener('click', () => {
      const itemId = (el as HTMLElement).dataset.measureItemId;
      const item = partA.pourState.round.items.find((it) => it.id === itemId);
      if (!item) return;

      soundManager.playWaterPour(600);
      partA.measureState.currentItem = item;
      partA.measureState.measuredLevel = item.capacity;
      partA.measureState.measuredItems[item.id] = item.capacity;

      // Check if all items in round are measured
      const allDone = partA.pourState.round.items.every(
        (it) => partA.measureState.measuredItems[it.id] !== undefined
      );

      if (allDone) {
        const highestItem = partA.pourState.round.items.reduce((max, it) =>
          it.capacity > max.capacity ? it : max
        );
        const isCorrect = partA.userGuessId === highestItem.id;
        if (isCorrect) {
          soundManager.playTing();
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          biState = {
            mood: 'celebrating',
            speech: capacityText.partA.guessCorrect,
          };
        } else {
          biState = {
            mood: 'thinking',
            speech: capacityText.partA.guessIncorrect,
          };
        }
      } else {
        biState = {
          mood: 'happy',
          speech: `Đã đong ${item.name}: đúng ${item.capacity} lít! Hãy đong tiếp các đồ vật còn lại nhé!`,
        };
      }

      renderApp();
    });
  });

  // Part A: Step 3 Next Round button
  document.getElementById('btn-measure-next-round')?.addEventListener('click', () => {
    soundManager.playPop();
    const nextRoundIndex = partA.currentRoundIndex + 1;
    if (nextRoundIndex < capacityItems.rounds.length) {
      partA = initPartARound(nextRoundIndex);
      route.partAStep = 1;
      biState = {
        mood: 'happy',
        speech: `Chào mừng em đến với ${partA.pourState.round.title}!`,
      };
      renderApp();
    } else {
      // Completed all Part A rounds! Switch to Part B
      soundManager.playTing();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      route.view = 'partB';
      route.partBMode = 'explore';
      biState = {
        mood: 'celebrating',
        speech: 'Xuất sắc! Em đã hoàn thành trọn bộ Phần A! Bây giờ cùng Bi thử thách đong nước ở Phần B nhé!',
      };
      renderApp();
    }
  });

  // Part B Mode switcher
  document.getElementById('btn-partb-mode-explore')?.addEventListener('click', () => {
    soundManager.playPop();
    route.partBMode = 'explore';
    biState = { mood: 'happy', speech: capacityText.partB.exploreWelcome };
    renderApp();
  });

  document.getElementById('btn-partb-mode-challenge')?.addEventListener('click', () => {
    soundManager.playPop();
    route.partBMode = 'challenge';
    biState = { mood: 'happy', speech: puzzleState.level.instruction };
    renderApp();
  });

  // Part B Challenge Level Switcher Tabs
  document.querySelectorAll('[data-nav-level]').forEach((el) => {
    el.addEventListener('click', () => {
      soundManager.playPop();
      const lvlIdx = parseInt((el as HTMLElement).dataset.navLevel || '0', 10);
      puzzleState = initPuzzleLevel(lvlIdx);
      biState = { mood: 'happy', speech: puzzleState.level.instruction };
      renderApp();
    });
  });

  // Part B Challenge: Hint Button (BFS shortest path)
  document.getElementById('puzzle-hint-btn')?.addEventListener('click', () => {
    soundManager.playPop();
    handleBfsHint();
  });

  // Part B Challenge: Reset Level
  document.getElementById('puzzle-reset-btn')?.addEventListener('click', () => {
    soundManager.playPop();
    puzzleState = initPuzzleLevel(puzzleState.currentLevelIndex);
    biState = { mood: 'happy', speech: puzzleState.level.instruction };
    renderApp();
  });

  // Part B Challenge: Next Level Button
  document.getElementById('btn-next-puzzle-level')?.addEventListener('click', () => {
    soundManager.playPop();
    const nextLvl = puzzleState.currentLevelIndex + 1;
    if (nextLvl < capacityLevels.levels.length) {
      puzzleState = initPuzzleLevel(nextLvl);
      biState = { mood: 'happy', speech: puzzleState.level.instruction };
      renderApp();
    } else {
      // Completed all 5 levels!
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.4 } });
      soundManager.playTing();
      biState = {
        mood: 'celebrating',
        speech: capacityText.partB.allLevelsCompleted,
      };
      renderApp();
    }
  });

  // Part B Explore Reset
  document.getElementById('btn-explore-reset')?.addEventListener('click', () => {
    soundManager.playPop();
    exploreState.vessels = createExploreVessels();
    exploreState.selectedVesselId = null;
    exploreState.activeTool = null;
    biState = { mood: 'happy', speech: capacityText.partB.exploreWelcome };
    renderApp();
  });

  // Part B Tap & Sink Tool Buttons direct click handlers
  const handleTapToolClick = (isPuzzle: boolean) => {
    soundManager.playPop();
    if (isPuzzle) {
      if (puzzleState.isCompleted || !puzzleState.level.tools.tap) return;
      if (puzzleState.selectedVesselId) {
        const vId = puzzleState.selectedVesselId;
        puzzleState.selectedVesselId = null;
        handlePuzzleFill(vId);
      } else {
        if (puzzleState.activeTool === 'tap') {
          puzzleState.activeTool = null;
          biState = { mood: 'happy', speech: 'Đã đóng vòi nước.' };
        } else {
          puzzleState.activeTool = 'tap';
          biState = {
            mood: 'pointing',
            speech: 'Vòi nước đã mở 💧! Hãy chạm vào chiếc bình em muốn đổ đầy nước nhé!',
          };
        }
        renderApp();
      }
    } else {
      if (exploreState.selectedVesselId) {
        const vId = exploreState.selectedVesselId;
        exploreState.selectedVesselId = null;
        handleExploreFill(vId);
      } else {
        if (exploreState.activeTool === 'tap') {
          exploreState.activeTool = null;
          biState = { mood: 'happy', speech: 'Đã đóng vòi nước.' };
        } else {
          exploreState.activeTool = 'tap';
          biState = {
            mood: 'pointing',
            speech: 'Vòi nước đã mở 💧! Hãy chạm vào chiếc bình em muốn đổ đầy nước nhé!',
          };
        }
        renderApp();
      }
    }
  };

  const handleSinkToolClick = (isPuzzle: boolean) => {
    soundManager.playPop();
    if (isPuzzle) {
      if (puzzleState.isCompleted || !puzzleState.level.tools.sink) return;
      if (puzzleState.selectedVesselId) {
        const vId = puzzleState.selectedVesselId;
        puzzleState.selectedVesselId = null;
        handlePuzzleEmpty(vId);
      } else {
        if (puzzleState.activeTool === 'sink') {
          puzzleState.activeTool = null;
          biState = { mood: 'happy', speech: 'Đã đóng cống xả.' };
        } else {
          puzzleState.activeTool = 'sink';
          biState = {
            mood: 'pointing',
            speech: 'Cống xả đã sẵn sàng 🌀! Hãy chạm vào chiếc bình em muốn xả hết nước nhé!',
          };
        }
        renderApp();
      }
    } else {
      if (exploreState.selectedVesselId) {
        const vId = exploreState.selectedVesselId;
        exploreState.selectedVesselId = null;
        handleExploreEmpty(vId);
      } else {
        if (exploreState.activeTool === 'sink') {
          exploreState.activeTool = null;
          biState = { mood: 'happy', speech: 'Đã đóng cống xả.' };
        } else {
          exploreState.activeTool = 'sink';
          biState = {
            mood: 'pointing',
            speech: 'Cống xả đã sẵn sàng 🌀! Hãy chạm vào chiếc bình em muốn xả hết nước nhé!',
          };
        }
        renderApp();
      }
    }
  };

  document.getElementById('tool-tap-btn')?.addEventListener('click', () => handleTapToolClick(false));
  document.getElementById('tool-sink-btn')?.addEventListener('click', () => handleSinkToolClick(false));
  document.getElementById('puzzle-tap-btn')?.addEventListener('click', () => handleTapToolClick(true));
  document.getElementById('puzzle-sink-btn')?.addEventListener('click', () => handleSinkToolClick(true));

  // Dual Pointer Events Initialization
  initInteractionManager();
}

function updateBiForPartAStep(step: 1 | 2 | 3) {
  if (step === 1) {
    biState = { mood: 'happy', speech: partA.pourState.round.instruction };
  } else if (step === 2) {
    biState = { mood: 'happy', speech: capacityText.partA.pourPrompt };
  } else if (step === 3) {
    biState = { mood: 'pointing', speech: capacityText.partA.measurePrompt };
  }
}

// ==========================================
// 7. Part A Step 2 Pouring Logic
// ==========================================

function executePartAPour() {
  const { sourceVessel, targetVessel } = partA.pourState;
  if (sourceVessel.level === 0) {
    biState = { mood: 'thinking', speech: capacityText.bi.vesselEmpty };
    soundManager.playPop();
    renderApp();
    return;
  }

  soundManager.playWaterPour(700);
  partA.pourState.isPouring = true;
  renderApp();

  setTimeout(() => {
    partA.pourState.isPouring = false;

    // Direct comparison outcome logic
    if (sourceVessel.capacity > targetVessel.capacity) {
      // A > B: Target fills completely, source has remaining water, excess overflows!
      targetVessel.level = targetVessel.capacity;
      sourceVessel.level = sourceVessel.capacity - targetVessel.capacity;
      partA.pourState.outcome = 'overflow';
      biState = {
        mood: 'sad',
        speech: capacityText.partA.resultOverflow,
      };
    } else if (sourceVessel.capacity === targetVessel.capacity) {
      // A == B: Exactly fills
      targetVessel.level = targetVessel.capacity;
      sourceVessel.level = 0;
      partA.pourState.outcome = 'exact';
      biState = {
        mood: 'celebrating',
        speech: capacityText.partA.resultExact,
      };
      soundManager.playTing();
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    } else {
      // A < B: Source empties, target still has room
      targetVessel.level = sourceVessel.capacity;
      sourceVessel.level = 0;
      partA.pourState.outcome = 'underflow';
      biState = {
        mood: 'thinking',
        speech: capacityText.partA.resultUnderflow,
      };
    }

    renderApp();
  }, 400);
}

// ==========================================
// 8. Part B Interaction Handling
// ==========================================

function initInteractionManager() {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  if (currentInteractionManager) {
    currentInteractionManager.destroy();
    currentInteractionManager = null;
  }

  if (route.view === 'partB') {
    if (route.partBMode === 'explore') {
      currentInteractionManager = new VesselInteractionManager(
        mainContent,
        {
          onPour: handleExplorePour,
          onFill: handleExploreFill,
          onEmpty: handleExploreEmpty,
          onSelect: (vId) => {
            if (!vId) {
              exploreState.selectedVesselId = null;
              renderApp();
              return;
            }
            if (exploreState.activeTool === 'tap') {
              exploreState.activeTool = null;
              handleExploreFill(vId);
              return;
            }
            if (exploreState.activeTool === 'sink') {
              exploreState.activeTool = null;
              handleExploreEmpty(vId);
              return;
            }
            exploreState.selectedVesselId = vId;
            const v = exploreState.vessels.find((x) => x.id === vId);
            biState = {
              mood: 'pointing',
              speech: `Em đã chọn ${v?.name}. Chạm bình khác để rót, hoặc chạm vòi 💧/cống 🌀!`,
            };
            soundManager.playPop();
            renderApp();
          },
        },
        exploreState.selectedVesselId
      );
    } else if (route.partBMode === 'challenge') {
      currentInteractionManager = new VesselInteractionManager(
        mainContent,
        {
          onPour: handlePuzzlePour,
          onFill: handlePuzzleFill,
          onEmpty: handlePuzzleEmpty,
          onSelect: (vId) => {
            if (!vId) {
              puzzleState.selectedVesselId = null;
              renderApp();
              return;
            }
            if (puzzleState.activeTool === 'tap') {
              puzzleState.activeTool = null;
              handlePuzzleFill(vId);
              return;
            }
            if (puzzleState.activeTool === 'sink') {
              puzzleState.activeTool = null;
              handlePuzzleEmpty(vId);
              return;
            }
            puzzleState.selectedVesselId = vId;
            const v = puzzleState.vessels.find((x) => x.id === vId);
            biState = {
              mood: 'pointing',
              speech: `Em đã chọn ${v?.name}. Chạm bình khác để rót, hoặc chạm vòi 💧/cống 🌀!`,
            };
            soundManager.playPop();
            renderApp();
          },
        },
        puzzleState.selectedVesselId
      );
    }
  } else if (route.view === 'partA' && route.partAStep === 2) {
    currentInteractionManager = new VesselInteractionManager(mainContent, {
      onPour: () => {
        executePartAPour();
      },
    });
  }
}

// Free explore handlers
function handleExplorePour(fromId: string, toId: string) {
  const from = exploreState.vessels.find((v) => v.id === fromId);
  const to = exploreState.vessels.find((v) => v.id === toId);
  if (!from || !to || from.id === to.id) return;

  if (from.level === 0) {
    biState = { mood: 'thinking', speech: capacityText.bi.vesselEmpty };
    soundManager.playPop();
    renderApp();
    return;
  }
  if (to.level === to.capacity) {
    biState = { mood: 'thinking', speech: capacityText.bi.vesselFull };
    soundManager.playPop();
    renderApp();
    return;
  }

  const amount = Math.min(from.level, to.capacity - to.level);
  if (amount <= 0) return;

  soundManager.playWaterPour(650);
  exploreState.isPouring = true;
  exploreState.pouringSourceId = fromId;
  exploreState.pouringTargetId = toId;
  renderApp();

  setTimeout(() => {
    from.level -= amount;
    to.level += amount;
    exploreState.isPouring = false;
    exploreState.pouringSourceId = null;
    exploreState.pouringTargetId = null;
    exploreState.selectedVesselId = null;
    biState = {
      mood: 'happy',
      speech: `Róc rách! Đã đổ ${amount} lít từ ${from.name} sang ${to.name}!`,
    };
    renderApp();
  }, 350);
}

function handleExploreFill(vesselId: string) {
  const v = exploreState.vessels.find((x) => x.id === vesselId);
  if (!v) return;

  if (v.level === v.capacity) {
    biState = { mood: 'thinking', speech: capacityText.bi.vesselFull };
    soundManager.playPop();
    renderApp();
    return;
  }

  soundManager.playWaterPour(600);
  exploreState.activeTool = 'tap';
  renderApp();

  setTimeout(() => {
    v.level = v.capacity;
    exploreState.activeTool = null;
    exploreState.selectedVesselId = null;
    biState = {
      mood: 'happy',
      speech: `Vòi nước đã làm đầy ${v.name} (${v.capacity} lít)!`,
    };
    renderApp();
  }, 300);
}

function handleExploreEmpty(vesselId: string) {
  const v = exploreState.vessels.find((x) => x.id === vesselId);
  if (!v) return;

  if (v.level === 0) {
    biState = { mood: 'thinking', speech: capacityText.bi.vesselEmpty };
    soundManager.playPop();
    renderApp();
    return;
  }

  soundManager.playWaterPour(500);
  exploreState.activeTool = 'sink';
  renderApp();

  setTimeout(() => {
    v.level = 0;
    exploreState.activeTool = null;
    exploreState.selectedVesselId = null;
    biState = {
      mood: 'happy',
      speech: `Đã xả hết nước trong ${v.name} vào cống!`,
    };
    renderApp();
  }, 300);
}

// Challenge Puzzle handlers
function handlePuzzlePour(fromId: string, toId: string) {
  if (puzzleState.isCompleted) return;

  const from = puzzleState.vessels.find((v) => v.id === fromId);
  const to = puzzleState.vessels.find((v) => v.id === toId);
  if (!from || !to || from.id === to.id) return;

  if (from.level === 0) {
    biState = { mood: 'thinking', speech: capacityText.bi.vesselEmpty };
    soundManager.playPop();
    renderApp();
    return;
  }
  if (to.level === to.capacity) {
    biState = { mood: 'thinking', speech: capacityText.bi.vesselFull };
    soundManager.playPop();
    renderApp();
    return;
  }

  const amount = Math.min(from.level, to.capacity - to.level);
  if (amount <= 0) return;

  soundManager.playWaterPour(650);
  puzzleState.isPouring = true;
  puzzleState.pouringSourceId = fromId;
  puzzleState.pouringTargetId = toId;
  renderApp();

  setTimeout(() => {
    from.level -= amount;
    to.level += amount;
    puzzleState.isPouring = false;
    puzzleState.pouringSourceId = null;
    puzzleState.pouringTargetId = null;
    puzzleState.selectedVesselId = null;
    puzzleState.movesCount += 1;
    puzzleState.activeHint = null;
    puzzleState.hintMove = null;

    checkPuzzleGoal();
  }, 350);
}

function handlePuzzleFill(vesselId: string) {
  if (puzzleState.isCompleted || !puzzleState.level.tools.tap) return;

  const v = puzzleState.vessels.find((x) => x.id === vesselId);
  if (!v) return;

  if (v.level === v.capacity) {
    biState = { mood: 'thinking', speech: capacityText.bi.vesselFull };
    soundManager.playPop();
    renderApp();
    return;
  }

  soundManager.playWaterPour(600);
  puzzleState.activeTool = 'tap';
  renderApp();

  setTimeout(() => {
    v.level = v.capacity;
    puzzleState.activeTool = null;
    puzzleState.selectedVesselId = null;
    puzzleState.movesCount += 1;
    puzzleState.activeHint = null;
    puzzleState.hintMove = null;

    checkPuzzleGoal();
  }, 300);
}

function handlePuzzleEmpty(vesselId: string) {
  if (puzzleState.isCompleted || !puzzleState.level.tools.sink) return;

  const v = puzzleState.vessels.find((x) => x.id === vesselId);
  if (!v) return;

  if (v.level === 0) {
    biState = { mood: 'thinking', speech: capacityText.bi.vesselEmpty };
    soundManager.playPop();
    renderApp();
    return;
  }

  soundManager.playWaterPour(500);
  puzzleState.activeTool = 'sink';
  renderApp();

  setTimeout(() => {
    v.level = 0;
    puzzleState.activeTool = null;
    puzzleState.selectedVesselId = null;
    puzzleState.movesCount += 1;
    puzzleState.activeHint = null;
    puzzleState.hintMove = null;

    checkPuzzleGoal();
  }, 300);
}

function checkPuzzleGoal() {
  const currentLevels = puzzleState.vessels.map((v) => v.level);
  const win = isGoalReached(currentLevels, puzzleState.level);

  if (win) {
    puzzleState.isCompleted = true;
    if (!completedPuzzleLevels.includes(puzzleState.level.id)) {
      completedPuzzleLevels.push(puzzleState.level.id);
    }
    soundManager.playTing();
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    biState = {
      mood: 'celebrating',
      speech: capacityText.bi.celebrate || 'Tuyệt vời ông mặt trời! Em thật là thông minh!',
    };
  } else {
    biState = {
      mood: 'happy',
      speech: `Bước ${puzzleState.movesCount}: Em đang tiến gần hơn tới mục tiêu rồi đấy!`,
    };
  }

  renderApp();
}

function handleBfsHint() {
  if (puzzleState.isCompleted) {
    biState = { mood: 'celebrating', speech: capacityText.partB.noHintAvailable };
    renderApp();
    return;
  }

  const currentLevels = puzzleState.vessels.map((v) => v.level);
  const bfsResult = solveLevelBfs(puzzleState.level, currentLevels);

  if (bfsResult.solved && bfsResult.nextStepExplanation) {
    puzzleState.activeHint = bfsResult.nextStepExplanation;
    puzzleState.hintMove = bfsResult.nextMove;
    biState = {
      mood: 'pointing',
      speech: `Gợi ý của Bi: ${bfsResult.nextStepExplanation}`,
    };
  } else {
    // If current state reached dead-end, advise reset
    puzzleState.activeHint = 'Không còn đường đi từ trạng thái hiện tại. Em hãy bấm nút "Làm lại" để thử lại nhé!';
    puzzleState.hintMove = null;
    biState = {
      mood: 'thinking',
      speech: 'Trạng thái này chưa tới được đích. Hãy bấm "Làm lại" để bắt đầu lại nhé!',
    };
  }

  renderApp();
}

// Initial application mount
renderApp();

console.log('Vui học dung tích application initialized successfully!');
console.log('Loaded lessons metadata:', capacityLesson);
console.log('Comparison rounds:', capacityItems.rounds.length);
console.log('Challenge levels:', capacityLevels.levels.length);
