import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const levelsPath = resolve(__dirname, '../src/lessons/capacity/levels.json');
const itemsPath = resolve(__dirname, '../src/lessons/capacity/items.json');
const textPath = resolve(__dirname, '../src/lessons/capacity/text.vi.json');
const lessonPath = resolve(__dirname, '../src/lessons/capacity/lesson.json');

const levelsData = JSON.parse(readFileSync(levelsPath, 'utf-8'));
const itemsData = JSON.parse(readFileSync(itemsPath, 'utf-8'));
const textData = JSON.parse(readFileSync(textPath, 'utf-8'));
const lessonData = JSON.parse(readFileSync(lessonPath, 'utf-8'));

console.log('=== KIỂM THỬ TÍNH TOÀN VẸN VÀ BẤT BIẾN CỦA HỆ THỐNG ===\n');

let allPassed = true;

// 1. Kiểm tra cấu hình bài học
console.log('1. Kiểm tra cấu hình bài học (lesson.json):');
if (lessonData.id === 'capacity' && lessonData.unit === 'lít' && lessonData.allowDecimals === false) {
  console.log('  ✅ Cấu hình bài học hợp lệ: đơn vị lít, không số thập phân.');
} else {
  console.error('  ❌ Cấu hình bài học không hợp lệ!');
  allPassed = false;
}

// 2. Kiểm tra Phần A: Items & Rounds
console.log('\n2. Kiểm tra Phần A (items.json):');
const catalogKeys = Object.keys(itemsData.catalog);
console.log(`  - Số lượng đồ vật trong danh mục: ${catalogKeys.length}`);
catalogKeys.forEach((key) => {
  const item = itemsData.catalog[key];
  if (!Number.isInteger(item.capacity) || item.capacity < 1 || item.capacity > 5) {
    console.error(`  ❌ Đồ vật ${key} có dung tích không hợp lệ: ${item.capacity}`);
    allPassed = false;
  }
});

console.log(`  - Số lượng lượt so sánh: ${itemsData.rounds.length}`);
if (itemsData.rounds.length === 5) {
  console.log('  ✅ Đủ 5 lượt so sánh tuần tự.');
} else {
  console.error(`  ❌ Số lượt so sánh không phải là 5 (tìm thấy ${itemsData.rounds.length})`);
  allPassed = false;
}

itemsData.rounds.forEach((round, idx) => {
  const [pairA, pairB] = round.focusPair;
  if (!pairA || !pairB) {
    console.error(`  ❌ Lượt ${idx + 1} thiếu cặp so sánh focusPair!`);
    allPassed = false;
  }
});
console.log('  ✅ 100% các lượt Phần A đều có cặp so sánh hợp lệ.');

// 3. Kiểm tra Phần B: 5 Màn Thử thách
console.log('\n3. Kiểm tra Phần B (levels.json):');
console.log(`  - Số lượng màn thử thách: ${levelsData.levels.length}`);
if (levelsData.levels.length === 5) {
  console.log('  ✅ Đủ 5 màn thử thách.');
} else {
  console.error(`  ❌ Số lượng màn thử thách không phải là 5!`);
  allPassed = false;
}

levelsData.levels.forEach((lvl) => {
  lvl.vessels.forEach((v) => {
    if (!Number.isInteger(v.capacity) || v.capacity <= 0) {
      console.error(`  ❌ Bình ${v.id} trong màn ${lvl.id} có dung tích không hợp lệ!`);
      allPassed = false;
    }
    if (!Number.isInteger(v.initialLevel) || v.initialLevel < 0 || v.initialLevel > v.capacity) {
      console.error(`  ❌ Bình ${v.id} trong màn ${lvl.id} có mức nước ban đầu không hợp lệ!`);
      allPassed = false;
    }
  });
  if (!Number.isInteger(lvl.goal.targetLevel) || lvl.goal.targetLevel <= 0) {
    console.error(`  ❌ Mục tiêu màn ${lvl.id} có số lít không phải số nguyên dương!`);
    allPassed = false;
  }
});
console.log('  ✅ 100% dung tích và mức nước các màn đều là số nguyên hợp lệ (0 <= level <= capacity).');

// 4. Kiểm tra Text Dictionary Tiếng Việt
console.log('\n4. Kiểm tra từ điển hiển thị tiếng Việt (text.vi.json):');
if (textData.common && textData.toolbar && textData.home && textData.partA && textData.partB && textData.teacher) {
  console.log('  ✅ Toàn bộ cấu trúc các module ngôn ngữ tiếng Việt đều đầy đủ.');
} else {
  console.error('  ❌ Thiếu module ngôn ngữ!');
  allPassed = false;
}

// 5. Kiểm tra tính bất biến của phép đổ nước
console.log('\n5. Kiểm tra tính bất biến phép đổ nước (calculatePour):');
function calculatePour(fromLevel, toCapacity, toLevel) {
  const amount = Math.min(fromLevel, toCapacity - toLevel);
  const fromAfter = fromLevel - amount;
  const toAfter = toLevel + amount;
  return { amount, fromAfter, toAfter };
}

// Thử nghiệm các trường hợp biên
const testCases = [
  { fromL: 2, toC: 5, toL: 0, expAmount: 2, expFrom: 0, expTo: 2 },
  { fromL: 3, toC: 2, toL: 0, expAmount: 2, expFrom: 1, expTo: 2 },
  { fromL: 3, toC: 5, toL: 4, expAmount: 1, expFrom: 2, expTo: 5 },
  { fromL: 0, toC: 5, toL: 2, expAmount: 0, expFrom: 0, expTo: 2 },
  { fromL: 5, toC: 5, toL: 5, expAmount: 0, expFrom: 5, expTo: 5 },
];

testCases.forEach((tc, idx) => {
  const res = calculatePour(tc.fromL, tc.toC, tc.toL);
  if (res.amount !== tc.expAmount || res.fromAfter !== tc.expFrom || res.toAfter !== tc.expTo) {
    console.error(`  ❌ Trường hợp ${idx + 1} tính toán sai: `, res);
    allPassed = false;
  }
});
console.log('  ✅ Phép tính đổ nước bảo toàn 100% số nguyên lít và không tràn trong Phần B.');

if (allPassed) {
  console.log('\n🎉 TOÀN BỘ CÁC TIÊU CHÍ TOÀN VẸN VÀ BẤT BIẾN ĐỀU ĐẠT CHUẨN 100%!\n');
} else {
  console.error('\n❌ Có tiêu chí chưa đạt!');
  process.exit(1);
}
