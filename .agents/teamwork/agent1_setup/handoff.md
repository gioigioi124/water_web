# Báo cáo chuyển giao công việc (Handoff Report) - Agent 1: Setup & Environment

## 1. Observation

- **Cấu hình dự án ban đầu:** Thư mục gốc `c:\Users\Administrator\Desktop\School` ban đầu chỉ chứa `plan.md` và thư mục `.agents`.
- **Môi trường thực thi:** 
  - Node.js: `v22.20.0`
  - npm: `10.9.3`
  - Hệ điều hành: Windows (PowerShell)
- **Cài đặt thư viện:**
  - `package.json` khai báo: `canvas-confetti` (v1.9.4), `@types/canvas-confetti` (v1.9.0), `typescript` (v5.6.3), `vite` (v5.4.11).
  - Lệnh `npm install` hoàn tất cài đặt 14 packages không phát sinh lỗi.
- **Kiến trúc 4 lớp theo mục 9 của `plan.md`:**
  - `src/core/`:
    - `types.ts` (6,841 bytes): Định nghĩa kiểu dữ liệu đầy đủ cho `Vessel`, `Move`, `GameState`, `LevelConfig`, `Item`, `ItemRound`, `BiState`, `TextDictionary`.
    - `theme.css` (3,136 bytes): Hệ thống biến màu hoạt hình chuẩn (nền `#e8f6ff`, nước `#3da9fc`, mặt nước `#7cc8ff`, vàng nắng `#ffd23f`, hồng đào `#ff8fa3`, chữ `#12355b`), chuẩn nút bấm >= 64px (`.btn-big`), hỗ trợ `prefers-reduced-motion`.
    - `audio.ts` (3,760 bytes): Bộ tổng hợp Web Audio API thuần (hiệu ứng tiếng ting chúc mừng, tiếng nước rót `playWaterPour` bằng filtered noise, tiếng pop nút bấm) không phụ thuộc file audio ngoài.
  - `src/components/`:
    - `vessel.ts` (3,922 bytes): Component SVG bình nước với vạch chia lít 1-5L, clipPath mặt nước sóng sánh, nhãn số lít có thể ẩn/hiện, hỗ trợ xoay nghiêng (`tiltAngle`) khi kéo rót.
    - `measuring-cup.ts` (2,427 bytes): Component cốc đong chuẩn 5 lít có mỏ rót và vạch chia lít.
    - `speech-bubble.ts` (4,216 bytes): Mascot giọt nước Bi với 6 biểu cảm hoạt hình (`happy`, `celebrating`, `surprised`, `thinking`, `sad`, `pointing`) và bong bóng đối thoại.
    - `tap.ts` (1,341 bytes): Vòi nước cấp SVG.
    - `sink.ts` (1,328 bytes): Cống xả nước SVG.
  - `src/activities/`:
    - `bfs.ts` (6,352 bytes): Thuật toán BFS tìm đường đi ngắn nhất tự động cho bài toán đong nước, hỗ trợ tính bước gợi ý kế tiếp.
    - `predict-rank.ts` (2,133 bytes): Khung hoạt động Phần A - Bước 1 (Dự đoán).
    - `pour-compare.ts` (1,533 bytes): Khung hoạt động Phần A - Bước 2 (Đổ qua lại đối chiếu).
    - `measure.ts` (1,803 bytes): Khung hoạt động Phần A - Bước 3 (Đo bằng cốc đong có vạch).
    - `explore.ts` (1,917 bytes): Khung hoạt động Phần B (Khám phá tự do).
    - `goal-puzzle.ts` (3,810 bytes): Khung hoạt động Phần B (5 màn Thử thách).
  - `src/lessons/capacity/`:
    - `lesson.json` (1,213 bytes): Khai báo bài học "capacity", tiêu đề "Dung tích", đơn vị "lít", `allowDecimals: false`, luồng 5 hoạt động.
    - `items.json` (8,434 bytes): Danh mục đồ vật (Chai nhỏ 1L, Bình hoa 2L, Ấm nước 3L, Xô nhỏ 4L, Xô lớn 5L, Bình thể thao cao 2L, Nồi rộng 3L) và 5 lượt so sánh có đánh lừa thị giác giữa chiều cao và độ rộng bề ngang.
    - `levels.json` (7,185 bytes): 5 màn thử thách Phần B theo đúng mục 4.3 của `plan.md` (Màn 1: 2L+3L->5L; Màn 2: 2L->5L có 2L; Màn 3: Vòi->5L có 4L; Màn 4: Vòi->bình bất kỳ có 1L; Màn 5: Vòi+cống->5L có 1L).
    - `text.vi.json` (6,192 bytes): Toàn bộ chuỗi tiếng Việt cho giao diện, lời thoại của Bi, phản hồi khi tràn/vừa đầy/thiếu, gợi ý, hướng dẫn giáo viên.
    - `index.ts` (683 bytes): Typed re-export nạp toàn bộ cấu hình vào TypeScript.
