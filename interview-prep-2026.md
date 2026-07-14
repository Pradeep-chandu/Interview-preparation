# JavaScript · Node.js · MongoDB — 360 Interview Q&A (2026 Complete Guide)

> Each question includes an elaborated answer and a practical code example. Structured by topic and difficulty.

---

## Table of Contents

| Part | Section | Questions |
|------|---------|-----------|
| **I** | [Core Fundamentals](#part-i--core-fundamentals) | |
| | JavaScript | 1–79 |
| | Node.js | 80–157 |
| | MongoDB | 158–225 |
| **II** | [Senior — System Design & Architecture](#part-ii--senior--system-design--architecture) | |
| | System Design & Scalability | 226–240 |
| | TypeScript for Node.js | 241–250 |
| | Testing & Quality | 251–257 |
| | PostgreSQL & Polyglot Data | 258–263 |
| | DevOps, Cloud & Observability | 264–271 |
| | Architecture & Production Patterns | 272–279 |
| | AI Integration | 280–293 |
| | Behavioral & Leadership | 294–300 |
| | DSA & Coding Round Prep | 301–305 |
| **III** | [Specialized Stacks](#part-iii--specialized-stacks) | |
| | GraphQL | 306–310 |
| | Redis Deep Dive | 311–315 |
| | React Essentials | 316–320 |
| | LeetCode Patterns | 321–325 |
| **IV** | [Extended Topics — 2026 Complete](#part-iv--extended-topics--2026-complete) | |
| | Modern JavaScript ES2023–2025 | 326–334 |
| | Message Queues & Async Jobs | 335–340 |
| | ORMs & Data Access | 341–348 |
| | Kubernetes Hands-On | 349–354 |
| | Cloud & CI/CD | 355–360 |
| **Appendix** | [Study Guide & Learning Plans](#appendix--study-guide--learning-plans) | |

---

# Part I — Core Fundamentals

## JavaScript (1–79)

### 1. What is JavaScript?

**Answer:** JavaScript is a high-level, interpreted programming language that powers interactive web pages and server-side applications via Node.js. It is single-threaded and event-driven, supporting functional, object-oriented, and prototype-based programming. In 2026 interviews, emphasize its ubiquity across browsers, servers, and tooling ecosystems.

**Example:**
```javascript
// E-commerce product card — runs in browser or Node 18+
const product = { id: 'p1', name: 'Wireless Headphones', price: 79.99 };
const formatPrice = (p) => `$${p.price.toFixed(2)}`;
console.log(`${product.name}: ${formatPrice(product)}`);
```

---
### 2. Difference between var, let, and const?

**Answer:** `var` is function-scoped and hoisted with an initial value of `undefined`. `let` and `const` are block-scoped and live in the temporal dead zone until their declaration line runs. Use `const` by default, `let` when reassignment is needed, and avoid `var` in modern code.

**Example:**
```javascript
function checkout(cart) {
  const total = cart.reduce((sum, item) => sum + item.price, 0); // block-scoped
  let discount = 0;
  if (total > 100) discount = 10;
  // var leaks to function scope — avoid
  return total - discount;
}
```

---
### 3. What is hoisting?

**Answer:** Hoisting is JavaScript's behavior of processing declarations before executing code in a scope. `var` and `function` declarations are hoisted; `let`/`const` are hoisted but uninitialized until their line executes. Understanding hoisting prevents bugs with variables used before declaration.

**Example:**
```javascript
console.log(typeof getTax); // 'function' — function declaration hoisted
getTax(100); // works

function getTax(amount) { return amount * 0.08; }

// console.log(rate); // ReferenceError — let in TDZ
let rate = 0.08;
```

---
### 4. What is the temporal dead zone?

**Answer:** The temporal dead zone (TDZ) is the period from entering a block until a `let` or `const` declaration is evaluated. Accessing the variable in the TDZ throws a `ReferenceError`. This prevents using block-scoped variables before they are properly initialized.

**Example:**
```javascript
function createOrder() {
  // TDZ for orderId starts here
  // console.log(orderId); // ReferenceError
  const orderId = `ORD-${Date.now()}`;
  return { orderId, status: 'pending' };
}
```

---
### 5. What is a closure?

**Answer:** A closure is a function that retains access to variables from its enclosing lexical scope even after the outer function has returned. Closures enable private state, factories, and callbacks. They are fundamental to modules, event handlers, and functional patterns.

**Example:**
```javascript
function createCart() {
  let items = []; // private via closure
  return {
    add(item) { items.push(item); },
    total() { return items.reduce((s, i) => s + i.price, 0); },
    count() { return items.length; }
  };
}
const cart = createCart();
cart.add({ name: 'USB-C Cable', price: 12 });
console.log(cart.total()); // 12
```

---
### 6. What is lexical scope?

**Answer:** Lexical scope means a function's accessible variables are determined by where the function is written in source code, not where it is called. Inner functions can read outer variables; the chain forms the scope chain used during lookup.

**Example:**
```javascript
const store = 'OnlineShop';
function shipOrder(orderId) {
  const carrier = 'FedEx';
  function label() {
    return `${store} → ${orderId} via ${carrier}`; // lexical chain
  }
  return label();
}
console.log(shipOrder('ORD-42'));
```

---
### 7. Explain the this keyword.

**Answer:** `this` refers to the execution context object. In a method, `this` is the object before the dot. Alone or in a regular function (non-strict), `this` may be `undefined` or the global object. Arrow functions do not have their own `this`; they inherit from the enclosing scope.

**Example:**
```javascript
const user = {
  name: 'Alice',
  greet() { return `Hello, ${this.name}`; }
};
console.log(user.greet()); // Hello, Alice

const loose = user.greet;
// console.log(loose()); // undefined name in strict mode
```

---
### 8. Arrow function vs regular function?

**Answer:** Arrow functions have concise syntax, no own `this`, `arguments`, or `prototype`, and cannot be used as constructors with `new`. Regular functions get dynamic `this` binding and are required for object methods that need `this` or for generator/constructor use cases.

**Example:**
```javascript
const order = { items: [10, 20], getTotal() {
  return this.items.reduce((sum, p) => sum + p, 0); // regular — this = order
}};
const broken = { items: [10, 20], getTotal: () =>
  this?.items?.reduce((s, p) => s + p, 0) // arrow — wrong this
};
console.log(order.getTotal()); // 30
```

---
### 9. What is the event loop?

**Answer:** The event loop is the mechanism that lets JavaScript perform non-blocking I/O despite being single-threaded. It runs the call stack until empty, drains all microtasks, then picks one macrotask, and repeats. This ordering explains async timing in interviews.

**Example:**
```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Output: 1, 4, 3, 2
```

---
### 10. Microtasks vs macrotasks?

**Answer:** Microtasks (Promise callbacks, `queueMicrotask`) run after the current stack clears but before the next macrotask. Macrotasks include `setTimeout`, `setInterval`, and I/O callbacks. All microtasks in the queue are processed before the next macrotask executes.

**Example:**
```javascript
setTimeout(() => console.log('macrotask'), 0);
queueMicrotask(() => console.log('microtask 1'));
Promise.resolve().then(() => console.log('microtask 2'));
// microtask 1, microtask 2, then macrotask
```

---
### 11. What is a Promise?

**Answer:** A Promise represents the eventual result of an asynchronous operation — pending, fulfilled, or rejected. It enables chaining with `.then`/`.catch` and works with `async/await`. Promises solve callback hell and provide a standard async composition model.

**Example:**
```javascript
function fetchProduct(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      id ? resolve({ id, name: 'Laptop', price: 999 }) : reject(new Error('Invalid id'));
    }, 100);
  });
}
fetchProduct('p1').then(p => console.log(p.name)).catch(console.error);
```

---
### 12. Promise.all vs Promise.allSettled?

**Answer:** `Promise.all` fails fast — if any promise rejects, the whole result rejects. `Promise.allSettled` waits for every promise and returns an array of `{ status, value|reason }` for each. Use `all` when all must succeed; `allSettled` for independent parallel tasks.

**Example:**
```javascript
const orders = [
  fetch('/api/orders/1').then(r => r.json()),
  fetch('/api/orders/2').then(r => r.json()),
];
const results = await Promise.allSettled(orders);
results.forEach((r, i) => console.log(`Order ${i+1}:`, r.status));
```

---
### 13. What is async/await?

**Answer:** `async` marks a function that always returns a Promise. `await` pauses within that function until a Promise settles, writing async code in a synchronous style. Errors are caught with `try/catch` instead of `.catch` chains.

**Example:**
```javascript
async function getOrderTotal(orderId) {
  try {
    const res = await fetch(`/api/orders/${orderId}`);
    if (!res.ok) throw new Error('Not found');
    const order = await res.json();
    return order.items.reduce((s, i) => s + i.price * i.qty, 0);
  } catch (err) {
    console.error('Order fetch failed:', err.message);
    throw err;
  }
}
```

---
### 14. What is callback hell?

**Answer:** Callback hell is deeply nested callbacks that make async code hard to read, test, and error-handle. It often causes pyramid-shaped code with duplicated error handling. Promises, async/await, and modular functions flatten this structure.

**Example:**
```javascript
// Before: nested callbacks
// getUser(id, (user) => {
//   getOrders(user.id, (orders) => {
//     getItems(orders[0].id, (items) => { /* ... */ });
//   });
// });

// After: async/await
async function loadOrderItems(userId) {
  const user = await getUser(userId);
  const orders = await getOrders(user.id);
  return getItems(orders[0].id);
}
```

---
### 15. What is prototypal inheritance?

**Answer:** JavaScript objects inherit from other objects via an internal `[[Prototype]]` link. When a property is missing on an object, the engine looks up the prototype chain. `class` syntax is sugar over constructor functions and `Object.create`.

**Example:**
```javascript
function Product(name, price) {
  this.name = name;
  this.price = price;
}
Product.prototype.display = function() {
  return `${this.name}: $${this.price}`;
};
const laptop = new Product('Laptop', 999);
console.log(laptop.display()); // Laptop: $999
```

---
### 16. Difference between == and ===?

**Answer:** `==` performs type coercion before comparison, which can produce surprising results. `===` compares value and type without coercion. In interviews and production code, prefer `===` unless you have a deliberate coercion need.

**Example:**
```javascript
console.log(0 == false);   // true  — coerced
console.log(0 === false);  // false — different types
console.log(null == undefined);  // true
console.log(null === undefined); // false
```

---
### 17. What is type coercion?

**Answer:** Type coercion is the automatic or explicit conversion of values from one type to another. JavaScript coerces in `+` with strings, loose equality, and boolean contexts. Explicit conversion uses `Number()`, `String()`, or `Boolean()`.

**Example:**
```javascript
const qty = '3';
const price = 25;
console.log(qty + price);      // '325' — string concat
console.log(Number(qty) * price); // 75 — explicit number
```

---
### 18. What is NaN?

**Answer:** `NaN` (Not a Number) is the result of invalid numeric operations like `0/0` or `parseInt('abc')`. It is the only value in JavaScript that is not equal to itself. Use `Number.isNaN()` instead of the global `isNaN()` which coerces.

**Example:**
```javascript
console.log(Number('abc'));     // NaN
console.log(NaN === NaN);       // false
console.log(Number.isNaN(NaN)); // true
const price = parseFloat('free');
if (Number.isNaN(price)) console.log('Invalid price input');
```

---
### 19. null vs undefined?

**Answer:** `undefined` means a variable was declared but not assigned, or a missing property/return value. `null` is an intentional assignment representing no value or empty reference. `typeof null` is famously `'object'` (historical bug).

**Example:**
```javascript
let selectedPayment; // undefined
const appliedCoupon = null; // explicitly no coupon
function findUser(id) { return id ? { id, name: 'Bob' } : null; }
console.log(selectedPayment, appliedCoupon, findUser(0));
```

---
### 20. Optional chaining (?.)?

**Answer:** Optional chaining short-circuits property access when the base is `null` or `undefined`, returning `undefined` instead of throwing. It works with `.`, `?.()`, and `?.[]`. It simplifies safe navigation of nested API or user objects.

**Example:**
```javascript
const user = { profile: { address: { city: 'Austin' } } };
const guest = {};
console.log(user?.profile?.address?.city); // Austin
console.log(guest?.profile?.address?.city); // undefined
console.log(user?.orders?.[0]?.id); // undefined
```

---
### 21. Nullish coalescing (??)?

**Answer:** The nullish coalescing operator returns the right operand only when the left is `null` or `undefined`. Unlike `||`, it does not treat `0`, `''`, or `false` as empty. Useful for default values in forms and API responses.

**Example:**
```javascript
const qty = 0;
const discount = qty ?? 1;    // 0 — not replaced
const fallback = qty || 1;    // 1 — falsy replaced
const name = null ?? 'Guest'; // Guest
```

---
### 22. What is destructuring?

**Answer:** Destructuring extracts values from arrays or properties from objects into variables. It supports defaults, renaming, and rest patterns. Common in function parameters, API mapping, and React props.

**Example:**
```javascript
const order = { id: 'O1', user: { name: 'Alice' }, total: 149.99 };
const { id, user: { name }, total = 0 } = order;
const [first, ...rest] = ['shipped', 'delivered', 'rated'];
console.log(id, name, total, rest);
```

---
### 23. What is the spread operator?

**Answer:** Spread (`...`) expands iterables into individual elements — copying arrays, merging objects, or passing arguments. It creates shallow copies. Use it for immutable updates in state management.

**Example:**
```javascript
const cart = [{ id: 1, qty: 2 }];
const newItem = { id: 2, qty: 1 };
const updated = [...cart, newItem];
const defaults = { currency: 'USD', tax: 0.08 };
const checkout = { ...defaults, ...{ userId: 'u1', total: 99 } };
```

---
### 24. What is rest parameter?

**Answer:** Rest (`...args`) collects remaining function arguments into an array. It must be the last parameter. It replaces the deprecated `arguments` object with a real array.

**Example:**
```javascript
function createInvoice(subtotal, ...lineItems) {
  const itemsTotal = lineItems.reduce((s, i) => s + i.amount, 0);
  return { subtotal, lineItems, total: subtotal + itemsTotal };
}
createInvoice(100, { desc: 'Shipping', amount: 9.99 });
```

---
### 25. What is a higher-order function?

**Answer:** A higher-order function takes one or more functions as arguments and/or returns a function. Examples include `map`, `filter`, `reduce`, and middleware patterns. They enable composition, abstraction, and declarative data transformation.

**Example:**
```javascript
const withTax = (rate) => (price) => price * (1 + rate);
const prices = [10, 20, 30];
const taxed = prices.map(withTax(0.08));
console.log(taxed); // [10.8, 21.6, 32.4]
```

---
### 26. map vs forEach?

**Answer:** `map` transforms each element and returns a new array of the same length. `forEach` iterates for side effects and always returns `undefined`. Choose `map` when you need a transformed result; `forEach` for logging or mutations.

**Example:**
```javascript
const products = [{ name: 'Mouse', price: 25 }, { name: 'Keyboard', price: 75 }];
const names = products.map(p => p.name);
products.forEach(p => console.log(`Listed: ${p.name}`));
console.log(names); // ['Mouse', 'Keyboard']
```

---
### 27. filter vs find?

**Answer:** `filter` returns all elements matching a predicate as an array. `find` returns the first match or `undefined`. Use `filter` for collections; `find` when you need a single item like a user by ID.

**Example:**
```javascript
const orders = [
  { id: 1, status: 'shipped' }, { id: 2, status: 'pending' }
];
const pending = orders.filter(o => o.status === 'pending');
const firstShipped = orders.find(o => o.status === 'shipped');
```

---
### 28. What is reduce?

**Answer:** `reduce` accumulates an array into a single value using a reducer function and optional initial accumulator. It can sum, group, flatten, or build objects. Always provide an initial value for safety with empty arrays. For flattening, prefer `flat()`/`flat(Infinity)` in production; use `reduce` + recursion when interviewers ask you to implement flatten manually.

**Example:**
```javascript
const items = [{ sku: 'A', qty: 2 }, { sku: 'B', qty: 3 }];
const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
const bySku = items.reduce((acc, item) => {
  acc[item.sku] = item.qty; return acc;
}, {});

// Flatten via reduce (deep) — interview classic
function flattenReduce(arr) {
  return arr.reduce((acc, item) =>
    Array.isArray(item)
      ? acc.concat(flattenReduce(item))
      : acc.concat(item),
  []);
}
console.log(flattenReduce([1, [2, [3, 4]], 5])); // [1, 2, 3, 4, 5]
console.log(totalQty, bySku);
```

---
### 29. What is flatMap?

**Answer:** `flatMap` maps each element then flattens the result by one level. It is equivalent to `map` followed by `flat(1)` but more efficient. Useful when each item produces zero or more outputs.

**Example:**
```javascript
const orders = [
  { id: 1, items: ['mouse', 'pad'] },
  { id: 2, items: ['keyboard'] }
];
const allSkus = orders.flatMap(o => o.items);
console.log(allSkus); // ['mouse', 'pad', 'keyboard']
```

---
### Flatten Nested Array — Interview Deep Dive (extends Q28–29)

> **High-frequency JS screening question.** Often phrased as “implement `flatten`”, “flatten this nested array”, or LeetCode **341 Flatten Nested List Iterator**. `flatMap` (Q29) only flattens **one** level — know shallow vs deep and all three manual approaches.

#### Shallow vs deep flatten

| Approach | Depth | Notes |
|----------|-------|-------|
| `arr.flat()` / `arr.flat(1)` | 1 level | Default depth is 1 |
| `arr.flat(Infinity)` | all levels | Best for unknown nesting depth |
| `flatMap(fn)` | 1 level after map | Not a general-purpose deep flatten |
| Recursive / stack / reduce | configurable | What interviewers want you to code |

**Native API (prefer in production):**
```javascript
const nested = [1, [2, [3, 4]], 5];

nested.flat();           // [1, 2, [3, 4], 5] — shallow
nested.flat(2);          // [1, 2, 3, 4, 5] — depth 2
nested.flat(Infinity);   // [1, 2, 3, 4, 5] — fully deep

// flat does not flatten plain objects — only Array elements
[{ a: 1 }, [{ b: 2 }]].flat(Infinity); // [{ a: 1 }, { b: 2 }]
```

#### Recursive flatten (most common live-coding answer)

**Answer:** Walk each element; if it's an array, recurse; otherwise append to result. Time **O(n)** over total elements; space **O(d)** call stack where **d** = max nesting depth.

```javascript
function flatten(arr, depth = Infinity) {
  const out = [];
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      out.push(...flatten(item, depth - 1));
    } else {
      out.push(item);
    }
  }
  return out;
}

flatten([1, [2, [3]]], 1);  // [1, 2, [3]]
flatten([1, [2, [3]]]);       // [1, 2, 3]
```

#### Iterative flatten with stack (DFS)

**Answer:** Avoid recursion depth limits on very deep arrays. Push items onto a stack; pop, and if array, push children back (reverse order to preserve left-to-right). Time **O(n)**; space **O(n)** for stack.

```javascript
function flattenIterative(arr) {
  const stack = [...arr];
  const out = [];
  while (stack.length) {
    const next = stack.pop();
    if (Array.isArray(next)) {
      stack.push(...next); // spread children onto stack
    } else {
      out.push(next);
    }
  }
  return out.reverse(); // stack pops LIFO — reverse to restore order
}

flattenIterative([1, [2, [3, 4]], 5]); // [1, 2, 3, 4, 5]
```

#### `concat` + recursion vs `push(...spread)`

**Answer:** `out.push(...flatten(child))` is concise but can throw **RangeError: Maximum call stack size exceeded** on huge sub-arrays (spread passes each element as a separate argument). Safer pattern: `out.push(...small)` only when size is bounded, or use `for...of` + `push` per element, or `acc.concat` in reduce.

```javascript
// Safe for large arrays — no spread of huge results
function flattenSafe(arr) {
  const out = [];
  (function walk(list) {
    for (const item of list) {
      if (Array.isArray(item)) walk(item);
      else out.push(item);
    }
  })(arr);
  return out;
}
```

#### Flatten Nested List Iterator (LeetCode 341)

**Answer:** Input is a nested list of integers **or** nested `NestedInteger` objects. Implement an iterator that returns integers one-by-one in left-to-right order. Classic fix: **stack + DFS** — push list in reverse; on `next()`, pop until you get an integer (unwrapping nested lists onto the stack). See **Q322** checklist.

```javascript
class NestedIterator {
  constructor(nestedList) {
    this.stack = [...nestedList].reverse();
  }
  hasNext() {
    this._prepare();
    return this.stack.length > 0;
  }
  next() {
    this._prepare();
    return this.stack.pop().getInteger();
  }
  _prepare() {
    while (this.stack.length) {
      const top = this.stack[this.stack.length - 1];
      if (!top.isInteger()) {
        this.stack.pop();
        const list = top.getList();
        for (let i = list.length - 1; i >= 0; i--) this.stack.push(list[i]);
      } else break;
    }
  }
}
```

#### What to say in the interview

1. Clarify: **shallow or deep?** Fixed depth or `Infinity`?
2. Mention **`arr.flat(depth)`** first — shows you know modern JS.
3. Code **recursive** or **stack** version; state **O(n)** time.
4. Call out **edge cases**: `[]`, `[[]]`, already-flat array, non-array elements mixed in.
5. Contrast with **`flatMap`**: one-level only; good when each item maps to 0+ outputs (Q29).

---
### 30. What is debouncing?

**Answer:** Debouncing delays function execution until input stops for a specified wait period. Each new trigger resets the timer. Ideal for search-as-you-type, resize handlers, and auto-save to avoid excessive API calls.

**Example:**
```javascript
function debounce(fn, wait = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
const searchProducts = debounce((q) => {
  fetch(`/api/products?q=${encodeURIComponent(q)}`);
}, 400);
```

---
### 31. What is throttling?

**Answer:** Throttling ensures a function runs at most once per time window regardless of how often it is triggered. Unlike debounce, it executes on a schedule during continuous events. Used for scroll, resize, and rate-limited analytics.

**Example:**
```javascript
function throttle(fn, limit = 200) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= limit) { last = now; fn(...args); }
  };
}
window.addEventListener('scroll', throttle(() => trackScroll(), 250));
```

---
### 32. What is currying?

**Answer:** Currying transforms a function of multiple arguments into a sequence of functions each taking one argument (or partial application). It enables reusable specialized functions and cleaner composition in functional pipelines.

**Example:**
```javascript
const applyDiscount = (pct) => (price) => price * (1 - pct / 100);
const vipDiscount = applyDiscount(20);
console.log(vipDiscount(100)); // 80
const addTax = (rate) => (price) => price * (1 + rate);
const priceWithTax = addTax(0.08)(50);
```

---
### 33. What is memoization?

**Answer:** Memoization caches function results keyed by inputs to avoid recomputation. It trades memory for speed on pure, expensive functions. Common in dynamic programming and React `useMemo`.

**Example:**
```javascript
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
const fib = memoize((n) => n <= 1 ? n : fib(n-1) + fib(n-2));
```

---
### 34. What is IIFE?

**Answer:** An Immediately Invoked Function Expression runs as soon as it is defined, creating a private scope. Before ES modules, IIFEs avoided global namespace pollution and enabled module patterns.

**Example:**
```javascript
const CartModule = (function() {
  let items = [];
  return {
    add(i) { items.push(i); },
    size() { return items.length; }
  };
})();
CartModule.add({ sku: 'A1' });
console.log(CartModule.size()); // 1
```

---
### 35. What is strict mode?

**Answer:** `'use strict'` enables strict mode, which catches silent errors, disallows undeclared variables, and makes `this` `undefined` in plain functions. Modules and classes are strict by default in modern JavaScript.

**Example:**
```javascript
'use strict';
function total(prices) {
  // undeclaredVar = 1; // ReferenceError in strict mode
  return prices.reduce((s, p) => s + p, 0);
}
console.log(total([10, 20]));
```

---
### 36. call vs apply vs bind?

**Answer:** `call` invokes a function with a specific `this` and comma-separated args. `apply` is the same but accepts an args array. `bind` returns a new function with fixed `this` (and optionally partial args) without invoking immediately.

**Example:**
```javascript
function format(currency) {
  return `${currency}${this.price.toFixed(2)}`;
}
const product = { price: 49.99 };
console.log(format.call(product, '$'));
console.log(format.apply(product, ['€']));
const usdFormat = format.bind(product, '$');
console.log(usdFormat());
```

---
### 37. What is a generator?

**Answer:** Generators (`function*`) are functions that can pause and resume via `yield`, returning an iterator. They simplify lazy sequences, async flows (before async/await), and custom iterables.

**Example:**
```javascript
function* orderIds() {
  let id = 1000;
  while (true) yield `ORD-${id++}`;
}
const gen = orderIds();
console.log(gen.next().value, gen.next().value); // ORD-1000 ORD-1001
```

---
### 38. What is an iterator?

**Answer:** An iterator is an object with a `next()` method returning `{ value, done }`. Iterables (arrays, Maps, generators) implement `Symbol.iterator` for `for...of` loops and spread.

**Example:**
```javascript
const range = {
  from: 1, to: 3,
  [Symbol.iterator]() {
    let cur = this.from;
    const end = this.to;
    return { next() {
      return cur <= end ? { value: cur++, done: false } : { done: true };
    }};
  }
};
console.log([...range]); // [1, 2, 3]
```

---
### 39. What is Proxy?

**Answer:** `Proxy` wraps an object to intercept operations like get, set, and delete via traps. Frameworks use Proxies for reactivity (Vue 3), validation, and logging. It enables meta-programming without modifying the target directly.

**Example:**
```javascript
const cart = new Proxy({ items: [] }, {
  set(target, prop, value) {
    if (prop === 'items' && !Array.isArray(value)) throw new TypeError('items must be array');
    target[prop] = value;
    return true;
  }
});
cart.items = [{ sku: 'X1' }];
```

---
### 40. What is Symbol?

**Answer:** `Symbol` creates unique, immutable primitive values used as property keys to avoid name collisions. Well-known symbols like `Symbol.iterator` define protocol hooks. Symbols are not enumerable in `for...in`.

**Example:**
```javascript
const id = Symbol('orderId');
const order = { [id]: 'ORD-99', status: 'paid' };
console.log(order[id]); // ORD-99
console.log(Object.keys(order)); // ['status'] — symbol hidden
```

---
### 41. Map vs Object?

**Answer:** `Map` accepts any type as keys, maintains insertion order, has a `.size` property, and performs better for frequent add/delete. Plain objects are fine for string-keyed records; Maps excel for caches and keyed collections.

**Example:**
```javascript
const priceCache = new Map();
priceCache.set('sku-1', 29.99);
priceCache.set({ region: 'US' }, 0.08);
console.log(priceCache.get('sku-1'), priceCache.size);
```

---
### 42. What is Set?

**Answer:** A `Set` stores unique values of any type. Duplicates are ignored by strict equality. Common uses include deduplication, membership tests, and tracking visited nodes.

**Example:**
```javascript
const tags = ['sale', 'new', 'sale', 'featured'];
const unique = [...new Set(tags)];
const viewed = new Set();
['p1','p2','p1'].forEach(id => viewed.add(id));
console.log(unique, viewed.size); // ['sale','new','featured'] 2
```

---
### 43. Shallow vs deep copy?

**Answer:** A shallow copy duplicates top-level references; nested objects are shared. A deep copy recursively clones all levels. Use spread/`Object.assign` for shallow copies and `structuredClone()` for deep clones of plain data.

**Example:**
```javascript
const original = { user: { name: 'Alice' }, total: 100 };
const shallow = { ...original };
const deep = structuredClone(original);
shallow.user.name = 'Bob';
console.log(original.user.name); // Bob — shared
deep.user.name = 'Carol';
console.log(original.user.name); // still Bob
```

---
### 44. What is immutability?

**Answer:** Immutability means not modifying existing data; instead create new copies with changes. It simplifies change detection in React, enables time-travel debugging, and reduces accidental side effects in shared state.

**Example:**
```javascript
const cart = [{ id: 1, qty: 1 }];
const addToCart = (cart, item) => [...cart, item];
const newCart = addToCart(cart, { id: 2, qty: 2 });
console.log(cart.length, newCart.length); // 1 2
```

---
### 45. Event bubbling?

**Answer:** Event bubbling propagates an event from the target element up through its ancestors to the document root. Most handlers listen in the bubbling phase by default. Understanding bubbling is key to delegation and stopping propagation.

**Example:**
```javascript
document.getElementById('checkout-btn')?.addEventListener('click', (e) => {
  console.log('button clicked', e.target.id);
});
// Click bubbles: button → form → body → document
```

---
### 46. Event capturing?

**Answer:** Capturing (trickling) propagates the event from the root down to the target before bubbling. Register with `{ capture: true }` or third argument `true`. Rare in app code but used for global interceptors.

**Example:**
```javascript
document.addEventListener('click', () => console.log('capture phase'), true);
document.getElementById('cart')?.addEventListener('click', () => console.log('bubble phase'));
```

---
### 47. Event delegation?

**Answer:** Event delegation attaches one listener on a parent and handles events from children via `event.target`. It reduces memory use and works for dynamically added elements — essential for large product lists.

**Example:**
```javascript
document.getElementById('product-list')?.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-add-cart]');
  if (!btn) return;
  addToCart(btn.dataset.productId);
});
```

---
### 48. What is the DOM?

**Answer:** The Document Object Model is a tree representation of HTML that JavaScript can read and modify. Nodes include elements, text, and attributes. The DOM API enables dynamic UIs without full page reloads.

**Example:**
```javascript
const title = document.querySelector('#product-title');
title.textContent = 'Wireless Earbuds';
const price = document.createElement('span');
price.className = 'price';
price.textContent = '$79.99';
title.after(price);
```

---
### 49. localStorage vs sessionStorage?

**Answer:** Both store key-value string pairs in the browser. `localStorage` persists until cleared; `sessionStorage` clears when the tab closes. Neither should store sensitive tokens without caution — use httpOnly cookies for auth.

**Example:**
```javascript
localStorage.setItem('cart', JSON.stringify([{ id: 1, qty: 2 }]));
const cart = JSON.parse(localStorage.getItem('cart') || '[]');
sessionStorage.setItem('checkoutStep', '2');
```

---
### 50. What is a cookie?

**Answer:** Cookies are small name-value pairs sent with HTTP requests, set via `Set-Cookie` headers or `document.cookie`. They support expiry, `Secure`, `HttpOnly`, and `SameSite` flags. Used for sessions, preferences, and tracking within size limits (~4KB).

**Example:**
```javascript
// Server sets: Set-Cookie: sessionId=abc; HttpOnly; Secure; SameSite=Strict
document.cookie = 'theme=dark; path=/; max-age=86400';
const hasTheme = document.cookie.includes('theme=dark');
```

---
### 51. What is CORS?

**Answer:** Cross-Origin Resource Sharing is a browser security mechanism blocking cross-origin HTTP requests unless the server sends permissive CORS headers. Preflight `OPTIONS` requests validate methods and headers for non-simple requests.

**Example:**
```javascript
// Browser at https://shop.com calls https://api.shop.com
// Server must respond:
// Access-Control-Allow-Origin: https://shop.com
// Access-Control-Allow-Methods: GET, POST
```

---
### 52. What is JSON?

**Answer:** JSON (JavaScript Object Notation) is a text format for structured data using objects, arrays, strings, numbers, booleans, and null. `JSON.stringify()` serializes; `JSON.parse()` deserializes. Functions and `undefined` are not valid JSON.

**Example:**
```javascript
const order = { id: 'O1', items: [{ sku: 'A', qty: 2 }], paid: true };
const json = JSON.stringify(order);
const parsed = JSON.parse(json);
console.log(parsed.items[0].sku);
```

---
### 53. What is fetch API?

**Answer:** `fetch` is the modern browser HTTP client returning Promises. It does not reject on HTTP error status codes — check `response.ok`. Supports streams, abort signals, and JSON helpers via `.json()`.

**Example:**
```javascript
async function getProduct(id) {
  const res = await fetch(`/api/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```

---
### 54. What is XMLHttpRequest?

**Answer:** XMLHttpRequest (XHR) is the legacy async HTTP API predating `fetch`. It supports progress events and older browser compatibility. New code should prefer `fetch` or axios unless XHR-specific features are required.

**Example:**
```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/orders');
xhr.onload = () => console.log(JSON.parse(xhr.responseText));
xhr.send();
```

---
### 55. Same-origin policy?

**Answer:** The same-origin policy restricts how documents and scripts from one origin interact with another. Origin = protocol + host + port. It prevents malicious sites from reading your bank session but is relaxed via CORS for intentional cross-origin APIs.

**Example:**
```javascript
// https://shop.com:443 and https://api.shop.com — different origins
// https://shop.com and https://shop.com/api — same origin
```

---
### 56. What is a JS module?

**Answer:** Modules encapsulate code with explicit exports and imports, enabling separate compilation units and dependency graphs. ES Modules use `import`/`export`; CommonJS uses `require`/`module.exports`. Modules are deferred and strict by default.

**Example:**
```javascript
// product.js
export function formatPrice(n) { return `$${n.toFixed(2)}`; }
export default class Product { constructor(name) { this.name = name; } }

// main.js
import Product, { formatPrice } from './product.js';
```

---
### 57. ESM vs CommonJS?

**Answer:** ES Modules are statically analyzable, support tree shaking, and are the browser/Node standard (`import`/`export`). CommonJS is dynamic, synchronous (`require`), and legacy in Node. Modern Node supports both; bundlers prefer ESM.

**Example:**
```javascript
// ESM — static imports, top-level await in Node
import express from 'express';

// CJS — dynamic require
const path = require('path');
const config = require(process.env.CONFIG || './default');
```

---
### 58. Tree shaking?

**Answer:** Tree shaking eliminates unused exported code during bundling. It requires static ESM imports so bundlers can analyze the dependency graph. Dead code elimination reduces bundle size for production SPAs.

**Example:**
```javascript
// utils.js exports many helpers; app only imports one
import { formatCurrency } from './utils.js'; // only formatCurrency bundled
console.log(formatCurrency(99.5));
```

---
### 59. Memory leak in JS?

**Answer:** Memory leaks occur when unreachable objects are still referenced and cannot be garbage collected. Common causes: forgotten timers, global variables, closures holding large data, and detached DOM nodes retained by event listeners.

**Example:**
```javascript
// Leak: interval never cleared
const id = setInterval(() => trackAnalytics(), 1000);
// Fix on cleanup:
clearInterval(id);
// Leak: listener on removed DOM node — removeListener on unmount
```

---
### 60. Garbage collection?

**Answer:** JavaScript engines like V8 use automatic garbage collection, primarily mark-and-sweep, to reclaim memory from unreachable objects. Developers do not manually free memory but must avoid retaining references that prevent collection.

**Example:**
```javascript
function processOrders(orders) {
  const cache = new WeakMap(); // keys can be GC'd when orders objects are gone
  orders.forEach(o => cache.set(o, computeTotal(o)));
  return orders.map(o => cache.get(o));
}
```

---
### 61. Call stack?

**Answer:** The call stack is a LIFO structure tracking function invocations. Each call pushes a frame; return pops it. Stack overflow occurs when recursion lacks a base case or depth exceeds the engine limit.

**Example:**
```javascript
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
console.log(factorial(5)); // 120 — 5 frames deep
```

---
### 62. Recursion?

**Answer:** Recursion is when a function calls itself with a smaller or simpler input until a base case stops it. Useful for trees, nested categories, and divide-and-conquer. Tail-call optimization is limited in JS engines.

**Example:**
```javascript
function sumCategoryPrices(category) {
  let total = category.price || 0;
  for (const child of category.children || []) {
    total += sumCategoryPrices(child);
  }
  return total;
}
```

---
### 63. BigInt?

**Answer:** `BigInt` represents integers of arbitrary precision using the `n` suffix or `BigInt()`. It cannot mix with regular `Number` in arithmetic without explicit conversion. Use for large IDs, crypto, or ledger calculations.

**Example:**
```javascript
const orderCount = 9007199254740991n;
const next = orderCount + 1n;
console.log(next.toString()); // 9007199254740992
```

---
### 64. Object.freeze?

**Answer:** `Object.freeze` makes an object shallowly immutable — no add, delete, or reassign properties. Nested objects remain mutable unless deeply frozen. Use for constants and defensive copies in shared config.

**Example:**
```javascript
const TAX_RATES = Object.freeze({ US: 0.08, EU: 0.20 });
// TAX_RATES.US = 0.1; // fails silently or throws in strict mode
console.log(Object.isFrozen(TAX_RATES));
```

---
### 65. Object.seal?

**Answer:** `Object.seal` prevents adding or deleting properties but allows modifying existing values. It is less strict than `freeze`. Useful when the shape is fixed but values may update.

**Example:**
```javascript
const settings = Object.seal({ theme: 'light', lang: 'en' });
settings.theme = 'dark'; // OK
// settings.newKey = true; // fails
console.log(Object.isSealed(settings));
```

---
### 66. Polyfill?

**Answer:** A polyfill implements a modern API on environments that lack native support. Libraries like core-js provide `Promise`, `Array.prototype.flat`, and `fetch` polyfills. Feature detection (`if (!Array.prototype.at)`) precedes loading polyfills. For `flat`, a minimal polyfill mirrors the recursive flatten pattern (Q28 / Flatten Deep Dive).

**Example:**
```javascript
if (!Array.prototype.at) {
  Array.prototype.at = function(n) {
    const i = n < 0 ? this.length + n : n;
    return this[i];
  };
}
console.log(['a','b','c'].at(-1)); // c

if (!Array.prototype.flat) {
  Array.prototype.flat = function(depth = 1) {
    const d = depth === Infinity ? Infinity : Math.floor(depth);
    const flattenOnce = (arr, remaining) => arr.reduce((acc, item) => {
      if (Array.isArray(item) && remaining > 0) {
        acc.push(...flattenOnce(item, remaining - 1));
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
    return flattenOnce(this, d);
  };
}
console.log([1, [2, [3]]].flat(Infinity)); // [1, 2, 3]
```

---
### 67. Transpilation?

**Answer:** Transpilation converts source code from one syntax level to another — e.g., TypeScript to JavaScript or ES2024 to ES2017 via Babel. It enables modern features in older browsers while developers write current syntax.

**Example:**
```javascript
// Source (ES2024): const total = items?.reduce((a, b) => a + b.price, 0) ?? 0;
// Babel output targets older engines with helper calls
```

---
### 68. Web Worker?

**Answer:** Web Workers run JavaScript in a background thread separate from the main UI thread. They communicate via `postMessage` and cannot access the DOM. Use for CPU-heavy tasks like image processing or large CSV parsing.

**Example:**
```javascript
// worker.js — self.onmessage = (e) => self.postMessage(heavyCalc(e.data));
const worker = new Worker('worker.js');
worker.postMessage(orderItems);
worker.onmessage = (e) => console.log('Total:', e.data);
```

---
### 69. Service Worker?

**Answer:** Service Workers are event-driven scripts acting as network proxies for offline caching, push notifications, and PWA features. They use a cache-first or network-first strategy and require HTTPS in production.

**Example:**
```javascript
// sw.js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
```

---
### 70. Temporal API?

**Answer:** The Temporal API is the modern replacement for the flawed `Date` object, providing `PlainDate`, `ZonedDateTime`, and explicit timezone handling. It is stage-3+ and available via polyfills (`@js-temporal/polyfill`) until universal runtime support.

**Example:**
```javascript
import { Temporal } from '@js-temporal/polyfill';
const shipDate = Temporal.PlainDate.from('2026-06-18');
const deadline = shipDate.add({ days: 7 });
console.log(deadline.toString()); // 2026-06-25
```

---
### 71. Browser vs Node event loop — key difference?

**Answer:** Both use V8 and microtasks, but Node adds libuv phases and `process.nextTick`/`setImmediate`. Browser has rendering and `requestAnimationFrame`. In interviews: Node optimizes I/O; browser optimizes UI paint. Never block either loop with CPU-heavy sync work.

**Example:**
```javascript
// BAD in both — blocks loop for 2 seconds
function bad() { const start = Date.now(); while (Date.now() - start < 2000) {} }

// GOOD — offload CPU to Worker Threads (Node) or Web Worker (browser)
```

---
### 72. Promise.race vs Promise.any?

**Answer:** `Promise.race` settles when **any** promise settles — first win or lose. `Promise.any` settles when **any** fulfills; rejects only if **all** reject. Use `race` for timeouts; `any` for fastest-success from redundant APIs.

**Example:**
```javascript
const timeout = (ms) => new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));

// Race — fail fast on timeout
await Promise.race([fetch('/api/price'), timeout(3000)]);

// Any — first successful payment gateway
await Promise.any([
  chargeStripe(order),
  chargePayPal(order),
]);
```

---
### 73. class, extends, and super in JavaScript?

**Answer:** `class` is syntactic sugar over prototypes. `extends` sets up inheritance chain; `super()` calls parent constructor (required in child before `this`). Methods on class are non-enumerable. Common in error classes and service layers.

**Example:**
```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404);
  }
}
throw new NotFoundError('Order');
```

---
### 74. Pass by value vs pass by reference?

**Answer:** Primitives (number, string, boolean, null, undefined, symbol, bigint) are passed **by value** — a copy is passed. Objects and arrays are passed **by reference** — the reference is copied, so mutating inside a function affects the original. Reassigning a parameter does not change the outer variable.

**Example:**
```javascript
let count = 5;
function inc(n) { n++; }
inc(count); // count still 5

const cart = { items: [] };
function addItem(c, item) { c.items.push(item); }
addItem(cart, 'phone'); // cart.items = ['phone']
```

---
### 75. typeof vs instanceof?

**Answer:** `typeof` returns a string type for primitives and `function`; `typeof null` is `'object'` (legacy quirk). `instanceof` checks prototype chain — useful for custom classes and `Array`, `Date`. For precise object checks use `Array.isArray()`, `Object.prototype.toString.call()`.

**Example:**
```javascript
typeof 42;           // 'number'
typeof null;         // 'object' — know this for interviews
[] instanceof Array; // true
({}) instanceof Object; // true
Array.isArray([]);   // preferred for arrays
```

---
### 76. for...of vs for...in?

**Answer:** `for...of` iterates **values** of iterables (arrays, strings, Maps, Sets). `for...in` iterates **enumerable keys** of objects (including prototype chain) — avoid on arrays. Use `for...of` or `forEach` for arrays; `Object.keys()` + loop for objects.

**Example:**
```javascript
const order = { id: 1, items: ['a', 'b'] };
for (const item of order.items) console.log(item); // 'a', 'b'
for (const key in order) console.log(key);         // 'id', 'items'
```

---
### 77. Template literals and tagged templates?

**Answer:** Backtick strings support `${expression}` interpolation and multiline text. Tagged templates pass string segments and values to a function — used in styled-components and `sql` query builders for safer composition.

**Example:**
```javascript
const user = 'Alice';
const total = 99.5;
const msg = `Hello ${user}, your total is $${total.toFixed(2)}`;

function sql(strings, ...values) {
  return strings.reduce((acc, s, i) => acc + s + (values[i] ?? ''), '');
}
```

---
### 78. AbortController — cancel fetch / async work?

**Answer:** `AbortController` provides an `AbortSignal` to cancel `fetch`, streams, or custom async logic. Essential for React `useEffect` cleanup and preventing race conditions when users navigate away mid-request.

**Example:**
```javascript
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 5000);

try {
  const res = await fetch('/api/orders', { signal: controller.signal });
  clearTimeout(timer);
  return res.json();
} catch (err) {
  if (err.name === 'AbortError') console.log('Request cancelled or timed out');
}
```

---
### 79. JavaScript falsy values — list them?

**Answer:** Eight falsy values: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`. Everything else is truthy — including `[]`, `{}`, and `"0"`. Use `??` when you only want to replace `null`/`undefined`, not `0` or `""`.

**Example:**
```javascript
const qty = 0;
qty || 1;   // 1 — wrong if 0 is valid
qty ?? 1;   // 0 — correct

Boolean([]);  // true
Boolean("");  // false
```

---

## Node.js (80–157)

### 80. What is Node.js?

**Answer:** Node.js is a JavaScript runtime built on Chrome's V8 engine with libuv for asynchronous, non-blocking I/O. It enables server-side APIs, CLIs, and tooling using the same language as the browser. Node excels at I/O-bound workloads like APIs and real-time apps.

**Example:**
```javascript
// server.js — minimal HTTP server
import http from 'node:http';
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ service: 'orders-api', status: 'ok' }));
});
server.listen(3000);
```

---
### 81. Why single-threaded?

**Answer:** Node uses one main JavaScript thread with an event loop, delegating I/O to libuv's thread pool and OS async APIs. This avoids thread synchronization overhead and suits concurrent connections. CPU work on the main thread blocks everything.

**Example:**
```javascript
// Non-blocking I/O — event loop stays free
import fs from 'node:fs/promises';
const data = await fs.readFile('./orders.json', 'utf8');
console.log(JSON.parse(data).length, 'orders loaded');
```

---
### 82. When is Node NOT ideal?

**Answer:** Node is a poor fit for CPU-intensive tasks like video encoding, heavy image processing, or large in-memory computation on the main thread. Such work blocks the event loop and increases latency. Use Worker Threads, external services, or languages better suited to CPU parallelism.

**Example:**
```javascript
// BAD: blocks event loop
// const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');

// GOOD: async or worker thread
import { pbkdf2 } from 'node:crypto';
pbkdf2(password, salt, 100000, 64, 'sha512', (err, key) => {
  console.log(key.toString('hex'));
});
```

---
### 83. What is libuv?

**Answer:** libuv is a C library providing Node's event loop, thread pool, and cross-platform async I/O (filesystem, DNS, network). It abstracts epoll, kqueue, and IOCP. File system and crypto operations often use libuv's thread pool.

**Example:**
```javascript
// DNS lookup uses libuv async I/O
import dns from 'node:dns';
dns.lookup('api.mystore.com', (err, address) => {
  if (!err) console.log('API host:', address);
});
```

---
### 84. What is npm?

**Answer:** npm (Node Package Manager) is the default registry and CLI for installing, publishing, and managing JavaScript packages. It resolves dependency trees and runs scripts defined in `package.json`. Alternatives include yarn and pnpm.

**Example:**
```bash
# Install Express for an e-commerce API
npm init -y
npm install express mongoose dotenv
npm install -D nodemon eslint
```

---
### 85. package.json?

**Answer:** `package.json` is the project manifest listing name, version, scripts, dependencies, and metadata. npm uses it to install packages and run commands like `npm start`. It is the single source of truth for project configuration.

**Example:**
```json
{
  "name": "shop-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": { "dev": "nodemon src/index.js", "start": "node src/index.js" },
  "dependencies": { "express": "^5.0.0" }
}
```

---
### 86. dependencies vs devDependencies?

**Answer:** `dependencies` are required at runtime in production. `devDependencies` are only for development — tests, linters, build tools. Production installs use `npm ci --omit=dev` to exclude devDeps and reduce image size.

**Example:**
```bash
npm install express          # dependencies
npm install -D jest nodemon    # devDependencies
# Docker prod: RUN npm ci --omit=dev
```

---
### 87. What is npx?

**Answer:** `npx` executes npm packages without global installation — either from local `node_modules/.bin` or by downloading temporarily. Useful for one-off scaffolding, CLIs, and running specific package versions.

**Example:**
```bash
npx create-express-api@latest shop-api
npx nodemon src/index.js
npx eslint . --fix
```

---
### 88. Express.js?

**Answer:** Express is a minimal, unopinionated web framework for Node.js providing routing, middleware, and HTTP utilities. It is the de facto standard for REST APIs. Express 5 adds native Promise support and improved routing.

**Example:**
```javascript
import express from 'express';
const app = express();
app.use(express.json());
app.get('/api/products', (req, res) => res.json([{ id: 1, name: 'Laptop' }]));
app.listen(3000);
```

---
### 89. Middleware?

**Answer:** Middleware functions have signature `(req, res, next)` and process requests in sequence — parsing, auth, logging, routing. They can end the response or call `next()` to continue. Order matters critically in Express apps.

**Example:**
```javascript
app.use(express.json());
app.use((req, res, next) => { req.requestId = crypto.randomUUID(); next(); });
app.use('/api', authMiddleware);
app.get('/api/orders', (req, res) => res.json([]));
```

---
### 90. Routing?

**Answer:** Routing maps HTTP methods and URL paths to handler functions. Express supports route parameters, query strings, and routers. RESTful design uses nouns (`/orders`) with verbs (GET, POST, PUT, DELETE).

**Example:**
```javascript
app.get('/api/products/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'Headphones' });
});
app.post('/api/orders', (req, res) => res.status(201).json({ id: 'O1' }));
```

---
### 91. req.body?

**Answer:** `req.body` contains the parsed request payload (JSON, form data) after body-parsing middleware like `express.json()`. Without middleware, `req.body` is `undefined`. Always validate body content before use.

**Example:**
```javascript
app.use(express.json());
app.post('/api/checkout', (req, res) => {
  const { userId, items } = req.body;
  if (!userId || !items?.length) return res.status(400).json({ error: 'Invalid cart' });
  res.status(201).json({ orderId: 'ORD-1' });
});
```

---
### 92. req.params vs req.query?

**Answer:** `req.params` holds route path parameters (`/users/:id`). `req.query` holds URL query string values (`?page=2&sort=price`). Params identify resources; query modifies list behavior — filtering, pagination, sorting.

**Example:**
```javascript
// GET /api/products/42?reviews=true
app.get('/api/products/:id', (req, res) => {
  console.log(req.params.id);    // '42'
  console.log(req.query.reviews); // 'true'
});
```

---
### 93. Error-handling middleware?

**Answer:** Express error middleware has four arguments `(err, req, res, next)` and must be defined after routes. It centralizes logging and consistent error responses. Throwing in async handlers requires `next(err)` or Express 5 auto-catch.

**Example:**
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});
```

---
### 94. next()?

**Answer:** `next()` passes control to the next middleware in the stack. Without it, the request hangs. Call `next(err)` to skip to error handlers. Middleware can attach data to `req` for downstream handlers.

**Example:**
```javascript
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  req.user = verifyToken(token);
  next();
}
```

---
### 95. next('route')?

**Answer:** Calling `next('route')` skips remaining handlers in the current route and jumps to the next matching route. Useful when a middleware conditionally bypasses route-specific logic without ending the response.

**Example:**
```javascript
app.get('/api/orders/:id', checkCache, (req, res, next) => {
  if (req.cached) return res.json(req.cached);
  next('route'); // skip to next GET handler for same path
}, fetchFromDb);
```

---
### 96. Express Router?

**Answer:** `express.Router()` creates modular, mountable mini-apps with their own middleware and routes. Routers organize large APIs by domain — users, products, orders — improving maintainability and testability.

**Example:**
```javascript
// routes/orders.js
import { Router } from 'express';
const router = Router();
router.get('/', listOrders);
router.post('/', createOrder);
export default router;
// app.js: app.use('/api/orders', orderRouter);
```

---
### 97. CORS middleware?

**Answer:** The `cors` package sets `Access-Control-Allow-*` headers so browsers permit cross-origin API calls. Configure allowed origins, methods, and credentials explicitly — never use `*` with credentials.

**Example:**
```javascript
import cors from 'cors';
app.use(cors({
  origin: 'https://shop.example.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

---
### 98. helmet?

**Answer:** Helmet sets secure HTTP response headers — Content-Security-Policy, X-Frame-Options, HSTS, etc. It reduces common web vulnerabilities with sensible defaults. Apply early in the middleware stack.

**Example:**
```javascript
import helmet from 'helmet';
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'"] }
}));
```

---
### 99. morgan?

**Answer:** Morgan is HTTP request logging middleware for Express. It logs method, URL, status, and response time — invaluable in development and production debugging. Use `combined` format for production logs.

**Example:**
```javascript
import morgan from 'morgan';
app.use(morgan('dev')); // GET /api/orders 200 12.345 ms - 1024
```

---
### 100. body-parser?

**Answer:** body-parser historically parsed JSON, URL-encoded, and raw bodies for Express. Since Express 4.16+, `express.json()` and `express.urlencoded()` are built-in replacements. Legacy apps may still import body-parser directly.

**Example:**
```javascript
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
// Legacy: import bodyParser from 'body-parser';
// app.use(bodyParser.json());
```

---
### 101. JWT?

**Answer:** JSON Web Tokens are compact, signed tokens encoding claims (user ID, roles) for stateless authentication. Structure: header.payload.signature. Verify signature with a secret or public key; never store secrets in the payload.

**Example:**
```javascript
import jwt from 'jsonwebtoken';
const token = jwt.sign({ userId: 'u1', role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '15m' });
const payload = jwt.verify(token, process.env.JWT_SECRET);
```

---
### 102. JWT auth flow?

**Answer:** Client sends credentials; server validates and returns JWT. Client stores token and sends `Authorization: Bearer <token>` on subsequent requests. Server verifies signature and expiry on each protected route.

**Example:**
```javascript
// Login
app.post('/api/auth/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash)))
    return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ accessToken: signToken(user) });
});
```

---
### 103. Access vs refresh token?

**Answer:** Access tokens are short-lived (minutes) and sent with every API request. Refresh tokens are long-lived, stored securely (httpOnly cookie), and used only to obtain new access tokens. This limits exposure if an access token is stolen.

**Example:**
```javascript
app.post('/api/auth/refresh', (req, res) => {
  const refresh = req.cookies.refreshToken;
  const payload = jwt.verify(refresh, process.env.REFRESH_SECRET);
  res.json({ accessToken: signAccessToken(payload.userId) });
});
```

---
### 104. bcrypt?

**Answer:** bcrypt hashes passwords with a salt and configurable work factor (rounds), making brute-force attacks expensive. Never store plain-text passwords. Compare with `bcrypt.compare()` — timing-safe.

**Example:**
```javascript
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash('MyP@ssw0rd', 12);
const valid = await bcrypt.compare('MyP@ssw0rd', hash);
console.log(valid); // true
```

---
### 105. Session-based auth?

**Answer:** Session auth stores user state server-side (memory, Redis, DB) and sends a session ID via cookie. The server looks up the session on each request. Stateful but easy to revoke; requires sticky sessions or shared store when scaling.

**Example:**
```javascript
import session from 'express-session';
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.post('/login', (req, res) => { req.session.userId = user.id; res.json({ ok: true }); });
```

---
### 106. OAuth 2.0?

**Answer:** OAuth 2.0 is an authorization framework letting users grant third-party apps limited access without sharing passwords — e.g., Login with Google. Flows include authorization code (most secure for SPAs with PKCE), client credentials for machine-to-machine.

**Example:**
```javascript
// Redirect user to Google, receive code, exchange for tokens
// GET /auth/google/callback?code=...
const tokens = await exchangeCodeForTokens(code);
const profile = await fetchGoogleProfile(tokens.access_token);
```

---
### 107. Rate limiting?

**Answer:** Rate limiting restricts requests per IP, user, or API key over a time window. It prevents abuse, brute-force attacks, and protects downstream services. Use `express-rate-limit` with Redis store for distributed apps.

**Example:**
```javascript
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);
app.use('/api/auth/login', rateLimit({ windowMs: 60000, max: 5 }));
```

---
### 108. Input validation?

**Answer:** Validate and sanitize all external input — body, params, query, headers. Libraries like Zod, Joi, and express-validator define schemas and return 400 on failure. Never trust client data for security decisions.

**Example:**
```javascript
import { z } from 'zod';
const orderSchema = z.object({ userId: z.string().uuid(), items: z.array(z.object({ sku: z.string(), qty: z.number().int().positive() })).min(1) });
app.post('/api/orders', (req, res) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
});
```

---
### 109. Environment variables?

**Answer:** Environment variables configure apps per environment without hardcoding secrets. Access via `process.env`. Use `.env` locally with `dotenv`; in production inject via Docker, K8s secrets, or cloud config. Never commit secrets.

**Example:**
```javascript
import 'dotenv/config';
const port = process.env.PORT || 3000;
const dbUri = process.env.MONGODB_URI;
if (!dbUri) throw new Error('MONGODB_URI required');
```

---
### 110. 12-factor app?

**Answer:** The twelve-factor methodology guides scalable SaaS apps: one codebase, config in env, backing services as attachments, stateless processes, dev/prod parity, logs as streams, and disposable processes. Node APIs in 2026 should follow these for cloud deployment.

**Example:**
```bash
# Factor III: Config in environment
# Factor VI: Stateless — session in Redis, not memory
# Factor IX: Graceful shutdown (see Q119)
# Factor XI: Logs to stdout — console.log picked up by Docker
```

---
### 111. Streams?

**Answer:** Streams process data in chunks instead of loading everything into memory. Types: Readable, Writable, Duplex, Transform. Essential for large file uploads, CSV exports, and proxying responses.

**Example:**
```javascript
import { createReadStream, createWriteStream } from 'node:fs';
createReadStream('large-orders.csv')
  .pipe(createWriteStream('backup-orders.csv'));
```

---
### 112. pipeline()?

**Answer:** `stream.pipeline` connects streams with automatic error propagation and cleanup. Prefer it over `.pipe()` chains to handle errors and destroy streams correctly on failure.

**Example:**
```javascript
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';
import { createReadStream, createWriteStream } from 'node:fs';
await pipeline(
  createReadStream('orders.json'),
  createGzip(),
  createWriteStream('orders.json.gz')
);
```

---
### 113. Buffer?

**Answer:** Buffers are fixed-length raw binary allocations for file I/O, crypto, and network protocols. Node 22+ also promotes `Uint8Array` in many APIs. Use `Buffer.from()` and `buf.toString('utf8')` for encoding conversion.

**Example:**
```javascript
import { Buffer } from 'node:buffer';
const buf = Buffer.from('SGVsbG8=', 'base64');
console.log(buf.toString('utf8')); // Hello
const sig = Buffer.alloc(32);
crypto.randomFillSync(sig);
```

---
### 114. EventEmitter?

**Answer:** Node's `EventEmitter` implements the observer pattern — `on`/`emit` for pub/sub within a process. Many Node core modules inherit from EventEmitter (streams, HTTP server). Useful for decoupled domain events.

**Example:**
```javascript
import { EventEmitter } from 'node:events';
const orders = new EventEmitter();
orders.on('created', (order) => console.log('Notify warehouse:', order.id));
orders.emit('created', { id: 'ORD-1', total: 99 });
```

---
### 115. fs module?

**Answer:** The `fs` module provides file system operations — read, write, rename, watch. Promises API (`fs/promises`) is preferred over callbacks; avoid sync methods in servers. Essential for config files, uploads, and logs.

**Example:**
```javascript
import { readFile, writeFile } from 'node:fs/promises';
const config = JSON.parse(await readFile('./config.json', 'utf8'));
await writeFile('./output.json', JSON.stringify({ exported: true }));
```

---
### 116. Sync vs async fs?

**Answer:** Synchronous fs methods (`readFileSync`) block the event loop until complete. Asynchronous methods yield control during I/O. Never use sync fs in production request handlers — it kills throughput under load.

**Example:**
```javascript
// BAD in request handler:
// const data = readFileSync('./huge.json');

// GOOD:
import { readFile } from 'node:fs/promises';
const data = await readFile('./orders.json', 'utf8');
```

---
### 117. path module?

**Answer:** The `path` module handles cross-platform file paths — `join`, `resolve`, `dirname`, `extname`, `basename`. Always use it instead of string concatenation to avoid Windows/Unix slash issues.

**Example:**
```javascript
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, 'uploads', 'products');
```

---
### 118. os module?

**Answer:** The `os` module exposes operating system info — platform, CPU cores, total/free memory, hostname, network interfaces. Useful for health checks, worker sizing, and diagnostics.

**Example:**
```javascript
import os from 'node:os';
console.log(os.platform(), os.cpus().length, 'cores');
console.log(Math.round(os.freemem() / 1024 / 1024), 'MB free');
```

---
### 119. crypto module?

**Answer:** Node's `crypto` provides hashing (SHA-256), HMAC, encryption, random bytes, and key derivation. Use for password hashing (bcrypt preferred), API signatures, and secure tokens — not for rolling your own crypto protocols.

**Example:**
```javascript
import { createHash, randomBytes } from 'node:crypto';
const hash = createHash('sha256').update('order-123').digest('hex');
const apiKey = randomBytes(32).toString('hex');
```

---
### 120. http module?

**Answer:** The built-in `http` module creates low-level HTTP servers and clients. Express builds on top of it. Use directly when you need minimal overhead or custom protocol handling without framework abstractions.

**Example:**
```javascript
import http from 'node:http';
http.get('http://localhost:3000/api/health', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(JSON.parse(data)));
});
```

---
### 121. cluster module?

**Answer:** The `cluster` module forks worker processes sharing the same server port, utilizing multiple CPU cores for HTTP throughput. The primary distributes connections; workers run independent V8 isolates.

**Example:**
```javascript
import cluster from 'node:cluster';
import os from 'node:os';
if (cluster.isPrimary) {
  for (let i = 0; i < os.cpus().length; i++) cluster.fork();
} else {
  startServer(); // each worker listens on same port
}
```

---
### 122. Worker Threads?

**Answer:** Worker Threads run JavaScript in parallel threads within the same process, sharing memory via `SharedArrayBuffer` or message passing. Ideal for CPU-bound tasks — image resizing, PDF generation, heavy JSON parsing.

**Example:**
```javascript
import { Worker, isMainThread, workerData } from 'node:worker_threads';
if (isMainThread) {
  new Worker(new URL(import.meta.url), { workerData: { orders: 10000 } });
} else {
  console.log('Process', workerData.orders, 'orders in worker');
}
```

---
### 123. Cluster vs Worker Threads?

**Answer:** Cluster forks separate processes — best for scaling HTTP servers across cores with isolation. Worker Threads share one process — best for CPU-heavy tasks with lower overhead. Choose based on workload: I/O scaling vs CPU parallelism.

**Example:**
```javascript
// HTTP API scaling → cluster (or PM2 cluster mode)
// Image processing on upload → Worker Thread with sharp
```

---
### 124. PM2?

**Answer:** PM2 is a production process manager for Node — auto-restart on crash, cluster mode, log management, and zero-downtime reloads. It keeps apps alive and is common in VPS deployments before Kubernetes.

**Example:**
```bash
# Start API with 4 instances, auto-restart
pm2 start src/index.js -i 4 --name shop-api
pm2 logs shop-api
pm2 reload shop-api
```

---
### 125. nodemon?

**Answer:** nodemon watches source files and automatically restarts Node on changes. It is a development-only tool — never use in production. Speeds up the edit-save-test loop for API development.

**Example:**
```json
// package.json
{ "scripts": { "dev": "nodemon src/index.js" } }
// npm run dev — restarts on file save
```

---
### 126. uncaughtException?

**Answer:** The `uncaughtException` event fires on synchronous errors not caught by try/catch. Best practice: log, close resources, and exit — the process may be in an undefined state. Do not rely on continuing normal operation.

**Example:**
```javascript
process.on('uncaughtException', (err) => {
  console.error('FATAL:', err);
  process.exit(1); // let PM2/K8s restart
});
```

---
### 127. unhandledRejection?

**Answer:** `unhandledRejection` occurs when a Promise rejects without `.catch` or try/catch in async. Node may terminate in future versions. Always handle Promise rejections; use global handler as safety net.

**Example:**
```javascript
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});
// Always: await with try/catch or .catch()
```

---
### 128. Graceful shutdown?

**Answer:** Graceful shutdown stops accepting new connections, finishes in-flight requests, closes DB pools, then exits on SIGTERM/SIGINT. Required for zero-downtime deploys and Kubernetes pod termination.

**Example:**
```javascript
const server = app.listen(3000);
process.on('SIGTERM', async () => {
  server.close(() => console.log('HTTP closed'));
  await mongoose.connection.close();
  process.exit(0);
});
```

---
### 129. Connection pooling?

**Answer:** Connection pooling maintains a cache of reusable database connections instead of opening one per request. Mongoose and native drivers pool by default. Tune `maxPoolSize` based on load and DB limits.

**Example:**
```javascript
await mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 50,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 5000
});
```

---
### 130. REST API?

**Answer:** REST (Representational State Transfer) uses HTTP methods on resource URLs with stateless requests and standard status codes. Resources are nouns; actions are verbs in HTTP method. JSON is the typical representation format.

**Example:**
```javascript
// RESTful order API
// GET    /api/orders       — list
// GET    /api/orders/:id   — get one
// POST   /api/orders       — create
// PATCH  /api/orders/:id   — partial update
// DELETE /api/orders/:id   — delete
```

---
### 131. REST vs GraphQL?

**Answer:** REST exposes multiple endpoints with fixed response shapes. GraphQL uses one endpoint where clients query exactly the fields needed. REST is simpler and cache-friendly; GraphQL reduces over-fetching but adds complexity.

**Example:**
```javascript
// REST: GET /api/products/1 → full product object
// GraphQL:
// query { product(id: "1") { name price reviews { rating } } }
```

---
### 132. Status codes 200, 201, 400, 401, 403, 404, 500?

**Answer:** 200 OK — success with body. 201 Created — resource created. 400 Bad Request — invalid input. 401 Unauthorized — authentication required. 403 Forbidden — authenticated but not allowed. 404 Not Found — resource missing. 500 Internal Server Error — server fault.

**Example:**
```javascript
app.post('/api/orders', (req, res) => res.status(201).json({ id: 'O1' }));
app.get('/api/orders/:id', (req, res) => res.status(404).json({ error: 'Not found' }));
// 401 vs 403: no token vs token but wrong role
```

---
### 133. Idempotency?

**Answer:** An idempotent operation produces the same result when repeated — critical for retries and network failures. GET, PUT, DELETE are idempotent; POST is not. Use idempotency keys for payment and order creation APIs.

**Example:**
```javascript
// PUT /api/carts/1  { items: [...] } — same result if sent twice
// POST /api/orders — creates duplicate without idempotency key
app.post('/api/orders', async (req, res) => {
  const existing = await Order.findOne({ idempotencyKey: req.headers['idempotency-key'] });
  if (existing) return res.json(existing);
});
```

---
### 134. WebSocket?

**Answer:** WebSocket provides a full-duplex persistent TCP connection after an HTTP upgrade handshake. Unlike polling, both client and server can push messages anytime. Ideal for live order tracking and chat.

**Example:**
```javascript
import { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ port: 8080 });
wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'ORDER_UPDATE', status: 'shipped' }));
});
```

---
### 135. Socket.io?

**Answer:** Socket.io is a real-time library built on WebSockets with fallbacks, rooms, namespaces, and reconnection. It simplifies broadcasting — order status to a user room, admin dashboard updates.

**Example:**
```javascript
import { Server } from 'socket.io';
const io = new Server(httpServer);
io.on('connection', (socket) => {
  socket.join(`user:${socket.userId}`);
  io.to('user:u1').emit('order:shipped', { orderId: 'O1' });
});
```

---
### 136. Redis?

**Answer:** Redis is an in-memory data store used for caching, session storage, rate limiting, pub/sub, and job queues. It is extremely fast with optional persistence. Common pairing: Node API + Redis cache + MongoDB primary store.

**Example:**
```javascript
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);
const cached = await redis.get('product:42');
if (!cached) {
  const product = await Product.findById(42).lean();
  await redis.setex('product:42', 300, JSON.stringify(product));
}
```

---
### 137. Caching strategy?

**Answer:** Cache-aside: app checks cache, on miss loads DB and populates cache. Write-through writes to cache and DB together. Set TTLs to balance freshness vs load. Invalidate on updates to avoid stale product prices.

**Example:**
```javascript
async function getProduct(id) {
  const key = `product:${id}`;
  let data = await redis.get(key);
  if (data) return JSON.parse(data);
  data = await db.products.findOne({ _id: id });
  await redis.setex(key, 600, JSON.stringify(data));
  return data;
}
```

---
### 138. multer?

**Answer:** Multer is Express middleware for handling `multipart/form-data` file uploads. It parses files into memory or disk storage with size limits and filtering. Always validate file types and scan uploads in production.

**Example:**
```javascript
import multer from 'multer';
const upload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 } });
app.post('/api/products/:id/image', upload.single('image'), (req, res) => {
  res.json({ filename: req.file.filename });
});
```

---
### 139. sharp?

**Answer:** Sharp is a high-performance Node image library using libvips for resize, crop, format conversion, and compression. Process uploads before storing to S3 — generate thumbnails and WebP variants.

**Example:**
```javascript
import sharp from 'sharp';
await sharp('uploads/original.jpg')
  .resize(400, 400, { fit: 'cover' })
  .webp({ quality: 80 })
  .toFile('uploads/thumb.webp');
```

---
### 140. child_process?

**Answer:** The `child_process` module spawns shell commands or other executables from Node. Use `spawn` for streaming output, `exec` for buffered results. Useful for git hooks, ffmpeg, or legacy CLI tools.

**Example:**
```javascript
import { spawn } from 'node:child_process';
const child = spawn('mongodump', ['--uri', process.env.MONGODB_URI, '--out', './backup']);
child.stdout.on('data', (d) => console.log(d.toString()));
```

---
### 141. REPL?

**Answer:** The Node REPL (Read-Eval-Print Loop) is an interactive shell for experimenting with JavaScript. Run `node` with no arguments to enter it. Useful for quick API tests and debugging snippets.

**Example:**
```bash
$ node
> const total = [10, 20, 30].reduce((a,b) => a+b, 0)
> total
60
> .exit
```

---
### 142. __dirname vs import.meta.url?

**Answer:** In CommonJS, `__dirname` is the current module's directory path. ESM has no `__dirname` — derive it from `import.meta.url` using `fileURLToPath`. Required for resolving relative file paths in ES modules.

**Example:**
```javascript
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '.env');
```

---
### 143. Semantic versioning?

**Answer:** Semver uses MAJOR.MINOR.PATCH: MAJOR for breaking changes, MINOR for backward-compatible features, PATCH for bug fixes. npm ranges like `^5.0.0` allow minor/patch updates. Understand lockfiles pin exact resolved versions.

**Example:**
```json
// package.json: "express": "^5.1.0"
// ^5.1.0 allows >=5.1.0 <6.0.0
// ~5.1.0 allows >=5.1.0 <5.2.0
// 5.1.0  — exact pin
```

---
### 144. package-lock.json?

**Answer:** `package-lock.json` records the exact dependency tree resolved at install time, ensuring reproducible builds across machines and CI. Commit it to version control. Use `npm ci` in CI/Docker for deterministic installs.

**Example:**
```bash
# CI pipeline
npm ci          # installs exact versions from lock file
npm test
npm run build
```

---
### 145. MVC in Node?

**Answer:** MVC separates Model (data/business logic), View (presentation — often JSON in APIs), and Controller (request handling). In Express APIs, controllers handle routes, models are Mongoose schemas, views may be omitted or serve SSR templates.

**Example:**
```javascript
// controllers/orderController.js
export async function createOrder(req, res) {
  const order = await OrderService.create(req.body);
  res.status(201).json(order);
}
// routes → controller → service → model
```

---
### 146. Dependency injection?

**Answer:** Dependency injection passes dependencies (DB, services, config) into modules rather than hardcoding them. It improves testability — inject mocks in unit tests. Manual DI or containers like Awilix are common in Node.

**Example:**
```javascript
// Manual DI
export function createOrderController(orderService) {
  return {
    async create(req, res) {
      const order = await orderService.create(req.body);
      res.status(201).json(order);
    }
  };
}
```

---
### 147. API versioning?

**Answer:** API versioning preserves backward compatibility when breaking changes ship. Strategies: URL path (`/api/v1`), header (`Accept-Version`), or query param. URL versioning is most visible and common in REST APIs.

**Example:**
```javascript
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);
// v2 may return { data: order, meta: {} } while v1 returns flat order
```

---
### 148. Health check?

**Answer:** Health endpoints (`GET /health` or `/ready`) report service status for load balancers and Kubernetes probes. Liveness checks if the process runs; readiness checks if it can serve traffic (DB connected).

**Example:**
```javascript
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
app.get('/ready', async (req, res) => {
  const dbOk = mongoose.connection.readyState === 1;
  res.status(dbOk ? 200 : 503).json({ db: dbOk ? 'connected' : 'down' });
});
```

---
### 149. Docker with Node?

**Answer:** Docker containerizes Node apps for consistent environments from dev to production. Use multi-stage builds, non-root user, `npm ci --omit=dev`, and `.dockerignore`. Alpine or distroless images reduce attack surface.

**Example:**
```dockerfile
# Dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
USER node
EXPOSE 3000
CMD ["node", "src/index.js"]
```

---
### 150. process.nextTick vs setImmediate vs setTimeout (Node)?

**Answer:** `process.nextTick` runs before the event loop continues — highest priority microtask-like callback in Node. `setImmediate` runs in the **check** phase, after I/O callbacks. `setTimeout` runs in the **timers** phase. Order matters for interview questions: sync code → `nextTick` → Promises → `setImmediate` → `setTimeout(0)`.

**Example:**
```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
setImmediate(() => console.log('3'));
Promise.resolve().then(() => console.log('4'));
process.nextTick(() => console.log('5'));
console.log('6');
// Typical: 1, 6, 5, 4, 2, 3 (timers vs immediate order can vary)
```

---
### 151. Node.js event loop — six phases?

**Answer:** Node's loop has: **timers** (setTimeout/setInterval), **pending callbacks**, **idle/prepare**, **poll** (I/O), **check** (setImmediate), **close callbacks**. Between phases, `process.nextTick` and microtasks run. This is why Node handles thousands of concurrent connections without thousands of threads.

**Example:**
```text
Incoming HTTP request
  → poll phase receives socket data
  → callback runs your Express handler (async)
  → await mongoose.find() yields to poll
  → DB response returns → handler resumes
  → response sent → loop continues
```

---
### 152. XSS and CSRF — how does Node prevent them?

**Answer:** **XSS** (Cross-Site Scripting): attacker injects script — prevent by escaping output, CSP headers (helmet), sanitizing HTML input. **CSRF** (Cross-Site Request Forgery): forged requests from another site — prevent with SameSite cookies, CSRF tokens for cookie-based sessions, or use JWT in Authorization header (not auto-sent by browser).

**Example:**
```javascript
import helmet from 'helmet';
app.use(helmet()); // CSP, X-Content-Type-Options, etc.

// JWT in header — not vulnerable to CSRF like cookie sessions
res.setHeader('Set-Cookie', 'session=...; HttpOnly; Secure; SameSite=Strict');
```

---
### 153. asyncHandler wrapper in Express?

**Answer:** Async route handlers that throw rejections bypass Express unless wrapped. `asyncHandler` catches Promise rejections and forwards to error middleware via `next(err)`. Cleaner than try/catch in every route.

**Example:**
```javascript
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.get('/api/orders/:id', asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new NotFoundError('Order');
  res.json(order);
}));
```

---
### 154. gzip compression middleware?

**Answer:** Compress HTTP responses to reduce bandwidth and latency. `compression` middleware negotiates `gzip`/`deflate` via `Accept-Encoding`. Apply before routes; skip tiny responses. Often handled at Nginx/CDN in production too.

**Example:**
```javascript
import compression from 'compression';
app.use(compression()); // before routes
app.get('/api/products', async (req, res) => {
  const products = await Product.find().lean();
  res.json(products); // automatically compressed if client accepts
});
```

---
### 155. npm scripts — what are they for?

**Answer:** Scripts in `package.json` define repeatable commands (`start`, `dev`, `test`, `build`). Run with `npm run <script>`. `pre` and `post` hooks automate setup/teardown. Standardize team workflows and CI pipelines.

**Example:**
```json
{
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js",
    "test": "jest --coverage",
    "lint": "eslint src/",
    "prestart": "node scripts/check-env.js"
  }
}
```

---
### 156. express.static and serving uploads?

**Answer:** `express.static` serves files from a directory — public assets, uploaded images. Set cache headers in production; never serve sensitive files. Prefer S3/CDN for user uploads at scale.

**Example:**
```javascript
import path from 'path';
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1d',
  index: false,
}));
// GET /uploads/avatar-123.jpg
```

---
### 157. Semver — caret (^) vs tilde (~)?

**Answer:** `^1.2.3` allows minor and patch updates (`>=1.2.3 <2.0.0`). `~1.2.3` allows only patch (`>=1.2.3 <1.3.0`). `package-lock.json` pins exact versions for reproducible installs. Run `npm audit` regularly.

**Example:**
```json
{
  "dependencies": {
    "express": "^4.21.0",
    "mongoose": "~8.12.0"
  }
}
// npm install respects lock file in CI
```

---

---

## MongoDB (158–225)

### 158. What is MongoDB?

**Answer:** MongoDB is a document-oriented NoSQL database storing flexible JSON-like BSON documents in collections. It scales horizontally via sharding and offers rich querying, aggregation, and indexing. Popular for Node.js apps needing schema flexibility.

**Example:**
```javascript
// Document in orders collection
{
  "_id": ObjectId("..."),
  "userId": ObjectId("..."),
  "items": [{ "sku": "KB-01", "qty": 2, "price": 75 }],
  "status": "paid",
  "createdAt": ISODate("2026-06-18")
}
```

---
### 159. SQL vs NoSQL?

**Answer:** SQL databases use tables, fixed schemas, and JOINs with strong ACID guarantees. NoSQL (MongoDB) uses flexible documents, embeds related data, and prioritizes horizontal scale and developer velocity. Choose SQL for complex relations and transactions; MongoDB for flexible, document-shaped data.

**Example:**
```javascript
// SQL: users JOIN orders JOIN order_items — normalized
// MongoDB: order embeds items array — one read for checkout receipt
```

---
### 160. Document?

**Answer:** A document is MongoDB's basic data unit — a BSON object similar to JSON with support for nested objects and arrays. Documents in a collection can have different shapes (schemaless), though application-level schemas are recommended.

**Example:**
```javascript
db.products.insertOne({
  name: "Mechanical Keyboard",
  price: 129.99,
  specs: { switches: "Cherry MX", backlight: true },
  tags: ["gaming", "mechanical"]
});
```

---
### 161. Collection?

**Answer:** A collection is a grouping of documents, analogous to a SQL table but without enforced uniform schema. Collections are created implicitly on first insert. Name them in plural lowercase convention: `users`, `orders`, `products`.

**Example:**
```javascript
db.createCollection("orders");
db.orders.insertMany([
  { userId: ObjectId("..."), total: 99 },
  { userId: ObjectId("..."), total: 149, coupon: "SAVE10" }
]);
```

---
### 162. _id?

**Answer:** Every MongoDB document requires a unique `_id` field, auto-generated as `ObjectId` if omitted. ObjectId embeds a timestamp and is indexable. Custom `_id` values are allowed but must be unique within the collection.

**Example:**
```javascript
db.users.insertOne({ name: "Alice", email: "alice@shop.com" });
// _id: ObjectId("665a1b2c3d4e5f6789012345") auto-created
```

---
### 163. BSON?

**Answer:** BSON (Binary JSON) is MongoDB's binary storage format extending JSON with types like `Date`, `ObjectId`, `Decimal128`, and `Binary`. It is faster to parse than JSON and type-rich for application data.

**Example:**
```javascript
// BSON types in shell
db.orders.insertOne({
  _id: ObjectId(),
  amount: NumberDecimal("99.99"),
  createdAt: new Date(),
  receipt: BinData(0, "base64data")
});
```

---
### 164. Mongoose?

**Answer:** Mongoose is an ODM (Object Document Mapper) for MongoDB in Node.js providing schemas, validation, middleware, and query helpers. It adds structure to schemaless MongoDB while preserving flexibility.

**Example:**
```javascript
import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, min: 0 }
});
const Product = mongoose.model('Product', productSchema);
```

---
### 165. Schema vs Model?

**Answer:** A Mongoose Schema defines document structure, types, validators, and defaults. A Model is a compiled Schema class providing CRUD methods (`find`, `create`, `save`). One schema compiles to one model per connection.

**Example:**
```javascript
const userSchema = new Schema({ email: String, name: String });
const User = mongoose.model('User', userSchema); // Model
await User.create({ email: 'bob@shop.com', name: 'Bob' });
```

---
### 166. Embedding vs referencing?

**Answer:** Embedding stores related data inside a parent document. Referencing stores an `ObjectId` pointing to another collection. Embedding reduces reads; referencing avoids duplication and unbounded growth.

**Example:**
```javascript
// Embed: product with reviews inside
{ name: "Laptop", reviews: [{ rating: 5, text: "Great" }] }
// Reference: order points to user
{ userId: ObjectId("..."), total: 199 }
```

---
### 167. When embed vs reference?

**Answer:** Embed when data is small, bounded, and read together (order line items, address on user). Reference when data is large, unbounded, shared across documents, or updated independently (user on many orders).

**Example:**
```javascript
// Embed: order.items — always fetched with order, bounded
// Reference: order.userId — user profile shared across orders
// Reference: product.reviews if millions of reviews per product
```

---
### 168. find() vs findOne()?

**Answer:** `find()` returns a Query yielding an array (or cursor) — zero or more documents. `findOne()` returns a single document or `null`. Use `find` for lists; `findOne` for unique lookups by email or `_id`.

**Example:**
```javascript
const pending = await Order.find({ status: 'pending' });
const user = await User.findOne({ email: 'alice@shop.com' });
console.log(pending.length, user?.name);
```

---
### 169. .lean()?

**Answer:** `.lean()` returns plain JavaScript objects instead of Mongoose documents — faster and lower memory for read-only queries. Skip lean when you need document methods, virtuals, or `.save()` on results.

**Example:**
```javascript
const products = await Product.find({ category: 'electronics' })
  .select('name price')
  .lean();
// products[0] is plain object — no .save()
```

---
### 170. .select()?

**Answer:** `.select()` projects specific fields, reducing data transfer. Include fields by name or exclude with `-`. Combines with queries for efficient list endpoints returning only needed columns.

**Example:**
```javascript
const users = await User.find()
  .select('name email -_id')
  .lean();
// Only name and email returned
```

---
### 171. .populate()?

**Answer:** `.populate()` replaces stored `ObjectId` references with documents from other collections — like a join. Specify path and optional select/populate nested paths. Can cause N+1 if overused; consider aggregation `$lookup` for complex joins.

**Example:**
```javascript
const order = await Order.findById(orderId)
  .populate('userId', 'name email')
  .populate('items.productId', 'name price');
console.log(order.userId.name);
```

---
### 172. $set, $push, $inc?

**Answer:** `$set` updates field values. `$push` appends to arrays. `$inc` atomically increments numbers. These update operators avoid read-modify-write races and are preferred over replacing whole documents.

**Example:**
```javascript
db.orders.updateOne(
  { _id: orderId },
  {
    $set: { status: 'shipped' },
    $push: { trackingEvents: { status: 'in_transit', at: new Date() } },
    $inc: { shipmentCount: 1 }
  }
);
```

---
### 173. $pull?

**Answer:** `$pull` removes array elements matching a condition. `$pullAll` removes specific values. Essential for cart operations — remove an item from `cart.items` without loading the full document into application code.

**Example:**
```javascript
db.carts.updateOne(
  { userId },
  { $pull: { items: { sku: 'MOUSE-01' } } }
);
```

---
### 174. Upsert?

**Answer:** Upsert (update + insert) applies update if a matching document exists, otherwise inserts a new one. Set `{ upsert: true }` on `updateOne`. Useful for idempotent sync, settings, and inventory counters.

**Example:**
```javascript
db.inventory.updateOne(
  { sku: 'KB-01' },
  { $inc: { stock: -1 }, $set: { lastSold: new Date() } },
  { upsert: true }
);
```

---
### 175. Index?

**Answer:** Indexes are B-tree data structures speeding queries at the cost of write overhead and storage. Create indexes on fields used in `find`, `sort`, and `$match`. The `_id` index exists by default.

**Example:**
```javascript
db.orders.createIndex({ userId: 1, createdAt: -1 });
// Speeds: db.orders.find({ userId }).sort({ createdAt: -1 })
```

---
### 176. Compound index?

**Answer:** A compound index includes multiple fields — order matters for query patterns. It supports queries on prefix fields. Put equality fields first, then sort/range fields for optimal index use.

**Example:**
```javascript
db.orders.createIndex({ status: 1, createdAt: -1 });
// Efficient: find({ status: 'pending' }).sort({ createdAt: -1 })
// Also uses index: find({ status: 'pending' })
```

---
### 177. Unique index?

**Answer:** A unique index enforces that indexed field values are distinct across documents. Duplicate inserts throw error code 11000. Use for emails, SKUs, and slugs.

**Example:**
```javascript
db.users.createIndex({ email: 1 }, { unique: true });
// Duplicate email insert → E11000 duplicate key error
```

---
### 178. TTL index?

**Answer:** TTL (Time To Live) indexes automatically delete documents after a specified seconds-since-field time. Use on `Date` fields for sessions, OTP codes, and temporary tokens.

**Example:**
```javascript
db.sessions.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 }
);
// Documents deleted ~1 hour after createdAt
```

---
### 179. Text index?

**Answer:** Text indexes support full-text search with `$text` and `$search`. One text index per collection combining multiple string fields. For advanced search in 2026, Atlas Search or Elasticsearch may be preferred.

**Example:**
```javascript
db.products.createIndex({ name: 'text', description: 'text' });
db.products.find({ $text: { $search: 'wireless headphones' } });
```

---
### 180. COLLSCAN vs IXSCAN?

**Answer:** COLLSCAN is a full collection scan — slow on large data. IXSCAN uses an index — fast targeted lookup. Always run `.explain('executionStats')` on slow queries and aim for IXSCAN with low `docsExamined`.

**Example:**
```javascript
db.orders.find({ status: 'pending' }).explain('executionStats');
// winningPlan.stage: 'IXSCAN' — good
// 'COLLSCAN' with docsExamined: 1000000 — add index
```

---
### 181. Aggregation pipeline?

**Answer:** The aggregation pipeline processes documents through stages — `$match`, `$group`, `$lookup`, etc. — like a data processing pipeline. More powerful than `find` for analytics, reports, and complex transforms.

**Example:**
```javascript
db.orders.aggregate([
  { $match: { status: 'paid', createdAt: { $gte: ISODate('2026-01-01') } } },
  { $group: { _id: '$userId', totalSpent: { $sum: '$total' }, orderCount: { $sum: 1 } } },
  { $sort: { totalSpent: -1 } },
  { $limit: 10 }
]);
```

---
### 182. $match?

**Answer:** `$match` filters documents like `find` — place it early to reduce documents flowing through later stages. It can use indexes when first in pipeline on a `$match`-only aggregation.

**Example:**
```javascript
db.orders.aggregate([
  { $match: { status: 'shipped', total: { $gte: 100 } } },
  { $group: { _id: null, avgTotal: { $avg: '$total' } } }
]);
```

---
### 183. $group?

**Answer:** `$group` groups documents by `_id` expression and accumulates with `$sum`, `$avg`, `$max`, `$push`, etc. Essential for sales reports, counts by category, and revenue dashboards.

**Example:**
```javascript
db.orders.aggregate([
  { $match: { status: 'paid' } },
  { $group: {
    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
    revenue: { $sum: '$total' },
    orders: { $sum: 1 }
  }}
]);
```

---
### 184. $lookup?

**Answer:** `$lookup` performs a left outer join to another collection — like SQL JOIN. Specify `from`, `localField`, `foreignField`, and `as`. Use for enriching orders with user details in one aggregation.

**Example:**
```javascript
db.orders.aggregate([
  { $match: { status: 'paid' } },
  { $lookup: {
    from: 'users', localField: 'userId', foreignField: '_id', as: 'user'
  }},
  { $unwind: '$user' },
  { $project: { total: 1, 'user.email': 1 } }
]);
```

---
### 185. $unwind?

**Answer:** `$unwind` deconstructs an array field, outputting one document per element. Preserves empty arrays optionally with `preserveNullAndEmptyArrays`. Needed before grouping on array fields.

**Example:**
```javascript
db.orders.aggregate([
  { $unwind: '$items' },
  { $group: { _id: '$items.sku', totalQty: { $sum: '$items.qty' } } }
]);
```

---
### 186. $project?

**Answer:** `$project` reshapes documents — include, exclude, rename, or compute fields. Use `$addFields` to add without removing others. Final stage for API response shaping.

**Example:**
```javascript
db.products.aggregate([
  { $project: {
    name: 1,
    priceWithTax: { $multiply: ['$price', 1.08] },
    _id: 0
  }}
]);
```

---
### 187. $sort and $limit?

**Answer:** `$sort` orders documents; `$limit` caps result count. Together they power top-N queries — best sellers, recent orders. Place after `$match`/`$group` and ensure supporting indexes exist.

**Example:**
```javascript
db.products.aggregate([
  { $match: { category: 'electronics' } },
  { $sort: { soldCount: -1 } },
  { $limit: 10 }
]);
```

---
### 188. Transaction?

**Answer:** MongoDB multi-document transactions provide ACID guarantees across multiple operations and collections. Requires replica set deployment. Use sessions with `startTransaction`, `commitTransaction`, `abortTransaction`.

**Example:**
```javascript
const session = await mongoose.startSession();
session.startTransaction();
try {
  await Inventory.updateOne({ sku }, { $inc: { stock: -1 } }, { session });
  await Order.create([{ sku, status: 'paid' }], { session });
  await session.commitTransaction();
} catch (e) {
  await session.abortTransaction();
  throw e;
} finally { session.endSession(); }
```

---
### 189. When transactions?

**Answer:** Use transactions when multiple documents must update atomically — inventory deduction + order creation, account transfers, double-entry ledger. Skip for single-document updates which are already atomic.

**Example:**
```javascript
// NEED transaction: decrement stock AND create order — both or neither
// SKIP transaction: single doc update { $set: { status: 'shipped' } }
```

---
### 190. Replica set?

**Answer:** A replica set is a group of MongoDB nodes — one primary (writes) and secondaries (replicate oplog). Automatic failover elects new primary on failure. Minimum three nodes for production (or PSA architecture).

**Example:**
```javascript
// Connection string with replica set
mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/shop?replicaSet=rs0
```

---
### 191. Sharding?

**Answer:** Sharding horizontally partitions data across multiple shards by a shard key. Each shard is a replica set. Enables write scaling and massive storage beyond single-server limits. Adds operational complexity.

**Example:**
```javascript
// sh.shardCollection('shop.orders', { userId: 1, createdAt: 1 })
// Routes queries by shard key — bad key causes scatter-gather
```

---
### 192. Shard key?

**Answer:** The shard key determines document distribution across shards. Choose high cardinality, even distribution, and alignment with common queries. A bad key (low cardinality like `status`) creates hotspots.

**Example:**
```javascript
// Good: { userId: 1, orderId: 1 } — even spread, query by user
// Bad: { status: 1 } — most orders 'completed', one chunk hot
```

---
### 193. Read preference?

**Answer:** Read preference controls which replica set members serve reads — `primary` (default), `primaryPreferred`, `secondary`, `nearest`. Secondaries may return slightly stale data; use for analytics, not checkout.

**Example:**
```javascript
mongoose.connect(uri, { readPreference: 'secondaryPreferred' });
// Analytics dashboard reads from secondary — reduces primary load
```

---
### 194. Write concern?

**Answer:** Write concern specifies acknowledgment level before reporting success — `w: 1` (primary only), `w: 'majority'` (majority of replicas). Higher concern = durability; trade-off with latency.

**Example:**
```javascript
await Order.create({ total: 99 }, {
  writeConcern: { w: 'majority', wtimeout: 5000 }
});
```

---
### 195. Change stream?

**Answer:** Change streams watch real-time insert/update/delete/replace events on a collection or database. Built on the oplog; requires replica set. Powers live dashboards, cache invalidation, and event-driven sync.

**Example:**
```javascript
const stream = db.orders.watch([{ $match: { 'fullDocument.status': 'shipped' } }]);
stream.on('change', (change) => {
  console.log('Order shipped:', change.fullDocument._id);
});
```

---
### 196. Capped collection?

**Answer:** Capped collections have fixed size and automatically overwrite oldest documents when full — circular buffer. Insert-order natural sorting. Use for logs, metrics, and message queues with bounded retention.

**Example:**
```javascript
db.createCollection('api_logs', { capped: true, size: 10485760, max: 5000 });
db.api_logs.insertOne({ method: 'POST', path: '/api/orders', ms: 45 });
```

---
### 197. GridFS?

**Answer:** GridFS stores files exceeding BSON's 16MB limit by splitting into chunks in `fs.files` and `fs.chunks` collections. Use for product videos, large PDFs, and user uploads in MongoDB.

**Example:**
```javascript
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
const uploadStream = bucket.openUploadStream('product-demo.mp4');
```

---
### 198. Schema validation?

**Answer:** MongoDB collection-level validation enforces document shape with `$jsonSchema` rules. Rejects invalid inserts/updates. Complements Mongoose validation with database-enforced guarantees.

**Example:**
```javascript
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      required: ['email', 'name'],
      properties: {
        email: { bsonType: 'string', pattern: '^[\w.-]+@[\w.-]+\.\w+$' },
        age: { bsonType: 'int', minimum: 0 }
      }
    }
  }
});
```

---
### 199. Mongoose hooks?

**Answer:** Mongoose middleware (hooks) runs pre/post logic on operations — `save`, `validate`, `findOneAndUpdate`. Use for password hashing, timestamps, audit logs, and cascading updates.

**Example:**
```javascript
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.passwordHash = await bcrypt.hash(this.password, 12);
  this.password = undefined;
});
```

---
### 200. Virtual property?

**Answer:** Virtuals are computed properties on Mongoose documents not persisted to MongoDB. Defined on schema with `.virtual()` and optional `.get()`. Included in `toJSON` with `{ virtuals: true }`.

**Example:**
```javascript
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});
const u = await User.findOne();
console.log(u.fullName); // not stored in DB
```

---
### 201. Pagination?

**Answer:** Offset pagination uses `skip` and `limit` — simple but slow for large offsets. Always sort consistently (usually by `_id` or `createdAt`). Return total count separately if needed for UI page numbers.

**Example:**
```javascript
const page = 2, limit = 20;
const orders = await Order.find({ userId })
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();
```

---
### 202. Cursor-based pagination?

**Answer:** Cursor pagination uses the last item's sort key (`_id` or `createdAt`) as a cursor instead of `skip`. Constant-time performance at any depth. Standard for infinite scroll and large datasets.

**Example:**
```javascript
const limit = 20;
const cursor = req.query.after; // last seen _id
const query = cursor
  ? { _id: { $lt: cursor } }
  : {};
const orders = await Order.find(query).sort({ _id: -1 }).limit(limit).lean();
const nextCursor = orders.at(-1)?._id;
```

---
### 203. $regex?

**Answer:** `$regex` performs pattern matching on strings. Case-insensitive search with `$options: 'i'`. Slow on large collections without index — prefer text index, Atlas Search, or prefix regex `^term` with index.

**Example:**
```javascript
// Avoid: { name: { $regex: 'phone', $options: 'i' } } — COLLSCAN
// Better: db.products.find({ $text: { $search: 'phone' } })
db.users.find({ email: { $regex: '^alice', $options: 'i' } });
```

---
### 204. Atlas?

**Answer:** MongoDB Atlas is the managed cloud database service — automated backups, monitoring, scaling, and global clusters. Free tier available. Preferred over self-hosting for most production Node apps in 2026.

**Example:**
```bash
# Connection via Atlas dashboard
MONGODB_URI=mongodb+srv://admin:PASSWORD@cluster0.abc.mongodb.net/shop?retryWrites=true&w=majority
```

---
### 205. Connection string?

**Answer:** The connection string (URI) specifies protocol, credentials, hosts, database, and options. `mongodb+srv://` resolves DNS seedlist for Atlas. Include `retryWrites`, `w=majority`, and app name for observability.

**Example:**
```javascript
await mongoose.connect(
  'mongodb+srv://user:pass@cluster.mongodb.net/shop?retryWrites=true&w=majority&appName=shop-api'
);
```

---
### 206. Connection pooling?

**Answer:** Mongoose maintains a pool of reusable TCP connections to MongoDB. Default `maxPoolSize` is 100. One `mongoose.connect()` per process; do not connect per request. Tune pool size vs application concurrency.

**Example:**
```javascript
// Single connect at startup
await mongoose.connect(uri, { maxPoolSize: 50, minPoolSize: 10 });
// Reuse connection across all requests in the process
```

---
### 207. Denormalization?

**Answer:** Denormalization duplicates data across documents to avoid joins and speed reads. Trade storage and sync complexity for query performance. Common in MongoDB — embed product name on order items at purchase time.

**Example:**
```javascript
// Denormalized order item — price at time of purchase
{ items: [{ sku: 'KB-01', name: 'Keyboard', price: 75, qty: 1 }] }
// Product price can change; order keeps historical price
```

---
### 208. Bucket pattern?

**Answer:** The bucket pattern groups high-volume time-series events into documents with arrays or sub-documents per time bucket (hour, day). Reduces document count for IoT, logs, and sensor data.

**Example:**
```javascript
// One doc per device per hour instead of one per reading
{
  deviceId: 'sensor-1',
  bucket: ISODate('2026-06-18T14:00:00Z'),
  readings: [{ t: ISODate('...'), temp: 22.1 }, { t: ISODate('...'), temp: 22.3 }]
}
```

---
### 209. Outlier pattern?

**Answer:** The outlier pattern handles documents that grow far larger than average — e.g., a product with millions of reviews. Store the common case efficiently and move outlier data to a separate collection.

**Example:**
```javascript
// Normal product: embed last 20 reviews
// Outlier bestseller: { productId, reviewIds: [...] } in product_reviews collection
```

---
### 210. $elemMatch?

**Answer:** `$elemMatch` queries array elements matching multiple conditions on the same element. Without it, MongoDB may match conditions across different array elements.

**Example:**
```javascript
db.orders.find({
  items: { $elemMatch: { sku: 'KB-01', qty: { $gte: 2 } } }
});
// Matches only if SAME item has sku KB-01 AND qty >= 2
```

---
### 211. Partial index?

**Answer:** Partial indexes index only documents matching a `partialFilterExpression`. Smaller index, faster writes, ideal for sparse conditions — e.g., only index `status: 'pending'` orders.

**Example:**
```javascript
db.orders.createIndex(
  { createdAt: 1 },
  { partialFilterExpression: { status: 'pending' } }
);
```

---
### 212. Sparse index?

**Answer:** Sparse indexes include only documents where the indexed field exists. Useful for optional unique fields — multiple docs can omit the field without violating uniqueness.

**Example:**
```javascript
db.users.createIndex({ phone: 1 }, { unique: true, sparse: true });
// Many users without phone — not indexed, no duplicate conflict
```

---
### 213. $geoNear?

**Answer:** `$geoNear` finds documents near a geographic point, sorted by distance. Requires a `2dsphere` index on a GeoJSON location field. Powers store locators and delivery radius features.

**Example:**
```javascript
db.stores.createIndex({ location: '2dsphere' });
db.stores.aggregate([
  { $geoNear: {
    near: { type: 'Point', coordinates: [-97.74, 30.27] },
    distanceField: 'distanceMeters',
    maxDistance: 5000,
    spherical: true
  }}
]);
```

---
### 214. Backup strategy?

**Answer:** Production backup strategies include Atlas continuous cloud backup with point-in-time recovery, scheduled `mongodump` to object storage, and testing restores regularly. 3-2-1 rule: 3 copies, 2 media types, 1 offsite.

**Example:**
```bash
# Atlas: enable Cloud Backup in cluster settings
# Self-hosted cron:
mongodump --uri="$MONGODB_URI" --gzip --archive=backup-$(date +%F).gz
```

---
### 215. E-commerce schema?

**Answer:** E-commerce schemas typically reference users and products, embed order line items with snapshot prices, and index by `userId + createdAt`. Reviews may embed on products or reference based on volume.

**Example:**
```javascript
// users: { email, passwordHash, addresses: [...] }
// products: { name, price, category, avgRating }
// orders: { userId, items: [{ productId, name, price, qty }], status, total }
// indexes: orders({ userId: 1, createdAt: -1 }), products({ category: 1, price: 1 })
```

---
### 216. Duplicate key error?

**Answer:** MongoDB error code 11000 indicates a unique index violation — duplicate email, SKU, or slug. Catch in application code and return HTTP 409 Conflict with a clear message.

**Example:**
```javascript
try {
  await User.create({ email: 'alice@shop.com' });
} catch (err) {
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Email already registered' });
  }
  throw err;
}
```

---
### 217. MongoDB best practices 2026?

**Answer:** Design schema around query patterns, index early based on `.explain()`, use `.lean()` for read-heavy APIs, avoid unbounded arrays, use transactions for multi-doc consistency, prefer cursor pagination at scale, monitor slow queries in Atlas, and validate at app + DB level.

**Example:**
```javascript
// Checklist
// ✓ Compound indexes match filter + sort
// ✓ Project only needed fields
// ✓ Connection pool tuned, single mongoose.connect()
// ✓ w: 'majority' for critical writes
// ✓ Atlas alerts on opLatencies and connections
```

---

---
### 218. NoSQL injection in MongoDB?

**Answer:** Passing unvalidated user objects directly into queries allows operators like `$gt`, `$ne` in login bypass. Always validate types, whitelist fields, and cast inputs. Never use `$where` with user strings. Use Mongoose schema + `strict: true`.

**Example:**
```javascript
// VULNERABLE — req.body = { email: { $gt: "" }, password: { $gt: "" } }
User.findOne(req.body);

// SAFE
const { email, password } = req.body;
if (typeof email !== 'string' || typeof password !== 'string')
  return res.status(400).json({ error: 'Invalid input' });
User.findOne({ email: email.toLowerCase().trim() });
```

---
### 219. MongoDB query operators — $or, $and, $in, $nin, $exists?

**Answer:** Logical operators combine conditions: `$or`, `$and`, `$nor`. `$in` / `$nin` match membership in arrays. `$exists` checks field presence. Combine with indexes on filtered fields for performance.

**Example:**
```javascript
// Active customers who bought electronics OR spent > 500
db.orders.find({
  $and: [
    { status: 'completed' },
    { $or: [
        { category: { $in: ['electronics', 'gadgets'] } },
        { total: { $gt: 500 } }
    ]}
  ]
});

db.users.find({ phone: { $exists: true, $nin: [null, ''] } });
```

---
### 220. findByIdAndUpdate pitfalls and runValidators?

**Answer:** By default `findByIdAndUpdate` does **not** run schema validators or middleware (`save` hooks). Use `{ runValidators: true, new: true }` to validate and return updated doc. For hooks, use `doc.save()` or `findOne` + modify + save.

**Example:**
```javascript
// Skips validators — can save invalid email
await User.findByIdAndUpdate(id, { email: 'not-an-email' });

// Correct
await User.findByIdAndUpdate(
  id,
  { email: 'alice@shop.com' },
  { new: true, runValidators: true }
);
```

---
### 221. Soft delete pattern in MongoDB?

**Answer:** Instead of `deleteOne`, set `deletedAt: new Date()` or `isDeleted: true`. Filter it out in queries. Enables audit trails and recovery. Add partial index on active records for performance.

**Example:**
```javascript
orderSchema.add({ deletedAt: { type: Date, default: null } });

orderSchema.statics.findActive = function (filter) {
  return this.find({ ...filter, deletedAt: null });
};

async function softDelete(id) {
  await Order.findByIdAndUpdate(id, { deletedAt: new Date() });
}
```

---
### 222. Mongoose static vs instance methods?

**Answer:** **Instance methods** live on documents (`order.save()`, custom `order.getTotal()`). **Static methods** live on the Model (`Order.findByStatus('shipped')`). Statics for query helpers; instances for per-document behavior.

**Example:**
```javascript
orderSchema.methods.getTotal = function () {
  return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
};

orderSchema.statics.findByStatus = function (status) {
  return this.find({ status }).sort('-createdAt');
};

const order = await Order.findById(id);
order.getTotal();
await Order.findByStatus('shipped');
```

---
### 223. Mongoose timestamps option?

**Answer:** `{ timestamps: true }` auto-adds `createdAt` and `updatedAt` on create/update. Replaces manual `Date.now()` in hooks. Useful for sorting, auditing, and TTL patterns.

**Example:**
```javascript
const orderSchema = new mongoose.Schema(
  { userId: ObjectId, total: Number, status: String },
  { timestamps: true }
);
// { createdAt: ISODate(...), updatedAt: ISODate(...), ... }
```

---
### 224. bulkWrite in MongoDB?

**Answer:** `bulkWrite` executes multiple insert/update/delete/replace operations in one round trip — faster than individual calls. Supports ordered (stop on error) or unordered (parallel) execution.

**Example:**
```javascript
await Product.bulkWrite([
  { insertOne: { document: { sku: 'A1', name: 'Phone', price: 699 } } },
  { updateOne: { filter: { sku: 'B2' }, update: { $inc: { stock: -1 } } } },
  { deleteOne: { filter: { sku: 'DISCONTINUED' } } },
], { ordered: false });
```

---
### 225. Optimistic concurrency with __v (version key)?

**Answer:** Mongoose adds `__v` by default. On concurrent updates, check version to prevent lost updates — if `__v` changed since read, reject the write. Alternative: use transactions or atomic operators (`$inc`) instead of read-modify-write.

**Example:**
```javascript
const product = await Product.findById(id);
product.stock -= 1;
product.__v; // e.g. 3

// Another request updated first — __v is now 4
await product.save(); // VersionError on conflict

// Better for inventory
await Product.updateOne({ _id: id, stock: { $gte: 1 } }, { $inc: { stock: -1 } });
```

---

# Part II — Senior — System Design & Architecture

## Senior Addendum — Node.js in the Real World & AI Era (226–305)

> Senior topics for **5+ years**: system design, TypeScript, testing, SQL, cloud, architecture, **AI/LLM integration**, and behavioral rounds. In 2026, senior Node interviews expect you to ship APIs *and* integrate AI safely at scale.

---

## System Design & Scalability (226–240)

### 226. How do you approach a system design interview?

**Answer:** Clarify requirements (functional + non-functional), estimate scale (DAU, QPS, storage), draw high-level boxes (client → LB → API → cache → DB → queue), then deep-dive on bottlenecks. State tradeoffs explicitly — consistency vs availability, cost vs latency. For Node.js roles, emphasize async I/O, stateless APIs, and horizontal scaling behind a load balancer.

**Example:**
```text
URL Shortener — clarify:
  • 100M URLs/month, 10:1 read:write
  • p99 redirect < 50ms
  • 7-year retention
Boxes: CDN → Nginx → Node cluster → Redis cache → MongoDB (hash → url)
Deep dive: base62 ID generation, cache-aside, collision handling
```

---

### 227. Design a rate-limited public REST API.

**Answer:** Use a token bucket or sliding window in Redis keyed by `apiKey` or IP. Return `429 Too Many Requests` with `Retry-After`. Separate limits per tier (free vs paid). Log abuse patterns. Node layer stays stateless; Redis holds counters with TTL.

**Example:**
```javascript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

app.use('/api/', rateLimit({
  store: new RedisStore({ sendCommand: (...args) => redis.sendCommand(args) }),
  windowMs: 60_000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));
```

---

### 228. Cache-aside vs write-through vs read-through?

**Answer:** **Cache-aside:** app reads cache first, on miss loads DB and populates cache — most common in Node. **Write-through:** write goes to cache and DB together — strong consistency, slower writes. **Read-through:** cache layer loads from DB on miss — app only talks to cache. Choose based on stale-data tolerance and write frequency.

**Example:**
```javascript
async function getProduct(id) {
  const cached = await redis.get(`product:${id}`);
  if (cached) return JSON.parse(cached);
  const product = await Product.findById(id).lean();
  if (product) await redis.setEx(`product:${id}`, 300, JSON.stringify(product));
  return product;
}
```

---

### 229. When would you choose MongoDB vs PostgreSQL?

**Answer:** MongoDB fits flexible schemas, document-heavy models, horizontal sharding, and rapid iteration (catalogs, IoT, content). PostgreSQL fits strict relations, ACID-heavy finance, complex joins, reporting, and mature tooling. Many production systems use **both** — Postgres for transactions/ledger, Mongo for product catalog or logs.

**Example:**
```text
E-commerce 2026 split:
  • Postgres: orders, payments, inventory ledger (ACID)
  • MongoDB: product catalog, reviews, search metadata
  • Redis: cart sessions, rate limits
  • Sync via events (order placed → update analytics in Mongo)
```

---

### 230. What is horizontal vs vertical scaling?

**Answer:** Vertical scaling adds CPU/RAM to one machine — simpler but has a ceiling. Horizontal scaling adds more machines behind a load balancer — required at scale, needs stateless apps and shared stores (Redis, DB). Node cluster/PM2 uses multiple cores; Kubernetes scales pods across nodes.

**Example:**
```javascript
// Stateless API — safe to scale horizontally
// ❌ in-memory session map breaks with 2+ instances
// ✅ session in Redis; JWT or sticky-less design
```

---

### 231. Load balancer — what does it do for Node APIs?

**Answer:** Distributes traffic across healthy instances, terminates TLS, may handle sticky sessions, and performs health checks. Use round-robin or least-connections. Combine with graceful shutdown (Q119) so draining connections don't get cut mid-request.

**Example:**
```nginx
upstream node_api {
  least_conn;
  server 10.0.1.10:3000;
  server 10.0.1.11:3000;
}
server {
  listen 443 ssl;
  location / { proxy_pass http://node_api; proxy_http_version 1.1; }
}
```

---

### 232. Message queue — why use one in Node backends?

**Answer:** Decouple producers from consumers, absorb traffic spikes, retry failed work, and run long tasks off the HTTP path. Use for emails, webhooks, image processing, AI batch jobs. RabbitMQ, AWS SQS, or BullMQ (Redis-backed) are common with Node.

**Example:**
```javascript
import { Queue, Worker } from 'bullmq';

const emailQueue = new Queue('emails', { connection: { host: 'redis' } });
await emailQueue.add('welcome', { userId: 'u1' }, { attempts: 3, backoff: { type: 'exponential', delay: 2000 } });

new Worker('emails', async (job) => sendWelcomeEmail(job.data.userId), { connection: { host: 'redis' } });
```

---

### 233. Idempotency at scale — how?

**Answer:** Clients send an `Idempotency-Key` header; server stores key + result in Redis/DB for 24h. Duplicate requests return the same response without re-charging or re-creating resources. Critical for payments and webhooks.

**Example:**
```javascript
app.post('/api/payments', async (req, res) => {
  const key = req.headers['idempotency-key'];
  if (!key) return res.status(400).json({ error: 'Idempotency-Key required' });
  const existing = await redis.get(`idem:${key}`);
  if (existing) return res.status(200).json(JSON.parse(existing));
  const payment = await charge(req.body);
  await redis.setEx(`idem:${key}`, 86400, JSON.stringify(payment));
  res.status(201).json(payment);
});
```

---

### 234. CAP theorem — practical meaning?

**Answer:** In a network partition, you choose between **Consistency** (all nodes see same data) and **Availability** (every request gets a response). Partition tolerance is assumed in distributed systems. MongoDB with `w: majority` leans CP; Redis cache leans AP with TTL staleness. Explain tradeoffs, don't recite blindly.

**Example:**
```text
Payment service during partition → prefer consistency (reject writes)
Product catalog CDN cache → availability + eventual consistency OK
```

---

### 235. Design real-time notifications (WebSocket + scale).

**Answer:** Clients connect via WebSocket (Socket.io or ws). Use Redis pub/sub or a dedicated message bus so any API instance can publish to users connected on other instances. Store offline notifications in DB; deliver on reconnect.

**Example:**
```javascript
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const io = new Server(httpServer);
const pub = createClient({ url: process.env.REDIS_URL });
const sub = pub.duplicate();
await Promise.all([pub.connect(), sub.connect()]);
io.adapter(createAdapter(pub, sub));

io.on('connection', (socket) => {
  socket.join(`user:${socket.userId}`);
});
// Any instance: io.to(`user:${userId}`).emit('notification', payload);
```

---

### 236. CDN — when and why?

**Answer:** Serve static assets (JS bundles, images, videos) from edge locations close to users. Reduces origin load and latency. Use signed URLs for private content. Node API still handles dynamic JSON; CDN handles cacheable files with long `Cache-Control`.

**Example:**
```javascript
// S3 + CloudFront — upload via sharp, serve via CDN URL
res.json({ imageUrl: `https://d111111.cloudfront.net/products/${id}.webp` });
```

---

### 237. Database connection pooling at scale?

**Answer:** Each Node process holds a pool of DB connections. Too many pods × too large a pool exhausts DB `max_connections`. Tune pool size per instance (often 5–20), use PgBouncer for Postgres, monitor active connections in Atlas/RDS.

**Example:**
```javascript
mongoose.connect(uri, { maxPoolSize: 10, minPoolSize: 2, serverSelectionTimeoutMS: 5000 });
// 8 pods × 10 = 80 connections — stay under DB limit
```

---

### 238. Saga pattern for distributed transactions?

**Answer:** When a business operation spans multiple services/DBs without a single ACID transaction, use a **saga**: a sequence of local transactions with compensating actions on failure. Orchestration (central coordinator) or choreography (events). Common in microservices order flows.

**Example:**
```text
Place order saga:
  1. Reserve inventory ✓
  2. Charge payment ✗ → compensate: release inventory
Choreography: order.created → payment service listens → payment.failed → inventory release
```

---

### 239. Circuit breaker pattern?

**Answer:** Stop calling a failing downstream service after a threshold; fail fast and optionally return fallback. Prevents cascade failures. Libraries: `opossum`, resilience patterns in NestJS. States: closed → open → half-open.

**Example:**
```javascript
import CircuitBreaker from 'opossum';

const breaker = new CircuitBreaker(callPaymentGateway, { timeout: 3000, errorThresholdPercentage: 50, resetTimeout: 30000 });
breaker.fallback(() => ({ status: 'pending', message: 'Payment queued for retry' }));
await breaker.fire(paymentPayload);
```

---

### 240. Design a webhook delivery system.

**Answer:** Store events, enqueue delivery jobs with retries (exponential backoff), sign payloads (HMAC-SHA256), verify partner endpoints, log delivery status. Use idempotency keys on receiver side. Never block HTTP request on webhook delivery — always async via queue.

**Example:**
```javascript
import crypto from 'crypto';

function signPayload(body, secret) {
  return crypto.createHmac('sha256', secret).update(JSON.stringify(body)).digest('hex');
}
await webhookQueue.add('deliver', { url, body, signature: signPayload(body, secret) }, { attempts: 5 });
```

---

## TypeScript for Node.js (241–250)

### 241. Why TypeScript for senior Node roles in 2026?

**Answer:** TypeScript catches bugs at compile time, improves IDE navigation/refactoring, documents APIs via types, and is the default in NestJS, many enterprise codebases, and AI SDK typings (OpenAI, Vercel AI SDK). Seniors are expected to design types, not just add `: any`.

**Example:**
```typescript
interface CreateOrderDto {
  userId: string;
  items: Array<{ productId: string; qty: number }>;
}
async function createOrder(dto: CreateOrderDto): Promise<Order> { /* ... */ }
```

---

### 242. interface vs type alias?

**Answer:** `interface` supports declaration merging and `extends`; preferred for object shapes and public APIs. `type` supports unions, intersections, mapped types, and tuples. Use `type` for unions like `Result = Success | Error`.

**Example:**
```typescript
type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

interface User { id: string; email: string; }
interface AdminUser extends User { role: 'admin'; permissions: string[]; }
```

---

### 243. Generics in Node APIs?

**Answer:** Generics write reusable functions/classes while preserving type relationships. Essential for repositories, paginated responses, and typed HTTP clients.

**Example:**
```typescript
interface Paginated<T> { items: T[]; nextCursor: string | null; }

async function findPage<T>(model: Model<T>, cursor?: string, limit = 20): Promise<Paginated<T>> {
  const filter = cursor ? { _id: { $gt: cursor } } : {};
  const items = await model.find(filter).limit(limit + 1).lean();
  const hasMore = items.length > limit;
  return { items: hasMore ? items.slice(0, limit) : items, nextCursor: hasMore ? items[limit - 1]._id : null };
}
```

---

### 244. Utility types — Pick, Omit, Partial, Required?

**Answer:** Transform existing types without duplication. `Pick<User, 'id'|'email'>` for public profile; `Partial<User>` for PATCH updates; `Omit<User, 'passwordHash'>` for safe responses.

**Example:**
```typescript
type PublicUser = Omit<User, 'passwordHash'>;
type UpdateUserDto = Partial<Pick<User, 'name' | 'avatarUrl'>>;
```

---

### 245. Type narrowing and discriminated unions?

**Answer:** Narrow types with `typeof`, `in`, or a shared literal field (`kind` / `type`). Discriminated unions make switch/if exhaustive and safe — ideal for event handlers and API result parsing.

**Example:**
```typescript
type PaymentEvent =
  | { type: 'paid'; orderId: string; amount: number }
  | { type: 'failed'; orderId: string; reason: string };

function handle(event: PaymentEvent) {
  if (event.type === 'paid') console.log(event.amount);
  else console.log(event.reason);
}
```

---

### 246. strict mode in tsconfig?

**Answer:** Enable `strict: true` (includes `strictNullChecks`, `noImplicitAny`, etc.). Forces handling `null`/`undefined`, eliminates silent `any`. Senior interviews expect you to defend strict settings in CI.

**Example:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

---

### 247. Typing Express req/res?

**Answer:** Extend Express types for authenticated user, validated body, and route params. Use generics on handlers or module augmentation.

**Example:**
```typescript
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
  }
}

app.get('/api/me', (req, res) => {
  const userId = req.user?.id;
  res.json({ userId });
});
```

---

### 248. Zod / class-validator for runtime validation?

**Answer:** TypeScript types disappear at runtime. Validate external input (req.body, env vars, LLM JSON) with Zod or class-validator. Infer TS types from Zod schemas — single source of truth.

**Example:**
```typescript
import { z } from 'zod';

const CreateProduct = z.object({ name: z.string().min(1), price: z.number().positive(), sku: z.string().regex(/^[A-Z0-9-]+$/) });
type CreateProduct = z.infer<typeof CreateProduct>;

app.post('/products', (req, res) => {
  const parsed = CreateProduct.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
});
```

---

### 249. ESM + TypeScript in Node?

**Answer:** Node 20+ supports `"type": "module"` with `.ts` via tsx/ts-node or compile to `.js`. Use `import.meta.url` for `__dirname` equivalent. Align `module`/`moduleResolution` in tsconfig with Node16/NodeNext.

**Example:**
```typescript
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
```

---

### 250. NestJS vs Express — when which?

**Answer:** Express is minimal and flexible — great for small/medium APIs and teams that want full control. NestJS adds structure (modules, DI, guards, pipes), TypeScript-first design, and scales well in large teams. Seniors should know both; many enterprises standardize on NestJS.

**Example:**
```typescript
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateOrderDto) { return this.ordersService.create(dto); }
}
```

---

## Testing & Quality (251–257)

### 251. Test pyramid for Node APIs?

**Answer:** Many unit tests (pure functions, services with mocks), fewer integration tests (Supertest + test DB), minimal E2E (critical flows). Fast feedback in CI; E2E catches wiring bugs. Avoid testing implementation details.

**Example:**
```text
Unit: price calculation, JWT helpers, Zod schemas
Integration: POST /api/orders → 201 + DB row
E2E: login → add to cart → checkout (Playwright or Postman Newman)
```

---

### 252. Jest + Supertest integration test?

**Answer:** Spin up Express app (or import `app` without `listen`), use Supertest to HTTP-call routes, use a test MongoDB (memory server or Docker) or mock repositories. Reset DB between tests.

**Example:**
```javascript
import request from 'supertest';
import { app } from '../app.js';

