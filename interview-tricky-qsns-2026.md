# Tricky Interview Q&A — JavaScript · Node.js · MongoDB (2026)

> Edge cases, coercion traps, async surprises, and “gotcha” questions that separate strong candidates from average ones. Each item includes the **expected output**, a clear **why**, and a runnable example.

---

## Table of Contents

| # | Section | Questions |
|---|---------|-----------|
| **I** | [JavaScript — Coercion & Equality](#part-i--javascript--coercion--equality) | 1–15 |
| **II** | [JavaScript — References & Types](#part-ii--javascript--references--types) | 16–25 |
| **III** | [JavaScript — Scope, Closures & `this`](#part-iii--javascript--scope-closures--this) | 26–35 |
| **IV** | [JavaScript — Event Loop & Async](#part-iv--javascript--event-loop--async) | 36–45 |
| **V** | [JavaScript — Prototypes & Objects](#part-v--javascript--prototypes--objects) | 46–52 |
| **VI** | [Node.js Tricky Questions](#part-vi--nodejs-tricky-questions) | 53–60 |
| **VII** | [MongoDB Tricky Questions](#part-vii--mongodb-tricky-questions) | 61–68 |
| **VIII** | [Output Prediction Drills](#part-viii--output-prediction-drills) | 69–80 |
| **IX** | [Aug 2026 Release Traps](#aug-2026-release-traps-8183) | 81–83 |
| **X** | [Gap-Fill & ES2026 Tricky (Aug 2026)](#part-x--gap-fill--es2026-tricky-aug-2026) | 84–95 |

---

# Part I — JavaScript — Coercion & Equality

### 1. What is the output of `[] === []`?

**Output:** `false`

**Answer:** `===` compares **reference identity** for objects. Each `[]` literal creates a new array in memory. Same contents, different objects.

**Example:**
```javascript
[] === []           // false
[] == []            // false
const a = [], b = [];
a === b             // false
a === a             // true
```

---

### 2. What is the output of `[] == ![]`?

**Output:** `true`

**Answer:** Coercion chain: `![]` → `false` (array is truthy, negated). Then `[] == false` → `[]` coerces to `""` → `0`, `false` coerces to `0`. So `0 == 0` → `true`.

**Example:**
```javascript
[] == ![]           // true
[] == false         // true
Number([])          // 0
![]                 // false
```

---

### 3. What is the output of `null == undefined` vs `null === undefined`?

**Output:** `true` then `false`

**Answer:** `==` treats `null` and `undefined` as equal (special case in spec). `===` requires same type — `null` is object-like sentinel, `undefined` is undefined type.

**Example:**
```javascript
null == undefined   // true
null === undefined  // false
null == 0           // false (null only == undefined)
undefined == 0      // false
```

---

### 4. What is the output of `typeof null`?

**Output:** `"object"`

**Answer:** Historical bug from the first JS implementation (null was stored as NULL pointer tag `0x00`, same as objects). Never fixed — breaking the web. Use `value === null` or `Object.prototype.toString.call(null)` → `"[object Null]"`.

**Example:**
```javascript
typeof null         // "object"
typeof undefined    // "undefined"
Object.prototype.toString.call(null) // "[object Null]"
```

---

### 5. What is the output of `'5' + 3` vs `'5' - 3`?

**Output:** `"53"` then `2`

**Answer:** `+` with a string triggers **string concatenation** if either operand is a string. `-` only works on numbers, so both operands are coerced to numbers.

**Example:**
```javascript
'5' + 3             // "53"
'5' - 3             // 2
'5' + null          // "5null"
'5' - null          // 5
```

---

### 6. What is the output of `0.1 + 0.2 === 0.3`?

**Output:** `false`

**Answer:** IEEE 754 floating-point cannot represent `0.1` and `0.2` exactly. Sum is `0.30000000000000004`. Use epsilon comparison or decimal libraries for money.

**Example:**
```javascript
0.1 + 0.2           // 0.30000000000000004
0.1 + 0.2 === 0.3   // false
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON // true
```

---

### 7. What is the output of `[] + []` and `[] + {}` and `{} + []`?

**Output:** `""`, `"[object Object]"`, depends on context

**Answer:** `[] + []` → both arrays toString to `""` → `"" + ""` = `""`. `[] + {}` → `"" + "[object Object]"`. **`{} + []` at statement start:** `{}` parsed as empty block, `+[]` is unary plus → `0`. In expression context like `({} + [])` → `"[object Object]"`.

**Example:**
```javascript
[] + []             // ""
[] + {}             // "[object Object]"
({} + [])           // "[object Object]"
+[]                 // 0
```

---

### 8. What is the output of `true + true`?

**Output:** `2`

**Answer:** `+` is numeric when both sides are primitives without strings. Booleans coerce: `true` → `1`.

**Example:**
```javascript
true + true         // 2
true + false        // 1
false + false       // 0
'true' + true       // "truetrue"
```

---

### 9. What is the output of `[1, 2, 3] + [4, 5, 6]`?

**Output:** `"1,2,34,5,6"`

**Answer:** Arrays are converted to strings via `toString()` (comma-joined elements), then concatenated. **Not** array merging.

**Example:**
```javascript
[1, 2, 3] + [4, 5, 6]  // "1,2,34,5,6"
[...([1,2,3]), ...([4,5,6])] // [1, 2, 3, 4, 5, 6]
```

---

### 10. What is the output of `'b' + 'a' + + 'a' + 'a'`?

**Output:** `"baNaNa"`

**Answer:** `+ 'a'` is unary plus on string `'a'` → `NaN`. String concatenation throughout: `'b'+'a'` → `"ba"`, `+"a"` → `NaN` → `"NaN"`, final `'a'`.

**Example:**
```javascript
'b' + 'a' + + 'a' + 'a'  // "baNaNa"
+'a'                      // NaN
+'42'                     // 42
```

---

### 11. What is the output of `NaN === NaN`?

**Output:** `false`

**Answer:** IEEE 754 spec: NaN is not equal to anything, including itself. Use `Number.isNaN(value)` (no coercion) vs legacy `isNaN()` which coerces first.

**Example:**
```javascript
NaN === NaN         // false
Number.isNaN(NaN)   // true
isNaN('hello')      // true (coerces to NaN)
Number.isNaN('hello') // false
```

---

### 12. What is the output of `[] == 0`, `'' == 0`, `false == 0`?

**Output:** all `true`

**Answer:** Abstract equality coerces to numbers: `[]` → `""` → `0`, `''` → `0`, `false` → `0`.

**Example:**
```javascript
[] == 0             // true
'' == 0             // true
false == 0          // true
[] === 0            // false
```

---

### 13. What is the output of `'11' < '2'`?

**Output:** `true`

**Answer:** Both are strings → **lexicographic** comparison. `'1' < '2'` at first char, so `'11' < '2'` is true. Not numeric comparison.

**Example:**
```javascript
'11' < '2'          // true
11 < 2              // false
'11' < 2            // false ('11' coerced to 11)
```

---

### 14. What is the output of `2 > 1 > 3`?

**Output:** `false`

**Answer:** Evaluated left-to-right: `(2 > 1)` → `true`, then `true > 3` → `1 > 3` → `false`.

**Example:**
```javascript
2 > 1 > 3           // false
2 < 1 < 3           // true  (true < 3 → 1 < 3)
```

---

### 15. What is the output of `!!"false"` vs `!!"0"`?

**Output:** both `true`

**Answer:** Non-empty strings are **truthy**, regardless of content. Only `""` is falsy among strings.

**Example:**
```javascript
!!"false"           // true
!!"0"               // true
!!""                // false
!!0                 // false
```

---

# Part II — JavaScript — References & Types

### 16. What is the output of `{ a: 1 } === { a: 1 }`?

**Output:** `false`

**Answer:** Same as arrays — object literals create new references every time.

**Example:**
```javascript
const x = { a: 1 };
const y = { a: 1 };
x === y             // false
x === x             // true
```

---

### 17. What happens with `const obj = {}; obj.prop = 1`?

**Output:** Works — `obj` is `{ prop: 1 }`

**Answer:** `const` prevents **rebinding** the variable, not mutating the object. `obj = {}` would throw.

**Example:**
```javascript
const obj = {};
obj.prop = 1;       // OK
// obj = {};        // TypeError
```

---

### 18. What is the output after mutating an array passed to a function?

**Output:** Original array reflects changes (pass-by-sharing)

**Answer:** JS passes object references by value — the reference is copied, both point to same array.

**Example:**
```javascript
function addItem(arr) { arr.push(99); }
const nums = [1, 2];
addItem(nums);
console.log(nums);  // [1, 2, 99]
```

---

### 19. What is the output of `typeof (() => {})` vs `typeof class {}`?

**Output:** `"function"` for both

**Answer:** Classes are syntactic sugar over constructor functions. `typeof` returns `"function"` for both. `instanceof` and `Object.prototype.toString` differ for built-ins.

**Example:**
```javascript
typeof (() => {})   // "function"
typeof class Foo {} // "function"
typeof null         // "object" (not a function)
```

---

### 20. What is the output of `Array.isArray([])` vs `[] instanceof Array`?

**Output:** both `true` — but `Array.isArray` is safer cross-realm

**Answer:** `instanceof` checks prototype chain and breaks across iframes/realms. `Array.isArray` uses internal `[[Class]]` tag.

**Example:**
```javascript
Array.isArray([])           // true
[] instanceof Array         // true
Array.isArray({ length: 0 }) // false
```

---

### 21. What is the output of `1..toString()`?

**Output:** `"1"`

**Answer:** Parser sees `1.` as float literal, second `.` as member access → `(1.).toString()`. Without first dot: `1.toString()` is syntax error (looks like invalid decimal).

**Example:**
```javascript
1..toString()       // "1"
(1).toString()      // "1"
1.0.toString()      // syntax error in strict parsing
```

---

### 22. What is the output of `parseInt('08')` vs `parseInt('08', 10)`?

**Output:** `8` and `8` (modern engines); historically octal trap

**Answer:** ES5 removed automatic octal for `parseInt` without radix. **Always pass radix 10** in interviews and production.

**Example:**
```javascript
parseInt('08')      // 8 (modern)
parseInt('08', 10)  // 8
parseInt('0x10')    // 16
parseInt('010', 8)  // 8
```

---

### 23. What is the output of `Math.max()` and `Math.min()`?

**Output:** `-Infinity` and `Infinity`

**Answer:** Empty spread/max/min with no args returns identity elements for the reduction.

**Example:**
```javascript
Math.max()          // -Infinity
Math.min()          // Infinity
Math.max(...[])     // -Infinity
Math.max(1, 2, 3)   // 3
```

---

### 24. What is the output of `[...'hello']`?

**Output:** `['h', 'e', 'l', 'l', 'o']`

**Answer:** Strings are iterable — spread splits by Unicode code units (surrogate pairs can split incorrectly; use `Array.from` or `[...str]` with awareness for emoji).

**Example:**
```javascript
[...'hello']        // ['h','e','l','l','o']
[...'👋']           // ['\uD83D', '\uDC4B'] — surrogate pair split
[...'👋'].length    // 2 (not 1)
```

---

### 25. What is the output of `Object.is(NaN, NaN)` vs `NaN === NaN`?

**Output:** `true` then `false`

**Answer:** `Object.is` implements SameValue equality: `NaN` equals `NaN`, and `+0 !== -0`.

**Example:**
```javascript
Object.is(NaN, NaN) // true
NaN === NaN         // false
Object.is(+0, -0)   // false
+0 === -0           // true
```

---

# Part III — JavaScript — Scope, Closures & `this`

### 26. What is the output of a `var` loop with `setTimeout`?

**Output:** `3, 3, 3` (not 0, 1, 2)

**Answer:** Single shared `i` hoisted to function scope; callbacks run after loop ends at `3`.

**Example:**
```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 3, 3, 3

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0);
}
// 0, 1, 2
```

---

### 27. What is the output of `console.log(a); var a = 1`?

**Output:** `undefined` (not ReferenceError)

**Answer:** `var` is hoisted and initialized to `undefined`. Assignment happens at the line.

**Example:**
```javascript
console.log(a);     // undefined
var a = 1;
console.log(a);     // 1

// let b; console.log(b); // ReferenceError (TDZ)
```

---

### 28. What is the output of nested function accessing outer `let`?

**Output:** Closure retains live binding — if outer changes, inner sees update

**Answer:** Closures capture **bindings**, not snapshot values (for `let`/`const`).

**Example:**
```javascript
function outer() {
  let count = 0;
  return {
    inc() { count++; return count; },
    get() { return count; }
  };
}
const c = outer();
c.inc(); c.inc();   // 1, 2
c.get();            // 2
```

---

### 29. What is `this` in an arrow function vs regular function?

**Output:** Arrow inherits lexical `this`; regular gets call-site `this`

**Answer:** Arrow functions have no own `this`, `arguments`, `super`, or `new.target`. Cannot be constructors.

**Example:**
```javascript
const obj = {
  name: 'App',
  regular() { return this.name; },
  arrow: () => this?.name
};
obj.regular();      // 'App'
obj.arrow();        // undefined (window/global this)
```

---

### 30. What is the output of `obj.method()` when method is extracted?

**Output:** Lost `this` — `undefined` in strict mode, global in sloppy

**Example:**
```javascript
'use strict';
const user = {
  name: 'Ada',
  greet() { return this.name; }
};
const fn = user.greet;
fn();               // TypeError (this is undefined)
fn.call(user);      // 'Ada'
```

---

### 31. What is the output of `(function(){ return typeof arguments; })()`?

**Output:** `"object"` (array-like, not real array)

**Answer:** `arguments` is object-like with `length` and indexed props. No array methods unless converted.

**Example:**
```javascript
(function() {
  console.log(typeof arguments);     // "object"
  console.log(arguments.map);        // undefined
  console.log([...arguments]);       // real array
})(1, 2);
```

---

### 32. What is the output of IIFE with duplicate function name?

**Output:** Inner function shadows outer in its scope; hoisting applies within function

**Example:**
```javascript
(function() {
  console.log(typeof foo); // "function" (inner hoisted)
  function foo() { return 1; }
  function foo() { return 2; }
  console.log(foo());      // 2
})();
```

---

### 33. What is the output of `for (const x of { a: 1, b: 2 })`?

**Output:** `TypeError: object is not iterable`

**Answer:** Plain objects are not iterable by default. Use `Object.keys/values/entries` or define `[Symbol.iterator]`.

**Example:**
```javascript
for (const v of Object.values({ a: 1 })) console.log(v); // 1
for (const k of Object.keys({ a: 1 })) console.log(k);   // 'a'
```

---

### 34. What is the output of optional chaining on null?

**Output:** `undefined` — no throw

**Example:**
```javascript
null?.foo           // undefined
null?.foo?.bar      // undefined
(undefined ?? 'x')  // 'x'
null ?? 'x'         // 'x'
null || 'x'         // 'x'
0 ?? 'x'            // 0  (?? only nullish)
0 || 'x'            // 'x'
```

---

### 35. What is the output of `try/catch/finally` when `finally` returns?

**Output:** `finally` return **overrides** try/catch return

**Example:**
```javascript
function test() {
  try { return 1; }
  catch { return 2; }
  finally { return 3; }
}
test();             // 3
```

---

# Part IV — JavaScript — Event Loop & Async

### 36. What is the log order: sync, Promise, setTimeout?

**Output:** `sync` → `promise` → `timeout`

**Answer:** Microtasks (Promises, queueMicrotask) run after current sync stack, **before** next macrotask (setTimeout, I/O).

**Example:**
```javascript
console.log('sync');
Promise.resolve().then(() => console.log('promise'));
setTimeout(() => console.log('timeout'), 0);
// sync, promise, timeout
```

---

### 37. What is the log order with nested microtasks?

**Output:** `1` → `2` → `4` → `3`

**Answer:** Both outer `.then` callbacks are queued first. The first runs (`2`), which queues the inner `3`. The second outer callback runs (`4`) before `3` because it was already in the queue ahead of the newly queued inner task.

**Example:**
```javascript
console.log('1');
Promise.resolve().then(() => {
  console.log('2');
  Promise.resolve().then(() => console.log('3'));
});
Promise.resolve().then(() => console.log('4'));
// 1, 2, 4, 3
```

---

### 38. What is the output of `async function` that returns non-Promise?

**Output:** Value wrapped in resolved Promise

**Example:**
```javascript
async function getId() { return 42; }
getId().then(console.log); // 42
async function fail() { throw new Error('x'); }
fail().catch(e => console.log(e.message)); // 'x'
```

---

### 39. What is the output of `await 0` vs `await Promise.resolve(0)`?

**Output:** Both pause and resume; `await` wraps non-thenables in resolved Promise

**Answer:** `await` always yields to microtask queue even for sync values.

**Example:**
```javascript
async function demo() {
  console.log('A');
  await 0;
  console.log('B');
}
demo();
console.log('C');
// A, C, B
```

---

### 40. What is the output of `Promise.resolve(1).then(v => v + 1).then(console.log)`?

**Output:** `2`

**Answer:** `.then` return value is chained; non-thenable return becomes fulfilled Promise.

---

### 41. What happens with `await Promise.all([reject])`?

**Output:** Async function throws — use try/catch

**Example:**
```javascript
async function load() {
  try {
    await Promise.all([Promise.reject('fail')]);
  } catch (e) {
    console.log(e); // 'fail'
  }
}
```

---

### 42. What is the log order: setTimeout 0 vs setImmediate (Node)?

**Output:** Depends on context — **inside I/O callback**, `setImmediate` runs before `setTimeout`. At top level, order varies by Node version/event loop phase.

**Example (Node, inside fs callback):**
```javascript
const fs = require('fs');
fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
});
// immediate, timeout (typical)
```

---

### 43. What is the output of `process.nextTick` vs Promise?

**Output:** `nextTick` runs **before** Promise microtasks in Node

**Example:**
```javascript
Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));
// nextTick, promise
```

---

### 44. What is the output of an infinite `then` chain?

**Output:** Can starve macrotasks / freeze UI — microtask queue never empties

**Answer:** Recursive `queueMicrotask` or `Promise.resolve().then(loop)` blocks I/O and rendering until stack/recursion limits.

---

### 45. What is the output of `fetch` error on 404?

**Output:** **Resolves** — `fetch` only rejects on network failure, not HTTP error status

**Example:**
```javascript
const res = await fetch('/missing');
console.log(res.ok);        // false
console.log(res.status);    // 404
// Must check res.ok manually
```

---

# Part V — JavaScript — Prototypes & Objects

### 46. What is the output of `({}).constructor === Object`?

**Output:** `true`

**Answer:** Plain objects inherit from `Object.prototype`; `.constructor` points to `Object` (with caveats if prototype was mutated).

---

### 47. What is the output of `'toString' in {}` vs `{}.hasOwnProperty('toString')`?

**Output:** `true` then `false`

**Answer:** `in` checks prototype chain. `hasOwnProperty` checks own properties only.

**Example:**
```javascript
'toString' in {}                    // true
({}).hasOwnProperty('toString')     // false
Object.hasOwn({}, 'toString')       // false (ES2022)
```

---

### 48. What is the output of `Object.keys({ a: 1, b: undefined })`?

**Output:** `['a', 'b']` — keys with `undefined` values still appear

**Example:**
```javascript
Object.keys({ a: 1, b: undefined })  // ['a', 'b']
JSON.stringify({ a: 1, b: undefined }) // '{"a":1}' — undefined values omitted
```

---

### 49. What is the output of spreading `null` or `undefined` in object?

**Output:** `TypeError` in object spread — `{ ...null }` is `{}` (no throw); `{ ...undefined }` is `{}`

**Answer:** Null/undefined are ignored in object spread (ES2018). Arrays cannot spread null.

**Example:**
```javascript
{ ...null }         // {}
{ ...undefined }    // {}
[...null]           // TypeError
```

---

### 50. What is the output of `delete obj.prop` on inherited property?

**Output:** `true` but property still accessible via prototype

**Example:**
```javascript
const child = Object.create({ inherited: 1 });
child.inherited = 2;
delete child.inherited;  // deletes own shadow
console.log(child.inherited); // 1 (from prototype)
```

---

### 51. What is the output of `class extends` without `super()` in constructor?

**Output:** `ReferenceError` — must call `super()` before using `this`

---

### 52. What is the output of `instanceof` with null prototype?

**Output:** `false` for expected constructor if chain broken

**Example:**
```javascript
const obj = Object.create(null);
obj instanceof Object  // false
```

---

# Part VI — Node.js Tricky Questions

### 53. What is the output of `require.cache` after first require?

**Answer:** Module is **cached** — second `require` returns same `exports` object. Delete from `require.cache` to reload (rare, dev only).

**Example:**
```javascript
// mod.js: module.exports = { n: 1 };
const a = require('./mod');
const b = require('./mod');
console.log(a === b); // true
a.n = 99;
console.log(b.n);     // 99
```

---

### 54. What happens if you `module.exports = { a: 1 }` then `exports.b = 2`?

**Output:** `b` is **not** on exported object

**Answer:** `exports` is alias to `module.exports` until reassigned. Reassignment breaks the link.

**Example:**
```javascript
module.exports = { a: 1 };
exports.b = 2;        // lost — exports no longer points to what you export
// Fix: module.exports.b = 2;
```

---

### 55. What is the output of `__dirname` in ES modules?

**Output:** **Not defined** — use `import.meta.url` with `fileURLToPath`

**Example:**
```javascript
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
```

---

### 56. What is the default behavior of `JSON.parse` on large integers?

**Output:** Precision loss for integers > `Number.MAX_SAFE_INTEGER`

**Answer:** JSON numbers parse as JS Number. Use `json-bigint` or keep IDs as strings.

**Example:**
```javascript
JSON.parse('{"id":9007199254740993}')
// id may be 9007199254740992
```

---

### 57. What is the output of `fs.readFile` without encoding?

**Output:** `Buffer` object, not string

**Example:**
```javascript
const fs = require('fs');
fs.readFile('file.txt', (err, data) => {
  console.log(Buffer.isBuffer(data)); // true
});
```

---

### 58. What happens when uncaught exception in async callback?

**Output:** Process may **crash** (Node default) unless `unhandledRejection` / domain handled

**Example:**
```javascript
Promise.reject('oops'); // unhandledRejection warning
// set unhandledRejection handler in production
```

---

### 59. What is `0.1 + 0.2` in Node vs browser?

**Output:** Same IEEE 754 — `0.30000000000000004` everywhere

---

### 60. What is the output of `cluster` worker sharing port?

**Answer:** All workers can `listen` on same port — master coordinates via SO_REUSEPORT / round-robin (OS-dependent). Tricky interview topic for scaling HTTP.

---

# Part VII — MongoDB Tricky Questions

### 61. What does `{ age: { $ne: 30 } }` return for missing `age`?

**Output:** **Includes** documents where `age` field is missing

**Answer:** `$ne` matches field not equal to 30 **or** field absent. Use `$exists: true` combined if you need only present fields.

**Example:**
```javascript
db.users.find({ age: { $ne: 30 } })
// matches { name: 'x' } with no age field
```

---

### 62. What is the difference between `null` and missing field in queries?

**Output:** `{ field: null }` matches **both** null and missing (legacy). `{ field: { $eq: null } }` same. Use `{ field: { $exists: true, $eq: null } }` for explicit null only.

---

### 63. What is the output order without sort on `_id`?

**Answer:** Natural order ≈ insertion order on single-node standalone, but **not guaranteed** in sharded/replicated/production — always explicit `sort`.

---

### 64. What happens with `$where: 'this.a == this.b'`?

**Output:** Works but **slow** — full collection scan, JS eval. Avoid in production; use aggregation `$expr`.

---

### 65. What is the trap with `$regex` without anchor?

**Output:** Cannot use index efficiently — `'^prefix'` can use index; substring regex often cannot.

**Example:**
```javascript
{ name: { $regex: /^Ada/ } }   // index-friendly
{ name: { $regex: /da/i } }    // often COLLSCAN
```

---

### 66. What is the output of `$inc` on missing field?

**Output:** Field created with increment value — `{ $inc: { views: 1 } }` on `{}` → `{ views: 1 }`

---

### 67. What is the difference between `$push` and `$addToSet`?

**Output:** `$addToSet` deduplicates (no order guarantee for sort). `$push` allows duplicates. `$addToSet` with `$each` still dedupes.

---

### 68. What is the read concern trap with `{ readConcern: 'majority' }`?

**Answer:** You may not read your **own write** if write not yet replicated to majority — feels like “data loss” in apps. Tune write concern + read concern together.

---

# Part VIII — Output Prediction Drills

Quick-fire — cover the answer, guess, then check.

| # | Code | Output |
|---|------|--------|
| 69 | `typeof NaN` | `"number"` |
| 70 | `3 > 2 > 1` | `false` |
| 71 | `[...new Set([1,1,2])]` | `[1, 2]` |
| 72 | `Boolean([])` | `true` |
| 73 | `Boolean('')` | `false` |
| 74 | `'foo' + + 'bar'` | `"fooNaN"` |
| 75 | `[]?.length?.toString()` | `"0"` |
| 76 | `({ length: 0 }).length + 1` | `1` (not `"01"`) |
| 77 | `String(null)` | `"null"` |
| 78 | `Number('')` | `0` |
| 79 | `setInterval(() => {}, 0)` fire rate | Clamped (~1ms min in browsers; Node similar) |
| 80 | `JSON.parse('{}').__proto__` | `{}` — modern engines ignore `__proto__` key in JSON.parse |

---

## Bonus: 5 “Senior Trap” Questions

### A. Explain why `map(parseInt)` on `[1,2,3]` gives `[1, NaN, NaN]`

**Answer:** `map` passes `(element, index)`. `parseInt('2', 1)` → NaN (invalid radix). `parseInt('3', 2)` → NaN.

```javascript
['1','2','3'].map(parseInt)           // [1, NaN, NaN]
['1','2','3'].map((v) => parseInt(v, 10)) // [1, 2, 3]
```

### B. Why does `if ([])` run the block?

**Answer:** Empty array is truthy — only falsy: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`.

### C. Why is `sort()` on `[10, 2, 1]` wrong by default?

**Answer:** Default sort converts to strings: `[1, 10, 2]`. Use `(a,b) => a - b`.

### D. Why can two objects with same shape have different hidden class (V8)?

**Answer:** Property addition **order** matters for inline caches. Interview signal for performance-aware JS.

### E. Why does MongoDB `$lookup` return empty array vs missing?

**Answer:** `$lookup` always adds array field (possibly `[]`). Missing vs empty matters for `$unwind` and `$size` filters.

---

## Aug 2026 Release Traps (81–83)

### 81. What is `Math.sumPrecise([0.1, 0.2, 0.3])` vs reduce sum?

**Answer:** `Math.sumPrecise` (ES2026) uses compensated summation → **0.6** (stable). Naive `reduce((a,b)=>a+b,0)` can yield **0.5999999999999999** due to IEEE-754 accumulation.

```javascript
Math.sumPrecise([0.1, 0.2, 0.3]);                    // 0.6
[0.1, 0.2, 0.3].reduce((a, b) => a + b, 0);          // 0.5999999999999999
```

### 82. `foreignErr instanceof Error` in vm context — true or false?

**Answer:** **false** — different realm/global. **`Error.isError(foreignErr)`** (ES2026) → **true**. Classic micro-frontend / worker error-handling trap.

```javascript
import vm from 'node:vm';
const ctx = vm.createContext({});
const e = vm.runInContext('new Error("x")', ctx);
e instanceof Error;  // false
Error.isError(e);    // true
```

### 83. `map.getOrInsert('k', expensive())` — is `expensive()` skipped if key exists?

**Answer:** **No** — JavaScript evaluates arguments **before** the call. `getOrInsert` only *uses* the value if the key is missing, but `expensive()` already ran. For lazy computation use **`getOrInsertComputed(k, () => expensive())`** — callback runs only when the key is absent.

```javascript
let calls = 0;
const expensive = () => { calls++; return 99; };
const m = new Map([['k', 1]]);

m.getOrInsert('k', expensive());           // returns 1, but calls === 1 (expensive ran!)
m.getOrInsertComputed('k', () => expensive()); // returns 1, calls still 1
m.getOrInsertComputed('x', () => expensive()); // inserts 99, calls === 2
```

---

# Part X — Gap-Fill & ES2026 Tricky (Aug 2026)

> Traps aligned with `interview-prep-2026.md` Part V (Q361–380) and Part VI (Q381–400).

### 84. What happens with `new WeakSet().add(1)`?

**Output:** **`TypeError`** — WeakSet values must be **objects** (not primitives).

**Answer:** Same for `WeakMap.set(1, 'x')`. Only `Set` / `Map` accept primitives.

```javascript
const ws = new WeakSet();
ws.add({});     // OK
ws.add(1);      // TypeError: Invalid value used in weak set
```

---

### 85. What is `[...new WeakSet([obj])].length`?

**Output:** **TypeError** — WeakSet is **not iterable** (no `Symbol.iterator`).

**Answer:** WeakSet has no `.size`, no `.forEach`, no spread — only `.add`, `.has`, `.delete`.

```javascript
const obj = {};
const ws = new WeakSet([obj]);
ws.size;           // undefined — no size property
[...ws];           // TypeError: ws is not iterable
```

---

### 86. After `obj = null`, is `weakMap.get(oldRef)` still reachable?

**Output:** **No** — once the object is GC'd, WeakMap entry disappears (no strong ref).

**Answer:** Unlike `Map`, WeakMap does not keep keys alive. Timing of GC is not deterministic in demos — interview answer is about **eligibility** for collection, not instant deletion.

```javascript
let obj = { id: 1 };
const wm = new WeakMap();
wm.set(obj, 'secret');
obj = null;
// wm had key { id: 1 } — when GC runs, entry is removed; wm.has(that object) impossible to test after nulling ref
```

---

### 87. What does `Promise.any([Promise.reject('a'), Promise.reject('b')])` reject with?

**Output:** **`AggregateError`** with `.errors === ['a', 'b']`

**Answer:** `Promise.any` rejects only when **all** promises reject. Contrast `Promise.race` — first settle wins (fulfill **or** reject).

```javascript
Promise.any([Promise.reject('a'), Promise.reject('b')])
  .catch(e => {
    console.log(e instanceof AggregateError); // true
    console.log(e.errors); // ['a', 'b']
  });

Promise.race([Promise.reject('a'), Promise.resolve('b')])
  .catch(e => console.log(e)); // 'a' — first rejection wins
```

---

### 88. What happens with `structuredClone({ fn: () => {} })`?

**Output:** **`DataCloneError`** (or DOMException) — functions are **not cloneable**.

**Answer:** `structuredClone` clones structured data (Date, Map, Set, ArrayBuffer, cycles) but rejects functions, symbols (in some cases), and DOM nodes. JSON round-trip also drops functions silently.

```javascript
structuredClone({ a: 1, d: new Date() });     // OK
structuredClone({ fn: () => 1 });               // throws
JSON.parse(JSON.stringify({ fn: () => 1 }));  // { } — fn dropped silently
```

---

### 89. Prototype pollution — what is `({}).isAdmin` after bad merge?

**Output:** **`true`** if attacker merged `{ "__proto__": { "isAdmin": true } }` into target via vulnerable deep merge.

**Answer:** Polluted `Object.prototype` affects **all** plain objects. Modern `JSON.parse` ignores `__proto__` key (drill #80), but **application-level merge** of user JSON is still dangerous. Fix: schema whitelist, block `__proto__`/`constructor`/`prototype` keys.

```javascript
function badMerge(target, source) {
  for (const k of Object.keys(source)) {
    if (source[k] && typeof source[k] === 'object') {
      target[k] = badMerge(target[k] || {}, source[k]);
    } else target[k] = source[k];
  }
  return target;
}
const user = {};
badMerge(user, JSON.parse('{"__proto__":{"isAdmin":true}}'));
console.log({}.isAdmin); // true — security bug
```

---

### 90. `[3, 1, 2].toSorted()` vs `.sort()` — what is `arr` after each?

**Output:** **`toSorted`** returns new array, **original unchanged**. **`sort`** mutates in place.

**Answer:** ES2023 `toSorted` / `toReversed` / `toSpliced` are immutability-safe — common React/state trap with `.sort()`.

```javascript
const a = [3, 1, 2];
const b = a.toSorted((x, y) => x - y);
console.log(a); // [3, 1, 2] — unchanged
console.log(b); // [1, 2, 3]

const c = [3, 1, 2];
c.sort((x, y) => x - y);
console.log(c); // [1, 2, 3] — mutated
```

---

### 91. What keys does `Object.groupBy([{ s: null }, { s: undefined }], x => x.s)` produce?

**Output:** **`{ "null": [...], "undefined": [...] }`** — keys are **strings** (property names).

**Answer:** `Object.groupBy` stringifies keys; `null` → `"null"`, `undefined` → `"undefined"`. Use `Map.groupBy` if you need non-string keys.

```javascript
Object.groupBy([{ s: null }, { s: undefined }], (x) => x.s);
// { null: [{ s: null }], undefined: [{ s: undefined }] }
```

---

### 92. MongoDB — `{ $set: { 'items.$[elem].done': true } }` with no matching `arrayFilters`?

**Output:** **No documents modified** — update silently matches 0 array elements (no error).

**Answer:** Always verify `modifiedCount`. `arrayFilters` must match at least one array element per doc.

```javascript
await Order.updateOne(
  { _id: orderId },
  { $set: { 'items.$[elem].done': true } },
  { arrayFilters: [{ 'elem.sku': 'NONEXISTENT' }] }
);
// matchedCount: 1, modifiedCount: 0 — trap for "why didn't it update?"
```

---

### 93. MongoDB — `'items.$'` updates which array element?

**Output:** **First** element matching the **query filter** on the array field — not all matches.

**Answer:** For multiple matching items use **`items.$[]`** (all) or **`arrayFilters`** (conditional). Classic partial-shipment bug.

```javascript
// Only first item with sku SKU-1 gets status (positional $)
await Order.updateOne(
  { _id: id, 'items.sku': 'SKU-1' },
  { $set: { 'items.$.status': 'shipped' } }
);
// If two line items have SKU-1, only first is updated
```

---

### 94. User search `"C++"` — why does `{ $regex: userInput }` fail?

**Output:** **`Invalid regular expression`** or wrong matches — `+` is a regex quantifier.

**Answer:** Always escape user input: **`RegExp.escape(userInput)`** (ES2026 / Node 24) or validation whitelist. Also ReDoS risk with nested quantifiers.

```javascript
const userInput = 'C++ (sale)';
new RegExp(userInput);              // SyntaxError or wrong pattern
new RegExp(RegExp.escape(userInput)); // safe literal match
```

---

### 95. `JSON.parse('{"id":9007199254740993}').id === 9007199254740993`?

**Output:** **`false`** — JSON numbers become IEEE doubles; large int **loses precision**.

**Answer:** ES2026 reviver **`context.source`** or store IDs as strings. Same trap as tricky Q56.

```javascript
JSON.parse('{"id":9007199254740993}').id; // 9007199254740992 — off by 1
// Fix: reviver with context.source (ES2026) or quote id in JSON as string
```

---

## Study Tips

1. **Run every example** in Node REPL or browser console — muscle memory beats memorization.
2. **Prefer `===`** and explicit conversion — trick questions exploit `==`.
3. For async, draw the **microtask vs macrotask** queue on paper.
4. For MongoDB, always ask: **“Does this match missing fields?”**
5. When comparing arrays/objects in real code, never use `==`/`===` — use deep equality or serialization with known limits.
6. **Part X (84–95):** WeakMap/WeakSet, Promise.any, MongoDB `$` vs `$[]`, RegExp.escape — tie to main guide Q361–400.

---

*Last updated: August 28, 2026 · Companion to `interview-prep-2026.md` (400 Q) · 95 tricky questions*
