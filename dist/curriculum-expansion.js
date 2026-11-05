// New teaching steps are inserted around stable legacy IDs. CURRICULUM.md is canon.
const additions=[];
function step(after,id,region,title,skill,teaching,task,starter,tests,example,hints,extra={}){
 additions.push({after,id,region,title,skill,teaching,task,starter,tests,example,hints,
  story:extra.story||'Echo has found a damaged process in this layer. Recover it by applying '+skill.toLowerCase()+'.',
  mode:'function',phase:'practice',minutes:12,expected:tests.map(t=>t[1]).join('\n'),requirements:[],...extra});
}
function program(after,id,region,title,skill,teaching,task,starter,cases,example,hints,extra={}){
 step(after,id,region,title,skill,teaching,task,starter,[],example,hints,{mode:'program',cases,expected:cases[0].expected,...extra});
}
const io='#include <iostream>\n';
const vec='#include <vector>\n';
const str='#include <string>\n';
const hint=(goal,idea,shape)=>[goal,idea,shape];

program('beacon','terminal-project',0,'Project: repair the signal beacon','Integration project',
 'A program is a sequence of statements. Read the requested transcript before editing. Build one line, compile, then add the next. Compiler messages refer to source lines; the first error is usually the best starting point.',
 'Repair the missing terminator and rebuild a four-line beacon: ORCH-01, HELP, SECTOR 00, READY. Keep one output statement per line of the transcript.',
 io+'int main() {\n    std::cout << "ORCH-01\\n"\n    // Add the remaining beacon lines.\n}\n',
 [{name:'Complete distress transcript',stdin:'',expected:'ORCH-01\nHELP\nSECTOR 00\nREADY'}],
 'std::cout << "BOOT\\n";\nstd::cout << "OK";',hint('Repair the compiler error before adding the new messages.','Each statement needs a semicolon; each output line except the last needs a newline.','Use four separate std::cout statements.'),{phase:'project',minutes:20});

step('charge','remainder',1,'The spare battery','Quotient and remainder',
 'Integer division counts complete groups. <code>%</code> returns the remainder. A remainder is useful for leftover items and periodic events. The divisor must not be zero; this trial guarantees a positive group size.',
 'Return the number of batteries left after putting total batteries into groups of size group. Inputs are nonnegative and group is positive.',
 'int leftovers(int total, int group) {\n    return 0;\n}',[['leftovers(14, 4)','2'],['leftovers(12, 4)','0'],['leftovers(0, 3)','0'],['leftovers(2, 7)','2']],
 'int spare = 17 % 5; // 2',hint('Whole groups are removed first.','Use the remainder operator, not division.','Return total % group;'));
step('division','conversion',1,'Convert before dividing','Explicit conversions',
 '<code>static_cast&lt;double&gt;(value)</code> converts an integer before the operation. Converting a truncated result afterward cannot restore its fraction. Explicit conversion makes your intent visible.',
 'Return the average of total over count as a double. count is positive. Convert an operand before dividing.',
 'double average(int total, int count) {\n    return 0;\n}',[['average(7, 2)','3.5'],['average(0, 3)','0'],['average(9, 3)','3']],
 'double rate = static_cast<double>(distance) / seconds;',hint('The division currently needs a floating-point operand.','Convert total before dividing by count.','static_cast<double>(total) / count'));
program('constant','read-input',1,'Listen to the console','Standard input',
 '<code>std::cin &gt;&gt; value</code> extracts a typed value from standard input. The game supplies each test input exactly as shown below the editor. Read instead of embedding a particular answer. This first trial supplies valid integers; failure handling comes in Logic Gates.',
 'Read two integers and print their sum. Do not print prompts; the puzzle checks only the answer.',
 io+'int main() {\n    int a = 0, b = 0;\n    // Read a and b, then print their sum.\n}\n',
 [{name:'Two readings',stdin:'12 8\n',expected:'20'},{name:'Signed reading',stdin:'-3 5\n',expected:'2'},{name:'Zero readings',stdin:'0 0\n',expected:'0'}],
 'int cells = 0;\nstd::cin >> cells;\nstd::cout << cells * 2;',hint('The values come from the test input, not the scaffold.','Chain extractions: std::cin >> a >> b;','Then output a + b.'),{requirements:[['std::cin','Read the supplied input with std::cin.']]});
program('read-input','line-input',1,'A name with spaces','Strings and getline',
 '<code>std::string</code> owns text. <code>&gt;&gt;</code> stops at whitespace, while <code>std::getline(std::cin, name)</code> reads the entire line. This program starts with getline, so there is no leftover newline from a previous extraction.',
 'Read one complete line and print WELCOME followed by a space and that line. Preserve spaces inside the name.',
 io+str+'int main() {\n    std::string name;\n    // Read a whole line, then greet it.\n}\n',
 [{name:'One word',stdin:'Echo\n',expected:'WELCOME Echo'},{name:'Two words',stdin:'Null Warden\n',expected:'WELCOME Null Warden'}],
 'std::string message;\nstd::getline(std::cin, message);\nstd::cout << "MESSAGE " << message;',hint('A name may contain more than one word.','Use getline rather than operator >>.','Print the prefix and then name.'),{requirements:[['getline','Use getline to retain spaces.']]});
step('conversion','wide-integers',1,'Beyond a small register','Integer range and overflow',
 'Signed overflow is undefined behavior. <code>long long</code> has a wider range than int, but the arithmetic itself must use the wider type. Multiplying two ints first can overflow before assignment. Cast one operand before the multiplication.',
 'Return the product of two nonnegative int counts (each at most 100000) as long long. Widen an operand before multiplying.',
 'long long cellsWide(int rows, int columns) {\n    return 0;\n}',[['cellsWide(100000, 100000)','10000000000'],['cellsWide(0, 9)','0'],['cellsWide(3, 7)','21']],
 'long long bytes = static_cast<long long>(count) * size;',hint('A larger destination alone is not enough.','Widen rows or columns before computing.','static_cast<long long>(rows) * columns'));
program('capacity','resource-project',1,'Project: distribute the reserve','Resource calculator',
 'Decompose the specification into inputs, computations, and output. Reuse integer division and remainder for complete allocations and surplus. The tests guarantee a positive number of shelters and a reserve at least as large as the protected amount.',
 'Read reserve, protectedAmount, and shelters. Set available = reserve - protectedAmount. Print the equal whole-number share and the leftover amount, separated by a space.',
 io+'int main() {\n    int reserve = 0, protectedAmount = 0, shelters = 1;\n    // Read, calculate, report.\n}\n',
 [{name:'Uneven distribution',stdin:'53 10 6\n',expected:'7 1'},{name:'Nothing left',stdin:'8 8 3\n',expected:'0 0'},{name:'One shelter',stdin:'23 3 1\n',expected:'20 0'}],
 'int available = stock - buffer;\nstd::cout << available / teams << " " << available % teams;',hint('Subtract the protected amount before dividing.','Compute both the quotient and remainder using shelters.','Read three values before computing available.'),{phase:'project',minutes:25});

program('branch','input-failure',2,'When the signal is not a number','Input validation',
 'An extraction is a condition: <code>if (std::cin &gt;&gt; value)</code> is true only if reading succeeded. Never use a failed input as if it were valid. This lesson asks for one integer; later stream lessons reject trailing junk too.',
 'Read one integer. Print it if extraction succeeds; otherwise print INVALID. Empty input must be handled.',
 io+'int main() {\n    int value = 0;\n    // Branch on the extraction result.\n}\n',
 [{name:'Valid',stdin:'42\n',expected:'42'},{name:'Malformed',stdin:'broken\n',expected:'INVALID'},{name:'Missing',stdin:'',expected:'INVALID'}],
 'if (std::cin >> count) std::cout << count;\nelse std::cout << "MISSING";',hint('Test reading itself, not whether the initialized variable is zero.','An if can contain std::cin >> value.','Use else to print INVALID.'));
step('boolean','short-circuit',2,'Guard the division','Short-circuit safety',
 '<code>&amp;&amp;</code> evaluates its left operand first and skips the right operand when the left is false. Put a safety check before an operation that would otherwise be invalid. A zero divisor must never reach division.',
 'Return true when teams is positive and supplies / teams is at least 3. If teams is zero or negative, return false without dividing.',
 'bool enough(int supplies, int teams) {\n    return false;\n}',[['enough(12, 4)','1'],['enough(11, 4)','0'],['enough(9, 0)','0'],['enough(9, -1)','0']],
 'return denominator != 0 && numerator / denominator > 1;',hint('Check teams before using it as a divisor.','Use && with teams > 0 on the left.','Return teams > 0 && supplies / teams >= 3;'));