test('POST /api/products creates product', async () => {
  const res = await request(app).post('/api/products').send({ name: 'Cable', price: 12, sku: 'CBL-001' });
  expect(res.status).toBe(201);
  expect(res.body.sku).toBe('CBL-001');
});
```

---

### 253. Mocking external services?

**Answer:** Mock HTTP clients (nock, msw), payment gateways, and LLM APIs in tests — never hit real APIs in CI. Inject dependencies so services accept interfaces/mocks (DI pattern).

**Example:**
```javascript
import nock from 'nock';
nock('https://api.stripe.com').post('/v1/charges').reply(200, { id: 'ch_test', status: 'succeeded' });
```

---

### 254. Contract testing?

**Answer:** Verify API consumer and provider agree on request/response shape without full E2E. Pact or OpenAPI diff in CI. Critical when mobile/frontend teams consume your Node API independently.

**Example:**
```text
Provider (Node): publish OpenAPI spec artifact in CI
Consumer: breaking change detector fails PR if response schema changes
```

---

### 255. CI pipeline essentials for Node?

**Answer:** On every PR: `npm ci`, lint, typecheck (`tsc --noEmit`), unit/integration tests, optional security audit (`npm audit`, Snyk). On main: build Docker image, deploy to staging, smoke test health endpoint.

**Example:**
```yaml
- run: npm ci
- run: npm run lint && npm run typecheck && npm test
- run: docker build -t api:${{ github.sha }} .
```

---

### 256. Code review — what seniors look for?

**Answer:** Correctness, security (injection, auth bypass), error handling, observability, test coverage on critical paths, N+1 queries, missing indexes, breaking API changes, and whether AI-generated code was validated (hallucinated APIs, leaked secrets).

**Example:**
```text
Review checklist:
  ✓ Input validated at boundary
  ✓ Secrets not in code
  ✓ Errors logged with correlation ID, not swallowed
  ✓ DB queries indexed / .lean() on reads
