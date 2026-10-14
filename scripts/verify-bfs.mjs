import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const levelsJsonPath = resolve(__dirname, '../src/lessons/capacity/levels.json');
const levelsData = JSON.parse(readFileSync(levelsJsonPath, 'utf-8'));

function isGoalReached(levels, config) {
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

function solveLevelBfs(config) {
  const capacities = config.vessels.map((v) => v.capacity);
  const initialLevels = config.vessels.map((v) => v.initialLevel);
  const numVessels = config.vessels.length;
  const keyOf = (lvls) => lvls.join(',');

  if (isGoalReached(initialLevels, config)) {
    return { solved: true, minMoves: 0, moves: [] };
  }

  const queue = [{ levels: [...initialLevels], moves: [] }];
  const visited = new Set();
  visited.add(keyOf(initialLevels));

  while (queue.length > 0) {
    const current = queue.shift();

    // 1. Tap / Fill
    if (config.tools.tap) {
      for (let i = 0; i < numVessels; i++) {
        if (current.levels[i] < capacities[i]) {
          const nextLevels = [...current.levels];
          nextLevels[i] = capacities[i];
          const key = keyOf(nextLevels);

          if (!visited.has(key)) {
            visited.add(key);
            const move = { type: 'fill', vessel: config.vessels[i].id, vesselName: config.vessels[i].name };
            const nextMoves = [...current.moves, move];

            if (isGoalReached(nextLevels, config)) {
              return { solved: true, minMoves: nextMoves.length, moves: nextMoves, finalState: nextLevels };
            }
            queue.push({ levels: nextLevels, moves: nextMoves });
          }
        }
      }
    }

    // 2. Sink / Drain
    if (config.tools.sink) {
      for (let i = 0; i < numVessels; i++) {
        if (current.levels[i] > 0) {
          const nextLevels = [...current.levels];
          nextLevels[i] = 0;
          const key = keyOf(nextLevels);

          if (!visited.has(key)) {
            visited.add(key);
            const move = { type: 'empty', vessel: config.vessels[i].id, vesselName: config.vessels[i].name };
            const nextMoves = [...current.moves, move];

            if (isGoalReached(nextLevels, config)) {
              return { solved: true, minMoves: nextMoves.length, moves: nextMoves, finalState: nextLevels };
            }
            queue.push({ levels: nextLevels, moves: nextMoves });
          }
        }
      }
    }

    // 3. Pour
    for (let i = 0; i < numVessels; i++) {
      if (current.levels[i] === 0) continue;
      for (let j = 0; j < numVessels; j++) {
        if (i === j) continue;
        if (current.levels[j] === capacities[j]) continue;

        const amount = Math.min(current.levels[i], capacities[j] - current.levels[j]);
        if (amount <= 0) continue;

        const nextLevels = [...current.levels];
        nextLevels[i] -= amount;
        nextLevels[j] += amount;
        const key = keyOf(nextLevels);

        if (!visited.has(key)) {
          visited.add(key);
          const move = {
            type: 'pour',
            from: config.vessels[i].id,
            to: config.vessels[j].id,
            fromName: config.vessels[i].name,
            toName: config.vessels[j].name,
            amount,
          };
          const nextMoves = [...current.moves, move];

          if (isGoalReached(nextLevels, config)) {
            return { solved: true, minMoves: nextMoves.length, moves: nextMoves, finalState: nextLevels };
          }
          queue.push({ levels: nextLevels, moves: nextMoves });
        }
      }
    }
  }

  return { solved: false, minMoves: -1, moves: [] };
}

console.log('=== KIỂM THỬ THUẬT TOÁN BFS 5 MÀN THỬ THÁCH ===\n');
let allPassed = true;

levelsData.levels.forEach((level) => {
  const result = solveLevelBfs(level);
  console.log(`Màn ${level.id}: ${level.title}`);
  console.log(`- Mục tiêu: ${level.goal.description}`);
  console.log(`- Trạng thái giải: ${result.solved ? 'THÀNH CÔNG' : 'THẤT BẠI'}`);
  console.log(`- Số bước tìm được: ${result.minMoves} bước (Kế hoạch quy định: ${level.minMoves} bước)`);

  if (!result.solved) {
    allPassed = false;
    console.error(`  ❌ Màn ${level.id} KHÔNG GIẢI ĐƯỢC!`);
  } else {
    console.log(`  Các bước đi tối ưu:`);
    result.moves.forEach((m, idx) => {
      if (m.type === 'fill') console.log(`    ${idx + 1}. Mở vòi nước đổ đầy ${m.vesselName}`);
      else if (m.type === 'empty') console.log(`    ${idx + 1}. Đổ hết ${m.vesselName} vào cống`);
      else if (m.type === 'pour') console.log(`    ${idx + 1}. Đổ ${m.amount}L từ ${m.fromName} sang ${m.toName}`);
    });
    console.log(`  Trạng thái cuối: [${result.finalState.join(', ')}]`);
  }
  console.log('--------------------------------------------------');
});

if (allPassed) {
  console.log('\n✅ 100% các màn thử thách (1 -> 5) đều có lời giải tối ưu hợp lệ!');
} else {
  console.error('\n❌ Có màn không đạt yêu cầu!');
  process.exit(1);
}