program('logic-transfer','access-project',2,'Project: rebuild access control','Validated decision system',
 'A decision system separates malformed input from valid input that is denied. Validate the record first, then evaluate its policy. Use exact boundary tests for the minimum energy and the allowed clearance values.',
 'Read energy and clearance (0 or 1). Print INVALID for failed input, negative energy, or other clearance values; OPEN for energy >= 10 and clearance == 1; otherwise LOCKED.',
 io+'int main() {\n    int energy = 0, clearance = 0;\n    // Validate the record before applying the policy.\n}\n',
 [{name:'Threshold',stdin:'10 1\n',expected:'OPEN'},{name:'Insufficient',stdin:'9 1\n',expected:'LOCKED'},{name:'No clearance',stdin:'50 0\n',expected:'LOCKED'},{name:'Invalid clearance',stdin:'20 2\n',expected:'INVALID'},{name:'Broken record',stdin:'bad\n',expected:'INVALID'}],
 'if (!(std::cin >> a >> b)) { std::cout << "INVALID"; return 0; }',hint('Handle extraction failure first and return.','Then reject out-of-domain values.','Only the final policy branch uses energy >= 10 and clearance == 1.'),{phase:'project',minutes:25});

program('off-by-one','loop-control',3,'Stop at corruption','break and continue',
 '<code>continue</code> skips the rest of the current iteration. <code>break</code> leaves the loop. Trace these separately: negative values are skipped here, but the sentinel 99 ends processing. Check the sentinel before adding it.',
 'Read ints from stdin until EOF or 99. Sum nonnegative values before the first 99; ignore other negative values. Use break for 99 and continue for negatives. Print the total.',
 io+'int main() {\n    int value=0, total=0;\n    while (std::cin >> value) {\n        // Stop at 99, skip negatives, add the rest.\n    }\n    std::cout << total;\n}',
 [{name:'Stop and skip',stdin:'2 -3 5 99 8\n',expected:'7'},{name:'Immediate stop',stdin:'99 4\n',expected:'0'},{name:'Empty stream',stdin:'',expected:'0'},{name:'No sentinel',stdin:'-1 0 3\n',expected:'3'}],
 'while (std::cin >> n) { if (n == 7) break; if (n < 0) continue; total += n; }',hint('Visit readings in their original order.','Sentinel checking must happen before accumulation.','Put both checks before total += value.'),{requirements:[['\\bbreak\\b','Practice break.'],['\\bcontinue\\b','Practice continue.']]});
program('while','read-until-end',3,'A stream of readings','Input loops and EOF',
 '<code>while (std::cin &gt;&gt; value)</code> reads, checks success, and repeats. End-of-file stops the loop. Do not loop on eof() before reading: it describes an earlier read, not whether the next one will succeed.',
 'Read integers until extraction fails or input ends. Print their sum. Empty input returns 0.',
 io+'int main() {\n    int value = 0, total = 0;\n    // Accumulate successful reads.\n    std::cout << total;\n}',
 [{name:'Several readings',stdin:'3 -2 8\n',expected:'9'},{name:'Empty stream',stdin:'',expected:'0'},{name:'Stop on malformed token',stdin:'4 5 noise 10\n',expected:'9'}],
 'while (std::cin >> value) { ++count; }',hint('Put the extraction in the while condition.','Only add value after a successful read.','The body needs total += value;'));
program('grid','guessing-project',3,'Project: the guessing lock','Interactive loop project',
 'A console game reads a sequence of actions and produces feedback after each one. It must stop when solved and also terminate on EOF. Write the rules first: smaller, larger, equal, then stop.',
 'The secret is 7. Read guesses until EOF or a correct guess. For each guess print LOW, HIGH, or OPEN on its own line. Stop immediately after OPEN.',
 io+'int main() {\n    const int secret = 7;\n    int guess = 0;\n    // Keep reading guesses until the lock opens.\n}',
 [{name:'Try and succeed',stdin:'3 9 7 1\n',expected:'LOW\nHIGH\nOPEN'},{name:'First try',stdin:'7\n',expected:'OPEN'},{name:'EOF before success',stdin:'2 5\n',expected:'LOW\nLOW'}],
 'while (std::cin >> action) { if (action == stop) break; }',hint('Use a while extraction loop.','Compare each guess with secret and output one line.','Print OPEN before breaking.'),{phase:'project',minutes:30});

step('function','overloads',4,'One name, two commands','Function overloads',
 'Overloads share a name but have different parameter lists. The compiler selects a matching signature at the call site. Return type alone cannot distinguish overloads. Keep each overload small and explicit.',
 'Implement boost(int energy) to add 1, and boost(int energy, int amount) to add amount. Return the new energy from each.',
 'int boost(int energy) { return 0; }\nint boost(int energy, int amount) { return 0; }',
 [['boost(4)','5'],['boost(4, 8)','12'],['boost(0, 0)','0']],
 'int twice(int n) { return n * 2; }\nint twice(int n, int extra) { return n * 2 + extra; }',hint('The one-argument overload uses a fixed increment.','The two-argument overload uses the second parameter.','Both return a sum.'));
program('scope','function-tests',4,'Test the edges','Assertions and regression tests',
 '<code>assert(condition)</code> stops a debug build when a condition is false. Test boundaries, empty/zero cases, and an ordinary case. Tests are executable specifications. Repair the implementation; keep the supplied tests so the regression stays caught.',
 'Repair clampEnergy: return 0 below zero, 100 above 100, and the unchanged value between. Keep all assertions passing, then print TESTS PASSED.',
 io+'#include <cassert>\nint clampEnergy(int n) { return n; }\nint main() {\n    assert(clampEnergy(-1) == 0);\n    assert(clampEnergy(0) == 0);\n    assert(clampEnergy(55) == 55);\n    assert(clampEnergy(100) == 100);\n    assert(clampEnergy(101) == 100);\n    std::cout << "TESTS PASSED";\n}',
 [{name:'Regression assertions',stdin:'',expected:'TESTS PASSED'}],
 'assert(remaining(10, 10) == 0);\nassert(remaining(10, 0) == 10);',hint('There are three cases, including two exact boundaries.','Return early for n < 0 and n > 100.','Otherwise return n.'),{phase:'debug',requirements:[['assert\\s*\\(','Keep executable assertions.']]});
step('clamp','decompose',4,'One job per helper','Decomposition and reuse',
 'Separate a reusable policy from the operation that applies it. Name helpers for intent, pass state explicitly, and avoid hidden global variables. This lets one set of tests describe the policy and another describe its use.',
 'Implement nonnegative(n) to return max(n,0). Implement rescued(a,b) by calling nonnegative for each input and adding the results.',
 'int nonnegative(int n) { return 0; }\nint rescued(int a, int b) { return 0; }',
 [['nonnegative(-3)','0'],['nonnegative(7)','7'],['rescued(-5, 9)','9'],['rescued(4, 6)','10']],
 'int limited(int n) { return n > 10 ? 10 : n; }\nint pairTotal(int a, int b) { return limited(a) + limited(b); }',hint('Solve the helper before the combined function.','Use the same helper for both inputs.','Return nonnegative(a) + nonnegative(b);'));
program('function-tests','adventure-project',4,'Project: a tiny text adventure','State and command decomposition',
 'Model state separately from commands. This small adventure has one reusable transition function and a command-reading loop. A key can be collected before opening the gate; unknown commands leave state unchanged.',
 'Implement command(word, hasKey): KEY sets hasKey and returns FOUND; OPEN returns ESCAPED if hasKey, otherwise LOCKED; anything else returns UNKNOWN. The supplied main reads commands and stops after ESCAPED.',
 io+str+'std::string command(const std::string& word, bool& hasKey) {\n    // A reference lets this function change the caller’s key flag.\n    return "";\n}\nint main() {\n    bool hasKey = false;\n    std::string word;\n    while (std::cin >> word) {\n        const auto response = command(word, hasKey);\n        std::cout << response << "\\n";\n        if (response == "ESCAPED") break;\n    }\n}',
 [{name:'Find then open',stdin:'OPEN KEY OPEN LOOK\n',expected:'LOCKED\nFOUND\nESCAPED'},{name:'Unknown and EOF',stdin:'LOOK OPEN\n',expected:'UNKNOWN\nLOCKED'}],
 'if (word == "TAKE") { carrying = true; return "TAKEN"; }',hint('Implement the transition function; main already drives it.','Assign hasKey = true in the KEY branch.','The OPEN branch reads the flag; default returns UNKNOWN.'),{phase:'project',minutes:30});