```

---

### 257. Technical debt — how do you manage it?

**Answer:** Track debt explicitly (tickets, ADRs), allocate ~15–20% sprint capacity, prioritize debt that blocks features or causes incidents. Refactor in small PRs with tests. Explain tradeoffs to product — "fast now vs slow later."

**Example:**
```text
STAR story prep: "We had no integration tests on checkout — after two outages,
I added Supertest suite + staging gate; deploy confidence went up, incidents dropped."
```

---

## PostgreSQL & Polyglot Data (258–263)

### 258. Why PostgreSQL alongside MongoDB?

**Answer:** Postgres handles relational integrity, complex joins, window functions, and strong ACID for money, inventory, and audit trails. Use Mongo for flexible documents; Postgres when invariants and reports matter.

**Example:**
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id TEXT NOT NULL,
  qty INT CHECK (qty > 0),
  unit_price NUMERIC(12,2) NOT NULL
);
```

---

### 259. Indexes in PostgreSQL?

**Answer:** B-tree default for equality/range; GIN for JSONB/full-text; partial indexes for filtered queries. Run `EXPLAIN ANALYZE` to verify index use — avoid sequential scans on large tables.

**Example:**
```sql
CREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC);
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = '...' ORDER BY created_at DESC LIMIT 20;
```

