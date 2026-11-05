# Prime Ignorance — project ladder and design defense

The game now has 101 encounters, including 17 encounters marked as projects and an additional grid transfer project. Every world ends in application of its ideas. Visible compiler checks provide feedback; an independent project, unfamiliar tests, and an explanation are still required to demonstrate proficiency. Suggested minutes are planning estimates, not speed requirements.

## How to work on a project

1. Restate the requirements: inputs, outputs, invalid states, boundaries, and ownership.
2. Decompose the work into small operations. Write one example and one counterexample for each.
3. Implement one operation and compile it. Keep real diagnostics visible; fix the first useful error.
4. Test normal behavior, zero/empty input, exact boundaries, invalid input, and repeated calls.
5. Debug the smallest failing case. Record what assumption failed in Plan · Trace · Reflect.
6. Refactor repeated rules into helpers. Keep tests passing after each change.
7. Close the worked example, revisit after a delay, and solve a changed version independently.
8. Explain the design, safety rules, and costs. Do not equate a passing transcript with mastery.

## The fourteen-world ladder

| World | In-game project | Independent extension and evidence |
|---|---|---|
| The Terminal | Repair a signal beacon | Build a new transcript from a written specification; explain a deliberately broken quote, terminator, and statement order. |
| Data Caverns | Resource calculator | Add units, protect a minimum reserve, state numeric limits, and test uneven division and zero available supplies. |
| Logic Gates | Access controller | Add three access roles, a maintenance override, malformed records, and a decision table with all boundaries. |
| Looping Ruins | Guessing lock | Make the secret configurable; count guesses; terminate on success and EOF; predict each iteration before running. |
| Function Workshop | Text adventure | Add rooms, inventory, HELP and QUIT commands, separate command parsing from transitions, and test a complete winning and losing route. |
| Container Forest | Inventory and crafting | Add item names, multiple-ingredient recipes, atomic rejection of impossible crafts, inventory display, and tests proving rejected crafts preserve stock. |
| Memory Depths | Safe energy simulation | Simulate multiple turns, retain independent snapshots, demonstrate that old states remain intact, and explain every borrow’s lifetime. |
| Object Citadel | Turn-based defender | Add attacks, armor, turns, victory conditions, and a companion composed from independent stats/equipment objects; test invariants after every public operation. |
| Resource Vault | Resource-safe dungeon | Turn lights into owned Room objects, connect rooms using non-owning IDs, move a dungeon between owners, and prove resources are released on early return and failure. |
| Generic Archives | Generic signal toolkit | Add constrained search/filter operations, test several admissible types, include compile-time rejection examples, and justify each concept rather than constraining unnecessarily. |
| System Frontier | Score ledger with headers and sources | Store multiple named records, define a versioned format, reject truncated/trailing/corrupt input, and verify failed loads leave the prior valid game state unchanged. |
| Algorithm Arena | Graph robot plus grid transfer | Return the actual shortest route, validate arbitrary graph data, test cycles/disconnected graphs/blocked endpoints, and compare BFS with a non-shortest strategy. |
| Parallel Nexus | Concurrent rescue factory | Partition a realistic workload, test deterministic results across worker counts, compare sequential and concurrent work, and explain ownership, synchronization, and completion order. |
| Mastery Expedition | Multi-file rescue network | Extend the three-layer capstone into an original application with command input, persistence, automated tests, measurement, and a design defense. |

## Multi-file workspaces

The header contract, linker repair, score ledger, shelter architecture, and rescue-network capstone have ordinary `.hpp`, `.cpp`, a visible read-only `checks.cpp`, and a CMake recipe. File tabs switch between source and checks. Editable files save independently. The compiler receives the additional `.cpp` files as separate translation units and links them; it does not paste their implementations into a pretend combined file.

**Export project ZIP** downloads the current files, a build recipe, and a short README. Extract into a new directory and use a C++20 toolchain with CMake:

```sh
cmake -S . -B build
cmake --build build
ctest --test-dir build --output-on-failure
```

For a multi-configuration generator, select a configuration consistently, for example `cmake --build build --config Debug` and `ctest --test-dir build -C Debug --output-on-failure`.