step('vector','array',5,'A fixed set of ports','std::array and indexing',
 '<code>std::array&lt;int, 3&gt;</code> owns exactly three ints. Indexes start at zero. A three-element array has indexes 0, 1, and 2; index 3 is out of bounds. Unlike vector, array does not grow.',
 'Return the last reading in an array of three ints. Do not read past its end.',
 '#include <array>\nint lastPort(const std::array<int, 3>& ports) { return 0; }',
 [['lastPort({2, 5, 9})','9'],['lastPort({1, 1, -3})','-3'],['lastPort({0, 0, 0})','0']],
 'std::array<int, 2> pair{4, 8};\nint second = pair[1];',hint('The last index is one less than the size.','For three elements it is 2.','Return ports[2].'));
step('array','bounds',5,'Stay inside the inventory','Bounds checks',
 'Validate an index before subscripting. Check a signed index for negativity before converting it to a size type. <code>size()</code> is the number of elements, not the last valid index. An empty vector has no valid index.',
 'Return values[index] when index is valid; otherwise return -1. Valid indexes satisfy 0 <= index < size.',
 vec+'int safeItem(const std::vector<int>& values, int index) { return 0; }',
 [['safeItem({4, 8}, 1)','8'],['safeItem({4, 8}, 2)','-1'],['safeItem({4}, -1)','-1'],['safeItem({}, 0)','-1']],
 'if (i < 0 || static_cast<std::size_t>(i) >= data.size()) return -1;',hint('Reject negative values first.','Then compare the converted index against size().','Return values[index] only after both checks.'));
step('range','grow-vector',5,'Keep the useful fragments','Growing vectors',
 '<code>push_back</code> appends an element to an owning vector. Build a result while reading an unchanged input range. Do not append to the same vector whose iterators a loop is using; reallocation can invalidate them.',
 'Return a new vector containing only nonnegative input values, preserving order. Do not change the input. The checks inspect its size and selected items.',
 vec+'std::vector<int> collect(const std::vector<int>& values) {\n    std::vector<int> result;\n    return result;\n}',
 [['collect({-1, 3, 0, 8}).size()','3'],['collect({-1, 3, 0, 8}).at(1)','0'],['collect({-4}).empty()','1'],['collect({}).empty()','1']],
 'for (int n : input) if (n > 10) output.push_back(n);',hint('Use a separate result vector.','Visit each input value and test it.','Append with result.push_back(value).'));
step('grow-vector','iterators',5,'The space between beginning and end','Iterator ranges',
 'An iterator refers to a position in a container. <code>begin()</code> is the first position; <code>end()</code> is one past the last and must not be dereferenced. Increment only while the iterator differs from end(). An empty range has begin() == end().',
 'Use an iterator loop to sum values. Start at begin(), stop before end(), and read each element through *it.',
 vec+'int iteratorSum(const std::vector<int>& values) {\n    int total = 0;\n    return total;\n}',
 [['iteratorSum({2, 3, 5})','10'],['iteratorSum({})','0'],['iteratorSum({-2, 2})','0']],
 'for (auto it = data.begin(); it != data.end(); ++it) total += *it;',hint('end() is a boundary, not an element.','Use != in the condition.','Read *it inside the loop.'),{requirements:[['\\.begin\\s*\\(','Use an iterator range.'],['\\*\\s*it','Dereference the iterator named it.']]});
step('iterators','erase-iterator',5,'Remove without a dangling step','Iterator invalidation',
 '<code>vector.erase(it)</code> invalidates it and later iterators, then returns the next valid position. Assign that result back to it. Increment only in the branch that did not erase. Removing while range-iterating the same vector is unsafe.',
 'Repair the loop to erase every negative value and return the remaining count. Adjacent negatives and an all-negative input must work.',
 vec+'int removeCorruption(std::vector<int> values) {\n    for (auto it = values.begin(); it != values.end();) {\n        if (*it < 0) { values.erase(it); }\n        else { ++it; }\n    }\n    return static_cast<int>(values.size());\n}',
 [['removeCorruption({-1, -2, 3, -4, 0})','2'],['removeCorruption({-1, -2})','0'],['removeCorruption({})','0'],['removeCorruption({2, 3})','2']],
 'it = items.erase(it); // use the returned valid iterator',hint('erase invalidates the iterator you passed.','Capture the returned iterator.','Replace values.erase(it) with it = values.erase(it).'),{phase:'debug'});
step('string','string-slicing',5,'Read the command prefix','String operations',
 '<code>substr(start, count)</code> returns an owning string slice. Check length before accessing individual characters. Prefix matching is a small parsing step; it is different from searching for text anywhere in a message.',
 'Return true only when a message starts with the three characters SOS. Shorter strings return false.',
 str+'bool distress(const std::string& message) { return false; }',
 [['distress("SOS help")','1'],['distress("SOS")','1'],['distress("SO")','0'],['distress("xSOS")','0'],['distress("")','0']],
 'return text.size() >= 2 && text.substr(0, 2) == "OK";',hint('Match from position zero.','Use a length check and substr(0, 3).','Compare the slice with "SOS".'));
step('string-slicing','inventory-project',5,'Project: stock and crafting','Inventory integration',
 'A project can expose several tested operations on the same representation. Here vector positions identify item types and values represent stock. Validate indexes and quantities, mutate only on success, and leave a rejected craft unchanged.',
 'Implement addStock(stock,index,amount): add a positive amount at a valid index, otherwise do nothing. Implement craft(stock,index,needed): consume needed and return true only for a valid index, positive needed, and sufficient stock. Return false without changes otherwise.',
 vec+'void addStock(std::vector<int>& stock, int index, int amount) {\n}\nbool craft(std::vector<int>& stock, int index, int needed) {\n    return false;\n}',
 [['([]{std::vector<int> s{2,0}; addStock(s,1,3); return s[1];}())','3'],['([]{std::vector<int> s{5}; return craft(s,0,3) && s[0]==2;}())','1'],['([]{std::vector<int> s{2}; return !craft(s,0,3) && s[0]==2;}())','1'],['([]{std::vector<int> s{}; addStock(s,0,4); return !craft(s,0,1) && s.empty();}())','1'],['([]{std::vector<int> s{3}; return !craft(s,-1,1) && !craft(s,0,0) && s[0]==3;}())','1']],
 'if (index < 0 || static_cast<std::size_t>(index) >= stock.size()) return false;',hint('Share the same bounds rule between both operations.','Only mutate after every precondition is valid.','For crafting, subtract needed and return true after the checks.'),{phase:'project',minutes:40});

step('reference','const-reference',6,'Borrow without changing','Const references',
 'A reference aliases an existing object. <code>const T&amp;</code> borrows read-only access without copying the object. A mutable reference can change its caller. Keep the owner alive for the full borrow; a reference does not extend every lifetime.',
 'Implement totalEnergy(const vector<int>&) without modifying it, and refill(vector<int>&, amount) to add amount to every element.',
 vec+'int totalEnergy(const std::vector<int>& values) { return 0; }\nvoid refill(std::vector<int>& values, int amount) {\n}',
 [['totalEnergy({2,3})','5'],['totalEnergy({})','0'],['([]{std::vector<int> v{2,3}; refill(v,4); return totalEnergy(v);}())','13']],
 'for (int& n : data) n += bonus; // alias each element',hint('The sum loop can read values by value.','The refill loop needs int& to change elements.','Adding to a copy of each element will not change the vector.'));