---

### 260. Transactions and isolation levels?

**Answer:** Postgres default is READ COMMITTED. Use explicit transactions for multi-step financial ops. SERIALIZABLE prevents anomalies but costs performance. Match isolation to business risk.

**Example:**
```javascript
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [100, fromId]);
  await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [100, toId]);
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
} finally {
  client.release();
}
```

---

### 261. N+1 query problem?

**Answer:** Loading a list then querying related data in a loop causes N+1 DB round-trips. Fix with JOIN, `$lookup`, `.populate()` with lean, DataLoader batching, or eager loading. Common interview red flag in ORM code.

**Example:**
```javascript
// ❌ N+1
const orders = await Order.find();
for (const o of orders) o.user = await User.findById(o.userId);

// ✅ one query
const orders = await Order.find().populate('userId').lean();
```

---

### 262. Database migrations?

**Answer:** Version schema changes with tools like `node-pg-migrate`, Knex, Prisma Migrate, or Flyway. Never manual prod edits. Backward-compatible migrations (expand → migrate data → contract) enable zero-downtime deploys.

**Example:**
```javascript
exports.up = (pgm) => pgm.addColumn('users', 'display_name', { type: 'text' });
```

---

### 263. Read replicas?

**Answer:** Primary handles writes; replicas serve read-heavy traffic with replication lag (eventual consistency). Route analytics/reporting to replica; critical reads from primary. MongoDB read preferences (Q176) follow similar logic.