The exported tests exercise the same public operations as the game. Add your own tests in a separate local file/target and include it with `add_test`. CMakeLists.txt is a supplied build recipe in the browser, not an assessed build-script editor. Real build-system changes and debugger/profiler work happen in the exported project.

## Capstone: restore the rescue network

The in-game capstone has three layers and tests each independently:

- `parser.hpp/.cpp`: parse complete integer tokens, distinguish valid empty data from failure, and reject negative or malformed needs.
- `allocation.hpp/.cpp`: own a copy of the needs, sort it, allocate only complete needs within the budget, and include zero-cost needs.
- `rescue.hpp/.cpp`: validate the budget, compose the layers, and format the public result.

The independent version adds a command interpreter (LOAD, PLAN, SAVE, REPORT, QUIT), versioned file persistence, explicit error handling, and tests for every layer. Preserve the last valid state after a rejected load. Avoid globals shared between layers. Explain why choosing the cheapest complete needs first maximizes the number served for this particular nonnegative, equal-benefit objective; explain why the rule would need to change if needs had different priorities.

Acceptance evidence:

1. A clean multi-file build and a test target that returns nonzero on failure.
2. At least twelve meaningful tests, including malformed and overflowing numeric tokens, missing files, empty data, zero budget, zero-cost needs, exact-budget allocation, and repeated state changes.
3. A deliberately broken implementation that the tests reject; restore the correct one afterward.
4. A debugger session: breakpoint at a rejected load, inspect the parsed value and call stack, then explain why prior state remains intact.
5. A measurement table for increasing data sizes, including workload, build flags, repetition count, operation counts, and timings. Keep input generation and terminal printing outside the timed interval.
6. A design note covering ownership, invariants, error representation, module boundaries, algorithmic complexity, and a rejected alternative.
7. A changed requirement implemented without the worked example, followed by a fresh test and explanation.

## Tooling labs after export

**Build and version control.** Initialize a local Git repository, make one implementation commit and one test commit, inspect a diff, introduce and fix a regression, and rebuild from a clean build directory. Explain the difference between a compile error and an undefined reference at link time.

**Debugger.** Build with debug information, stop before a failing assertion, inspect locals and the call stack, and step across a function boundary. Do not infer lifetime safety merely because one run printed the expected result.

**Safety diagnostics.** On a compiler/platform supporting them, run an AddressSanitizer/UndefinedBehaviorSanitizer build on a disposable intentionally broken example, then repair it. Keep that diagnostic example out of the production model. A sanitizer cannot prove the absence of every bug. Run race diagnostics separately on supported environments; concurrent output matching alone does not establish race freedom.

**Profiling.** The game teaches `steady_clock`, counting work, and an O(n²)-to-O(n) transformation. The independent project should also use the platform's profiler to locate a hotspot, then measure before/after with the same workload and build flags. Do not use a fixed timing threshold to pass a learner: host load and toolchain differences make that unfair.

**Interoperability and modules.** As advanced extensions, wrap a small function in an `extern "C"` interface using plain data and document ownership across the boundary. Separately experiment with C++20 modules only on a toolchain whose module build workflow you have verified. The fixed browser judge uses ordinary headers and sources and does not claim to grade modules or cross-language ABI behavior.

## Review rubric

| Dimension | Evidence |
|---|---|
| Correctness | Requirements and boundary cases pass; errors have defined outcomes. |
| Independence | A changed requirement is solved without the worked solution. |
| Debugging | The learner identifies the first cause and explains the repair. |
| Safety | Ownership, lifetimes, bounds, cleanup, and synchronization are justified. |
| Design | Helpers and interfaces have coherent responsibilities; tests protect invariants. |
| Efficiency | Costs are reasoned about and optimizations supported by repeatable measurements. |

A reviewer should not compensate for a broken safety/correctness requirement with presentation points. Assistance is useful and should be recorded honestly. There is no automated design-defense evaluator or calibrated mastery score in this release. The preserved [curriculum](CURRICULUM.md) remains the educational specification; [PROGRESSION.md](PROGRESSION.md) lists the implemented route and remaining limits.