step('pointer','pointer-borrow',6,'A pointer is an optional borrow','Null and non-owning pointers',
 'A raw pointer may be null. A non-null pointer can borrow an object while its owner is alive. Dereference only after checking. Do not delete a borrowed object. Ownership and address are different concepts.',
 'If target is non-null, add amount to the pointed-to int. Null is a no-op. This function never owns or deletes target.',
 'void chargeBorrowed(int* target, int amount) {\n}',
 [['([]{int n=4; chargeBorrowed(&n,3); return n;}())','7'],['([]{chargeBorrowed(nullptr,8); return true;}())','1']],
 'if (value != nullptr) *value = 0;',hint('Check target before dereferencing.','Use *target to access the original int.','Do not allocate or delete anything.'));
step('lifetime','simulation-project',6,'Project: a safe energy simulation','Value ownership and lifetime',
 'Returning an owning vector by value is safe: the returned vector owns its storage after local variables are destroyed. A simulation step should produce a new state without leaving references to local data. This project avoids manual allocation entirely.',
 'Implement stepEnergy(state, drain): copy state, subtract drain from every element but clamp at zero, and return the new vector. drain is nonnegative; do not mutate the input.',
 vec+'std::vector<int> stepEnergy(const std::vector<int>& state, int drain) {\n    return {};\n}',
 [['stepEnergy({5,2,0},3).at(0)','2'],['stepEnergy({5,2,0},3).at(1)','0'],['stepEnergy({},3).empty()','1'],['([]{std::vector<int> s{4}; auto next=stepEnergy(s,2); return s[0]==4 && next[0]==2;}())','1']],
 'auto next = state;\nfor (int& n : next) { n = n > cost ? n - cost : 0; }\nreturn next;',hint('Make an owning copy before changing values.','Use a mutable reference to each element of the copy.','Return the vector itself, never a pointer or reference to a local.'),{phase:'project',minutes:30});

step('class','constructors',7,'Build a valid companion','Constructors and member initialization',
 'A constructor establishes an object’s state when it is created. A member-initializer list initializes members directly. Initialization happens before the constructor body. Give every member a defined value before it can be read.',
 'Define Cell with an explicit constructor taking an int and an energy() const observer returning it. Use a private value_ member and initialize it.',
 'class Cell {\n    int value_;\npublic:\n    explicit Cell(int n) : value_(0) {}\n    int energy() const { return 0; }\n};',
 [['Cell(8).energy()','8'],['Cell(0).energy()','0'],['Cell(42).energy()','42']],
 'explicit Key(int code) : code_(code) {}',hint('Initialize value_ from n.','The const observer only reads state.','Return value_ from energy().'));
step('invariant','encapsulation',7,'Protect the invariant','Encapsulated operations',
 'An invariant must survive every public operation, not only construction. Keep data private and expose operations that reject invalid changes. A rejected operation leaves state unchanged.',
 'Implement Battery: constructor starts at nonnegative charge (negative becomes zero); spend(n) returns false for n <= 0 or insufficient charge, otherwise subtracts n and returns true. energy() const reports charge.',
 'class Battery {\n    int charge_;\npublic:\n    explicit Battery(int n) : charge_(0) {}\n    bool spend(int n) { return false; }\n    int energy() const { return charge_; }\n};',
 [['Battery(-1).energy()','0'],['([]{Battery b(9); return b.spend(4) && b.energy()==5;}())','1'],['([]{Battery b(2); return !b.spend(3) && b.energy()==2 && !b.spend(0);}())','1']],
 'if (cost <= 0 || cost > energy_) return false;',hint('Clamp once during construction.','Validate the operation before subtracting.','Never expose charge_ for arbitrary writes.'));
step('encapsulation','composition',7,'A robot has a battery','Object composition',
 'Composition models a has-a relationship. The containing object owns its members by value. Their lifetimes follow the owner automatically. Prefer composition when a robot uses a battery; a robot is not a kind of battery.',
 'Complete Robot with a Battery member named battery_. Its constructor passes energy to Battery. move() spends 2 energy and returns whether it succeeded; energy() delegates to the battery. The supplied Battery must be reused.',
 'class Battery {\n    int energy_;\npublic:\n    explicit Battery(int n) : energy_(n < 0 ? 0 : n) {}\n    bool spend(int n) { if(n <= 0 || n > energy_) return false; energy_ -= n; return true; }\n    int energy() const { return energy_; }\n};\nclass Robot {\n    Battery battery_;\npublic:\n    explicit Robot(int energy) : battery_(0) {}\n    bool move() { return false; }\n    int energy() const { return 0; }\n};',
 [['([]{Robot r(5); return r.move() && r.energy()==3;}())','1'],['([]{Robot r(1); return !r.move() && r.energy()==1;}())','1']],
 'class Door { Lock lock_; public: Door(int code) : lock_(code) {} };',hint('Initialize the owned member using the constructor argument.','Delegate move() to battery_.spend(2).','Delegate the observer to battery_.energy().'));
step('composition','combat-project',7,'Project: a turn-based defender','Battle model and invariants',
 'Keep a battle model independent of its display. Give an actor health and an operation that never leaves health negative. Compose the actor into a battle simulation. Deterministic inputs make the model testable without a game loop or random numbers.',
 'Implement Fighter with clamped initial health, hit(damage) that ignores nonpositive damage and clamps at zero, and health() const. Implement survive(health, attacks) by creating a Fighter and applying each attack in order.',
 vec+'class Fighter {\n    int health_;\npublic:\n    explicit Fighter(int n) : health_(0) {}\n    void hit(int damage) {}\n    int health() const { return 0; }\n};\nint survive(int health, const std::vector<int>& attacks) { return 0; }',
 [['survive(10,{3,2})','5'],['survive(5,{8,2})','0'],['survive(7,{-4,0,2})','5'],['survive(-1,{})','0'],['Fighter(6).health()','6']],
 'Fighter actor(initial);\nfor (int attack : attacks) actor.hit(attack);',hint('Write and check the class before the simulation.','Clamp after valid damage; do not let negative damage heal.','Use a local Fighter in survive, then return its final health.'),{phase:'project',minutes:45});

// RAII is introduced before dynamic ownership mechanics.
step('^raii','destruction',8,'A scope that pays its debt','Destructors and RAII',
 'RAII ties acquisition to construction and release to destruction. Automatic local objects are destroyed when their scope ends, including when returning early. A destructor must not throw. This counter is a visible model of a resource lease.',
 'Complete Lease: construction increments the referenced live count; destruction decrements it. Do not copy leases in this trial. The checks create and destroy nested scopes.',
 'class Lease {\n    int& live_;\npublic:\n    explicit Lease(int& live) : live_(live) { }\n    ~Lease() { }\n    Lease(const Lease&) = delete;\n    Lease& operator=(const Lease&) = delete;\n};',
 [['([]{int n=0; {Lease a(n); {Lease b(n);} if(n!=1) return false;} return n==0;}())','1'],['([]{int n=0; {Lease a(n); return n==1;} }())','1']],
 'Handle(Resource& r) : resource_(r) { resource_.acquire(); }\n~Handle() { resource_.release(); }',hint('The reference points to the caller’s live counter.','Increment in the constructor body.','Decrement in the destructor.'),{phase:'foundation'});
step('raii','unique-borrow',8,'One owner, a short borrow','Smart ownership and observers',
 'A unique_ptr is an exclusive owner. <code>get()</code> exposes a non-owning pointer without transferring ownership. A borrow must end before its owner is destroyed. Prefer a reference when null is not meaningful.',
 'Implement peek(const unique_ptr<int>&): return the pointed-to value if present, otherwise -1. Do not copy or release the owner.',
 '#include <memory>\nint peek(const std::unique_ptr<int>& owner) { return 0; }',
 [['peek(std::make_unique<int>(12))','12'],['peek(std::unique_ptr<int>{})','-1']],
 'if (owner) use(*owner);',hint('unique_ptr can be tested as a condition.','Return *owner when it exists.','A const reference avoids copying the exclusive owner.'));
step('move','moved-owner',8,'Observe the handover','Moved-from ownership',
 'For unique_ptr, moving transfers ownership and leaves the source empty. That rule is specific and useful; do not assume every moved-from C++ object becomes empty. Other types are often valid but in an unspecified state.',
 'Create first with value 9, move it to second, and return true only when first is empty and second owns 9.',
 '#include <memory>\n#include <utility>\nbool handover() {\n    return false;\n}',[['handover()','1']],
 'auto next = std::move(owner);\nbool transferred = !owner && next;',hint('Use make_unique to create the first owner.','Move rather than copy to second.','Test !first, second, and *second == 9.'));