**Example:**
```javascript
const writePool = new Pool({ connectionString: process.env.DATABASE_PRIMARY_URL });
const readPool = new Pool({ connectionString: process.env.DATABASE_REPLICA_URL });
```

---

## DevOps, Cloud & Observability (264–271)

### 264. 12-factor app — senior interpretation?

**Answer:** Beyond the list (Q101): treat logs as event streams, config in env, stateless processes, disposability (fast startup), dev/prod parity. In 2026 add: health/readiness probes, structured JSON logs, and secrets from vault — not `.env` in prod images.

**Example:**
```javascript
import pino from 'pino';
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
logger.info({ orderId, userId, latencyMs }, 'order_created');
```

---

### 265. Docker multi-stage build for Node?

**Answer:** Build stage installs deps and compiles TS; runtime stage copies only production deps and dist — smaller, more secure image. Run as non-root user.

**Example:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci && COPY . . && npm run build

FROM node:20-alpine
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER nodejs
CMD ["node", "dist/server.js"]
```

---

### 266. Kubernetes basics for Node developers?

**Answer:** Deploy containerized API as Deployment (replicas), expose via Service, ingress for HTTPS, ConfigMap/Secret for env, liveness vs readiness probes. HPA scales on CPU/request rate. Understand how your pod runs — you don't need to be a K8s admin.

**Example:**
```yaml
readinessProbe:
  httpGet: { path: /health/ready, port: 3000 }