- **Kiểm thử tự động BFS (`npm test`):**
  - Chạy `node scripts/verify-bfs.mjs`:
    ```
    === KIỂM THỬ THUẬT TOÁN BFS 5 MÀN THỬ THÁCH ===
    Màn 1: THÀNH CÔNG (2 bước)
    Màn 2: THÀNH CÔNG (1 bước)
    Màn 3: THÀNH CÔNG (4 bước)
    Màn 4: THÀNH CÔNG (2 bước)
    Màn 5: THÀNH CÔNG (3 bước)
    ✅ 100% các màn thử thách (1 -> 5) đều có lời giải tối ưu hợp lệ!
    ```
- **Kiểm thử biên dịch (`npm run build`):**
  - Thực thi: `tsc && vite build`
  - Kết quả: `✓ built in 287ms` (0 lỗi, tạo thư mục `dist/` đầy đủ bundle HTML, JS, CSS).

---

## 2. Logic Chain

1. **Khởi tạo và module resolution:** Dự án dùng TypeScript và Vite thuần, cấu hình `"resolveJsonModule": true` trong `tsconfig.json` và `"base": "./"` trong `vite.config.ts`. Điều này đảm bảo Vite và TSC có thể import trực tiếp các file JSON mà không gặp lỗi typing hay bundler error.
2. **Tuân thủ kiến trúc 4 lớp và tách biệt cấu hình:** Toàn bộ dữ liệu hiển thị (số liệu dung tích, tên đồ vật, kích thước, các màn thử thách, lời thoại) được đặt hoàn toàn trong `src/lessons/capacity/*.json`. Agent 2 khi code giao diện chỉ cần import qua `src/lessons/capacity` và không bao giờ phải hardcode văn bản hay số liệu.
3. **Tính đúng đắn của logic dung tích:** Thuật toán đổ nước `calculatePour(from, to)` tuân theo nguyên tắc số nguyên: `Math.min(from.level, to.capacity - to.level)`.
4. **Bảo đảm 100% màn chơi giải được:** Script kiểm thử `scripts/verify-bfs.mjs` chạy giải thuật duyệt theo chiều rộng trên không gian trạng thái của 5 màn chơi trong `levels.json`, chứng minh cả 5 màn đều tìm được lời giải tối ưu với số bước đi trùng khớp đặc tả mục 4.3 trong `plan.md`.

---

## 3. Caveats

- **Âm thanh trên trình duyệt:** Bộ tổng hợp âm thanh Web Audio API trong `src/core/audio.ts` khởi tạo `AudioContext` theo chuẩn tương tác người dùng (lazy resume on click) để tránh chính sách Autoplay Policy của trình duyệt hiện đại.
- **Kéo Pointer Events:** Agent 1 đã chuẩn bị các tham số tọa độ và góc xoay (`tiltAngle`, `translateX`, `translateY`) trong `src/components/vessel.ts`. Agent 2 sẽ gắn các bộ lắng nghe sự kiện `pointerdown`, `pointermove`, `pointerup` lên DOM elements để xử lý hoạt hình kéo nghiêng mượt mà.