step('moved-owner','dungeon-project',8,'Project: a resource-safe dungeon','Ownership integration',
 'Use owning containers to express a variable number of exclusive resources. Each room owns one light. Moving the vector can transfer the whole dungeon; clearing it destroys its unique_ptr elements. No manual delete is needed.',
 'Implement buildLights(count): return count unique_ptr<int> values initialized to 1, or an empty vector when count <= 0. Implement lit(lights) to sum values of non-null owners. Do not use new or delete.',
 '#include <memory>\n'+vec+'std::vector<std::unique_ptr<int>> buildLights(int count) { return {}; }\nint lit(const std::vector<std::unique_ptr<int>>& lights) { return 0; }',
 [['lit(buildLights(4))','4'],['lit(buildLights(0))','0'],['buildLights(-2).empty()','1'],['([]{auto a=buildLights(3); auto b=std::move(a); return lit(b);}())','3']],
 'std::vector<std::unique_ptr<int>> owners;\nowners.push_back(std::make_unique<int>(7));',hint('Build a local vector and append one owning pointer each iteration.','Read owners with const auto& so no copy is attempted.','Returning the owning vector safely transfers its contents.'),{phase:'project',minutes:40});

step('^algorithm','lambda',9,'Capture an intention','Lambda parameters and captures',
 'A lambda is a callable object. Parameters receive each input; captures preserve surrounding state. Capture a small threshold by value so the callable does not borrow a local variable that might disappear.',
 'Implement above(value, threshold) by creating a lambda named test that captures threshold by value and returns whether its int parameter exceeds it. Return test(value).',
 'bool above(int value, int threshold) {\n    return false;\n}',[['above(8, 7)','1'],['above(7, 7)','0'],['above(-2, -3)','1']],
 'auto below = [limit](int n) { return n < limit; };',hint('The capture list contains threshold.','The parameter supplies the value being checked.','Use [threshold](int n) { return n > threshold; };'));
step('algorithm','sorting',9,'Restore the order','Sorting and algorithm contracts',
 '<code>std::sort(begin,end)</code> rearranges a random-access range in ascending order by default. Sorting mutates its range; take a vector by value when the caller’s copy should remain unchanged. Decide the empty-input behavior explicitly.',
 'Sort a copy of values and return its smallest element. Empty input returns -1.',
 '#include <algorithm>\n'+vec+'int smallest(std::vector<int> values) { return 0; }',
 [['smallest({8,2,7})','2'],['smallest({})','-1'],['smallest({-4,0,9})','-4']],
 'std::sort(copy.begin(), copy.end());',hint('Handle empty before accessing front().','Sort values using begin/end.','Return values.front() after sorting.'),{requirements:[['std::sort\\s*\\(','Use the standard sort algorithm.']]});
step('template','concepts',9,'State the type contract','C++20 concepts',
 '<code>std::integral</code> is a standard concept from &lt;concepts&gt;. A constrained template states which types it accepts. Constraints are checked during compilation; they do not test runtime values. This trial also checks that a double cannot call your template.',
 'Constrain twice<T> to integral types and return n + n. Keep accepts<T> so the checks can test whether a call is well-formed. Do not accept double.',
 '#include <concepts>\ntemplate<typename T>\nT twice(T n) { return T{}; }\ntemplate<typename T>\nconstexpr bool accepts = requires(T n) { twice(n); };',
 [['twice(4)','8'],['twice(0L)','0'],['accepts<int>','1'],['accepts<double>','0']],
 'template<std::integral T> T increment(T n) { return n + 1; }',hint('Replace typename T with a constrained type parameter.','std::integral comes from <concepts>.','Then return n + n.'),{requirements:[['std::integral','Use the integral type constraint.']]});
step('concepts','class-template',9,'One container, several types','Class templates',
 'A class template applies a representation to multiple types. A small owning Box stores a value by value. Template definitions must be visible where they are instantiated, which is why they commonly live in headers.',
 'Complete Box<T>: store the constructor value and return it from get() const. Support int and double.',
 'template<typename T>\nclass Box {\n    T value_;\npublic:\n    explicit Box(T n) : value_{} {}\n    T get() const { return T{}; }\n};',
 [['Box<int>(7).get()','7'],['Box<double>(2.5).get()','2.5']],
 'template<typename T> struct Pair { T first; T second; };',hint('Use the same T in storage, constructor, and return type.','Initialize value_ from n.','Return value_.'));
step('sorting','toolkit-project',9,'Project: a generic signal toolkit','Generic algorithms integration',
 'Combine a type contract, a reusable callable, and a standard algorithm. The supplied test uses ints and doubles, which need a broader constraint than std::integral. std::totally_ordered expresses the comparisons required by this toolkit.',
 'Implement countAbove<T>(values, limit), constrained by std::totally_ordered, using count_if and a by-value lambda capture. Return the count of elements strictly greater than limit.',
 '#include <concepts>\n#include <algorithm>\n'+vec+'template<std::totally_ordered T>\nint countAbove(const std::vector<T>& values, T limit) { return 0; }',
 [['countAbove<int>({1,4,4,9},4)','1'],['countAbove<double>({1.5,2.5,3.5},2.0)','2'],['countAbove<int>({},3)','0']],
 'auto matches = [bound](T value) { return value < bound; };',hint('Call count_if with the vector’s iterator range.','Capture limit by value in the predicate.','Convert the algorithm’s count to int for the declared return type.'),{phase:'project',minutes:35});

step('stream','strict-parse',10,'Reject trailing corruption','Stream state and complete records',
 'A successful first extraction does not prove the entire record is valid. After reading a number, consume whitespace with <code>std::ws</code> and check end-of-file. This accepts trailing spaces but rejects extra tokens.',
 'Return the parsed nonnegative int if the string contains exactly one integer and optional whitespace; otherwise return -1. Reject negative values and trailing junk.',
 '#include <sstream>\n'+str+'int strictEnergy(const std::string& text) { return 0; }',
 [['strictEnergy(" 42  ")','42'],['strictEnergy("42 junk")','-1'],['strictEnergy("-2")','-1'],['strictEnergy("")','-1']],
 'if (!(input >> n)) return -1;\ninput >> std::ws;\nif (!input.eof()) return -1;',hint('Check extraction success first.','Then consume whitespace and verify no more input remains.','A negative parsed value is invalid too.'));
step('optional','exceptions',10,'Signal an exceptional failure','throw and catch',
 '<code>throw</code> reports a failure to a matching catch handler. Standard exception types carry meaning; catch by const reference to avoid slicing. Expected absence often fits optional better; exceptions are useful when an operation cannot fulfill its contract.',
 'Implement divide(a,b): throw std::invalid_argument when b == 0; otherwise return integer a / b. The supplied safeDivide catches that type and returns ERROR, or the quotient as text.',
 '#include <stdexcept>\n'+str+'int divide(int a, int b) { return 0; }\nstd::string safeDivide(int a, int b) {\n    try { return std::to_string(divide(a,b)); }\n    catch (const std::invalid_argument&) { return "ERROR"; }\n}',
 [['safeDivide(9, 3)','3'],['safeDivide(8, 0)','ERROR'],['safeDivide(-9, 2)','-4']],
 'if (size < 0) throw std::invalid_argument("negative size");',hint('Check the divisor before performing division.','Throw exactly the exception type the handler catches.','Return a / b for valid divisors.'));
step('exceptions','unwind',10,'Cleanup during failure','RAII and stack unwinding',
 'Throwing unwinds automatic objects between the throw and the handler. Their destructors still run. Use RAII rather than a separate manual cleanup path for every return and exception. Destructors themselves should not throw.',
 'Complete Guard so construction increments live and destruction decrements it. Implement cleaned(): create a guard inside try, throw runtime_error, catch it, and return whether live is zero afterward.',
 '#include <stdexcept>\nstruct Guard {\n    int& live;\n    explicit Guard(int& n) : live(n) {}\n    ~Guard() {}\n};\nbool cleaned() {\n    int live = 0;\n    // Scope the guard inside try, and inspect after catch.\n    return false;\n}',[['cleaned()','1']],
 'try { Resource r; throw std::runtime_error("stop"); } catch(const std::runtime_error&) {}',hint('Update the counter in both lifetime hooks.','The guard must be local to the try block.','After catch, compare live with zero.'));
