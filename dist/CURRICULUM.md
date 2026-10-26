# C++ Quest — preserved curriculum and progression specification

Status: original educational design preserved as the source for Prime Ignorance's progression. The story and game setting are adapted in GAME_DESIGN.md. The playable content is defined in curriculum.js. Completing the prototype is not equivalent to completing this entire curriculum.

## 1. Central principle

Learn one concept, use it immediately, combine it with prior concepts, and demonstrate understanding in a meaningful puzzle. Begin with modern C++: value semantics, standard containers, and safe automatic resource management. Teach RAII before substantial manual memory management. Use C++20 as the prototype's fixed target, rather than silently changing compiler standards.

The game world supplies concrete consequences for code: variables store energy, conditions operate gates, loops automate machines, functions become reusable tools, classes describe companions, references and pointers connect objects, algorithms find routes, and concurrency coordinates independent systems.

## 2. Learning atom: approximately 5–15 minutes

1. Observe a small program or machine execute.
2. Predict its output or state changes.
3. Modify one expression, statement, or parameter.
4. Construct a small solution without copying.
5. Debug an intentionally broken variation.
6. Apply the concept to a game problem.
7. Recall it after a delay in a changed context.

Introduce one major idea per learning atom. Reuse known ideas without making them compete with the new idea. Prediction is an activity within a lesson; every scored encounter must ultimately require the player to type and run C++.

## 3. World progression

| World | Concepts | Application | Mastery project |
|---|---|---|---|
| 0. The Terminal | Editor, compiler, execution, errors, main, output | Activate an abandoned console | Repair and run a signal beacon |
| 1. Data Caverns | Variables, types, literals, arithmetic, const, input | Store and distribute energy | Resource calculator |
| 2. Logic Gates | Comparisons, Boolean logic, if/else, switch | Operate security gates | Access control system |
| 3. Looping Ruins | while, for, range-based loops, nested loops | Control repeating mechanisms | Automated mining grid |
| 4. Function Workshop | Parameters, returns, scope, overloads, decomposition | Assemble reusable commands | Robot command library |
| 5. Container Forest | string, array, vector, iterators | Manage inventories and paths | Inventory and crafting system |
| 6. Memory Depths | References, addresses, pointers, lifetimes, stack/heap model | Repair linked conduits | Safe dynamic simulation |
| 7. Object Citadel | Classes, encapsulation, constructors, invariants, composition | Construct companions | Turn-based battle model |
| 8. Resource Vault | Destructors, RAII, smart pointers, move semantics | Recover resources | Resource-safe dungeon |
| 9. Generic Archives | Templates, concepts, lambdas, standard algorithms | Build reusable mechanisms | Generic puzzle toolkit |
| 10. System Frontier | Files, streams, errors, exceptions, build structure, modules where supported | Restore an outpost | Save-and-load system |
| 11. Algorithm Arena | Complexity, searching, sorting, recursion, graphs, data structures | Optimize routes and production | Autonomous navigation |
| 12. Parallel Nexus | Threads, synchronization, atomics, async | Coordinate machines | Concurrent factory simulation |
| 13. Mastery Expedition | Architecture, testing, profiling, tooling, interoperability | Restore the world | Original project and design defense |

## 4. Ordering constraints and safety

- std::string before C strings; std::vector before manually allocated arrays.
- References before raw pointers. Ownership and lifetimes before smart-pointer mechanics.
- Use RAII before substantial manual allocation; new/delete are later diagnostic or legacy topics, not default solutions.
- Composition before inheritance. Introduce virtual dispatch only with a need and an explanation of base-class destruction.
- Teach standard algorithms before implementing every data structure manually.
- Treat undefined behavior as a language constraint throughout: uninitialized reads, bounds violations, dangling references, signed overflow, invalid iterators, and data races.
- Teach initialization and const from early lessons. Show integer division, conversions, overflow limits, and input failure explicitly.
- Explain that addresses are not ownership; storage duration is a teaching model, not a promise of a particular physical machine layout.
- Introduce smart pointers for dynamic ownership needs. shared_ptr is not a universal default; teach cycles and weak_ptr only after shared ownership is justified.
- Teach testing alongside the first small functions; introduce compiler warnings and debugging early, not only in the last world.

