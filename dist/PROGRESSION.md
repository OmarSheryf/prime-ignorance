# Prime Ignorance — implemented teaching progression

Updated 5 November 2026. This catalog lists **101 encounters**, including the original 40 and 61 added steps. There are **17 project encounters** plus a grid transfer challenge; **five workspaces compile and link multiple source files**. The original [CURRICULUM.md](CURRICULUM.md) remains the preserved educational specification.

Each row requires the previous encounter, with stable IDs recorded in the data. Previously solved legacy lessons remain replayable after save migration, while inserted foundations stay required. Estimates are pacing suggestions, not time limits. Every scored step requires C++ entry and real execution; narrative or reflection alone does not recover a fragment.

## Coverage added

| Gap | Implemented route |
|---|---|
| Input handling | cin, getline, validation, EOF loops, strict complete-record parsing, malformed and empty inputs |
| Arrays and iterators | std::array, zero-based bounds, vector growth, iterator ranges, invalidation and erase-return repair |
| Decomposition and composition | overloads, reusable policy helpers, function assertions, constructors, invariants, owned member objects, battle model |
| Ownership and exceptions | destructor-based RAII before smart pointers, non-owning borrows, move state, owning containers, throw/catch and unwinding |
| Generic programming | templates, constrained templates, compile-time rejection, class templates, lambda capture, standard algorithms |
| Multi-file development | header declarations, separate source definitions, linker repair, five editable project workspaces, ZIP/CMake/CTest exports |
| Testing | input suites, boundary checks, assertions, mutation checks, independent layer tests, project design-defense rubric |
| Algorithms and profiling | operation counts, binary search, queue/BFS, graph/grid route projects, steady_clock timing, algorithmic optimization |
| Concurrency | thread lifetime/join, atomic operations, lock_guard, deadlock repair, independent async partial results |
| Substantial independent work | project ladder with command-driven adventure, crafting, battle, persistence, resource-safe dungeon, navigation, concurrent factory, and original capstone extensions |

## Encounter catalog

### 00. The Terminal — 5 encounters

| ID | Encounter | Focus | Phase | Minutes | Prior encounter |
|---|---|---|---|---:|---|
| `signal` | Make yourself heard. | Program output | foundation | 10 | Start |
| `sequence` | One line after another. | Execution order | foundation | 10 | signal |
| `diagnostic` | Read the fracture. | Compiler diagnostics | debug | 10 | sequence |
| `beacon` | The first breach. | Output transfer | foundation | 10 | diagnostic |
| `terminal-project` | Project: repair the signal beacon | Integration project | project | 20 | beacon |

### 01. Data Caverns — 11 encounters

| ID | Encounter | Focus | Phase | Minutes | Prior encounter |
|---|---|---|---|---:|---|
| `energy` | A name for energy. | Integer variables | foundation | 10 | terminal-project |
| `charge` | Change the charge. | Assignment and arithmetic | foundation | 10 | energy |
| `remainder` | The spare battery | Quotient and remainder | practice | 12 | charge |
| `division` | A fraction of a thought. | Floating point and integer division | foundation | 10 | remainder |
| `conversion` | Convert before dividing | Explicit conversions | practice | 12 | division |
| `wide-integers` | Beyond a small register | Integer range and overflow | practice | 12 | conversion |
| `constant` | Something that stays true. | Constants | foundation | 10 | wide-integers |
| `read-input` | Listen to the console | Standard input | practice | 12 | constant |
| `line-input` | A name with spaces | Strings and getline | practice | 12 | read-input |
| `capacity` | What can you carry? | Arithmetic transfer | foundation | 10 | line-input |
| `resource-project` | Project: distribute the reserve | Resource calculator | project | 25 | capacity |

### 02. Logic Gates — 8 encounters

| ID | Encounter | Focus | Phase | Minutes | Prior encounter |
|---|---|---|---|---:|---|
| `comparison` | The threshold. | Comparisons | foundation | 10 | resource-project |
| `branch` | Choose your words. | if and else | foundation | 10 | comparison |
| `input-failure` | When the signal is not a number | Input validation | practice | 12 | branch |
| `boolean` | Two keys, one door. | Boolean logic | foundation | 10 | input-failure |
| `short-circuit` | Guard the division | Short-circuit safety | practice | 12 | boolean |
| `switch` | Route the signal. | switch | foundation | 10 | short-circuit |
| `logic-transfer` | Mercy protocol. | Branching transfer | foundation | 10 | switch |
| `access-project` | Project: rebuild access control | Validated decision system | project | 25 | logic-transfer |

### 03. Looping Ruins — 7 encounters

