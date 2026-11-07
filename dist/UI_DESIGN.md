# The silent city

The title screen looks out from ORCH-01's roof toward the objective engine. The paperclip monument cuts through an eclipsed sun: the swarm's trivial objective has become the city's largest landmark. Layered apartments, cooling towers, cargo cranes, stopped-looking infrastructure, wet tiles, and one maintenance train establish the scale of what has been lost.

The illustration is drawn on a 640 × 360 pixel grid, rendered at twice that size and scaled with pixel sampling. It is original code artwork in `title-scene.js`. A dark, quiet left side supports the title and menu; the illuminated factory occupies the right. Phone framing crops the landscape while preserving readable controls.

## Materials and type

- Deep petroleum blue is the unlit machine; oxidized teal defines its metal housing.
- Phosphor cream carries reading text. Amber identifies an action or source keyword. Mint marks a surviving signal.
- Silkscreen names worlds and actions. IBM Plex Mono carries instructions, source, and diagnostics. All fonts remain local.
- Numbered menu switches have an inset indicator rail, a separated index, a cut corner, and a directional mechanism. Hover moves the switch 5 px toward its destination; press lowers it 3 px into the housing. Focus has a strong amber outline.
- Terminal panels use structural dividers and straight edges. Source file tabs look like seated cartridges. An illuminated active source line follows the cursor without moving the code itself. Line numbers, comments, and diagnostics have deliberate contrast.

The reading text is 14–15 px in the main teaching surfaces. New saves use 18 px code; 21 and 24 px are available in Calibration. Previous 13/15/18 px preferences survive migration. Code remains selectable and editable, with horizontal source scrolling when needed. Mobile lessons stack above the editor and the terminal header stays reachable while scrolling.

## Motion and navigation

The city has three slow ambient layers: drifting clouds/smoke, maintenance traffic, and sparse rain/reflections. A 20 fps cap preserves the stepped pixel rhythm. The title enters once, followed by three switches with short staggered arrivals. Interactive feedback is immediate; ambient motion never controls reading or progression.

Scenery can be paused from the title screen. Reduced motion produces a fixed illustration, removes transitions, and stops animation scheduling. Hidden pages, modal dialogs, and leaving the menu also stop the title animation. The hidden arena does not render beneath it. All functional text is ordinary HTML, independent of the artwork.

The title screen opens on every visit. Entry starts the opening for new players and resumes returning expeditions. The world-before option replays the story without replacing saved work. Menu, the logo, and Escape while exploring return to the title. Modal dismissal returns focus to the active scene. Progress, code drafts, project files, and notes retain their existing storage format.
