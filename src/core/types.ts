/**
 * Vui học dung tích (Toán lớp 2)
 * Core Type Definitions
 * Based on plan.md specifications (Sections 6, 9)
 */

// ==========================================
// 1. Vessels & Fluid Logic
// ==========================================

export interface Vessel {
  id: string;
  name: string;
  capacity: number; // Integer liters only (1, 2, 3, 4, 5)
  level: number;    // Current water amount (0 <= level <= capacity)
  color?: string;
  width?: number;   // Visual relative width (SVG)
  height?: number;  // Visual relative height (SVG)
  shape?: 'bottle' | 'vase' | 'teapot' | 'bucket_small' | 'bucket_large' | 'standard';
}

export type Move =
  | { type: 'pour'; from: string; to: string }
  | { type: 'fill'; vessel: string }   // From tap/faucet
  | { type: 'empty'; vessel: string }; // Into sink/drain

export interface GameState {
  vessels: Vessel[];
  moves: Move[];
}

export interface PourResult {
  amount: number;
  fromLevelBefore: number;
  fromLevelAfter: number;
  toLevelBefore: number;
  toLevelAfter: number;
  isOverflowAttempt?: boolean;
  isFull: boolean;
  isEmpty: boolean;
}

/**
 * Pure pouring calculation adhering to plan.md section 6.2:
 * amount = Math.min(from.level, to.capacity - to.level)
 */
export function calculatePour(from: Vessel, to: Vessel): number {
  return Math.min(from.level, to.capacity - to.level);
}

// ==========================================
// 2. Part B: Challenge Levels & BFS Solver
// ==========================================

export interface VesselConfig {
  id: string;
  name: string;
  capacity: number;
  initialLevel: number;
  color?: string;
}

export interface LevelGoal {
  type: 'exact' | 'any';
  vesselId?: string; // If 'exact', target vessel ID
  targetLevel: number; // Target liter amount
  description: string; // Vietnamese explanation of goal
}

export interface LevelTools {
  tap: boolean; // Is tap/faucet available?
  sink: boolean; // Is drain/sink available?
}

export interface LevelConfig {
  id: number;
  title: string;
  description: string;
  instruction: string;
  tools: LevelTools;
  vessels: VesselConfig[];
  goal: LevelGoal;
  minMoves: number;
  optimalMoves?: Move[];
  hintSteps?: string[];
}

export interface LevelsData {
  levels: LevelConfig[];
}

// ==========================================
// 3. Part A: Items, Prediction & Measurement
// ==========================================

export interface Item {
  id: string;
  name: string;
  capacity: number; // In liters (e.g., 1, 2, 3, 4, 5)
  height: number;   // Visual height in px (e.g., 180)
  width: number;    // Visual width in px (e.g., 60 - can be tall & thin vs short & wide)
  shape: 'bottle' | 'vase' | 'teapot' | 'bucket_small' | 'bucket_large';
  color: string;
  label: string;
  description: string;
}

export interface ItemRound {
  id: string;
  roundNumber: number;
  title: string;
  instruction: string;
  items: Item[];
  focusPair: [string, string]; // IDs of 2 items to compare in Step 2
  misleadingAspect?: 'height_vs_width' | 'different_shapes' | 'identical_capacity' | 'obvious';
  biHint: string;
}

export interface ItemsData {
  catalog: Record<string, Item>;
  rounds: ItemRound[];
}

// ==========================================
// 4. Mascot Bi & Audio
// ==========================================

export type BiMood =
  | 'happy'       // Smiling, waving
  | 'thinking'    // Eye looking up, wondering
  | 'surprised'   // O-shaped mouth, wide eyes
  | 'celebrating' // Joyful, jumping, stars
  | 'sad'         // Mild concern (e.g. water spilled)
  | 'pointing';   // Directing attention

export interface BiState {
  mood: BiMood;
  speech: string;
  isVisible: boolean;
}

// ==========================================
// 5. Application Routing & Global Settings
// ==========================================

export type ScreenView = 'home' | 'partA' | 'partB' | 'teacher';