## 5. Five layers within every world

### A. Foundations

Read, predict, modify, complete, then independently construct. For loops: read a loop, predict iterations, adjust a condition, complete a body, and write a loop from a goal.

### B. Variations

Keep the concept stable while changing context. Iteration can operate a countdown, inventory, grid, combat turn, validation loop, or simulation. Vary inputs and boundaries so that a remembered output cannot substitute for understanding.

### C. Debugging

Include off-by-one mistakes, incorrect conditions, uninitialized values, lifetime problems, iterator invalidation, unwanted copies, leaks, and race conditions as prerequisites become available. Preserve the real compiler diagnostic next to progressively clearer explanations.

### D. Integration

Combine earlier concepts in a larger encounter without new syntax. Transfer should be the difficulty, rather than surprise language features.

### E. Mastery gate

Require a novel problem with limited assistance. Gates depend on demonstrated prerequisites, not XP or time spent. Repeated attempts do not cost health or destroy progress.

## 6. Puzzle specification

A puzzle combines visible state, an explicit goal, a constrained interface, and immediate feedback. Use prediction, completion, construction, debugging, optimization, refactoring, architecture, and open challenges. Avoid making an entire course out of blanks to fill.

Every puzzle should record:

```cpp
struct PuzzleDefinition {
    std::string id;
    std::vector<std::string> prerequisites;
    std::vector<std::string> skills_assessed;
    int expected_minutes;
    Difficulty difficulty;
    PuzzleType type;
    std::string narrative_goal;
    std::string starter_code;
    std::vector<TestCase> visible_tests;
    std::vector<TestCase> hidden_tests;
    std::vector<Hint> hints;
    std::optional<ComplexityTarget> performance_target;
    std::optional<std::string> reference_solution;
};
```

For the production evaluator, use isolated compilation, tests, execution time/memory/output limits, deterministic cases where feasible, diagnostics, and sanitizers when applicable. Accept multiple valid solutions. Detect suspicious hardcoding with new inputs and review rather than simplistic keyword matching alone. Frontend code cannot keep tests secret.

## 7. Example: functions and parameters

Narrative: three robots need different charging amounts.

1. Observe recharge(20, 5) change a display using `return energy + amount;`.
2. Predict recharge(12, 8).
3. Modify the function so the result never exceeds 100.
4. Construct an energy sufficiency function.
5. Repair reversed arguments at a call site.
6. Build a station used by different robot types.
7. After a delay, solve a cargo-capacity problem with the same abstract structure.

The last step measures transfer rather than syntax recall.

## 8. Mastery model

Keep completion and mastery separate. Track correctness, independence, assistance, diagnostic ability, delayed recall, unfamiliar variations, explanation, quality, and safety. A proposed state model is:

`Unseen → Introduced → Practiced → Reliable → Transferable → Mastered`

Award mastery only after multiple variations, a delayed successful retrieval, combination with another concept, a repaired related bug, and an unfamiliar application. Thresholds must be calibrated through learner studies; the state names alone do not establish learning effectiveness.

XP can unlock cosmetics, lore, and optional challenges. It cannot override prerequisite gaps. Guided success is useful but must be distinguished from independent performance. The prototype records completed trials and guidance use; it does not claim to implement the full mastery estimator.

## 9. Adaptive progression

Maintain a prerequisite graph. Example dependencies: variables → expressions; variables → conditions → loops; variables → functions → classes → invariants and resource ownership → RAII → move semantics. Actual dependencies may cross worlds; the map is a narrative presentation, not the complete prerequisite structure.

When a player struggles, isolate the smallest missing prerequisite, offer an execution trace or partial scaffold, provide a simpler variation, and return to the original task. When they succeed easily, fade scaffolding, combine objectives, introduce justified performance constraints, and skip redundant practice after verification.

Use spaced retrieval with intervals adjusted to success. A starting content design could revisit a concept later in the session, in a later region, and on a later day; validate the schedule rather than treating one timing formula as universally optimal. Avoid adapting solely from speed: typing fluency, accessibility needs, and reflection time differ.

## 10. Hint ladder