| ID | Encounter | Focus | Phase | Minutes | Prior encounter |
|---|---|---|---|---:|---|
| `while` | Keep the light on. | while loops | foundation | 10 | access-project |
| `read-until-end` | A stream of readings | Input loops and EOF | practice | 12 | while |
| `for` | Count the fragments. | for and accumulation | foundation | 10 | read-until-end |
| `off-by-one` | The missing last step. | Loop debugging | foundation | 10 | for |
| `loop-control` | Stop at corruption | break and continue | practice | 12 | off-by-one |
| `grid` | Light every chamber. | Nested loops | foundation | 10 | loop-control |
| `guessing-project` | Project: the guessing lock | Interactive loop project | project | 30 | grid |

### 04. Function Workshop — 7 encounters

| ID | Encounter | Focus | Phase | Minutes | Prior encounter |
|---|---|---|---|---:|---|
| `function` | Forge a command. | Parameters and return values | foundation | 10 | guessing-project |
| `overloads` | One name, two commands | Function overloads | practice | 12 | function |
| `clamp` | Know your limits. | Function composition | foundation | 10 | overloads |
| `decompose` | One job per helper | Decomposition and reuse | practice | 12 | clamp |
| `scope` | The thought that escaped. | Local scope | debug | 10 | decompose |
| `function-tests` | Test the edges | Assertions and regression tests | debug | 12 | scope |
| `adventure-project` | Project: a tiny text adventure | State and command decomposition | project | 30 | function-tests |

### 05. Container Forest — 10 encounters

| ID | Encounter | Focus | Phase | Minutes | Prior encounter |
|---|---|---|---|---:|---|
| `vector` | Carry what remains. | std::vector | foundation | 10 | adventure-project |
| `array` | A fixed set of ports | std::array and indexing | practice | 12 | vector |
| `bounds` | Stay inside the inventory | Bounds checks | practice | 12 | array |
| `range` | A path through the trees. | Range-based for | foundation | 10 | bounds |
| `grow-vector` | Keep the useful fragments | Growing vectors | practice | 12 | range |
| `iterators` | The space between beginning and end | Iterator ranges | practice | 12 | grow-vector |
| `erase-iterator` | Remove without a dangling step | Iterator invalidation | debug | 12 | iterators |
| `string` | Your name survives. | std::string | foundation | 10 | erase-iterator |
| `string-slicing` | Read the command prefix | String operations | practice | 12 | string |
| `inventory-project` | Project: stock and crafting | Inventory integration | project | 40 | string-slicing |

### 06. Memory Depths — 6 encounters

| ID | Encounter | Focus | Phase | Minutes | Prior encounter |
|---|---|---|---|---:|---|
| `reference` | Change the original. | References | foundation | 10 | inventory-project |
| `const-reference` | Borrow without changing | Const references | practice | 12 | reference |
| `pointer` | Follow the address. | Pointers and nullptr | foundation | 10 | const-reference |
| `pointer-borrow` | A pointer is an optional borrow | Null and non-owning pointers | practice | 12 | pointer |
| `lifetime` | Let it return safely. | Object lifetime | debug | 10 | pointer-borrow |
| `simulation-project` | Project: a safe energy simulation | Value ownership and lifetime | project | 30 | lifetime |

### 07. Object Citadel — 6 encounters

| ID | Encounter | Focus | Phase | Minutes | Prior encounter |
|---|---|---|---|---:|---|
| `class` | Build a companion. | Classes and constructors | foundation | 10 | simulation-project |
| `constructors` | Build a valid companion | Constructors and member initialization | practice | 12 | class |
| `invariant` | A promise in the walls. | Class invariants | foundation | 10 | constructors |
| `encapsulation` | Protect the invariant | Encapsulated operations | practice | 12 | invariant |
| `composition` | A robot has a battery | Object composition | practice | 12 | encapsulation |
| `combat-project` | Project: a turn-based defender | Battle model and invariants | project | 45 | composition |

### 08. Resource Vault — 6 encounters

| ID | Encounter | Focus | Phase | Minutes | Prior encounter |
|---|---|---|---|---:|---|
| `destruction` | A scope that pays its debt | Destructors and RAII | foundation | 12 | combat-project |
| `raii` | An owner for the light. | RAII and unique_ptr | foundation | 10 | destruction |
| `unique-borrow` | One owner, a short borrow | Smart ownership and observers | practice | 12 | raii |
| `move` | Pass the torch. | Ownership transfer | foundation | 10 | unique-borrow |
| `moved-owner` | Observe the handover | Moved-from ownership | practice | 12 | move |
| `dungeon-project` | Project: a resource-safe dungeon | Ownership integration | project | 40 | moved-owner |

### 09. Generic Archives — 7 encounters

