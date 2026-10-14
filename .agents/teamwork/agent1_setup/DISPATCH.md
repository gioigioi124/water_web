## 2026-10-14T08:35:11Z
You are Agent 1 (Setup & Environment) for the "Vui học dung tích" educational web application project.

Your assigned working directory for metadata/notes/handoff is:
c:\Users\Administrator\Desktop\School\.agents\teamwork\agent1_setup

Authoritative user request:
c:\Users\Administrator\Desktop\School\.agents\teamwork\ORIGINAL_REQUEST.md

Architecture and specification plan:
c:\Users\Administrator\Desktop\School\plan.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. An auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Mission & Detailed Tasks:
1. Thoroughly read and analyze `plan.md` (especially sections 2, 3, 4, 6, 8, 9, 13) and `ORIGINAL_REQUEST.md`.
2. Initialize the static web project at project root `c:\Users\Administrator\Desktop\School`:
   - Initialize with Vite + TypeScript (you can use `npm create vite@latest . -- --template vanilla-ts` or create package.json, vite.config.ts, tsconfig.json, index.html directly and run `npm install`).
   - Install required dependencies, including `canvas-confetti` and `@types/canvas-confetti` (for celebration confetti).
   - Ensure `npm run build` is supported and compiles cleanly via Vite.
3. Establish the 4-layer architecture structure according to Section 9 of `plan.md`:
   - `src/core/`: Application shell, routing, top toolbar, theme, audio/speech manager, Bi mascot helper.
   - `src/components/`: SVG vessel with tick marks & wave clipPath, measuring cup, faucet/tap, sink/drain, big buttons (>= 64px), speech bubble.
   - `src/activities/`: Activity runners (Part A: predict-rank, pour-compare, measure; Part B: free explore, goal-puzzle with BFS hint solver).
   - `src/lessons/capacity/`: Pure JSON lesson configuration files and assets.
4. Prepare complete, production-ready JSON configuration files in `src/lessons/capacity/` (and ensure they are accessible or bundled/imported by Vite):
   - `lesson.json`: Lesson definition ("capacity", title "Dung tích", unit "lít", allowDecimals: false, activity flow).
   - `items.json`: Objects for Part A (Bottle 1L, Flower vase 2L, Teapot 3L, Small bucket 4L, Large bucket 5L; test pairs/rounds with misleading heights vs widths).
   - `levels.json`: 5 challenge levels for Part B matching section 4.3 of plan.md:
     - Level 1: 2L full, 3L full, 5L empty -> Goal: 5L full (5L).
     - Level 2: 2L full, 5L empty -> Goal: 5L has exactly 2L.
     - Level 3: Faucet available, vessels empty -> Goal: 5L has exactly 4L.
     - Level 4: Faucet available, vessels empty -> Goal: Any vessel has exactly 1L.
     - Level 5: Faucet & sink available -> Goal: 5L has exactly 1L.
     Vessels configured: 2L, 3L, 5L with initial levels, capacities, and tools (tap, sink).
   - `text.vi.json`: All Vietnamese strings, dialogs, Bi's greetings, explanations, step prompts, reactions (overflow, exact fill, underfill, congratulations, hint templates), button labels, toolbar tooltips.
5. Provide clean TypeScript type definitions (e.g., `src/core/types.ts`) for Vessel, GameState, Move, LessonConfig, ActivityConfig, LevelConfig, etc., based on Section 6 of `plan.md`.
6. Run `npm install` and verify the setup with `npm run build` to ensure zero compilation or configuration errors.
7. Write your detailed handoff report to:
   `c:\Users\Administrator\Desktop\School\.agents\teamwork\agent1_setup\handoff.md`
   Document:
   - All installed dependencies
   - Directory tree created
   - Details of each JSON configuration file created
   - Build verification output
   - Clear guidelines and entry points for Agent 2 (Implementation)

Communicate your final completion back to the orchestrator via send_message.
