import type { LevelConfig, Move } from '../core/types';

export interface BfsStep {
  move: Move;
  state: number[]; // Water levels of vessels in order
  explanation: string;
}

export interface BfsResult {
  solved: boolean;
  minMoves: number;
  path: BfsStep[];
  nextMove: Move | null;
  nextStepExplanation: string | null;
}

interface Node {
  levels: number[];
  moves: Move[];
  explanations: string[];
}

/**
 * Checks whether current levels satisfy the goal condition
 */
export function isGoalReached(levels: number[], config: LevelConfig): boolean {
  const { goal, vessels } = config;

  if (goal.type === 'exact') {
    const targetIdx = vessels.findIndex((v) => v.id === goal.vesselId);
    if (targetIdx === -1) return false;
    return levels[targetIdx] === goal.targetLevel;
  } else if (goal.type === 'any') {
    return levels.some((lvl) => lvl === goal.targetLevel);
  }
  return false;
}

/**
 * Pure BFS solver to find shortest path to target state
 */
export function solveLevelBfs(
  config: LevelConfig,
  currentLevels?: number[]
): BfsResult {
  const capacities = config.vessels.map((v) => v.capacity);
  const initialLevels = currentLevels ?? config.vessels.map((v) => v.initialLevel);
  const numVessels = config.vessels.length;

  const keyOf = (lvls: number[]) => lvls.join(',');

  if (isGoalReached(initialLevels, config)) {
    return {
      solved: true,
      minMoves: 0,
      path: [],
      nextMove: null,
      nextStepExplanation: null,
    };
  }

  const queue: Node[] = [
    {
      levels: [...initialLevels],
      moves: [],
      explanations: [],
    },
  ];
  const visited = new Set<string>();
  visited.add(keyOf(initialLevels));

  while (queue.length > 0) {
    const current = queue.shift()!;

    // 1. Try Tap / Fill operations (if tap is available)
    if (config.tools.tap) {
      for (let i = 0; i < numVessels; i++) {
        if (current.levels[i] < capacities[i]) {
          const nextLevels = [...current.levels];
          nextLevels[i] = capacities[i];
          const key = keyOf(nextLevels);

          if (!visited.has(key)) {
            visited.add(key);
            const move: Move = { type: 'fill', vessel: config.vessels[i].id };
            const expl = `Mở vòi nước làm đầy ${config.vessels[i].name} (${capacities[i]}L)`;
            const nextMoves = [...current.moves, move];
            const nextExpls = [...current.explanations, expl];

            if (isGoalReached(nextLevels, config)) {
              return buildResult(nextMoves, nextExpls, initialLevels, capacities, config);
            }
            queue.push({ levels: nextLevels, moves: nextMoves, explanations: nextExpls });
          }
        }
      }
    }

    // 2. Try Sink / Drain operations (if sink is available)
    if (config.tools.sink) {
      for (let i = 0; i < numVessels; i++) {
        if (current.levels[i] > 0) {
          const nextLevels = [...current.levels];
          nextLevels[i] = 0;
          const key = keyOf(nextLevels);

          if (!visited.has(key)) {
            visited.add(key);
            const move: Move = { type: 'empty', vessel: config.vessels[i].id };
            const expl = `Xả hết nước từ ${config.vessels[i].name} vào cống`;
            const nextMoves = [...current.moves, move];
            const nextExpls = [...current.explanations, expl];

            if (isGoalReached(nextLevels, config)) {
              return buildResult(nextMoves, nextExpls, initialLevels, capacities, config);
            }
            queue.push({ levels: nextLevels, moves: nextMoves, explanations: nextExpls });
          }
        }
      }
    }

    // 3. Try Pour operations between any pair of vessels (i -> j)
    for (let i = 0; i < numVessels; i++) {
      if (current.levels[i] === 0) continue; // Source is empty

      for (let j = 0; j < numVessels; j++) {
        if (i === j) continue;
        if (current.levels[j] === capacities[j]) continue; // Destination is full

        // calculate amount to pour
        const amount = Math.min(current.levels[i], capacities[j] - current.levels[j]);
        if (amount <= 0) continue;

        const nextLevels = [...current.levels];
        nextLevels[i] -= amount;
        nextLevels[j] += amount;
        const key = keyOf(nextLevels);

        if (!visited.has(key)) {
          visited.add(key);
          const move: Move = {
            type: 'pour',
            from: config.vessels[i].id,
            to: config.vessels[j].id,
          };
          const expl = `Đổ ${amount}L từ ${config.vessels[i].name} sang ${config.vessels[j].name}`;
          const nextMoves = [...current.moves, move];
          const nextExpls = [...current.explanations, expl];

          if (isGoalReached(nextLevels, config)) {
            return buildResult(nextMoves, nextExpls, initialLevels, capacities, config);
          }
          queue.push({ levels: nextLevels, moves: nextMoves, explanations: nextExpls });
        }
      }
    }
  }

  // No solution found
  return {
    solved: false,
    minMoves: -1,
    path: [],
    nextMove: null,
    nextStepExplanation: null,
  };
}

function buildResult(
  moves: Move[],
  explanations: string[],
  initialLevels: number[],
  capacities: number[],
  config: LevelConfig
): BfsResult {
  const path: BfsStep[] = [];
  let curr = [...initialLevels];

  for (let stepIdx = 0; stepIdx < moves.length; stepIdx++) {
    const m = moves[stepIdx];
    const next = [...curr];

    if (m.type === 'fill') {
      const idx = config.vessels.findIndex((v) => v.id === m.vessel);
      next[idx] = capacities[idx];
    } else if (m.type === 'empty') {
      const idx = config.vessels.findIndex((v) => v.id === m.vessel);
      next[idx] = 0;
    } else if (m.type === 'pour') {
      const fromIdx = config.vessels.findIndex((v) => v.id === m.from);
      const toIdx = config.vessels.findIndex((v) => v.id === m.to);
      const amount = Math.min(curr[fromIdx], capacities[toIdx] - curr[toIdx]);
      next[fromIdx] -= amount;
      next[toIdx] += amount;
    }

    path.push({
      move: m,
      state: [...next],
      explanation: explanations[stepIdx],
    });
    curr = next;
  }

  return {
    solved: true,
    minMoves: moves.length,
    path,
    nextMove: moves[0] || null,
    nextStepExplanation: explanations[0] || null,
  };
}