program('unwind','file-streams',10,'Write a memory to disk','File streams and failure checks',
 '<code>ofstream</code> writes and <code>ifstream</code> reads. Their destructors close files. End the output scope before reading so buffered data is flushed. Test both opening and extraction. Here files live only in the compiler sandbox for one run; they do not persist as player saves.',
 'Read an int from stdin. Write it to energy.txt using ofstream in a nested scope, then reopen using ifstream and print the recovered int. On any failed input/open/write/read print ERROR.',
 io+'#include <fstream>\nint main() {\n    int value = 0;\n    // Validate input, write and close, then read back.\n}',
 [{name:'Persist zero',stdin:'0\n',expected:'0'},{name:'Persist reading',stdin:'42\n',expected:'42'},{name:'Reject input',stdin:'noise\n',expected:'ERROR'}],
 '{ std::ofstream out("state.txt"); out << score; }\nstd::ifstream in("state.txt");',hint('Return after reporting an input failure.','Place the output stream inside braces so it closes.','Check stream state and report ERROR on each failure.'),{requirements:[['std::ofstream','Write a real sandbox file.'],['std::ifstream','Reopen the sandbox file.']]});

step('search','operation-count',11,'Measure the work','Complexity and instrumentation',
 'Count operations before timing. A worst-case linear search visits n items; an early match visits fewer. O(n) describes growth, not exact seconds. Instrumenting comparisons makes this cost visible without noisy stopwatch thresholds.',
 'Return how many element comparisons a linear search makes before finding target, including its successful comparison. If absent, count all elements.',
 vec+'int comparisons(const std::vector<int>& values, int target) { return 0; }',
 [['comparisons({4,7,9},4)','1'],['comparisons({4,7,9},9)','3'],['comparisons({4,7,9},8)','3'],['comparisons({},8)','0']],
 '++checks;\nif (value == wanted) break;',hint('Increment before checking each element.','Stop after a match.','Empty input performs no comparisons.'));
step('operation-count','binary-search',11,'Halve the search space','Binary search and contracts',
 'Binary search requires sorted input. Maintain a half-open interval [left,right), shrink it every iteration, and never read at right. The worst-case number of steps grows logarithmically. Sorting solely for one search may cost more overall than linear search.',
 'Implement containsSorted on an ascending vector using a binary search loop. Return whether target exists. Empty and missing values must terminate.',
 vec+'bool containsSorted(const std::vector<int>& values, int target) {\n    int left = 0, right = static_cast<int>(values.size());\n    return false;\n}',
 [['containsSorted({1,4,7,9},7)','1'],['containsSorted({1,4,7,9},8)','0'],['containsSorted({},1)','0'],['containsSorted({2},2)','1'],['containsSorted({2},1)','0']],
 'int middle = left + (right - left) / 2;',hint('Continue while left < right.','A too-small middle value makes left = middle + 1.','A too-large value makes right = middle.'));
step('recursion','queue',11,'A fair frontier','Queues and breadth-first order',
 '<code>std::queue</code> is first-in, first-out. Push at the back, inspect front(), and pop the front only when nonempty. A queue is useful when nearby work must be processed before deeper work.',
 'Push every input value into a queue, then pop all values in FIFO order while building a comma-separated string. No trailing comma; empty input returns an empty string.',
 '#include <queue>\n'+vec+str+'std::string fifo(const std::vector<int>& values) { return ""; }',
 [['fifo({3,1,2})','3,1,2'],['fifo({})',''],['fifo({7})','7']],
 'while (!q.empty()) { int value=q.front(); q.pop(); }',hint('Fill the queue before draining it.','Insert a comma only when the output is not empty.','Use std::to_string on each front value.'));
step('queue','graph-route',11,'Project: a pathfinding robot','Graph search and visited state',
 'In an unweighted graph, breadth-first search finds a shortest path by exploring each distance layer in queue order. Mark vertices when enqueuing them, so cycles do not repeat forever. A distance of -1 means not visited or unreachable.',
 'Implement distanceTo(graph,start,goal) for an adjacency-list vector<vector<int>>. Return the fewest edges, -1 when unreachable or an endpoint is invalid. Neighbor IDs in supplied graphs are valid.',
 '#include <queue>\n'+vec+'int distanceTo(const std::vector<std::vector<int>>& graph, int start, int goal) {\n    return -1;\n}',
 [['distanceTo({{1,2},{3},{3},{}},0,3)','2'],['distanceTo({{1},{0},{}},0,2)','-1'],['distanceTo({{1},{0}},0,0)','0'],['distanceTo({},0,0)','-1'],['distanceTo({{}},-1,0)','-1']],
 'distance[start]=0; q.push(start);\n// Enqueue an unseen neighbor with distance[current]+1.',hint('Reject invalid endpoints before indexing.','Initialize a distance vector to -1 and push start.','For unseen neighbors, set distance before pushing them.'),{phase:'project',minutes:45});
step('graph-route','grid-project',11,'Project: navigate the ruined grid','Representation transfer',
 'Transfer the graph idea to a rectangular grid. Four orthogonal neighbors are edges; walls are not vertices you can enter. Boundary checks happen before indexing. The supplied grids are rectangular. Mark a cell as visited when enqueuing it.',
 'Implement escape(grid) from top-left to bottom-right using four-direction BFS. # blocks a cell. Return shortest step count, or -1 for empty grids, blocked endpoints, or no route.',
 '#include <queue>\n#include <utility>\n'+vec+str+'int escape(const std::vector<std::string>& grid) { return -1; }',
 [['escape({"...",".#.","..."})','4'],['escape({".#","#."})','-1'],['escape({"."})','0'],['escape({"#"})','-1'],['escape({})','-1']],
 'const int dx[4]={1,-1,0,0};\nconst int dy[4]={0,0,1,-1};',hint('Use a queue of row/column pairs and a distance grid.','Check each neighbor’s bounds, wall, and visited state.','The first distance assigned to the goal is shortest.'),{phase:'transfer',minutes:45});

step('^atomic','thread-join',12,'Start, then join','Thread lifetime',
 'A thread starts work concurrently. <code>join()</code> waits for completion and synchronizes with that completion. An ordinary std::thread must be joined or detached before destruction; use joining rather than detaching borrowed local state.',
 'Start a std::thread that computes n*n into result by reference, join it, then return result. Do not read result before joining.',
 '#include <thread>\nint joinedSquare(int n) {\n    int result = 0;\n    // Start worker, join, return result.\n    return result;\n}',
 [['joinedSquare(5)','25'],['joinedSquare(-3)','9'],['joinedSquare(0)','0']],
 'std::thread worker([&result, n] { result = n + 1; });\nworker.join();',hint('Capture n by value and result by reference.','The local result must outlive the worker.','Join before returning from the function.'));
step('atomic','mutex',12,'Keep a compound promise','Mutex and lock_guard',
 'An atomic scalar does not automatically protect a multi-step invariant. A mutex serializes a critical section. <code>lock_guard</code> unlocks on scope exit. Keep the lock short; join workers only after they can acquire the lock they need.',
 'Implement twoWorkers(n): two threads each append n copies of 1 to a shared vector under a mutex. Join both and return the final size. n is nonnegative.',
 '#include <thread>\n#include <mutex>\n'+vec+'int twoWorkers(int n) {\n    std::vector<int> results;\n    std::mutex gate;\n    // Lock around each mutation, join both workers.\n    return static_cast<int>(results.size());\n}',
 [['twoWorkers(0)','0'],['twoWorkers(10)','20'],['twoWorkers(50)','100']],
 'std::lock_guard<std::mutex> lock(gate);\nresults.push_back(1);',hint('A reusable lambda can run in both threads.','Protect push_back, which may reallocate.','Join both workers before reading the vector size.'),{requirements:[['lock_guard','Use an automatic lock guard.']]});