| ID | Encounter | Focus | Phase | Minutes | Prior encounter |
|---|---|---|---|---:|---|
| `template` | An idea with many forms. | Function templates | foundation | 10 | dungeon-project |
| `concepts` | State the type contract | C++20 concepts | practice | 12 | template |
| `class-template` | One container, several types | Class templates | practice | 12 | concepts |
| `lambda` | Capture an intention | Lambda parameters and captures | practice | 12 | class-template |
| `algorithm` | Use the library. | Algorithms and lambdas | foundation | 10 | lambda |
| `sorting` | Restore the order | Sorting and algorithm contracts | practice | 12 | algorithm |
| `toolkit-project` | Project: a generic signal toolkit | Generic algorithms integration | project | 35 | sorting |

### 10. System Frontier — 9 encounters

| ID | Encounter | Focus | Phase | Minutes | Prior encounter |
|---|---|---|---|---:|---|
| `stream` | Read the old record. | Streams and parsing | foundation | 10 | toolkit-project |
| `strict-parse` | Reject trailing corruption | Stream state and complete records | practice | 12 | stream |
| `optional` | Failure has a type. | Explicit error values | foundation | 10 | strict-parse |
| `exceptions` | Signal an exceptional failure | throw and catch | practice | 12 | optional |
| `unwind` | Cleanup during failure | RAII and stack unwinding | practice | 12 | exceptions |
| `file-streams` | Write a memory to disk | File streams and failure checks | practice | 12 | unwind |
| `header-contract` | Declare here, define there | Headers and separate translation units | project | 25 | file-streams |
| `linker-repair` | Repair a broken interface | Build and link debugging | project | 25 | header-contract |
| `score-project` | Project: save the score ledger | File-backed score tracker | project | 50 | linker-repair |

### 11. Algorithm Arena — 7 encounters

| ID | Encounter | Focus | Phase | Minutes | Prior encounter |
|---|---|---|---|---:|---|
| `search` | Find a way through. | Linear search | foundation | 10 | score-project |
| `operation-count` | Measure the work | Complexity and instrumentation | practice | 12 | search |
| `binary-search` | Halve the search space | Binary search and contracts | practice | 12 | operation-count |
| `recursion` | A voice calls itself. | Recursion and base cases | foundation | 10 | binary-search |
| `queue` | A fair frontier | Queues and breadth-first order | practice | 12 | recursion |
| `graph-route` | Project: a pathfinding robot | Graph search and visited state | project | 45 | queue |
| `grid-project` | Project: navigate the ruined grid | Representation transfer | transfer | 45 | graph-route |

### 12. Parallel Nexus — 6 encounters

| ID | Encounter | Focus | Phase | Minutes | Prior encounter |
|---|---|---|---|---:|---|
| `thread-join` | Start, then join | Thread lifetime | practice | 12 | grid-project |
| `atomic` | A shared count. | Atomics and shared state | foundation | 10 | thread-join |
| `mutex` | Keep a compound promise | Mutex and lock_guard | practice | 12 | atomic |
| `deadlock-repair` | Wait without holding the gate | Deadlock avoidance | debug | 12 | mutex |
| `async` | Together, carefully. | Asynchronous tasks | foundation | 10 | deadlock-repair |
| `factory-project` | Project: a concurrent rescue factory | Concurrent integration | project | 45 | async |

### 13. Mastery Expedition — 6 encounters

| ID | Encounter | Focus | Phase | Minutes | Prior encounter |
|---|---|---|---|---:|---|
| `regression-suite` | A test suite that can fail | Testing and mutation checks | transfer | 12 | factory-project |
| `profiling` | Measure before optimizing | Profiling and steady_clock | practice | 12 | regression-suite |
| `profile-transfer` | Choose the optimization | Algorithmic profiling transfer | transfer | 12 | profiling |
| `architecture-project` | Project: separate policy from presentation | Architecture and regression tests | project | 60 | profile-transfer |
| `prime` | Rewrite the objective. | Integration | foundation | 10 | architecture-project |
| `capstone-project` | Capstone: restore the rescue network | Cumulative multi-file project | project | 90 | prime |

## Project and assessment limits

The browser verifies visible examples and boundary cases. It is a client-visible learning judge, not secure hidden assessment. Plan/Trace/Reflect notes are optional and ungraded. Hint use is recorded separately from independent completion.

The in-game projects provide checked integration steps. Completing the larger independent extensions in [PROJECTS.md](PROJECTS.md), testing changed requirements after a delay, and presenting a design defense remain necessary evidence of proficiency. The game does not yet adapt difficulty, schedule spaced retrieval, grade open-ended architecture, visualize a debugger/profiler, or implement a calibrated mastery estimator. Native modules, ABI experiments, and real profiler use are tooling labs after export.

The compiler integration uses the [Compiler Explorer API](https://github.com/compiler-explorer/compiler-explorer/blob/main/docs/API.md): stdin is supplied per case; additional .cpp files are compiled and linked, with ordinary headers available by filename. The static app remains C++20 on GCC 14.1 and introduces no new runtime dependency.
