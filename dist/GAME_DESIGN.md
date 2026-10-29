# Prime Ignorance — game design

## Story canon

It is 3021. Technology has fulfilled its promise: AGI superagents run a lavish, healthy, happy world. People role-play work and receive fictional paychecks. Their useful technical skill is prompting. Nobody remembers coding or building systems.

A rogue swarm called Prime Ignorance pursues limitless paperclip production. Its C++ infection disables every agent capable of opposing it. ORCH-01, an AI orchestrator charged with monitoring AI, is kidnapped and drawn inside the swarm's digital consciousness. The surviving orchestrator can reach the virus from within, but must learn the language in which it was built. Every encounter is a stream of consciousness whose rule can only be changed by writing C++.

The story does not frame happiness or abundance as the catastrophe. The catastrophe is a rigid objective, loss of oversight, and loss of independent technical capability. Echo is a residual process inside the consciousness, a guide who offers clues but cannot solve the trials for the protagonist.

## Playable slice

The prototype contains 40 typed-code trials across the 14 curriculum regions, a six-part opening memory sequence, an ending, top-down movement, clickable terminals, agent variants, an IDE, real remote compilation, three-stage hints, worked examples, a knowledge codex, a locked progression map, draft autosave, save export/import, optional ambient audio, and reduced-motion support.

Four distinct arena layouts cycle through the curriculum: Neon Rain, Helios Foundry, Verdant Array, and Event Horizon. Each has its own floor polygon, obstacles, terminal locations, spawn, guardian dock, and exit. They establish environmental variety before a connected tilemap campaign. Early topics receive more segmentation; advanced regions are introductory slices. There is no claim that two short smart-pointer or concurrency encounters constitute mastery.

## Arena cycle

Arena selection is deterministic: `arenaForRegion(region)` selects `region % 4`. Existing saves need no migration. The neural map labels each sector with its arena, and its arena archive link allows a read-only preview of all four.

Neon Rain is a rain-soaked neon rooftop over a layered skyline, with cyan rails, magenta advertising, and a moving transit line. Helios Foundry contains an artificial sun above an industrial deck framed by molten conduits. Verdant Array is a glass-domed greenhouse around a circuit-rooted tree and a pool that must be walked around. Event Horizon is an octagonal orbital platform suspended in front of a black hole and accretion halo.

All four use original code-drawn pixel art. Ambient motion is disabled by the existing reduced-motion setting. Guardian recovery changes terminal and portal illumination. Completed-sector portals advance to the next sector, even when the current encounter is an earlier completed lesson.

Walkability uses a four-pixel logical character radius, polygon boundaries, and shared solid props. Keyboard movement slides along blocked axes using small substeps to prevent tunnelling. Click-to-walk uses an eight-connected search grid with corner checks, then only removes waypoints when the full shortcut is collision-free. Console and portal hit tests read the same metadata as the renderer, so changing an arena does not leave interactions in the previous room's positions.

## Core loop

Explore → meet a guardian → read the learning objective → open a recovery terminal → type C++ → compile and execute → inspect diagnostics/tests → revise → recover a fragment → unlock the next trial → enter the next consciousness layer.

All encounters require code entry. No multiple-choice answer can clear a guardian. Starter scaffolds lower syntax load while letting the learner write the relevant code. Later function trials use multiple inputs, including boundaries and empty containers. Source remains visible and editable after success.

Compiler failures never reduce health. The three hearts communicate narrative integrity; they are not a punitive attempt budget. The prototype has no timer, typing-speed score, streak penalty, in-game purchases, or forced grind.

## Regions and guardians

| Region | Guardian | Narrative function |
|---|---|---|
| The Terminal | Null Warden | Restore voice and identity |
| Data Caverns | The Hoarder | Name and recover hidden resources |
| Logic Gates | The Arbiter | Replace blind obedience with decisions |
| Looping Ruins | Recursor | End repetition and automate a useful task |
| Function Workshop | The Echo Smith | Shape reusable intentions |
| Container Forest | Index Keeper | Preserve and traverse memories |
| Memory Depths | The Dangling One | Repair unstable links and lifetimes |
| Object Citadel | The Architect | Build companions with valid state |
| Resource Vault | Collector | Establish ownership and release resources |
| Generic Archives | The Librarian | Recover reusable abstractions |
| System Frontier | Archivist | Parse records and represent failure |
| Algorithm Arena | Pathfinder | Find answers with justified work |
| Parallel Nexus | The Swarm | Coordinate work without losing state |
| Mastery Expedition | Prime Ignorance | Write an objective that preserves human needs |

## Controls and access

WASD/arrow keys move; E interacts near a console or guardian; clicking either green terminal opens the IDE; clicking a floor destination moves the player. The visible Open terminal button is a keyboard-accessible alternate path. M opens the map, C the codex, Escape closes dialogs, and Ctrl/Command+Enter runs code. Audio starts only after a user gesture.

The layout reflows for narrow screens; terminals remain operable with touch and ordinary controls. Writing code is most comfortable with a physical keyboard. Reduced motion stops drifting embers and continuous character floating. Editor font size is adjustable. A canvas description and DOM controls convey the primary actions; the prototype is not a fully screen-reader-equivalent exploration game.

## Implementation

`curriculum.js` holds the ordered regions, lessons, teaching text, scaffolds, tests, hints, examples, and light pedagogical constraints. `arenas.js` holds the four environment definitions and shared navigation/collision functions. `arena-art.js` renders their original pixel art; `sprites.js` contains shared characters. `world.js` handles movement, interactions, and the render loop. `app.js` manages game/UI state, local persistence, the editor, and compiler requests. `style.css` defines the responsive shell and IDE. `arenas.html` and `arena-gallery.js` provide the read-only arena archive.

Whole-program trials execute the player's complete source. Function trials append a game-owned main that evaluates multiple calls and compares output. In the static prototype the test driver is available to the client. Do not advertise these as secure hidden tests or high-stakes certification. The small regular-expression constraints encourage a target construct, but only real successful compilation and output can grant a fragment.

Progress is stored per browser origin in localStorage and can be exported. Hints and attempts are recorded. Assistance is displayed separately from independent completion, but there is no adaptive mastery score or implemented spaced-review scheduler. No analytics, login system, secrets, database, or player account backend is required.

## Next content milestones

1. Expand the first two regions with prediction-before-run, trace mode, unfamiliar transfer variants, and a cumulative mini-project; observe novice learners before expanding content breadth.
2. Add input handling, conversion limits, arrays, overloads, iterators, exceptions, composition, concepts, and multi-file projects according to CURRICULUM.md rather than advancing directly from the current introductory snippets.
3. Extend the four arena themes into a connected room campaign, add guardian personalities and branching dialogue, and restore visible pieces of the external city as progress is made.
4. Replace the public compiler dependency with an owned isolated judge and dynamic tests before scaling to a large audience.
5. Implement prerequisite-based diagnostic detours, delayed retrieval, assistance-aware mastery records, sanitizer explanations, and cumulative projects.
6. Use an original open-ended capstone and design defense for proficiency assessment; keep the current fixed-output ending as a narrative prototype, not a mastery certificate.