1. Restate the goal.
2. Point to relevant state.
3. Name the useful concept.
4. Offer pseudocode.
5. Reveal one expression or line.
6. Show a worked solution with explanation.

Hints are not punishment. Record assistance. After revealing a full answer, require a changed problem before granting independence credit. The prototype uses three compact hints and analogous worked examples; full production lessons expand the ladder when needed.

## 11. Feedback

### Compiler

Keep the actual compiler message and translate it. For `expected ';' after expression`, explain that the preceding statement is missing its terminator. Start with the first useful error because later messages can be cascading symptoms.

### Runtime

Visualize the current line, variables, call stack, lifetimes, allocations/releases, container contents, and world changes as relevant. Do not expose all advanced detail to beginners at once.

### Tests

Show visible examples and categories for hidden failures: empty input, exact boundaries, negative values, large input, repeated calls, lifetime/ownership, and invalid input. A failure should identify what assumption to inspect without always revealing the answer.

### Quality

Assess correctness, readability, safety, complexity, duplication, and appropriate standard-library use separately. Concision is not automatically clarity or efficiency. Performance targets must fit the learner's current knowledge.

## 12. Learning-aligned game systems

Abilities represent concepts. Companions represent abstractions. Lore rewards curiosity. Debugger vision appears after debugging lessons. Refactoring allows revisiting completed machinery. Bosses are cumulative projects. Efficiency rewards consider safety and clarity as well as speed.

Avoid expiring energy, random punishment, coercive streaks, and grinding redundant exercises. Compiler errors are opportunities to investigate. Health may communicate narrative integrity; it should not make experimentation costly.

## 13. Project ladder

1. Number guessing game.
2. Text adventure.
3. Inventory and crafting.
4. Grid puzzle solver.
5. Turn-based combat simulator.
6. File-backed score tracker.
7. Resource-safe dungeon engine.
8. Pathfinding robot.
9. Concurrent factory simulation.
10. Original capstone.

Use `requirements → decomposition → implementation → testing → debugging → refactoring → reflection` for every project. Move gradually from constrained snippets to ordinary source files, headers, a build system, tests, version control, debugger, and profiler.

## 14. Assessment

Use formative puzzle feedback, diagnostic prerequisite checks, cumulative mixed retrieval, and authentic projects with multiple acceptable solutions. Initial proposed project rubric:

| Dimension | Suggested weight |
|---|---:|
| Functional correctness | 40% |
| Independent solution | 20% |
| Debugging and explanation | 15% |
| Safety and resource handling | 10% |
| Clarity and structure | 10% |
| Level-appropriate efficiency | 5% |

These are design proposals, not empirically validated weights. Unsafe behavior or broken critical requirements should not be canceled by cosmetic points. Use minimum safety/correctness gates where the task warrants them.

## 15. Efficiency rules

Teach the theory needed for the next action. Prefer retrieval over rereading. Space practice, interleave old and new skills, provide worked examples before difficult construction, fade support, test unfamiliar contexts, and allow productive struggle in logic while explaining syntax promptly. Use a few varied puzzles instead of many duplicates. Ask what failed, why, and how the learner found it.

A starting allocation is 20% explanation/observation, 25% guided modification, 35% independent construction, and 20% debugging/review/reflection. It is a content-planning heuristic that must change with learner needs and evidence.

Measure effectiveness through delayed retention and transfer. Useful evaluation: compare a baseline, immediate posttest, delayed posttest, and independent project; track hint dependence, repeated misconceptions, completion barriers, accessibility, and dropout. Engagement alone does not prove learning.

## 16. Practical final proficiency

A proficient graduate can translate requirements into data/operations/components; compile, test, and debug a multi-file program; reason about types, scope, lifetime, ownership, and value categories; use the standard library; design invariants; manage resources with RAII; recognize undefined behavior; select algorithms/data structures; estimate time/space complexity; read unfamiliar code and diagnostics; profile; defend tradeoffs; and learn a new facility from documentation.

No finite game can establish mastery of all of C++. The final assessment is an original project with requirements, tests, review, profiling, and a design explanation, followed by continued practice. The prototype's ending certifies only completion of its introductory expedition.