---

## 4. Conclusion

- Toàn bộ nền tảng môi trường, thư viện, kiến trúc 4 lớp, kiểu dữ liệu TypeScript, bộ dữ liệu cấu hình JSON và thuật toán BFS đã được thiết lập hoàn chỉnh, đạt chuẩn 100% yêu cầu.
- Lệnh `npm test` và `npm run build` đều vượt qua với mã thoát `0`.
- Dự án đã sẵn sàng bàn giao cho **Agent 2 (Implementation)** để triển khai tương tác giao diện và luồng hoạt động chi tiết.

---

## 5. Verification Method

Để kiểm tra độc lập công việc của Agent 1:

1. **Kiểm tra trạng thái build:**
   ```powershell
   npm run build
   ```
   *Kỳ vọng:* `tsc && vite build` hoàn thành không có lỗi, mã thoát 0.
2. **Kiểm tra thuật toán BFS và cấu hình 5 màn chơi:**
   ```powershell
   npm test
   ```
   *Kỳ vọng:* Xuất hiện `✅ 100% các màn thử thách (1 -> 5) đều có lời giải tối ưu hợp lệ!` với đúng 5 màn thành công.
3. **Kiểm tra xem trước web tĩnh tại local:**
   ```powershell
   npm run preview
   ```
   Hoặc chạy môi trường phát triển:
   ```powershell
   npm run dev
   ```

---

## 6. Guidelines & Entry Points for Agent 2 (Implementation)

1. **File chạy chính:** `src/main.ts`
   - Đã có khung thanh công cụ (`top-toolbar`), mascot Bi (`renderBiMascot`), hai thẻ chọn Phần A và Phần B, nút pháo giấy `canvas-confetti`.
   - Agent 2 hãy phát triển bộ quản lý view/route chuyển đổi giữa: Trang chủ ➔ Phần A (Bước 1, 2, 3) ➔ Phần B (Khám phá tự do & 5 màn Thử thách).
2. **Truy cập dữ liệu bài học:**
   ```ts
   import { capacityLesson, capacityItems, capacityLevels, capacityText } from './lessons/capacity';
   ```
   Không hardcode chữ tiếng Việt hay số lít vào component.
3. **Tương tác kéo nghiêng (Pointer Events):**
   - Khi kéo bình nguồn gần bình đích: tính góc nghiêng `tiltAngle` dựa vào khoảng cách deltaX, deltaY.
   - Khi góc nghiêng vượt ngưỡng hoặc thả vào bình đích: gọi `calculatePour(from, to)` từ `src/core/types.ts`.
   - Gọi `soundManager.playWaterPour()` từ `src/core/audio.ts` để phát tiếng nước róc rách.
   - Hỗ trợ chế độ chạm nguồn -> chạm đích (tap-to-pour) cho học sinh dùng máy tính bảng hoặc giáo viên chiếu bảng thông minh.
4. **Phần A (So sánh sức chứa):**
   - Nạp các round từ `capacityItems.rounds`.
   - Bước 1: Cho học sinh chọn hoặc xếp thứ tự (`src/activities/predict-rank.ts`).
   - Bước 2: Đổ qua lại hiển thị 3 trạng thái: Tràn ra ngoài (`overflow`), Vừa đầy (`exact`), Còn thiếu (`underflow`) (`src/activities/pour-compare.ts`).
   - Bước 3: Đong vào cốc đong lớn (`src/components/measuring-cup.ts`) và đối chiếu với dự đoán ở Bước 1.
5. **Phần B (Đong nước):**
   - Dùng `solveLevelBfs(currentLevelConfig, currentLevels)` từ `src/activities/bfs.ts` khi người dùng bấm nút "Gợi ý".
   - Bắn pháo hoa `confetti()` và gọi `soundManager.playTing()` khi hoàn thành mục tiêu.