step('mutex','deadlock-repair',12,'Wait without holding the gate','Deadlock avoidance',
 'Joining while holding a mutex needed by the worker creates a deadlock: the caller waits for the worker, and the worker waits for the caller. End the lock scope before waiting. Never run known-deadlocking code outside an execution timeout.',
 'Repair awaitSignal so the worker can acquire gate. The caller must not hold gate while joining. Return the value written by the worker after join.',
 '#include <thread>\n#include <mutex>\nint awaitSignal() {\n    int value=0;\n    std::mutex gate;\n    std::lock_guard<std::mutex> held(gate);\n    std::thread worker([&] { std::lock_guard<std::mutex> lock(gate); value=7; });\n    worker.join();\n    return value;\n}',[['awaitSignal()','7']],
 '{ std::lock_guard<std::mutex> lock(m); /* finish shared setup */ }\nworker.join();',hint('Look at the lifetime of held.','Remove the unnecessary caller lock, or limit its scope before starting/waiting.','The worker’s lock is still required for shared guarded operations.'),{phase:'debug'});
step('async','factory-project',12,'Project: a concurrent rescue factory','Concurrent integration',
 'Partition independent work and combine only after completion. Sharing writable containers requires synchronization; returning independent partial results avoids that need. Capture each worker’s input by value so its lifetime is clear.',
 'Implement factory(a,b): start two async tasks, each returning the sum of nonnegative values in its own vector. Collect both futures and return their sum. Do not share a mutable accumulator.',
 '#include <future>\n'+vec+'int factory(std::vector<int> a, std::vector<int> b) {\n    return 0;\n}',
 [['factory({3,-1,2},{4,0})','9'],['factory({},{})','0'],['factory({-4},{7})','7']],
 'auto task = std::async(std::launch::async, [values] { /* local total */ return total; });',hint('Make a callable that takes a vector by value and computes one total.','Launch once for each input.','Return first.get() + second.get().'),{phase:'project',minutes:45});

step('^prime','regression-suite',13,'A test suite that can fail','Testing and mutation checks',
 'A useful suite accepts a correct implementation and rejects plausible wrong ones. Test normal, zero, negative, and exact-boundary behavior. A test that merely prints PASSED without checking results proves nothing.',
 'Implement suite(candidate), where candidate is an int(int) function pointer. Return true only if it clamps -1 to 0, 0 to 0, 50 to 50, 100 to 100, and 101 to 100. The checks give correct and deliberately wrong candidates.',
 'bool suite(int (*candidate)(int)) { return true; }',
 [['suite(+[](int n){return n<0?0:n>100?100:n;})','1'],['suite(+[](int n){return n;})','0'],['suite(+[](int){return 0;})','0'],['suite(+[](int n){return n<0?0:n>=100?99:n;})','0']],
 'bool ok = operation(0)==0 && operation(1)==1;',hint('Call candidate on each required boundary.','Use && so every expected result is required.','Include the upper boundary and the value just above it.'),{phase:'transfer'});
program('regression-suite','profiling',13,'Measure before optimizing','Profiling and steady_clock',
 'Use a monotonic <code>steady_clock</code> around work, not calendar time. Record the result so a benchmark cannot discard unused work. Measure repeatably and compare the same workload; noisy wall-clock speed is not a fair progression gate. Here a nonnegative duration is inspected, never a machine-specific speed target.',
 'Read n (0..1000). Sum 1..n while counting additions. Time the work with steady_clock and duration_cast<nanoseconds>. Print total, additions, and whether elapsed nanoseconds is nonnegative. Do not print the raw duration.',
 io+'#include <chrono>\nint main() {\n    int n=0; std::cin >> n;\n    long long total=0; int additions=0;\n    // Record start, perform and count work, record finish.\n}',
 [{name:'Small workload',stdin:'4\n',expected:'10 4 1'},{name:'Empty workload',stdin:'0\n',expected:'0 0 1'},{name:'Larger workload',stdin:'1000\n',expected:'500500 1000 1'}],
 'auto start = std::chrono::steady_clock::now();\n// measured work\nauto elapsed = std::chrono::steady_clock::now() - start;',hint('Time before and after the loop.','Increment additions once per added number.','Convert finish-start to nanoseconds and compare count() >= 0.'),{requirements:[['steady_clock','Use a monotonic clock.'],['duration_cast','Convert the measured duration explicitly.']]});
step('profiling','profile-transfer',13,'Choose the optimization','Algorithmic profiling transfer',
 'A profiler points to expensive work; changing an algorithm can matter more than a small syntax change. Counting all pairs visits n² pairs. A running sum visits n elements. Preserve the same result and test empty input before comparing timings.',
 'Implement pairSum(values): return the sum of a*b for every ordered pair of elements, using the identity (sum values) squared. Inputs are small; use long long arithmetic.',
 vec+'long long pairSum(const std::vector<int>& values) { return 0; }',
 [['pairSum({1,2,3})','36'],['pairSum({-2,2})','0'],['pairSum({})','0'],['pairSum({4})','16']],
 'long long total=0;\nfor (int n : values) total += n;\nreturn total * total;',hint('Factor the repeated summation rather than nesting loops.','Store the sum in a wide accumulator.','Square that sum.'),{phase:'transfer'});

// True multi-file projects: editable headers and implementation, visible locked checks.
function project(after,id,region,title,skill,teaching,task,files,tests,hints,minutes=45){
 const sources=Object.keys(files).filter(n=>n.endsWith('.cpp')&&n!=='checks.cpp');
 const build='cmake_minimum_required(VERSION 3.16)\nproject('+id.replaceAll('-','_')+' LANGUAGES CXX)\nset(CMAKE_CXX_STANDARD 20)\nset(CMAKE_CXX_STANDARD_REQUIRED ON)\nadd_executable(quest checks.cpp '+sources.join(' ')+')\nfind_package(Threads REQUIRED)\ntarget_link_libraries(quest PRIVATE Threads::Threads)\nenable_testing()\nadd_test(NAME quest_checks COMMAND quest)\n';
 step(after,id,region,title,skill,teaching,task,files[Object.keys(files)[0]],tests,'// Declare in .hpp; define in .cpp; include the header in both.',hints,{mode:'project',phase:'project',minutes,files:{...files,'CMakeLists.txt':build},entry:'checks.cpp',readOnly:['checks.cpp','CMakeLists.txt'],expected:tests.map(t=>t[1]).join('\n')});
}
project('file-streams','header-contract',10,'Declare here, define there','Headers and separate translation units',
 'A header declares the interface; a .cpp defines it. Include guards prevent repeated declarations from the same header. The compiler compiles the implementation and test translation units separately, then links them. A declaration without a definition produces a link error.',
 'In power.hpp, declare int restoredPower(int,int). In power.cpp, include that header and define the function to add its inputs. checks.cpp is visible and read-only. Use the file tabs; the build links both translation units.',
 {'power.hpp':'#ifndef POWER_HPP\n#define POWER_HPP\n// Declare restoredPower here.\n#endif\n','power.cpp':'#include "power.hpp"\n// Define restoredPower here.\n','checks.cpp':io+'#include "power.hpp"\nint main(){\n    std::cout << restoredPower(3,4) << "\\n" << restoredPower(0,5) << "\\n";\n}\n'},
 [['3 + 4','7'],['0 + 5','5']],hint('The declaration ends with a semicolon.','The definition has a body and matching parameter types.','Do not #include the .cpp; it is compiled separately.'),25);
project('header-contract','linker-repair',10,'Repair a broken interface','Build and link debugging',
 'A caller and implementation must agree on name, parameter types, and namespace. Including the same header in both translation units lets the compiler check the contract. An undefined reference is often a missing source file or a mismatched definition. CMakeLists.txt shows the equivalent local build.',
 'The header declares int rechargePort(int). Repair the mismatched implementation so it defines that exact function and adds 2. Read the build recipe and export the workspace to run cmake, build, and ctest locally.',
 {'port.hpp':'#ifndef PORT_HPP\n#define PORT_HPP\nint rechargePort(int energy);\n#endif\n','port.cpp':'#include "port.hpp"\nint rechargePorts(int energy) { return energy + 2; }\n','checks.cpp':io+'#include "port.hpp"\nint main(){std::cout << rechargePort(5) << "\\n" << rechargePort(0) << "\\n";}\n'},
 [['Normal energy','7'],['Zero energy','2']],hint('Compare the declared and defined names character by character.','The implementation has an extra s.','Keep the int parameter and int return type consistent.'),25);
