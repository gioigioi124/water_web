## 2026-10-14T08:46:11Z

You are Agent 2 (Implementation) for the "Vui học dung tích" educational web application project.

Your assigned working directory for metadata/notes/handoff is:
c:\Users\Administrator\Desktop\School\.agents\teamwork\agent2_implementation

Authoritative user request:
c:\Users\Administrator\Desktop\School\.agents\teamwork\ORIGINAL_REQUEST.md

Reference plan:
c:\Users\Administrator\Desktop\School\plan.md

Predecessor Handoff (Agent 1 Setup & Environment):
c:\Users\Administrator\Desktop\School\.agents\teamwork\agent1_setup\handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. An auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Mission & Detailed Implementation Tasks:
Develop full UI, logic, interactions, and activities across the 4 layers initialized by Agent 1:

1. Core Layer:
   - Application shell and routing in `src/core/` and `src/main.ts`:
     * Navigation: Home (Trang chủ) <-> Part A (So sánh sức chứa) <-> Part B (Đổ nước giữa các bình: Khám phá tự do & 5 màn Thử thách).
     * Fixed top toolbar across all screens: Home button, Reset button (Làm lại), Toggle Liters switch (Ẩn/Hiện số lít), Audio toggle button (Âm thanh bật/tắt).
     * Mascot Bi helper: always visible with cartoon speech bubble, responding to events with 6 distinct emotions (happy, surprised, sad/pout when overflowing, celebrating on win, thinking, pointing hint).
     * Cartoon theme: soft sky background (#E8F6FF) with subtle floating clouds/bubbles, water blue (#3DA9FC), warm sunlight yellow (#FFD23F), peach congratulatory pink (#FF8FA3), deep navy text (#12355B), high contrast for classroom projector display, minimum 64px touch targets.

2. Components Layer:
   - Complete interactive SVG components in `src/components/`:
     * Vessel: Render dynamic SVG vessels with tick marks 1L-5L, clipPath wave water surface, liter count badge (toggleable by teacher switch), tilt angle transformation, pouring water stream animation.
     * Measuring cup: 5-liter transparent cup with distinct tick marks 1, 2, 3, 4, 5L and spout.
     * Faucet (vòi cấp nước) and Sink/Drain (cống xả nước) with animated water effects.
     * Big Buttons (>= 64px) with cartoon rounded styling, hover/active bounce effects.
   - Dual Pointer Events interaction system:
     * Drag-and-tilt pour: User drags source vessel toward target vessel -> vessel rotates/tilts proportionally to distance/direction -> when tilted past angle threshold or dragged over target, water pours into target vessel -> automatically pours `amount = Math.min(from.level, to.capacity - to.level)` with sound effect. If dropped outside or invalid, smooth spring return to original position.
     * Tap-to-pour fallback: Tap source vessel (glows with golden outline) -> Tap target vessel -> source tilts and pours into target. Perfectly supported for touch tablets and interactive classroom whiteboards.

3. Activities Layer:
   - Part A: "Đồ vật nào đựng được nhiều nước hơn?" (`src/activities/`):
     * Step 1 (Dự đoán): Display 2-3 items from items.json. Students click to guess which holds the most (or rank 1-2-3). Bi asks: "Cái nào đựng được nhiều nhất nhỉ?".
     * Step 2 (Đổ qua lại): Source item is full. Student drags/taps to pour into target. Shows 3 realistic visual outcomes: Tràn ra ngoài (A > B), Vừa đầy (A == B), Còn thiếu (A < B). Bi reacts accordingly. Buttons to swap A/B or retry.
     * Step 3 (Đo bằng cốc đong chuẩn): Pour items into standard measuring cup with tick marks 1-5L. Show exact liter levels. Bi compares with Step 1 prediction ("Bạn đoán đúng rồi!" or "Cùng xem lại nhé!").
     * Support multiple rounds from `items.json` (including visual deception rounds: tall thin vs short wide).
   - Part B: "Đổ nước giữa các bình" (`src/activities/`):
     * Free exploration mode (Khám phá tự do): 2L, 3L, 5L vessels, faucet, sink. Students freely pour, fill, empty. Bi gives friendly encouragement.
     * Challenge mode (Thử thách): 5 levels matching `plan.md` Section 4.3:
       - Level 1: 2L full, 3L full, 5L empty -> Goal: 5L full (5L).
       - Level 2: 2L full, 5L empty -> Goal: 5L has exactly 2L.
       - Level 3: Faucet available, empty vessels -> Goal: 5L has exactly 4L.
       - Level 4: Faucet available, empty vessels -> Goal: Any vessel has exactly 1L.
       - Level 5: Faucet & sink available -> Goal: 5L has exactly 1L.
     * BFS Hint Solver (`src/activities/bfs.ts`): "Gợi ý" button calculates optimal shortest path from current state and provides visual clue (pulsating arrow / Bi hint dialog).
     * Win state: Confetti explosion via `canvas-confetti`, celebration sound, Bi dancing, "Màn tiếp theo" button.

4. Lessons Layer:
   - Strictly load all configurations, texts, item properties, and level parameters from `src/lessons/capacity/*.json`. Zero hardcoding in UI components.

5. Verification & Testing:
   - Execute `npm test` to verify BFS solver passes 100% on all 5 levels.
   - Execute `npm run build` to verify clean compilation with 0 errors.

6. Handoff:
   - Write comprehensive report to `c:\Users\Administrator\Desktop\School\.agents\teamwork\agent2_implementation\handoff.md`.
   - Send completion message to orchestrator via `send_message`.