livenessProbe:
  httpGet: { path: /health/live, port: 3000 }
```

---

### 267. AWS services commonly paired with Node?

**Answer:** **Lambda** (serverless APIs), **ECS/Fargate** (containers), **S3** (files), **SQS/SNS** (queues), **RDS/Aurora** (Postgres), **ElastiCache** (Redis), **Secrets Manager**, **CloudWatch**. Know one cloud deeply; concepts transfer to GCP/Azure.

**Example:**
```javascript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
await s3.send(new PutObjectCommand({ Bucket: 'uploads', Key: key, Body: buffer }));
```

---

### 268. OpenTelemetry tracing in Node?

**Answer:** Trace requests across services with span IDs — see latency breakdown (HTTP → DB → Redis → external API). Export to Jaeger, Datadog, or Honeycomb. Essential for debugging microservices and slow LLM calls.

**Example:**
```javascript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
const sdk = new NodeSDK({ instrumentations: [getNodeAutoInstrumentations()] });
sdk.start();
```

---

### 269. Structured logging vs console.log?

**Answer:** Production uses JSON logs with timestamp, level, `correlationId`, `userId`, duration. Enables search and alerts in ELK/Datadog. Pass correlation ID from gateway or generate per request middleware.

**Example:**
```javascript
app.use((req, res, next) => {
  req.correlationId = req.headers['x-correlation-id'] || crypto.randomUUID();
  res.setHeader('x-correlation-id', req.correlationId);
  next();
});
```

---

### 270. Secrets management in production?

**Answer:** Never commit secrets. Use AWS Secrets Manager, HashiCorp Vault, or K8s Secrets (encrypted at rest). Inject at runtime; rotate regularly. Scan repos with gitleaks in CI.

**Example:**
```javascript
if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY missing');
```

---

### 271. Zero-downtime deployment?

**Answer:** Rolling updates: new pods start, pass readiness, old pods drain connections (graceful shutdown Q119). DB migrations must be backward compatible. Feature flags decouple deploy from release.

**Example:**
```javascript
process.on('SIGTERM', async () => {
  server.close(async () => { await mongoose.disconnect(); process.exit(0); });
  setTimeout(() => process.exit(1), 30_000).unref();
});
```

---

## Architecture & Production Patterns (272–279)

### 272. Monolith vs microservices?

**Answer:** Start monolith for speed; split when teams scale, deploy cadence conflicts, or domains need independent scaling. Microservices add network latency, distributed debugging, and ops overhead. Modular monolith is a 2026 sweet spot.

**Example:**
```text
Modular monolith: orders/, payments/, catalog/ — shared DB, clear boundaries
Extract payments microservice when PCI scope or team ownership demands it
```

---

### 273. Event-driven architecture?

**Answer:** Services communicate via events (order.placed, payment.captured) through Kafka, SNS/SQS, or Redis streams. Loose coupling; consumers scale independently. Requires idempotent handlers and dead-letter queues.

**Example:**
```javascript
await eventBus.publish('order.placed', { orderId, userId, total });
```

---

### 274. CQRS — when useful?

**Answer:** Command Query Responsibility Segregation separates write model from read-optimized views. Useful when read patterns differ heavily from writes (dashboards, search). Adds complexity — don't use for CRUD apps.

**Example:**
```text
Write: POST /orders → Postgres normalized tables
Read: GET /dashboard/sales → pre-aggregated Mongo collection updated by events
```

---

### 275. API Gateway pattern?

**Answer:** Single entry point for auth, rate limiting, routing, TLS termination, and request logging. Kong, AWS API Gateway, or Nginx. Backend services stay internal.

**Example:**
```text
Client → API Gateway (JWT verify, rate limit) → /orders → orders-service:3001
```

---

### 276. Dependency injection in Node?

**Answer:** Pass dependencies (DB, cache, logger) into constructors/factories instead of importing singletons — enables testing and swapping implementations. NestJS has built-in DI; manual DI works in Express.

**Example:**
```javascript
class OrderService {
  constructor({ orderRepo, paymentClient, logger }) {
    this.orderRepo = orderRepo;
    this.paymentClient = paymentClient;
    this.logger = logger;
  }
}
```

---

### 277. Feature flags?

**Answer:** Toggle features without redeploy — gradual rollout, A/B tests, kill switch for bad releases. LaunchDarkly, Unleash, or simple Redis/DB flags.

**Example:**
```javascript
if (await flags.isEnabled('new-checkout', { userId })) return newCheckoutFlow(req);
return legacyCheckout(req);
```

---

### 278. OWASP Top 10 — Node-relevant highlights?

**Answer:** Injection (NoSQL injection — sanitize query objects), broken auth (weak JWT secrets), SSRF (validate outbound URLs in webhooks/AI tools), security misconfiguration, vulnerable dependencies (`npm audit`). Use helmet, validation, parameterized queries.

**Example:**
```javascript
const email = String(req.body.email);
await User.findOne({ email }); // not req.body directly as query object
```

---

### 279. Performance profiling Node in production?

**Answer:** Use `--inspect`, clinic.js (doctor, flame, bubbleprof), heap snapshots for memory leaks, APM (Datadog/New Relic). Profile before optimizing — often DB indexes or missing cache, not JS CPU.

**Example:**
```bash
npx clinic doctor -- node dist/server.js
```

---

## AI Integration for Node.js Developers (280–293)

> In 2026, senior Node roles increasingly ask: *"How would you add AI to this API safely and affordably?"* This is production engineering around LLMs — not ML research.

---

### 280. How do LLM APIs fit in a Node backend?

**Answer:** Node acts as orchestration layer: validate input → retrieve context (RAG) → call LLM API (OpenAI, Anthropic, Azure OpenAI) → validate output → persist/log. Never expose API keys to clients; stream responses via SSE for chat UX.

**Example:**
```javascript
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/support/suggest-reply', async (req, res) => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: req.body.ticketText }],
    max_tokens: 500,
  });
  res.json({ suggestion: completion.choices[0].message.content });
});
```

---

### 281. What is RAG (Retrieval-Augmented Generation)?

**Answer:** RAG grounds LLM answers in your data: embed documents → store vectors → on query, retrieve top-k chunks → inject into prompt. Reduces hallucination vs raw LLM. Node handles ingestion pipeline, query API, and prompt assembly.

**Example:**
```javascript
const chunks = await vectorStore.similaritySearch(userQuestion, 5);
const context = chunks.map(c => c.text).join('\n---\n');
const prompt = `Answer using ONLY this context:\n${context}\n\nQuestion: ${userQuestion}`;
```

---

### 282. Vector databases — options with Node?

**Answer:** **MongoDB Atlas Vector Search** (if already on Atlas), **Pinecone**, **Weaviate**, **pgvector** (Postgres extension), **Qdrant**. Choose based on existing stack, latency, and ops appetite.

**Example:**
```javascript
const results = await collection.aggregate([
  { $vectorSearch: { index: 'embedding_index', path: 'embedding', queryVector: queryEmbedding, numCandidates: 100, limit: 5 } },
  { $project: { title: 1, text: 1, score: { $meta: 'vectorSearchScore' } } },
]).toArray();
```

---

### 283. Streaming LLM responses with SSE?

**Answer:** LLM tokens arrive incrementally — use Server-Sent Events or WebSocket to stream to client instead of waiting for full completion. Better UX for chat; handle client disconnect to stop burning tokens.

**Example:**
```javascript
app.post('/api/chat/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  const stream = await openai.chat.completions.create({ model: 'gpt-4o-mini', messages: req.body.messages, stream: true });
  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content || '';
    if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
  }
  res.write('data: [DONE]\n\n');
  res.end();
});
```

---

### 284. Prompt injection — how to defend?

**Answer:** Untrusted user input can manipulate LLM behavior ("ignore previous instructions"). Mitigate: separate system vs user roles, output validation, allowlists for tools/actions, never execute LLM-suggested code blindly, log prompts, limit tool permissions.

**Example:**
```javascript
const system = 'You are a support bot. Answer ONLY about our product. Refuse unrelated requests.';
// Never pass raw user text as system prompt
```

---

### 285. AI cost control in production?

**Answer:** Cache frequent queries (Redis), use smaller models for classification/routing and larger for generation, set `max_tokens`, rate-limit per user, track token usage per request, batch embeddings offline.

**Example:**
```javascript
const cacheKey = `llm:${hash(prompt)}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);
const result = await callLlm(prompt);
await redis.setEx(cacheKey, 3600, JSON.stringify(result));
```

---

### 286. Structured output from LLMs?

**Answer:** Ask for JSON and validate with Zod; use provider **JSON mode** or **function/tool calling** for reliable schemas. Never `JSON.parse` without validation — models hallucinate fields.

**Example:**
```javascript
const Schema = z.object({ sentiment: z.enum(['positive', 'neutral', 'negative']), summary: z.string().max(200) });
const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  response_format: { type: 'json_object' },
  messages: [{ role: 'user', content: `Classify review: "${review}"` }],
});
const parsed = Schema.safeParse(JSON.parse(completion.choices[0].message.content));
```

---

### 287. AI agents and tool calling in Node?

**Answer:** Agent loop: LLM decides which tools to call (search DB, send email, create ticket) → Node executes tool → feeds result back to LLM. Implement strict tool schemas, auth checks per tool, timeouts, and max iteration limits.

**Example:**
```javascript
const tools = [{
  type: 'function',
  function: {
    name: 'getOrderStatus',
    parameters: { type: 'object', properties: { orderId: { type: 'string' } }, required: ['orderId'] },
  },
}];
// On tool_call: verify user owns orderId before querying DB
```

---

### 288. Embeddings pipeline — Node responsibilities?

**Answer:** Chunk documents (500–1000 tokens), generate embeddings via API, upsert to vector store with metadata. Run as background job (BullMQ), not in request path. Re-embed on document update.

**Example:**
```javascript
const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 800, chunkOverlap: 100 });
const chunks = await splitter.splitText(documentText);
for (const chunk of chunks) {
  const embedding = await openai.embeddings.create({ model: 'text-embedding-3-small', input: chunk });
  await vectorCollection.insertOne({ text: chunk, embedding: embedding.data[0].embedding, docId });
}
```

---

### 289. LangChain / Vercel AI SDK — when to use?

**Answer:** SDKs abstract chains, memory, tools, and streaming. Use for rapid prototyping and standard patterns; seniors should understand underlying API calls. Vercel AI SDK excels at streaming; LangChain at composable pipelines. Raw SDK fine for simple cases.

**Example:**
```javascript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
const { text } = await generateText({ model: openai('gpt-4o-mini'), prompt: 'Summarize this ticket...' });
```

---

### 290. Evaluating AI features before ship?

**Answer:** Build eval set (50–200 golden Q&A pairs), measure accuracy/faithfulness/latency/cost offline. Regression test prompts on CI when changing models. Human review for high-risk domains.

**Example:**
```javascript
const evalCases = [{ input: 'Where is my order #123?', expectedContains: 'shipped' }];
for (const c of evalCases) {
  const out = await ragAnswer(c.input);
  console.log(out.includes(c.expectedContains) ? 'PASS' : 'FAIL', c.input);
}
```

---

### 291. PII and data privacy with LLMs?

**Answer:** Redact PII before sending to third-party LLMs, use enterprise agreements (zero retention), regional endpoints (Azure OpenAI in EU), audit logs of prompts/responses. Don't send full credit cards or health records to public APIs.

**Example:**
```javascript
function redactPii(text) {
  return text
    .replace(/\b[\w.-]+@[\w.-]+\.\w+\b/g, '[EMAIL]')
    .replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[CARD]');
}
```

---

### 292. Local vs cloud LLMs for Node?

**Answer:** Cloud APIs: best quality, no GPU ops, pay per token. Local (Ollama, vLLM): data privacy, no per-token cost, but ops burden. Hybrid: route sensitive data locally, general tasks to cloud.

**Example:**
```javascript
const local = new OpenAI({ baseURL: 'http://localhost:11434/v1', apiKey: 'ollama' });
const res = await local.chat.completions.create({ model: 'llama3.2', messages: [{ role: 'user', content: prompt }] });
```

---

### 293. How AI changes the senior Node developer role in 2026?

**Answer:** You're expected to integrate AI features (search, chat, summarization, classification), not train models. Core skills remain: API design, security, scaling, observability. Add: prompt engineering basics, RAG pipelines, cost/latency tradeoffs, eval discipline, and skepticism toward AI-generated code — **you** own production reliability.

**Example:**
```text
"I've shipped RAG over MongoDB Atlas Vector Search with BullMQ ingestion,
SSE streaming, Zod-validated tool calls, and Redis caching — p95 latency 800ms,
cost capped at $0.002/query via gpt-4o-mini routing."
```

---

## Behavioral & Leadership (294–300)

### 294. Tell me about a production incident you handled.

**Answer:** Use STAR: Situation, Task, Action, Result. Mention correlation IDs, logs, rollback, graceful degradation, and blameless postmortem.

**Example:**
```text
"S: Checkout 500s spiked after deploy. T: On-call lead. A: Traces showed Mongo pool exhausted;
rolled back; increased pool + added connection alert. R: MTTR 12 min, postmortem added staging load test."
```

---

### 295. How do you mentor junior developers?

**Answer:** Pair on PRs, assign scoped tasks with clear acceptance criteria, review with teaching comments, share runbooks. Measure growth by independence and code quality over time.

**Example:**
```text
"I gave them auth middleware with test cases first — reviewed security edge cases in 1:1.
Within 6 weeks they owned the whole users module."
```

---

### 296. Disagreement with product or manager on technical choice?

**Answer:** Data over opinions: prototype, estimate cost/risk, present options with tradeoffs. Accept decision once made unless safety/compliance is at stake.

**Example:**
```text
"Product wanted real-time LLM on every page load — I showed $40K/month projection;
we agreed on cached summaries + on-demand chat."
```

---

### 297. How do you estimate tasks?

**Answer:** Break into subtasks, compare to similar past work, add buffer for unknowns, state assumptions. Re-estimate when scope changes.

**Example:**
```text
"RAG MVP: ingestion (3d), vector index (1d), query API (2d), eval set (2d), hardening (2d) ≈ 2 weeks with buffer."
```

---

### 298. Code review conflict — how do you handle it?

**Answer:** Ask clarifying questions, focus on code not person, cite standards/docs, offer to pair. If stalemate, involve tech lead or spike. Document in ADR if architectural.

**Example:**
```text
"We paired on one endpoint, agreed repositories for testability, raw SQL only in reporting module."
```

---

### 299. Keeping up with tech (AI, Node releases)?

**Answer:** Curate inputs (official blogs, Node release notes), build small side experiments, share learnings in team tech talks. Depth on fundamentals beats chasing every framework.

**Example:**
```text
"Monthly: read Node release blog, test one feature in sandbox, run one AI eval experiment."
```

---

### 300. Why should we hire you as a senior Node developer?

**Answer:** Connect experience to their needs: shipped scalable APIs, owned incidents, mentored team, integrated AI safely, balanced speed and quality. Be specific — metrics, stack overlap.

**Example:**
```text
"6 years building Node APIs serving 2M req/day, Mongo + Postgres split, led TypeScript migration,
added RAG support desk cutting ticket time 30%. I write code that survives on-call."
```

---

## DSA & Coding Round Prep (301–305)

> Companies still run coding rounds at 6 years — often medium difficulty. These five questions frame **what** to practice alongside LeetCode.

---

### 301. What DSA topics matter most for Node backend roles?

**Answer:** Arrays/strings, hash maps, two pointers, BFS/DFS, trees, heaps (top-K), binary search, basic DP. Focus on clean code, complexity analysis, and explaining tradeoffs.

**Example:**
```text
Practice: Two Sum, Valid Parentheses, Merge Intervals, LRU Cache, Number of Islands, Top K Frequent, Flatten Nested List Iterator / implement flatten
Target: 40–60 medium problems with patterns recognized
```

---

### 302. How to communicate during live coding?

**Answer:** Repeat problem, clarify edge cases, propose approach + Big-O before coding, code incrementally, test with examples. Think aloud — silence hurts you.

**Example:**
```javascript
function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, k).map(([n]) => n);
}
```

---

### 303. Build vs buy — coding interview angle?

**Answer:** Sometimes asked as hybrid: implement rate limiter, LRU cache, task scheduler, or TTL cache. Classic patterns map to production components (Redis, BullMQ).

**Example:**
```text
"Implement a simple TTL cache" → Map + expiry timestamps + lazy eviction on get
```

---

### 304. Take-home assignment best practices?

**Answer:** Read requirements twice, deliver README with setup/run, include tests, don't over-engineer, document tradeoffs. For AI features: include eval notes and cost estimate.

**Example:**
```markdown
## README sections interviewers love
- Setup: npm ci && cp .env.example .env
- Tradeoffs: chose BullMQ over SQS because...
- If I had 2 more days: auth, rate limits, OpenTelemetry
```

---

### 305. Using AI tools (Cursor, Copilot) — interview honesty?

**Answer:** Many teams allow AI daily but expect you to understand generated code in interviews. Senior value: review, test, and fix AI output — not paste blindly.

**Example:**
```text
"I use AI for boilerplate and exploration, but I verify security, types, and tests manually."
```

---


---


---

# Part III — Specialized Stacks

## GraphQL (306–310)

### 306. GraphQL vs REST — when to choose GraphQL?

**Answer:** GraphQL lets clients request exactly the fields they need in one round-trip — great for mobile apps and varied frontends. REST is simpler to cache (HTTP), easier to monitor, and fits CRUD microservices. Choose GraphQL when over-fetching/under-fetching hurts UX; stick with REST when teams are small or caching/CDN matters more.

**Example:**
```graphql
# One request — client picks fields
query {
  product(id: "p1") { name price reviews { rating comment } }
}
# REST might need GET /products/p1 + GET /products/p1/reviews
```

---

### 307. Schema, resolvers, and type system?

**Answer:** **Schema** defines types and operations (`Query`, `Mutation`, `Subscription`). **Resolvers** are functions that fetch data for each field. Strong typing catches breaking changes early. In Node, use Apollo Server, GraphQL Yoga, or `@nestjs/graphql`.

**Example:**
```javascript
const typeDefs = `#graphql
  type Product { id: ID! name: String! price: Float! }
  type Query { product(id: ID!): Product }
`;
const resolvers = {
  Query: {
    product: (_, { id }) => Product.findById(id).lean(),
  },
};
```

---

### 308. N+1 problem in GraphQL?

**Answer:** Nested resolvers can trigger one DB query per parent row (e.g. 100 orders → 100 user lookups). Fix with **DataLoader** (batch + cache per request), eager loading in parent resolver, or JOIN at service layer. Classic senior GraphQL interview topic.

**Example:**
```javascript
import DataLoader from 'dataloader';

const userLoader = new DataLoader(async (ids) => {
  const users = await User.find({ _id: { $in: ids } }).lean();
  const map = new Map(users.map(u => [String(u._id), u]));
  return ids.map(id => map.get(String(id)) ?? null);
});

const resolvers = {
  Order: {
    user: (order) => userLoader.load(order.userId),
  },
};
```

---

### 309. GraphQL authentication and authorization?

**Answer:** Auth at HTTP layer (JWT in `Authorization` header) — context carries `user` into resolvers. Authorization per field or mutation with guards (`@auth`, custom directives, or manual checks). Don't expose introspection in production without protection.

**Example:**
```javascript
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const user = token ? verifyJwt(token) : null;
    return { user };
  },
});

// Mutation resolver
async createOrder(_, args, { user }) {
  if (!user) throw new GraphQLError('Unauthorized', { extensions: { code: 'UNAUTHENTICATED' } });
  if (user.role !== 'admin' && args.userId !== user.id) throw new GraphQLError('Forbidden');
}
```

---

### 310. GraphQL caching, errors, and pagination?

**Answer:** Field-level caching is harder than REST URL caching — use persisted queries, CDN for public queries, or APQ (Automatic Persisted Queries). Return errors in `errors` array with extensions. Cursor-based pagination (Relay spec) scales better than offset.

**Example:**
```graphql
type Query {
  products(first: Int!, after: String): ProductConnection!
}
type ProductConnection {
  edges: [ProductEdge!]!
  pageInfo: PageInfo!
}
# Resolver: decode cursor → query with _id > cursor, limit first+1
```