export type PartAStep = 1 | 2 | 3; // 1: Predict, 2: Pour/Compare, 3: Measure

export type PartBMode = 'explore' | 'challenge';

export interface RouteState {
  view: ScreenView;
  partAStep?: PartAStep;
  partARoundIndex?: number;
  partBMode?: PartBMode;
  partBLevelIndex?: number;
}

export interface GlobalSettings {
  showLiters: boolean;      // Teacher toggle: show/hide liter numbers
  soundEnabled: boolean;    // Mute/unmute sounds
  reducedMotion: boolean;   // Reduce heavy animations
}

// ==========================================
// 6. Lesson Configuration (Section 9.3)
// ==========================================

export interface ActivityDefinition {
  id: string;
  type: 'predict-rank' | 'pour-compare' | 'measure' | 'explore' | 'goal-puzzle';
  title: string;
  dataFile: string;
}

export interface LessonConfig {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  unit: string;
  allowDecimals: boolean;
  targetGrade: number;
  activities: ActivityDefinition[];
}

// ==========================================
// 7. Vietnamese Localization Schema
// ==========================================

export interface TextDictionary {
  common: {
    appName: string;
    back: string;
    next: string;
    prev: string;
    restart: string;
    finish: string;
    liters: string;
    literAbbr: string;
    home: string;
    level: string;
    round?: string;
    congratulations: string;
    close: string;
    step: string;
    hint?: string;
    loading?: string;
    sourceVessel?: string;
    targetVessel?: string;
    pourAction?: string;
    measureAction?: string;
    measuringTitle?: string;
    capacityLabel?: string;
    tapTitle?: string;
    tapDisplay?: string;
    sinkTitle?: string;
    sinkDisplay?: string;
    measuringCupName?: string;
  };
  toolbar: {
    homeTitle: string;
    resetTitle: string;
    toggleLitersTitle: string;
    soundTitle: string;
    teacherGuideTitle: string;
  };
  home: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    biWelcome: string;
    partATitle: string;
    partASubtitle: string;
    partBTitle: string;
    partBSubtitle: string;
    forTeachers: string;
  };
  partA: {
    title: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    predictPrompt: string;
    predictInstruction?: string;
    pourPrompt: string;
    measurePrompt: string;
    swapVessels: string;
    pourAgain: string;
    nextRound: string;
    compareSummary: string;
    resultOverflow: string;
    resultExact: string;
    resultUnderflow: string;
    guessCorrect: string;
    guessIncorrect: string;
    tapToSelect?: string;
    selectedBadge?: string;
    dragToPourInstruction?: string;
    step2Button?: string;
    measureListPrompt?: string;
    finishPartA?: string;
    startPartA?: string;
    yourGuess?: string;
    actualCapacity?: string;
    measuringCupTitle?: string;
  };
  partB: {
    title: string;
    modeExplore: string;
    modeChallenge: string;
    exploreWelcome: string;
    tapLabel: string;
    sinkLabel: string;
    dragHelp: string;
    tapHelp: string;
    goalLabel: string;
    hintButton: string;
    noHintAvailable: string;
    nextLevel: string;
    allLevelsCompleted: string;
    movesCount: string;
    bestMoves?: string;
    congratsTitle?: string;
    currentLevel?: string;
    selectLevel?: string;
    startPartB?: string;
    tapFullTitle?: string;
    sinkEmptyTitle?: string;
    bfsHintTitle?: string;
    resetLevelTitle?: string;
    biHintPrefix?: string;
    allLevelsMastered?: string;
    completedInMoves?: string;
    optimalIs?: string;
    stepsUnit?: string;
  };
  bi: {
    vesselFull: string;
    vesselEmpty: string;
    pourSuccess: string;
    tapSuccess: string;
    sinkSuccess: string;
    encourage?: string;
    celebrate?: string;
  };
  teacher: {
    title: string;
    guide1: string;
    guide2: string;
    guide3: string;
    guide4: string;
    guide5: string;
    understood?: string;
  };
}