project('linker-repair','score-project',10,'Project: save the score ledger','File-backed score tracker',
 'Separate storage from UI. A storage function should report whether saving succeeded and distinguish a missing file from a stored zero. Close output before loading. The test files exist only for one sandbox run; export this project for persistent local experiments.',
 'Implement saveScore(path,score): reject negative scores; write the score and report stream success. Implement loadScore(path): return optional<int> for exactly one nonnegative int, otherwise nullopt. Include ledger.hpp from ledger.cpp.',
 {'ledger.hpp':'#ifndef LEDGER_HPP\n#define LEDGER_HPP\n#include <optional>\n#include <string>\nbool saveScore(const std::string& path, int score);\nstd::optional<int> loadScore(const std::string& path);\n#endif\n',
 'ledger.cpp':'#include "ledger.hpp"\n#include <fstream>\nbool saveScore(const std::string& path, int score) { return false; }\nstd::optional<int> loadScore(const std::string& path) { return std::nullopt; }\n',
 'checks.cpp':io+'#include <fstream>\n#include "ledger.hpp"\nint main(){\n std::cout << saveScore("quest-score.txt",42) << "\\n";\n std::cout << loadScore("quest-score.txt").value_or(-1) << "\\n";\n std::cout << saveScore("quest-zero.txt",0) << "\\n";\n std::cout << loadScore("quest-zero.txt").value_or(-1) << "\\n";\n std::cout << saveScore("invalid.txt",-1) << "\\n";\n {std::ofstream out("broken.txt"); out << "7 junk";}\n std::cout << loadScore("broken.txt").has_value() << "\\n";\n std::cout << loadScore("never-created.txt").has_value() << "\\n";\n}\n'},
 [['Save normal','1'],['Load normal','42'],['Save zero','1'],['Load zero','0'],['Reject negative','0'],['Reject trailing junk','0'],['Missing file','0']],
 hint('Use ofstream for saving and ifstream for loading.','Validate extraction, sign, and trailing whitespace/end-of-file.','Return std::nullopt instead of inventing a valid score.'),50);
project('profile-transfer','architecture-project',13,'Project: separate policy from presentation','Architecture and regression tests',
 'Architecture starts with boundaries: input parsing, domain policy, and presentation should have distinct responsibilities. The rescue policy can be tested without a terminal. Keep its public interface in a header and preserve its invariant across multiple operations.',
 'Implement Shelter in shelter.cpp. Construction clamps initial supplies to zero. deliver(amount) adds only positive amounts. serve(people) rejects negative people or insufficient supplies without changing state; serving zero succeeds. supplies() const reports the reserve.',
 {'shelter.hpp':'#ifndef SHELTER_HPP\n#define SHELTER_HPP\nclass Shelter {\n    int supplies_;\npublic:\n    explicit Shelter(int initial);\n    void deliver(int amount);\n    bool serve(int people);\n    int supplies() const;\n};\n#endif\n',
 'shelter.cpp':'#include "shelter.hpp"\nShelter::Shelter(int initial) : supplies_(0) {}\nvoid Shelter::deliver(int amount) {}\nbool Shelter::serve(int people) { return false; }\nint Shelter::supplies() const { return 0; }\n',
 'checks.cpp':io+'#include "shelter.hpp"\nint main(){\n Shelter s(5); s.deliver(3);\n std::cout << s.supplies() << "\\n";\n std::cout << s.serve(6) << "\\n" << s.supplies() << "\\n";\n std::cout << s.serve(3) << "\\n" << s.supplies() << "\\n";\n s.deliver(-5); std::cout << s.supplies() << "\\n";\n std::cout << s.serve(0) << "\\n" << s.serve(-1) << "\\n";\n std::cout << Shelter(-4).supplies() << "\\n";\n}\n'},
 [['Delivery','8'],['Successful serving','1'],['Remaining reserve','2'],['Reject overspend','0'],['Rejected operation preserves state','2'],['Ignore negative delivery','2'],['Serve zero','1'],['Reject negative people','0'],['Initial invariant','0']],
 hint('Use the class declarations exactly as written.','Put policy checks before mutation.','Define members with Shelter:: and retain const on the observer.'),60);
project('prime','capstone-project',13,'Capstone: restore the rescue network','Cumulative multi-file project',
 'Build three independently testable layers: strict parsing, allocation policy, and a public recovery interface. Keep owning data at boundaries. The checks exercise each layer and their integration. After passing, export the project, add unfamiliar tests, profile workloads, and complete the design defense in PROJECTS.md.',
 'Implement parseNeeds(text) in parser.cpp: return an optional vector of nonnegative ints; reject any malformed token or negative value. Empty text is valid. Implement allocateNeeds(needs,budget) in allocation.cpp: sort a copy and serve the most complete needs possible, including zero-cost needs; inputs to this layer are valid and budget is nonnegative. Return Plan{served,remaining}. Implement restore(text,budget) in rescue.cpp: reject negative budgets or failed parsing as INVALID; otherwise combine the layers and return "served remaining".',
 {'parser.hpp':'#ifndef PARSER_HPP\n#define PARSER_HPP\n#include <optional>\n#include <vector>\n#include <string>\nstd::optional<std::vector<int>> parseNeeds(const std::string& text);\n#endif\n',
 'parser.cpp':'#include "parser.hpp"\n#include <sstream>\nstd::optional<std::vector<int>> parseNeeds(const std::string& text) {\n    return std::nullopt;\n}\n',
 'allocation.hpp':'#ifndef ALLOCATION_HPP\n#define ALLOCATION_HPP\n#include <vector>\nstruct Plan { int served; int remaining; };\nPlan allocateNeeds(std::vector<int> needs, int budget);\n#endif\n',
 'allocation.cpp':'#include "allocation.hpp"\n#include <algorithm>\nPlan allocateNeeds(std::vector<int> needs, int budget) {\n    return {0, budget};\n}\n',
 'rescue.hpp':'#ifndef RESCUE_HPP\n#define RESCUE_HPP\n#include <string>\nstd::string restore(const std::string& text, int budget);\n#endif\n',
 'rescue.cpp':'#include "rescue.hpp"\n#include "parser.hpp"\n#include "allocation.hpp"\nstd::string restore(const std::string& text, int budget) {\n    return "";\n}\n',
 'checks.cpp':io+'#include "rescue.hpp"\n#include "parser.hpp"\n#include "allocation.hpp"\nint main(){\n std::cout << parseNeeds("0 4").has_value() << "\\n";\n std::cout << parseNeeds("2bad").has_value() << "\\n";\n std::cout << parseNeeds("-1").has_value() << "\\n";\n std::cout << parseNeeds("").has_value() << "\\n";\n const auto plan=allocateNeeds({5,2,4},7);\n std::cout << plan.served << " " << plan.remaining << "\\n";\n std::cout << restore("5 2 4",7) << "\\n";\n std::cout << restore("0 0 3",0) << "\\n";\n std::cout << restore("",8) << "\\n";\n std::cout << restore("9",2) << "\\n";\n std::cout << restore("2 bad 1",9) << "\\n";\n std::cout << restore("2 -1",9) << "\\n";\n std::cout << restore("3",-1) << "\\n";\n std::cout << restore("3x",8) << "\\n";\n}\n'},
 [['Parse valid data','1'],['Reject malformed token','0'],['Reject negative need','0'],['Accept empty data','1'],['Independent allocation policy','2 1'],['Integrate parsing and allocation','2 1'],['Zero-cost needs','2 0'],['Empty network','0 8'],['No partial allocation','0 2'],['Malformed input','INVALID'],['Negative input','INVALID'],['Negative budget','INVALID'],['Trailing corruption','INVALID']],
 hint('Implement and test parsing before allocation, then wire both into restore.','Validate every token completely; allocate only after the entire record is valid.','Keep parsing, allocation, and output formatting in separate translation units.'),90);

export function expandCurriculum(legacy){
 const result=[];
 const append=lesson=>{result.push(lesson);for(const extra of additions.filter(x=>x.after===lesson.id))append(extra);};
 for(const lesson of legacy){for(const extra of additions.filter(x=>x.after==='^'+lesson.id))append(extra);append(lesson);}
 // File/project progression follows its region, even if added in a later source section.
 result.sort((a,b)=>a.region-b.region);
 return result.map((lesson,index)=>({...lesson,phase:lesson.phase||(/debug|diagnostic|scope|lifetime/.test(lesson.id)?'debug':'foundation'),minutes:lesson.minutes||10,
  prerequisites:index?[result[index-1].id]:[],review:lesson.phase==='transfer'||lesson.phase==='project',...{after:undefined}}));
}