---

## Redis Deep Dive (311–315)

### 311. Redis data structures — when to use which?

**Answer:** **String:** cache, counters, simple KV. **Hash:** object fields (user session). **List:** queues, recent items. **Set:** unique tags, followers. **Sorted Set:** leaderboards, rate-limit windows. **Stream:** event logs (alternative to Kafka for smaller scale). Pick structure to match access pattern.

**Example:**
```javascript
await redis.hSet(`session:${sid}`, { userId: 'u1', role: 'customer' });
await redis.expire(`session:${sid}`, 3600);
await redis.zIncrBy('leaderboard:sales', 150, 'agent:42');
```

---

### 312. Redis pub/sub vs Streams?

**Answer:** **Pub/sub:** fire-and-forget broadcast — subscribers offline miss messages. **Streams:** persisted, consumer groups, ack/retry — closer to Kafka for job events. Use pub/sub for live notifications; Streams or BullMQ for reliable work processing.

**Example:**
```javascript
// Pub/sub — live only
await redis.publish('notifications', JSON.stringify({ userId: 'u1', text: 'Order shipped' }));

// Stream — durable
await redis.xAdd('events', '*', { type: 'order.placed', orderId: 'o1' });
```

---

### 313. Distributed locks with Redis?

**Answer:** Coordinate exclusive access across Node instances (cron jobs, inventory decrement). Use `SET key value NX EX ttl` — only set if not exists with expiry (prevents deadlocks). Redlock algorithm for multi-master; libraries: `redlock`. Always set TTL; lock value should be unique per holder for safe release.

**Example:**
```javascript
const lockKey = `lock:inventory:${productId}`;
const token = crypto.randomUUID();
const acquired = await redis.set(lockKey, token, { NX: true, EX: 10 });
if (!acquired) throw new Error('Could not acquire lock');
try {
  await decrementStock(productId);
} finally {
  const val = await redis.get(lockKey);
  if (val === token) await redis.del(lockKey);
}
```

---

### 314. Cache invalidation strategies?

**Answer:** **TTL:** simple, allows stale reads. **Write-through / write-aside:** update cache on write. **Event-driven:** invalidate on `product.updated` event. **Version keys:** `product:v12:{id}`. Hardest part of caching — senior answer: "pick staleness tolerance per domain."

**Example:**
```javascript
async function updateProduct(id, data) {
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  await redis.del(`product:${id}`);
  await redis.del('products:list:page:1'); // invalidate list cache
  await eventBus.publish('product.updated', { id });
  return product;
}
```

---

### 315. Redis Cluster, Sentinel, and production pitfalls?

**Answer:** **Sentinel:** HA failover for single-master. **Cluster:** horizontal sharding across nodes. Pitfalls: large values block single-threaded Redis, `KEYS *` in prod, no persistence = data loss on restart, hot keys on single slot. Monitor memory, evictions, latency. Use connection pooling (ioredis).

**Example:**
```javascript
import Redis from 'ioredis';
const redis = new Redis.Cluster([{ host: 'redis-1' }, { host: 'redis-2' }], {
  redisOptions: { maxRetriesPerRequest: 3 },
});
// Avoid: await redis.keys('session:*') — use SCAN in production
```

---

## React Essentials for Full-Stack Node Roles (316–320)

### 316. React fundamentals — components, props, state?

**Answer:** React builds UI from components. **Props** flow down (read-only); **state** is local (`useState`) or shared (`useContext`, Redux, Zustand). Node developers in full-stack roles should explain component tree and one-way data flow clearly.

**Example:**
```jsx
function ProductCard({ product, onAddToCart }) {
  const [qty, setQty] = useState(1);
  return (
    <div>
      <h2>{product.name}</h2>
      <p>${product.price}</p>
      <input type="number" value={qty} onChange={e => setQty(+e.target.value)} />
      <button onClick={() => onAddToCart(product.id, qty)}>Add</button>
    </div>
  );
}
```

---

### 317. useEffect — fetching data from your Node API?

**Answer:** `useEffect` runs side effects after render — API calls, subscriptions. Pass dependency array to control re-runs. Handle loading/error states. In 2026, **React Server Components** and frameworks like Next.js shift fetching to server — still know client-side pattern.

**Example:**
```jsx
function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p>Loading...</p>;
  return orders.map(o => <OrderRow key={o.id} order={o} />);
}
```

---

### 318. Next.js — SSR, SSG, and API routes?

**Answer:** **SSR:** render on each request — fresh data, SEO. **SSG:** build-time static pages — fast CDN. **ISR:** revalidate static pages on interval. **App Router (Next 13+):** Server Components by default. Node devs often own Next API routes or BFF layer calling backend microservices.

**Example:**
```javascript
// app/products/page.jsx — Server Component
async function ProductsPage() {
  const res = await fetch(`${process.env.API_URL}/products`, { next: { revalidate: 60 } });
  const products = await res.json();
  return products.map(p => <ProductCard key={p.id} product={p} />);
}
```

---

### 319. State management — Context vs Redux vs Zustand?

**Answer:** **Context:** simple shared state (auth user, theme) — avoid big trees re-rendering. **Redux Toolkit:** complex global state, time-travel debugging, middleware. **Zustand:** minimal boilerplate, popular in 2026 mid-size apps. Senior answer: start local/context; add library when prop drilling hurts.

**Example:**
```javascript
import { create } from 'zustand';

const useCart = create((set) => ({
  items: [],
  add: (item) => set(s => ({ items: [...s.items, item] })),
  total: () => useCart.getState().items.reduce((s, i) => s + i.price, 0),
}));
```

---

### 320. React performance — memo, useMemo, useCallback?

**Answer:** **React.memo:** skip re-render if props unchanged. **useMemo:** cache expensive computation. **useCallback:** stable function reference for child memo. Don't overuse — measure first (React DevTools Profiler). Key list items with stable `id`, not index.

**Example:**
```jsx
const ProductList = React.memo(function ProductList({ products, onSelect }) {
  const sorted = useMemo(() => [...products].sort((a, b) => a.price - b.price), [products]);
  return sorted.map(p => <ProductRow key={p.id} product={p} onSelect={onSelect} />);
});
```

---

## LeetCode Pattern Checklist (321–325)

> Tied to **Q276** — each question is one pattern family with must-do problems. Target **40–60 mediums** total; check off as you solve.

---

### 321. Pattern: Hash Map & Two Pointers

**Answer:** Hash maps turn O(n²) lookups into O(n). Two pointers shrink search space on sorted arrays or palindrome checks. Most common backend coding patterns — clean Map/Set usage in JS.

**Checklist — solve these (Medium unless noted):**

| # | Problem | Pattern note |
|---|---------|--------------|
| 1 | Two Sum | Map: complement lookup |
| 2 | Group Anagrams | Sort key or char count key |
| 3 | Valid Palindrome | Two pointers inward |
| 4 | 3Sum | Sort + two pointers |
| 5 | Container With Most Water | Two pointers max area |
| 6 | Longest Substring Without Repeating Characters | Sliding window + Set |

**Example:**
```javascript
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
}
```

---

### 322. Pattern: Stack, Queue & Intervals

**Answer:** Stack handles nesting (parentheses, monotonic stack). Intervals need sort-by-start then merge or sweep. Frequently asked for scheduling and API rate-window problems.

**Checklist:**

| # | Problem | Pattern note |
|---|---------|--------------|
| 1 | Valid Parentheses | Stack match pairs |
| 2 | Min Stack | Auxiliary stack |
| 3 | Merge Intervals | Sort + merge overlap |
| 4 | Insert Interval | Merge into list |
| 5 | Daily Temperatures | Monotonic stack |
| 6 | LRU Cache (Medium/Hard) | Map + doubly linked list — design |
| 7 | Flatten Nested List Iterator | Stack + DFS unwrap — see Flatten Deep Dive after Q29 |
| 8 | Implement `flatten(arr)` (custom) | Recursive or iterative stack; O(n) time |

**Example:**
```javascript
function mergeIntervals(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const out = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = out[out.length - 1];
    if (intervals[i][0] <= last[1]) last[1] = Math.max(last[1], intervals[i][1]);
    else out.push(intervals[i]);
  }
  return out;
}

```

**Flatten (custom — common JS interview ask):**
```javascript
function flatten(arr, depth = Infinity) {
  const out = [];
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      out.push(...flatten(item, depth - 1));
    } else {
      out.push(item);
    }
  }
  return out;
}
// Production: arr.flat(Infinity)
```

---

### 323. Pattern: BFS, DFS & Graphs

**Answer:** BFS for shortest path in unweighted graphs; DFS for connected components, cycles, islands. Grid problems are implicit graphs. Know recursive vs iterative DFS.

**Checklist:**

| # | Problem | Pattern note |
|---|---------|--------------|
| 1 | Number of Islands | DFS/BFS flood fill |
| 2 | Clone Graph | BFS + Map old→new node |
| 3 | Course Schedule | Topological sort / cycle detect |
| 4 | Rotting Oranges | Multi-source BFS |
| 5 | Word Ladder (optional Hard) | BFS shortest path |
| 6 | Max Area of Island | DFS count cells |

**Example:**
```javascript
function numIslands(grid) {
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  let count = 0;
  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dirs.forEach(([dr, dc]) => dfs(r + dr, c + dc));
  }
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[0].length; c++)
      if (grid[r][c] === '1') { count++; dfs(r, c); }
  return count;
}
```

---

### 324. Pattern: Trees, Heaps & Binary Search

**Answer:** Trees: recursion + base case (null). Heaps for top-K / streaming median. Binary search on sorted arrays and on **answer space** (min capacity, speed).

**Checklist:**

| # | Problem | Pattern note |
|---|---------|--------------|
| 1 | Binary Tree Level Order Traversal | BFS queue |
| 2 | Validate Binary Search Tree | DFS with min/max bounds |
| 3 | Lowest Common Ancestor of BST | BST property walk |
| 4 | Kth Largest Element in Array | Min-heap size k |
| 5 | Top K Frequent Elements | Map + heap or bucket sort |
| 6 | Search in Rotated Sorted Array | Modified binary search |

**Example:**
```javascript
function levelOrder(root) {
  if (!root) return [];
  const out = [], q = [root];
  while (q.length) {
    const level = [], size = q.length;
    for (let i = 0; i < size; i++) {
      const node = q.shift();
      level.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    out.push(level);
  }
  return out;
}
```

---

### 325. Pattern: DP & Classic Design — finish your 40–60 list

**Answer:** Dynamic programming: define state, recurrence, base case. Start with 1D DP (climbing stairs, house robber). Design problems map to production (TTL cache, rate limiter). Complete remaining mediums from any pattern you're weak on.

**Checklist:**

| # | Problem | Pattern note |
|---|---------|--------------|
| 1 | Climbing Stairs | 1D DP |
| 2 | House Robber | DP skip/take |
| 3 | Coin Change | Unbounded knapsack DP |
| 4 | Longest Increasing Subsequence | DP or patience sorting |
| 5 | Implement Trie (Prefix Tree) | Design — autocomplete |
| 6 | Design Hit Counter / Rate Limiter | Queue or sliding window |

**8-week LC schedule (2/day = 48 problems):**

| Week | Patterns (Q) | Focus |
|------|----------------|-------|
| 1 | Q296 Hash/Two pointers | 6 problems |
| 2 | Q297 Stack/Intervals | 6 problems |
| 3 | Q298 BFS/DFS | 6 problems |
| 4 | Q299 Trees/Heap/BS | 6 problems |
| 5 | Q300 DP + redo weak | 6 problems |
| 6–8 | Mixed timed mocks | 18 problems + 3 timed mocks |

**Example (DP):**
```javascript
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++)
    for (const c of coins)
      if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

---


---


---

# Part IV — Extended Topics — 2026 Complete

## Modern JavaScript ES2023–2025 (326–334)

> Latest language features commonly asked in 2026 interviews.

### 326. Promise.withResolvers (ES2024)?

**Answer:** `Promise.withResolvers()` returns `{ promise, resolve, reject }` — useful when you need to resolve/reject from outside the executor (event listeners, callbacks, third-party APIs). Cleaner than the manual `let resolve; new Promise(r => resolve = r)` pattern.

**Example:**
```javascript
function waitForPayment(orderId) {
  const { promise, resolve, reject } = Promise.withResolvers();
  paymentGateway.on(`paid:${orderId}`, (data) => resolve(data));
  paymentGateway.on(`failed:${orderId}`, (err) => reject(err));
  setTimeout(() => reject(new Error('Payment timeout')), 60_000);
  return promise;
}
```

---

### 327. Array.at(), toSorted(), toReversed(), toSpliced() (ES2023)?

**Answer:** `at(index)` supports negative indices (`arr.at(-1)` = last element). `toSorted`, `toReversed`, `toSpliced` return **new** arrays without mutating originals — align with immutability in React/state. Prefer these over `.sort()` which mutates in place.

**Example:**
```javascript
const prices = [49, 99, 29, 199];
prices.at(-1);           // 199 — last price
prices.toSorted((a, b) => a - b); // new sorted array
prices;                  // unchanged [49, 99, 29, 199]
```

---

### 328. Object.groupBy() and Map.groupBy() (ES2024)?

**Answer:** Groups array elements by a callback return value. `Object.groupBy` returns plain object with string keys; `Map.groupBy` returns Map (supports non-string keys). Replaces manual reduce-for-grouping patterns.

**Example:**
```javascript
const orders = [
  { id: 1, status: 'shipped' },
  { id: 2, status: 'pending' },
  { id: 3, status: 'shipped' },
];
const byStatus = Object.groupBy(orders, (o) => o.status);
// { shipped: [...], pending: [...] }
```

---

### 329. structuredClone() vs JSON.parse(JSON.stringify())?

**Answer:** `structuredClone` deep-clones most structured data including `Date`, `Map`, `Set`, `ArrayBuffer`, and circular refs (with limits). JSON round-trip loses types, functions, `undefined`, and fails on cycles. Use `structuredClone` for state snapshots and worker message copies.

**Example:**
```javascript
const cart = { items: [{ id: 1 }], meta: new Map([['coupon', 'SAVE10']]) };
const copy = structuredClone(cart);
copy.meta.get('coupon'); // 'SAVE10'
JSON.parse(JSON.stringify(cart)); // meta becomes {} — broken
```

---

### 330. Iterator helpers — map, filter, take, drop?

**Answer:** ES2024+ iterator helpers operate lazily on iterables without creating intermediate arrays. `Iterator.from`, `.map()`, `.filter()`, `.take(n)`, `.drop(n)`, `.toArray()` — memory-efficient for large datasets and streaming pipelines.

**Example:**
```javascript
const ids = [1, 2, 3, 4, 5, 6];
const first3Evens = Iterator.from(ids)
  .filter((n) => n % 2 === 0)
  .take(3)
  .toArray();
// [2, 4, 6] — lazy until toArray()
```

---

### 331. RegExp — dotAll, sticky, and named groups?

**Answer:** `/s` (dotAll) makes `.` match newlines. `/y` (sticky) matches only at `lastIndex`. Named capture groups `(?<name>...)` improve readability in URL/log parsers. Know flags for parsing routes, emails, and log lines in Node.

**Example:**
```javascript
const re = /^(?<method>\w+)\s+(?<path>\/[^\s]+)/;
const m = re.exec('GET /api/orders/42');
m.groups.method; // 'GET'
m.groups.path;   // '/api/orders/42'
```

---

### 332. WeakRef and FinalizationRegistry?

**Answer:** `WeakRef` holds a weak reference to an object without preventing GC — useful for caches that shouldn't leak memory. `FinalizationRegistry` runs a callback when an object is garbage-collected. Advanced; mention awareness in senior interviews, rarely used daily.

**Example:**
```javascript
const cache = new Map();
const registry = new FinalizationRegistry((key) => cache.delete(key));

function cacheProduct(id, product) {
  const ref = new WeakRef(product);
  cache.set(id, ref);
  registry.register(product, id);
}
```

---

### 333. globalThis?

**Answer:** Standard way to access the global object in any environment — `window` in browser, `global` in Node, `self` in workers. Use for polyfills or libraries that must run everywhere. Prefer module scope over globals in application code.

**Example:**
```javascript
// Library that works in browser and Node
const g = globalThis;
if (!g.fetch) g.fetch = require('node-fetch');
```

---

### 334. Error.cause and AggregateError?

**Answer:** `Error` constructor accepts `{ cause }` to chain errors — preserves stack context in async pipelines. `AggregateError` wraps multiple errors (e.g., `Promise.any` rejection). Essential for production logging and debugging distributed flows.

**Example:**
```javascript
try {
  await syncInventory();
} catch (err) {
  throw new Error('Checkout failed', { cause: err });
}
// logger sees err.cause with original stack

Promise.any([api1(), api2()]).catch((e) => {
  console.log(e instanceof AggregateError); // true
  console.log(e.errors); // all rejection reasons
});
```

---

## Message Queues & Async Jobs (335–340)

> RabbitMQ, Kafka, and Bull/BullMQ — common in senior Node backend interviews.

### 335. RabbitMQ with Node (amqplib)?

**Answer:** RabbitMQ is a message broker using AMQP — producers publish to **exchanges**, routed to **queues**, consumed by workers. Supports ack/nack, durability, and routing patterns (direct, topic, fanout). Good for task queues, email sending, order processing.

**Example:**
```javascript
import amqp from 'amqplib';

const conn = await amqp.connect(process.env.RABBITMQ_URL);
const ch = await conn.createChannel();
await ch.assertQueue('order-emails', { durable: true });
ch.sendToQueue('order-emails', Buffer.from(JSON.stringify({ orderId: 'O1', email: 'a@x.com' })), { persistent: true });

// Worker
ch.consume('order-emails', async (msg) => {
  const job = JSON.parse(msg.content.toString());
  await sendReceiptEmail(job);
  ch.ack(msg);
});
```

---

### 336. Apache Kafka with Node (KafkaJS)?

**Answer:** Kafka is a distributed **event log** — high-throughput, durable, replayable. Producers write to **topics** partitioned for scale; consumers track **offsets**. Use for event sourcing, analytics pipelines, microservice decoupling — not simple task queues.

**Example:**
```javascript
import { Kafka } from 'kafkajs';

const kafka = new Kafka({ brokers: ['localhost:9092'] });
const producer = kafka.producer();
await producer.connect();
await producer.send({
  topic: 'orders.placed',
  messages: [{ key: 'O123', value: JSON.stringify({ orderId: 'O123', total: 99 }) }],
});

const consumer = kafka.consumer({ groupId: 'inventory-service' });
await consumer.subscribe({ topic: 'orders.placed' });
await consumer.run({
  eachMessage: async ({ message }) => {
    const order = JSON.parse(message.value.toString());
    await decrementStock(order);
  },
});
```

---

### 337. Bull / BullMQ job queues with Redis?

**Answer:** BullMQ is a Redis-backed queue for Node — jobs, delays, retries, concurrency, and dashboards (Bull Board). Simpler than Kafka for background jobs (PDF gen, emails, image resize). Workers run in separate processes or same app.

**Example:**
```javascript
import { Queue, Worker } from 'bullmq';

const emailQueue = new Queue('email', { connection: { host: 'localhost', port: 6379 } });
await emailQueue.add('receipt', { orderId: 'O1' }, { attempts: 3, backoff: { type: 'exponential', delay: 2000 } });

new Worker('email', async (job) => {
  await sendReceipt(job.data.orderId);
}, { connection: { host: 'localhost', port: 6379 } });
```

---

### 338. When to use a queue vs direct API call?

**Answer:** Use queues when work is **slow**, **retriable**, or must **decouple** producer from consumer (spike traffic, third-party latency). Direct calls when user needs immediate response and work is fast (<200ms). Pattern: API validates → enqueue → return 202 Accepted with job ID.

**Example:**
```javascript
app.post('/api/orders', async (req, res) => {
  const order = await Order.create({ ...req.body, status: 'pending' });
  await orderQueue.add('fulfill', { orderId: order._id });
  res.status(202).json({ orderId: order._id, message: 'Processing' });
});
```

---

### 339. Dead letter queues (DLQ)?

**Answer:** After max retries, failed messages move to a DLQ for manual inspection — prevents poison messages from blocking the queue. Monitor DLQ depth; alert on growth. Reprocess after fixing root cause.

**Example:**
```javascript
// BullMQ — failed jobs retained
const worker = new Worker('email', handler, {
  connection,
  settings: { backoffStrategy: () => 5000 },
});
worker.on('failed', (job, err) => {
  logger.error({ jobId: job.id, data: job.data, err });
  // Alert if job.attemptsMade >= job.opts.attempts → DLQ review
});
```

---

### 340. Event-driven order processing pattern?

**Answer:** Order flow: `order.placed` → payment service → `payment.completed` → inventory → `inventory.reserved` → shipping. Each service consumes events and publishes next. Enables independent scaling; requires idempotency and outbox pattern for reliability.

**Example:**
```text
POST /orders → MongoDB + publish order.placed (Kafka)
  → PaymentService consumes → charges card → payment.completed
  → InventoryService consumes → reserves stock → inventory.reserved
  → NotificationService → email customer
Each handler: idempotent on eventId, log correlationId
```

---

## ORMs & Data Access (341–348)

> Prisma, Sequelize, TypeORM, Drizzle — comparison for Node interviews.

### 341. Why use an ORM?

**Answer:** ORMs map database rows to objects, provide migrations, type safety, and query builders — faster development and fewer SQL injection bugs. Tradeoffs: abstraction leaks, N+1 queries, complex SQL harder. Use raw SQL/driver for extreme performance or complex analytics.

**Example:**
```javascript
// Without ORM — verbose, error-prone
const { rows } = await pool.query('SELECT * FROM products WHERE category = $1 AND price < $2', ['electronics', 500]);

// With ORM — readable, typed
const products = await prisma.product.findMany({ where: { category: 'electronics', price: { lt: 500 } } });
```

---

### 342. Prisma with Node?

**Answer:** Prisma is schema-first ORM with excellent TypeScript support, auto-generated client, migrations, and Prisma Studio GUI. Supports PostgreSQL, MySQL, SQLite, MongoDB. Popular in 2026 greenfield Node/TS projects.

**Example:**
```prisma
// schema.prisma
model Product {
  id       String @id @default(cuid())
  name     String
  price    Float
  category String
}
```
```typescript
const products = await prisma.product.findMany({ where: { category: 'electronics' }, take: 20 });
await prisma.product.create({ data: { name: 'Phone', price: 699, category: 'electronics' } });
```

---

### 343. Sequelize with PostgreSQL?

**Answer:** Sequelize is mature ORM for SQL databases — models, associations, hooks, migrations. Class-based or functional models. Large legacy codebase footprint; more boilerplate than Prisma but flexible raw queries.

**Example:**
```javascript
const Product = sequelize.define('Product', {
  name: DataTypes.STRING,
  price: DataTypes.DECIMAL,
  category: DataTypes.STRING,
});
Product.hasMany(Review);
const products = await Product.findAll({
  where: { category: 'electronics' },
  include: [{ model: Review, limit: 5 }],
});
```

---

### 344. TypeORM?

**Answer:** TypeORM uses decorators and Active Record / Data Mapper patterns — popular with NestJS. Supports many SQL databases. Migrations, relations, query builder. Heavier than Prisma; decorator syntax fits NestJS conventions.

**Example:**
```typescript
@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column('decimal') price: number;
  @OneToMany(() => Review, (r) => r.product) reviews: Review[];
}
const repo = AppDataSource.getRepository(Product);
await repo.find({ where: { category: 'electronics' }, relations: ['reviews'] });
```

---

### 345. Drizzle ORM?

**Answer:** Drizzle is lightweight, SQL-like TypeScript ORM — schema in TS, excellent type inference, minimal runtime. Growing choice for performance-conscious teams wanting SQL control with type safety. Works with PostgreSQL, MySQL, SQLite.

**Example:**
```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, text, numeric } from 'drizzle-orm/pg-core';

const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  price: numeric('price').notNull(),
});

const db = drizzle(pool);
await db.select().from(products).where(eq(products.category, 'electronics')).limit(20);
```

---

### 346. Mongoose vs Prisma vs Sequelize — when which?

**Answer:** **Mongoose** — MongoDB document apps, flexible schema, aggregation. **Prisma** — new TypeScript SQL projects, best DX and types. **Sequelize** — legacy Node SQL, large existing codebases. **Drizzle** — TS teams wanting SQL-first control. Match ORM to database and team stack.

**Example:**
```text
| Scenario                    | Pick        |
|-----------------------------|-------------|
| MongoDB + Express           | Mongoose    |
| New NestJS + PostgreSQL     | Prisma/TypeORM |
| Legacy MySQL monolith       | Sequelize   |
| Edge/serverless + SQLite    | Drizzle     |
```

---

### 347. Migrations with Prisma vs raw SQL?

**Answer:** Prisma Migrate generates SQL from schema diff — `prisma migrate dev` locally, `migrate deploy` in CI. Raw SQL migrations (Flyway, node-pg-migrate) give full control for complex changes. Always version migrations; never edit applied migration files.

**Example:**
```bash
# Prisma workflow
npx prisma migrate dev --name add_product_sku
npx prisma migrate deploy   # production CI

# node-pg-migrate
npx node-pg-migrate up
```

---

### 348. N+1 query problem with ORMs?

**Answer:** Loading N parent records then 1 query per child = N+1. Fix with eager loading (`include`, `populate`, `JOIN`), DataLoader (GraphQL), or batch queries. Always check query count in dev with ORM logging.

**Example:**
```javascript
// N+1 — BAD: 1 + 100 queries
const orders = await Order.find();
for (const o of orders) o.user = await User.findById(o.userId);

// Fix — populate / include
const orders = await Order.find().populate('user'); // 2 queries (or 1 with $lookup)
// Prisma: include: { user: true }
// Sequelize: include: [User]
```

---

## Kubernetes Hands-On (349–354)

> Practical K8s for Node.js developers deploying APIs.

### 349. Kubernetes Deployment for Node.js?

**Answer:** A Deployment manages replica Pods running your container image — rolling updates, rollbacks, self-healing. Define `replicas`, `resources`, env from ConfigMap/Secret, and container port 3000.

**Example:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: shop-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: shop-api
  template:
    metadata:
      labels:
        app: shop-api
    spec:
      containers:
        - name: api
          image: myregistry/shop-api:1.2.0
          ports:
            - containerPort: 3000
          envFrom:
            - secretRef:
                name: shop-api-secrets
          resources:
            requests: { memory: "256Mi", cpu: "250m" }
            limits: { memory: "512Mi", cpu: "500m" }
```

---

### 350. Service, Ingress, ConfigMap, Secret?

**Answer:** **Service** — stable cluster IP / DNS to reach Pods. **Ingress** — HTTP routing + TLS from outside cluster. **ConfigMap** — non-sensitive config. **Secret** — base64-encoded credentials (use external secret managers in prod).

**Example:**
```yaml
# Service — ClusterIP internal
apiVersion: v1
kind: Service
metadata:
  name: shop-api
spec:
  selector:
    app: shop-api
  ports:
    - port: 80
      targetPort: 3000
---
# Ingress — external HTTPS
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: shop-api
spec:
  rules:
    - host: api.shop.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: shop-api
                port:
                  number: 80
```

---

### 351. Liveness vs Readiness probes?

**Answer:** **Liveness** — is the process alive? Fails → kubelet restarts Pod (use if app deadlocks). **Readiness** — can it accept traffic? Fails → removed from Service endpoints (use during startup or DB disconnect). Don't point liveness at downstream dependencies.

**Example:**
```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 15
readinessProbe:
  httpGet:
    path: /health/ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```
```javascript
app.get('/health/live', (_, res) => res.json({ ok: true }));
app.get('/health/ready', async (_, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ ok: true });
  } catch {
    res.status(503).json({ ok: false });
  }
});
```

---

### 352. Horizontal Pod Autoscaler (HPA)?

**Answer:** HPA scales Deployment replicas based on CPU, memory, or custom metrics (requests/sec). Requires metrics-server. Set min/max replicas and target utilization. Node apps should be stateless for safe scaling.

**Example:**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: shop-api
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: shop-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

---

### 353. kubectl essentials for Node developers?

**Answer:** Daily commands: `kubectl get pods`, `logs -f deployment/shop-api`, `describe pod`, `exec -it pod -- sh`, `apply -f`, `rollout status/restart/undo`. Debug crash loops with logs and describe events.

**Example:**
```bash
kubectl get pods -l app=shop-api
kubectl logs -f deployment/shop-api --tail=100
kubectl exec -it shop-api-7d8f9-xxxxx -- node -v
kubectl rollout undo deployment/shop-api   # rollback bad deploy
kubectl port-forward svc/shop-api 3000:80  # local test
```

---

### 354. Helm charts basics?

**Answer:** Helm packages K8s manifests as **charts** with templated values — reuse across dev/staging/prod. `helm install`, `upgrade`, `rollback`. Official charts exist for Redis, MongoDB; custom charts for your Node API.

**Example:**
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install redis bitnami/redis --set auth.password=secret

# Custom chart values.yaml
replicaCount: 3
image:
  tag: "1.2.0"
env:
  NODE_ENV: production
helm upgrade shop-api ./charts/shop-api -f values-prod.yaml
```

---

## Cloud & CI/CD (355–360)

> AWS patterns and GitHub Actions for Node.js production.

### 355. AWS Lambda with Node.js?

**Answer:** Lambda runs Node handlers on demand — pay per invocation, auto-scales. Use for webhooks, image processing triggers, scheduled jobs. Cold starts matter; keep bundle small. API Gateway fronts HTTP Lambdas.

**Example:**
```javascript
// handler.js — API Gateway proxy
export const handler = async (event) => {
  const body = JSON.parse(event.body || '{}');
  const order = await createOrder(body);
  return {
    statusCode: 201,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  };
};
```

---

### 356. S3 presigned URLs with Node?

**Answer:** Presigned URLs grant temporary upload/download access without exposing AWS keys. Client uploads directly to S3; Node generates URL with expiry. Reduces server bandwidth for file uploads.

**Example:**
```javascript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({ region: 'ap-south-1' });
const command = new PutObjectCommand({
  Bucket: 'shop-uploads',
  Key: `avatars/${userId}.jpg`,
  ContentType: 'image/jpeg',
});
const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
res.json({ uploadUrl }); // client PUTs file to this URL
```

---

### 357. AWS SQS with Node?

**Answer:** SQS is managed message queue — standard (at-least-once) or FIFO (exactly-once, ordered). Producers send messages; consumers poll and delete after processing. Simpler than self-hosted RabbitMQ; integrates with Lambda.

**Example:**
```javascript
import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';

const sqs = new SQSClient({ region: 'ap-south-1' });
await sqs.send(new SendMessageCommand({
  QueueUrl: process.env.ORDER_QUEUE_URL,
  MessageBody: JSON.stringify({ orderId: 'O1' }),
}));

const { Messages } = await sqs.send(new ReceiveMessageCommand({ QueueUrl, MaxNumberOfMessages: 10, WaitTimeSeconds: 20 }));
for (const msg of Messages ?? []) {
  await processOrder(JSON.parse(msg.Body));
  await sqs.send(new DeleteMessageCommand({ QueueUrl, ReceiptHandle: msg.ReceiptHandle }));
}
```

---

### 358. ECS vs EKS vs Lambda — when which?

**Answer:** **Lambda** — event-driven, spiky, short-lived, no server management. **ECS (Fargate)** — containerized APIs without K8s complexity. **EKS** — full Kubernetes, multi-team, complex microservices. Node Express APIs often start ECS/Fargate; scale to EKS when K8s ecosystem needed.

**Example:**
```text
| Workload              | AWS choice     |
|-----------------------|----------------|
| Webhook / cron        | Lambda         |
| Standard REST API     | ECS Fargate    |
| 20+ microservices     | EKS            |
| Spike + queue workers | Lambda + SQS   |
```

---

### 359. Terraform basics for Node infrastructure?

**Answer:** Terraform defines infrastructure as code — reproducible envs, version controlled. Providers for AWS, K8s, MongoDB Atlas. `plan` previews changes; `apply` executes. Modules reuse patterns (VPC, ECS service, RDS).

**Example:**
```hcl
resource "aws_ecs_service" "shop_api" {
  name            = "shop-api"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.shop_api.arn
  desired_count   = 3

  load_balancer {
    target_group_arn = aws_lb_target_group.shop.arn
    container_name   = "api"
    container_port   = 3000
  }
}
```

---

### 360. GitHub Actions CI/CD for Node?

**Answer:** Automate lint, test, build Docker image, push to registry, deploy on merge to main. Cache `node_modules`, run on PR and push, use secrets for deploy keys. Quality gate before production.

**Example:**
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t shop-api:${{ github.sha }} .
      - run: docker push myregistry/shop-api:${{ github.sha }}
      - run: kubectl set image deployment/shop-api api=myregistry/shop-api:${{ github.sha }}
```

---

---


---

# Appendix — Study Guide & Learning Plans

## Study Guide

| Experience | Focus |
|------------|-------|
| Fresher | Q 1–30, 80–99, 158–177 — JS basics, Express routing, MongoDB CRUD, event loop & falsy traps; **Flatten Deep Dive** after Q29 |
| 2–4 years | Q 30–79, 100–130, 178–200 — async patterns, auth, aggregation, NoSQL injection, soft delete |
| 5–6 years (Senior) | Q 60–79, 110–157, 190–225, **226–279, 294–300** — system design, Docker, sharding, architecture, behavioral |
| 6+ years (Senior + AI era) | All Senior rows + **241–250**, **251–257**, **258–263**, **264–271**, **280–293**, **301–305**, **321–325**, **326–360** (ES2024+, queues, ORMs, K8s, AWS) |
| Full-stack Node + React JD | Add **316–320** + one Next.js page calling your API |
| GraphQL API role | **306–310** + DataLoader exercise |
| AI-focused Node role | **280–293** deep dive + build one RAG side project |
| Message queue / event-driven JD | **335–340** + BullMQ or Kafka spike |
| ORM-heavy SQL role | **341–348** + Prisma or Sequelize exercise |
| K8s / platform JD | **349–354** + deploy API to minikube |
| AWS / DevOps JD | **355–360** + GitHub Actions pipeline |

### Recommended 4-week plan (6 years, Node + AI market)

| Week | Daily (2h) | Goal |
|------|------------|------|
| 1 | Senior Q 226–240 + draw 2 system designs on paper | System design fluency |
| 2 | Q 241–257 + write Supertest suite for one route | TypeScript + testing credibility |
| 3 | Q 280–293 + build mini RAG API (Mongo Atlas or pgvector) | AI integration portfolio piece |
| 4 | Q 294–300 (STAR stories out loud) + Q321–325 (2 LC/day) | Behavioral + coding round |

### Recommended 12-week plan (complete coverage — all 360 Q)

| Week | Topics (Q) | Deliverable |
|------|------------|-------------|
| 1–2 | 1–79 | JavaScript core (includes event loop, classes, falsy) |
| 3–4 | 80–157 | Express API + security patterns |
| 5 | 158–225 | MongoDB mastery |
| 6 | 226–240 | 2 system design write-ups |
| 7 | 241–257, 264–271 | TS API + Docker + CI |
| 8 | 258–263, 272–279, 326–334 | Postgres + ES2024 features |
| 9 | 280–293, 335–340 | RAG project + queue spike |
| 10 | 306–315, 341–348 | GraphQL/Redis + ORM exercise |
| 11 | 349–360, 316–320 | K8s/AWS + optional React |
| 12 | 321–325, 294–300 | LC patterns + mock interviews |

### Recommended 10-week plan (core + senior)

| Week | Topics (Q) | Deliverable |
|------|------------|-------------|
| 1–2 | 70–79, 110–157, 190–225 | Node + Mongo depth notes |
| 3 | 226–240 | 2 system design write-ups |
| 4 | 241–257, 264–271 | TS API + Dockerfile + tests |
| 5 | 258–263, 272–279 | Postgres exercise + architecture diagram |
| 6 | 280–293 | RAG portfolio project |
| 7 | 306–310, 311–315 | GraphQL or Redis spike (pick JD) |
| 8 | 316–320 | Next.js page → your API |
| 9 | 321–325 | 30+ LC mediums checked off |
| 10 | 294–300, 326–360 (skim Part IV) | Full mock interview × 2 |

---

## 6-Month Learning Plan (Senior Node.js · 6 Years · 2026)

> **Assumption:** ~1.5h weekdays + 3–4h one weekend day (~12–14h/week). Maps every week to Q numbers in this doc. **Every 4th week is lighter** (review only — avoid burnout).

### Month-at-a-glance

| Month | Theme | Main Q ranges | Deliverable |
|-------|--------|---------------|-------------|
| **1** | Core refresh | Q 1–79, 80–157, 158–225 | Express + Mongo API |
| **2** | Senior + system design | Q 110–157, 190–225, 226–240, 272–279 | 3 system designs + Docker + Redis |
| **3** | TS, testing, GraphQL, Redis | Q 241–257, 258–263, 306–315 | TS API + CI tests + optional GraphQL |
| **4** | AI portfolio | Q 280–293 | **RAG project** on GitHub |
| **5** | LeetCode + React | Q 321–325, 316–320 | 48+ LC mediums + optional Next.js |
| **6** | Behavioral + mocks + apply | Q 294–300, 326–360 (Part IV extended skim), review weak Q | 8 STAR stories + applications |

---

### Month 1 — Foundation (Weeks 1–4)

**Goal:** No gaps on JS, Node, Mongo.

#### Week 1 — JavaScript core

| Day | Read | Practice |
|-----|------|----------|
| Mon–Wed | Q 1–20 | Run examples; predict event-loop output (Q 9–10) |
| Thu–Fri | Q 21–40 | Rewrite 3 examples from memory |
| Sat | Q 41–55 | Small script: closures, promises, fetch |
| Sun | Review | Explain 10 answers aloud |

#### Week 2 — JavaScript advanced

| Day | Read | Practice |
|-----|------|----------|
| Mon–Wed | Q 56–79 | Modules, memory, Service Worker concepts |
| Thu–Fri | Q 5, 9, 11, 28–29, Flatten Deep Dive, 30–33 | Implement `flatten` (recursive + stack), debounce, memoize from scratch |
| Sat | — | Closed-book quiz: 20 random JS questions |
| Sun | Review weak Q | |

#### Week 3 — Node.js

| Day | Read | Practice |
|-----|------|----------|
| Mon–Tue | Q 80–99 | Express: routes + middleware |
| Wed–Thu | Q 100–119 | JWT login + refresh token |
| Fri | Q 120–128 | Graceful shutdown + error middleware |
| Sat | Q 111–114 | Stream file with `pipeline()` |
| Sun | Review Q 126–128 | |

#### Week 4 — MongoDB

| Day | Read | Practice |
|-----|------|----------|
| Mon–Tue | Q 158–177 | CRUD + indexes on sample data |
| Wed–Thu | Q 178–194 | Aggregation + `.explain()` |
| Fri | Q 195–202 | Cursor pagination API |
| Sat | Q 203–217 | E-commerce schema on whiteboard |
| Sun | **Checkpoint** | 30-min self-interview: JS + Node + Mongo |

**Month 1 deliverable:** Express + Mongo API (auth, CRUD, indexes, pagination).

---

### Month 2 — Senior depth + system design (Weeks 5–8)

**Goal:** Sound like 6 years in production.

#### Week 5 — Node production

| Focus | Q 129–149 |
|-------|-----------|
| Topics | Redis cache, Docker, health checks, API versioning |
| Sat | Add Redis cache-aside to Month 1 API |
| Sun | Q 128, 148, 149 — Dockerize the API |

#### Week 6 — Mongo at scale

| Focus | Q 187–217 |
|-------|-----------|
| Topics | Transactions, sharding, bucket pattern, best practices |
| Sat | Aggregation reports; tune one slow query |
| Sun | Write 1-page “Mongo ops notes” from Q 217 |

#### Week 7 — System design I

| Day | Activity |
|-----|----------|
| Mon | Q 226 — learn framework: requirements → scale → diagram → deep dive |
| Tue–Wed | Q 227–233 — rate limit, cache, queues, idempotency |
| Thu–Fri | Q 234–237 — CAP, WebSockets, connection pooling |
| Sat | **Design #1:** URL shortener (45 min timed) |
| Sun | **Design #2:** Notification service |

#### Week 8 — System design II + architecture

| Day | Activity |
|-----|----------|
| Mon–Wed | Q 238–240, 247–254 — saga, circuit breaker, webhooks, monolith vs microservices |
| Thu–Fri | Q 264–271 — structured logs, multi-stage Dockerfile, probes |
| Sat | **Design #3:** E-commerce checkout |
| Sun | **Checkpoint mock:** 45-min system design out loud |

**Month 2 deliverable:** 3 system design write-ups + Dockerized API with Redis.

---

### Month 3 — TypeScript, testing, GraphQL, Redis (Weeks 9–12)

**Goal:** Strict TS + CI tests — credible in interview.

#### Week 9 — TypeScript

| Day | Activity |
|-----|----------|
| Mon–Wed | Q 241–246 — migrate API to TS, `strict: true` |
| Thu–Fri | Q 247–250 — Zod validation + Express types |
| Sat | Skim NestJS structure (Q 250) |
| Sun | Review |

#### Week 10 — Testing & Postgres

| Day | Activity |
|-----|----------|
| Mon–Wed | Q 251–257 — Jest + Supertest: 5+ integration tests |
| Thu–Fri | Q 258–263 — Postgres: one transactional flow + EXPLAIN |
| Sat | GitHub Actions: lint + typecheck + test |
| Sun | Draft STAR stories for Q 256–257 |

#### Week 11 — GraphQL

| Day | Activity |
|-----|----------|
| Mon–Wed | Q 306–310 — Apollo/GraphQL Yoga project |
| Thu–Fri | DataLoader for N+1 (Q 308) |
| Sat | Document REST vs GraphQL tradeoffs |
| Sun | Review |

#### Week 12 — Redis deep dive

| Day | Activity |
|-----|----------|
| Mon–Wed | Q 311–315 — pub/sub, distributed lock, invalidation |
| Thu–Fri | Wire Redis: rate limit + session + cache |
| Sat | **Checkpoint:** demo TS API + tests + Docker + Redis |
| Sun | Rest / light review |

**Month 3 deliverable:** Production-style repo (TS, tests, CI, Docker, Redis, optional GraphQL).

---

### Month 4 — AI / RAG portfolio (Weeks 13–16)

**Goal:** 10-minute demo that stands out in 2026 market.

#### Week 13 — LLM basics

| Day | Activity |
|-----|----------|
| Mon–Wed | Q 280–283 — embed + chat; basic RAG query |
| Thu–Fri | Q 284–286 — system prompt, Zod JSON, injection guard |
| Sat | SSE streaming endpoint |
| Sun | Read Q 266 (PII redaction) |

#### Week 14 — RAG pipeline

| Day | Activity |
|-----|----------|
| Mon–Wed | Q 282, 288 — chunk + embed + vector store |
| Thu–Fri | Q 232 — BullMQ ingestion job |
| Sat | Ingest 20–50 documents |
| Sun | Test retrieval quality manually |

#### Week 15 — Production polish

| Day | Activity |
|-----|----------|
| Mon–Tue | Q 285, 290 — Redis LLM cache + eval script (10 Q) |
| Wed–Thu | Q 287, 289 — tool calling or Vercel AI SDK |
| Fri | Q 292–293 — README: architecture, cost, latency, eval |
| Sat | Record 5-min walkthrough video |
| Sun | Rest |

#### Week 16 — AI review week

| Day | Activity |
|-----|----------|
| Mon–Fri | Re-read Q 280–293 — explain without looking |
| Sat | Mock: “How would you add AI to our product?” |
| Sun | **Checkpoint:** RAG repo public on GitHub |

**Month 4 deliverable:** Support-bot / doc-search **RAG API** with README + eval metrics.

---

### Month 5 — LeetCode + React (Weeks 17–21)

**Goal:** Pass coding round; optional full-stack coverage.

#### LeetCode (Q 321–325) — 48 problems total

| Week | Pattern (Q) | Problems |
|------|-------------|----------|
| 17 | Q 321 Hash / two pointers | 6 |
| 18 | Q 322 Stack / intervals | 6 |
| 19 | Q 323 BFS / DFS | 6 |
| 20 | Q 324 Trees / heap / BS | 6 |
| 21 | Q 325 DP + redo 6 weakest | 12 |

**Daily LC habit (Mon–Fri, 45 min):** read (5) → approach aloud (5) → code (25) → review solution (10).

**Weekends:** timed mock — 2 problems, 45 min each.

#### React (Weeks 19–21 — skip if backend-only JD)

| Week | Read | Build |
|------|------|-------|
| 19 | Q 316–317 | React page listing products from your API |
| 20 | Q 318–319 | Next.js page with SSR or SSG |
| 21 | Q 320 | Memoize list; profile with DevTools |

**Month 5 deliverable:** 48 LC problems logged + optional Next.js frontend.

---

### Month 6 — Behavioral, mocks, applications (Weeks 22–26)

**Goal:** Interview-ready — not just “studied a lot.”

#### Week 22 — Behavioral (Q 294–300)

Prepare **8 STAR stories** (2 min spoken each):

| # | Story | Maps to |
|---|--------|---------|
| 1 | Production incident | Q 269 |
| 2 | Mentoring junior | Q 270 |
| 3 | Pushed back on bad idea | Q 271 |
| 4 | Missed deadline / recovery | Q 272 |
| 5 | Code review conflict | Q 273 |
| 6 | Tech debt win | Q 232 |
| 7 | Cross-team delivery | Leadership |
| 8 | AI feature shipped | Q 268 |

**Daily:** practice 2 stories aloud.

#### Week 23 — Full mocks

| Mock | Content |
|------|---------|
| 1 | 45 min system design |
| 2 | 2 LC mediums timed |
| 3 | 30 min behavioral |
| 4 | Technical deep-dive on RAG project |

#### Week 24 — Gap week

- Re-read flagged weak Q from months 1–5
- Re-do 6 hardest LC problems
- Update resume + LinkedIn with RAG project

#### Week 25 — Start applying

| Activity | Time |
|----------|------|
| Tailor resume per JD | 2h |
| Apply 5–10 roles/week | Ongoing |
| 1 LC/day maintenance | 30 min |
| Review Q 301–305 (take-home tips) | 1h |

#### Week 26 — Interview mode

| Rule | Why |
|------|-----|
| No new topics | Confidence > cramming |
| 1 LC easy/medium/day | Stay warm |
| Review STAR + RAG demo script | First rounds |
| Light read Q 278, 284, 291 | Security + AI safety |

**Month 6 deliverable:** Applications live + 6+ mocks completed.

---

### Weekly rhythm (all 6 months)

| When | Duration | Activity |
|------|----------|----------|
| Mon–Fri | 1.5h | 40 min read 4–6 Q → 40 min code → 10 min log weak topics |
| Sat | 3–4h | Project OR system design OR timed LC mock |
| Sun | 2h | Review + explain aloud OR rest (every 4th week: light only) |

---

### 6-month milestone checklist

| Skill | Target by end |
|-------|----------------|
| JS / Node / Mongo | Explain any Q 1–225 confidently |
| Extended (Part IV) | Skim Q 326–360; hands-on 2+ topics (queue, ORM, K8s, or AWS) |
| System design | 5 designs: URL shortener, chat, checkout, notifications, RAG search |
| Portfolio | 2 repos: **production API** + **RAG project** |
| LeetCode | **48+ mediums** (Q 321–325 checklists) |
| Behavioral | **8 STAR stories** under 2 min each |
| Mocks | **6+ full mocks** |
| Applications | Start **Week 25** (month 6) |

---

### What to skip (save time)

| Skip if… | Section |
|----------|---------|
| Backend-only JD | Q 316–320 (React) — read only |
| No GraphQL in JD | Q 306–310 hands-on — read only |
| No Postgres at work | Q 258–263 — one exercise enough |
| No K8s at work | Q 349–354 — read only |
| No message queues | Q 335–340 — read only |

---

### Calendar (starting June 2026)

| Month | Focus | Start applying? |
|-------|--------|-----------------|
| Jun | Month 1 — JS, Node, Mongo | No |
| Jul | Month 2 — System design, Docker | No |
| Aug | Month 3 — TS, tests, GraphQL/Redis | No |
| Sep | Month 4 — RAG portfolio | No |
| Oct | Month 5 — LeetCode + React | No |
| Nov | Month 6 — Mocks + apply | **Yes — Week 25** |

Target interview-ready: **December 2026 / January 2027**.

---

*Last updated: June 2026 — 360 Q&A total (merged core, Parts I–IV + Appendix)*
