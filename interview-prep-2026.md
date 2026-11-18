# JavaScript · Node.js · MongoDB — 400 Interview Q&A (2026 Complete Guide)

> The concept bank for a 5–6 year backend interview. Questions 1–400 each have an answer, a code example, a difficulty, a production use, and two follow-ups with answers. Questions 401–445 are the senior TypeScript set and include the same. Q9, Q10, and Q150 keep their longer event-loop explanations, with answers under the follow-ups.
>
> Do not look here for Deloitte round order, salary, or your self-introduction. That is [`senior-nodejs-mnc-playbook-2026.md`](./senior-nodejs-mnc-playbook-2026.md). Output prediction is [`interview-tricky-qsns-2026.md`](./interview-tricky-qsns-2026.md).
>
> Assumed versions: Node.js 24 LTS for new APIs named in Part VI, and Node.js 22+ for `nextTick`-before-promises and `AbortSignal.timeout`. MongoDB 8.x for the aggregation behaviour discussed in Part VI.

---

## Table of Contents

| Part | Section | Questions |
|------|---------|-----------|
| **I** | [Core Fundamentals](#part-i--core-fundamentals) | |
| JavaScript | 1–79, **361–366, 369, 374–376, 379** |
| | Node.js | 80–157 |
| | MongoDB | 158–225 |
| **II** | [Senior — System Design & Architecture](#part-ii--senior--system-design--architecture) | |
| | System Design & Scalability | 226–240 |
| | TypeScript for Node.js | 241–250, **401–445** |
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
| | Modern JavaScript ES2023–2026 | 326–334, **381–389, 399** |
| | Message Queues & Async Jobs | 335–340 |
| | ORMs & Data Access | 341–348 |
| | Kubernetes Hands-On | 349–354 |
| | Cloud & CI/CD | 355–360 |
| **V** | [Missing Topics — Gap Fill](#part-v--missing-topics--gap-fill) | |
| | JavaScript gaps | 361–366, 369, 374–376, 379 |
| | Node.js gaps | 363–365, 370–373, 377 |
| | MongoDB gaps | 367–368, 378, 380 |
| **VI** | [Mid-2026 Release Updates (Aug 2026)](#part-vi--mid-2026-release-updates-aug-2026) | |
| | ECMAScript 2026 (ratified Jun 30) | 381–389, 399 |
| | Node.js 24 LTS | 390–393, 400 |
| | MongoDB 8.0 / 8.3 | 394–398 |
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


**Difficulty:** Screening

**Real-world:** A Node handler and a browser script share the language and not the I/O model.

**Follow-up 1:** Why does that single thread matter on a server?

**Answer:** A synchronous 200ms loop in one request delays every other request on that process. Async I/O does not move CPU work off the thread.

**Follow-up 2:** What would you measure before blaming Mongo?

**Answer:** Event-loop lag beside the Mongo timer. If lag is high and the query is fast, the handler is blocking.

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


**Difficulty:** Screening

**Real-world:** Loop variables and block scope still show up in review.

**Follow-up 1:** What does a `var` index do inside `setTimeout` in a loop?

**Answer:** Every callback sees the final value, because there is one function-scoped binding. `let` gives one binding per iteration.

**Follow-up 2:** Why is `const` wrong for a counter you increment?

**Answer:** `const` forbids reassignment. Use `let` for the counter and `const` for the object the counter describes.

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


**Difficulty:** Screening

**Real-world:** Hoisting explains temporal dead zone bugs, not a reason to use `var`.

**Follow-up 1:** What is initialised, and what is only reserved?

**Answer:** `var` is initialised to `undefined`. `let` and `const` are in the temporal dead zone until their line. A function declaration is hoisted with its body.

**Follow-up 2:** Where does this still bite a TypeScript build?

**Answer:** TypeScript erases types. A `var` or a function declaration still hoists in the emitted JavaScript.

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


**Difficulty:** Intermediate

**Real-world:** TDZ is why a circular `const` initialiser throws.

**Follow-up 1:** Show the line that throws.

**Answer:** Any read of `let` or `const` before its declaration, including a function called before the line if that function closes over the binding and runs immediately.

**Follow-up 2:** `typeof undeclared` versus `typeof` a TDZ binding?

**Answer:** `typeof` an undeclared name is `"undefined"`. `typeof` a `let` in the TDZ throws `ReferenceError`.

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


**Difficulty:** Intermediate

**Real-world:** Closures keep caches, debounce timers, and per-request state alive.

**Follow-up 1:** What is retained after the outer function returns?

**Answer:** The inner function and every binding it uses. A large buffer closed over by a long-lived listener will not be collected.

**Follow-up 2:** How do you use a closure for a concurrency limit without a class?

**Answer:** The `inFlight` counter and the queue live in the outer function. The returned function closes over them. That is the limiter in the playbook.

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


**Difficulty:** Intermediate

**Real-world:** Lexical scope is why a callback sees the variables where it was written.

**Follow-up 1:** Does `this` follow lexical scope?

**Answer:** Not for a normal function. `this` depends on the call. An arrow function takes `this` from the enclosing lexical scope.

**Follow-up 2:** A sibling block declares `const secret`. Can the other block see it?

**Answer:** No. A block is a scope boundary. The binding is not visible to a sibling block.

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


**Difficulty:** Intermediate

**Real-world:** Express class methods lose `this` when passed as callbacks.

**Follow-up 1:** What is `this` in a strict-mode function called as a bare callback?

**Answer:** `undefined`. Reading `this.service` throws. Bind the method or wrap it.

**Follow-up 2:** Name four call patterns and the `this` you get.

**Answer:** Method call uses the receiver. A bare call is `undefined` in strict mode. `call`/`apply`/`bind` set it. An arrow ignores those and uses the outer `this`.

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


**Difficulty:** Intermediate

**Real-world:** Arrows are the right tool for callbacks and the wrong tool when you need `arguments` or a prototype method.

**Follow-up 1:** Why can you not use an arrow as a constructor?

**Answer:** It has no `[[Construct]]` and no own `this`. `new` throws.

**Follow-up 2:** When is a class-field arrow a problem?

**Answer:** It is created per instance, so it is not shared on the prototype, and a test that swaps the prototype method will not see it.

---
### 9. What is the event loop?

**Difficulty:** Intermediate in the browser. Advanced once Node phases and `nextTick` are included.

**Expected time:** 2–3 minutes.

**Answer:** JavaScript runs your code on one call stack. The event loop starts the next callback only when that stack is empty. In the browser model: finish sync code, drain the microtask queue (promises, `queueMicrotask`), then run one task (`setTimeout`, I/O). Node is stricter. After the current stack, drain `process.nextTick`, then promise microtasks, then continue the libuv phase (timers, poll, check). “Macrotask” is browser vocabulary. In a Node interview, name the phase.

**Example:**
```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Browser and Node: 1, 4, 3, 2
```

**Production:** A 200ms synchronous loop in an Express handler delays every other request on that process, including timers that are already due. Move CPU work off the request path.

**Common mistake:** Saying promises and `setTimeout(0)` are the same queue. They are not. Promises run first.

**Follow-ups:** Where does `process.nextTick` sit? When is `setImmediate` ordered before `setTimeout(0)`? What does a recursive `nextTick` do to I/O?

**Where else:** Redraw the loop in [`basics-js-node-flowcharts-2026.md`](./basics-js-node-flowcharts-2026.md) topics 1 and 12. Predict output in [`interview-tricky-qsns-2026.md`](./interview-tricky-qsns-2026.md) Q36–Q43. Company scenarios are in the playbook, not here.

**Answers to those follow-ups:** `process.nextTick` runs before promise microtasks. `setImmediate` runs before `setTimeout(0)` inside an I/O callback, and the order is not fixed at the top level. A recursive `nextTick` never reaches the poll phase, so I/O and health checks stall.

---
### 10. Microtasks vs macrotasks?

**Difficulty:** Intermediate. The Node follow-up is advanced.

**Answer:** Microtasks (`Promise.then`, `queueMicrotask`, `await` continuations) run after the current stack and before the next timer or I/O callback. The loop drains the whole microtask queue, including tasks queued by those microtasks. A timer callback is one task; it does not jump the queue.

In Node, `process.nextTick` is a separate queue that runs before promise microtasks. It is not a promise, and it is not a timer.

**Example:**
```javascript
setTimeout(() => console.log('timer'), 0);
queueMicrotask(() => console.log('micro 1'));
Promise.resolve().then(() => console.log('micro 2'));
process.nextTick(() => console.log('nextTick')); // Node only
// Node: nextTick, micro 1, micro 2, timer
```

**Common mistake:** Teaching “sync → microtasks → macrotasks” as the Node order and forgetting `nextTick`. That order is the browser order.

**Follow-up 1:** What happens if a microtask queues another microtask forever?

**Answer:** I/O never runs. A recursive `process.nextTick` does the same thing: the loop never reaches the poll phase, so a health check stalls.

**Follow-up 2:** In the example, why is `nextTick` printed before `micro 1`?

**Answer:** Node drains the `nextTick` queue before promise microtasks and `queueMicrotask`. The timer runs only after both queues are empty.

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


**Difficulty:** Intermediate

**Real-world:** Every async Express path is a promise, whether you wrote `.then` or not.

**Follow-up 1:** What states can a promise be in, and can it leave a settled state?

**Answer:** Pending, fulfilled, or rejected. Once settled, it stays settled. A later `resolve` is ignored.

**Follow-up 2:** Why does `throw` inside a `.then` reject the chain?

**Answer:** The callback's throw becomes a rejection of the promise returned by `.then`. Without a `.catch` or an `await` in try/catch, it is an unhandled rejection.

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


**Difficulty:** Intermediate

**Real-world:** Fan-out to three downstreams is the Infosys-style question.

**Follow-up 1:** When do you refuse `Promise.all`?

**Answer:** When one failure must not hide the others, or when a call is not safe to start in parallel because it depends on the previous result. Use `allSettled` for independent optional calls.

**Follow-up 2:** What does `all` do to the results order?

**Answer:** The output array matches the input order, not the completion order. A rejection fails the whole aggregate.

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


**Difficulty:** Intermediate

**Real-world:** `await` in a loop is a latency bug when the calls are independent.

**Follow-up 1:** What does `await` pause?

**Answer:** That async function, not the thread. Other requests keep running unless the awaited work is synchronous CPU.

**Follow-up 2:** How do you convert a rejected await into a 404 rather than a 500?

**Answer:** Catch the typed error and pass it to `next`, or return a result union. A bare `Error` from a library should become a 500 in one middleware, not in every handler.

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


**Difficulty:** Screening

**Real-world:** The lesson is composition, not a history lecture.

**Follow-up 1:** What replaced the pyramid, and what problem remains?

**Answer:** Promises and async/await flattened the syntax. You can still forget cancellation, timeouts, and partial failure.

**Follow-up 2:** Show a chain that swallows a rejection.

**Answer:** A `.then` with no `.catch` and no returned promise to the caller. The route looks successful while the write failed.

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


**Difficulty:** Intermediate

**Real-world:** Prototype methods are shared. Own properties are not.

**Follow-up 1:** Where does `class` put a method?

**Answer:** On the prototype, same as assigning `Constructor.prototype.method`. Instances do not each get a copy.

**Follow-up 2:** Why is mutating `Object.prototype` an incident?

**Answer:** Every object lookup can see the new property. It breaks `for...in`, libraries, and security assumptions. Do not do it.

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


**Difficulty:** Screening

**Real-world:** `==` hides coercion bugs in request comparisons.

**Follow-up 1:** Why is `req.query.limit == 0` a trap?

**Answer:** `""` and `false` also compare equal under `==` in some neighbouring checks. Compare with `===` after you parse the query into a number.

**Follow-up 2:** Name a case where `==` is intentional.

**Answer:** `value == null` checks both `null` and `undefined`. Many codebases still prefer an explicit check so the next reader does not have to remember the rule.

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


**Difficulty:** Intermediate

**Real-world:** Coercion shows up in sort, in `+`, and in query strings.

**Follow-up 1:** Why does `[10, 2, 1].sort()` return `[1, 10, 2]`?

**Answer:** The default sort stringifies. `"10"` is before `"2"`. Pass `(a, b) => a - b` for numbers.

**Follow-up 2:** What is `+'5'` versus `'5'+1`?

**Answer:** Unary plus coerces to the number 5. `+` with a string concatenates, so you get `"51"`.

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


**Difficulty:** Screening

**Real-world:** NaN from a bad query must not become a Mongo operator.

**Follow-up 1:** How do you detect NaN?

**Answer:** `Number.isNaN(x)`. `x === NaN` is always false. `typeof NaN` is `"number"`.

**Follow-up 2:** What does a NaN `limit` do if you pass it to Mongo?

**Answer:** It can throw or be interpreted in a way you did not mean. Reject the query with 400 if `Number.isFinite` fails.

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


**Difficulty:** Screening

**Real-world:** Missing JSON fields and explicit nulls are different in PATCH.

**Follow-up 1:** Which one means the client sent null?

**Answer:** `null` means a value was sent. `undefined` usually means the key was omitted, and `JSON.stringify` drops undefined fields.

**Follow-up 2:** How should a PATCH treat them?

**Answer:** Omitted means leave the column alone. `null` means clear it, if the product allows clear. `exactOptionalPropertyTypes` plus Zod makes that distinction explicit.

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


**Difficulty:** Intermediate

**Real-world:** Optional chaining hides missing data. Do not use it to hide a missing auth check.

**Follow-up 1:** What does `user?.orgId` become when user is null?

**Answer:** `undefined`. It does not throw. The next bug is treating that undefined as 'no filter' and returning every organisation.

**Follow-up 2:** When must you not use `?.` on a required field?

**Answer:** On a field that must exist for the write. Fail the request. Optional chaining is for genuinely optional data, not for skipping validation.

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


**Difficulty:** Intermediate

**Real-world:** `||` treats 0 and `""` as missing. Fees and counts break.

**Follow-up 1:** Give a value where `??` and `||` differ.

**Answer:** `0`, `""`, and `false`. `??` only substitutes for `null` and `undefined`. A free appointment fee of 0 must use `??`.

**Follow-up 2:** Is `??` the same as a default parameter?

**Answer:** A default parameter also applies for `undefined`, not for `null`. `function f(n = 1)` with `f(null)` binds `null`, not `1`.

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


**Difficulty:** Screening

**Real-world:** Destructuring a missing body throws or yields undefined depending on the default.

**Follow-up 1:** What throws: `const { id } = req.body` when body is undefined?

**Answer:** Reading a property of undefined throws. Default the object: `const { id } = req.body ?? {}` and then validate `id`.

**Follow-up 2:** Can you rename while destructuring?

**Answer:** Yes. `const { id: appointmentId } = doc` reads `id` and binds `appointmentId`.

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


**Difficulty:** Intermediate

**Real-world:** Spread is shallow. Nested state is still shared.

**Follow-up 1:** After `const b = { ...a }`, you change `b.address.city`. What happens to `a`?

**Answer:** It changes too. `address` is the same object. Use `structuredClone` when you need a deep copy of plain data.

**Follow-up 2:** What does object spread do with an undefined source in an array?

**Answer:** Array spread of undefined throws. Object spread of null or undefined in modern JS is a no-op: `{ ...undefined }` is `{}`. Do not confuse the two.

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


**Difficulty:** Screening

**Real-world:** Rest collects what you did not name. It is a real array.

**Follow-up 1:** How is rest different from `arguments`?

**Answer:** Rest is a real array and does not include the named parameters before it. `arguments` is array-like, includes all arguments, and does not exist on arrows.

**Follow-up 2:** A route handler uses rest for query flags. What do you validate?

**Answer:** The list length and each flag against an allow-list. Rest does not validate.

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


**Difficulty:** Intermediate

**Real-world:** Middleware is a higher-order function: it takes a handler and returns a handler.

**Follow-up 1:** Write the shape of `asyncHandler`.

**Answer:** `(fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)`.

**Follow-up 2:** What is the risk of a higher-order helper that swallows errors?

**Answer:** The caller thinks the write succeeded. Always forward the rejection. Do not `catch` and return undefined.

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


**Difficulty:** Screening

**Real-world:** `map` builds a new array. `forEach` is for side effects and returns undefined.

**Follow-up 1:** What does `map` do with a missing return?

**Answer:** It inserts `undefined` for that index. A forgotten return becomes a hole of undefineds that later code treats as documents.

**Follow-up 2:** Why is `forEach` plus `await` a bug?

**Answer:** `forEach` does not await the promises it starts. Use a `for...of` loop or `Promise.all` on a `map` that returns promises.

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


**Difficulty:** Screening

**Real-world:** `find` returns the element or undefined. `filter` returns an array.

**Follow-up 1:** A missing patient: which do you use?

**Answer:** `find` when there is one id. Undefined becomes a 404. `filter` is for a list the client asked to search.

**Follow-up 2:** What does `find` return when nothing matches?

**Answer:** `undefined`, not null and not an empty array. Check it before you read `_id`.

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


**Difficulty:** Intermediate

**Real-world:** Reduce is how you group a small in-memory page. It is not a substitute for a Mongo aggregation on a million rows.

**Follow-up 1:** What is the initial value for?

**Answer:** It sets the accumulator type and the result on an empty array. Without it, an empty array throws, and the first element becomes the accumulator.

**Follow-up 2:** When do you refuse to reduce a query result in Node?

**Answer:** When the set is large. Aggregate in Mongo and return the summary. Pulling every appointment into Node to sum it will blow memory.

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

**Difficulty:** Intermediate

**Real-world:** `flatMap` maps and flattens one level. It is the right tool for a join in memory of a small array.

**Follow-up 1:** How many levels does `flatMap` flatten?

**Answer:** One. Nested arrays deeper than that remain nested. Use a recursive flatten or `flat` with a depth if you truly need more.

**Follow-up 2:** A `flatMap` that parses each line and sometimes returns [] — why is that useful?

**Answer:** It drops invalid lines without a separate filter. An empty array contributes nothing.

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


**Difficulty:** Intermediate

**Real-world:** Debounce on the server coalesces a burst of invalidations.

**Follow-up 1:** Debounce versus throttle in one sentence each?

**Answer:** Debounce runs after the calls stop. Throttle runs at most once per window.

**Follow-up 2:** What bug does a shared debounce timer cause across users?

**Answer:** One global timer collapses different users into one call. Key the timer by user or resource id, or you will refresh the wrong cache.

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


**Difficulty:** Intermediate

**Real-world:** Throttle a metrics emit. Do not throttle a payment POST.

**Follow-up 1:** Why is throttle the wrong fix for double-submit of a booking?

**Answer:** Throttle drops calls on a timer. Two clicks far enough apart still create two bookings. Idempotency key and a unique index are the fix.

**Follow-up 2:** Where does throttle belong?

**Answer:** Logging, scroll-like client events, and a metrics flush. The leading call runs, the rest in the window collapse.

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


**Difficulty:** Intermediate

**Real-world:** Currying is optional style. Partial application of a repository with a fixed `orgId` is the useful form.

**Follow-up 1:** Why curry `orgId` into a repository call?

**Answer:** So a handler cannot forget the tenant. `withOrg(orgId).find(id)` always includes the scope.

**Follow-up 2:** What is the cost?

**Answer:** More closures and a harder stack trace. Do not curry a three-line script. Do it when the forgotten argument is a security bug.

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


**Difficulty:** Intermediate

**Real-world:** Memoize pure functions. Do not memoize a function that reads the clock or the database unless the key includes the tenant and a TTL.

**Follow-up 1:** What key bug does `JSON.stringify` have as a cache key?

**Answer:** Key order: `{a:1,b:2}` and `{b:2,a:1}` are different strings. Undefined fields disappear. Build the key from an explicit list.

**Follow-up 2:** What leak does an unbounded memoize cause?

**Answer:** The map grows with every distinct argument for the life of the process. Cap it or use an LRU.

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


**Difficulty:** Screening

**Real-world:** IIFEs were modules before modules. You rarely write one now.

**Follow-up 1:** What did an IIFE give you that a module gives you today?

**Answer:** A private scope that does not leak locals to the global object. ESM does that by default.

**Follow-up 2:** Is an IIFE async?

**Answer:** An async IIFE is still a common way to use `await` at the top of a CommonJS file. It returns a promise you should catch.

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


**Difficulty:** Intermediate

**Real-world:** Modules and classes are strict already.

**Follow-up 1:** Name two strict-mode differences that matter in Node.

**Answer:** Assigning to an undeclared variable throws. `this` in a bare function is `undefined`, not `global`.

**Follow-up 2:** Why did a sloppy `this` work in a browser script and throw in a module?

**Answer:** The module is strict. `this` is undefined. The browser script was sloppy and `this` was `window`.

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


**Difficulty:** Intermediate

**Real-world:** `bind` returns a new function. `call` invokes immediately.

**Follow-up 1:** You pass `controller.me` to Express. Which do you use?

**Answer:** `controller.me.bind(controller)`, or a wrapper. `call` would invoke it during registration, which is wrong.

**Follow-up 2:** What is the difference between `call` and `apply`?

**Answer:** `call` takes arguments one by one. `apply` takes an array. Both set `this` and invoke now.

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


**Difficulty:** Intermediate

**Real-world:** Generators are rare in request handlers. They matter when you see a library that pulls values.

**Follow-up 1:** What does `yield` do to the generator?

**Answer:** It pauses and returns the value to the caller of `next`. The generator resumes on the following `next`.

**Follow-up 2:** Why not use a generator to stream a million Mongo rows?

**Answer:** A cursor and a Node stream already do that with backpressure. A generator the caller pulls without a limit will still buffer if the consumer is slow and you queued ahead.

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


**Difficulty:** Screening

**Real-world:** Iterators are the protocol behind `for...of`.

**Follow-up 1:** What methods does the protocol need?

**Answer:** `next()` returning `{ value, done }`. The iterable implements `@@iterator` or `Symbol.iterator`.

**Follow-up 2:** What happens if `done` is never true?

**Answer:** `for...of` never ends. A bug in a custom iterator becomes a stuck request.

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


**Difficulty:** Advanced

**Real-world:** Proxies can enforce invariants or hide a validation bug. They also hide stack traces.

**Follow-up 1:** When would you use a Proxy in an API?

**Answer:** Rarely. A possible use is a dev-only guard that throws if code reads an unknown config key. Do not proxy a Mongoose document you do not own.

**Follow-up 2:** What is the performance cost?

**Answer:** Every get and set goes through a trap. Hot paths get slower and optimisers give up. Measure before you leave a Proxy on a request object.

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


**Difficulty:** Intermediate

**Real-world:** Symbols create non-string keys that will not collide with user data.

**Follow-up 1:** Will `JSON.stringify` include a symbol key?

**Answer:** No. Symbol keys are omitted. Do not store an id the client must see in a symbol key.

**Follow-up 2:** `Symbol.for` versus `Symbol()`?

**Answer:** `Symbol.for` reuses a global registry entry. `Symbol()` is unique. Use the registry only when two packages must share the key.

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


**Difficulty:** Intermediate

**Real-world:** Map keys can be objects. Object keys are strings.

**Follow-up 1:** When do you pick Map over a plain object for a cache?

**Answer:** When keys are not strings, when you add and delete often, or when you need insertion order and a size.

**Follow-up 2:** What does a Map hold that blocks GC?

**Answer:** The keys and values. Use WeakMap if the key is an object that should be collectable and you only need metadata.

---
### 42. What is Set? Set vs WeakSet?

**Answer:** A `Set` stores unique values of any type (primitives or objects). Duplicates are ignored by `SameValueZero`. Common uses: deduplication, membership tests, visited nodes.

A `WeakSet` holds only **objects**. References are **weak**: if nothing else points to an object, it can be garbage-collected and drops out of the WeakSet. WeakSet is not iterable, has no `.size`, and only supports `.add`, `.has`, and `.delete`. Use it to tag objects (e.g. “already processed”) without preventing GC — same idea as `WeakMap`, but for membership instead of key→value.

| | Set | WeakSet |
|--|-----|---------|
| Values | Any type | Objects only |
| Iterable / `.size` | Yes | No |
| GC | Strong refs — keeps values alive | Weak refs — values can be GC’d |
| Typical use | Unique lists, algorithms | Object tagging without leaks |

**Example:**
```javascript
const tags = ['sale', 'new', 'sale', 'featured'];
const unique = [...new Set(tags)];
const viewed = new Set();
['p1','p2','p1'].forEach(id => viewed.add(id));
console.log(unique, viewed.size); // ['sale','new','featured'] 2

// WeakSet: mark DOM/nodes/objects as seen without retaining them
const processed = new WeakSet();
function handleOrder(order) {
  if (processed.has(order)) return;
  processed.add(order);
  // ... process once; when `order` is unreachable, WeakSet entry can be GC'd
}
```


**Difficulty:** Intermediate

**Real-world:** Set dedupes appointment ids in a request. WeakSet does not keep the object alive.

**Follow-up 1:** What does Set use for equality?

**Answer:** SameValueZero. Objects are compared by reference, not by deep value. Two equal-looking `{id}` objects are both kept.

**Follow-up 2:** Why is WeakSet not iterable?

**Answer:** So it cannot be used to enumerate the objects it is not supposed to keep alive. Use it for 'have I seen this request object'.

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


**Difficulty:** Intermediate

**Real-world:** Shallow copy bugs share nested patient addresses.

**Follow-up 1:** Name two copies and what they drop.

**Answer:** `structuredClone` copies plain data and Dates, and rejects functions. `JSON.parse(JSON.stringify(x))` drops undefined, converts Date to string, and throws on cycles.

**Follow-up 2:** Is a spread of an array a deep copy?

**Answer:** No. Nested objects inside the elements are shared.

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


**Difficulty:** Intermediate

**Real-world:** Immutability is a convention until you freeze or you copy.

**Follow-up 1:** Does `const` make the object immutable?

**Answer:** No. It blocks rebinding the variable. The properties can still change.

**Follow-up 2:** When do you copy instead of mutate a cache entry?

**Answer:** When another request may be reading that object. Mutating it changes the cached response for everyone.

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


**Difficulty:** Screening

**Real-world:** Bubbling is a browser event question that still appears on full-stack MNC screens.

**Follow-up 1:** How do you stop a click from reaching a parent?

**Answer:** `event.stopPropagation()`. `stopImmediatePropagation` also stops other listeners on the same node.

**Follow-up 2:** Does this exist in Node HTTP?

**Answer:** Not as DOM bubbling. Do not drag this answer into an Express design. Say it is a browser event model.

---
### 46. Event capturing?

**Answer:** Capturing (trickling) propagates the event from the root down to the target before bubbling. Register with `{ capture: true }` or third argument `true`. Rare in app code but used for global interceptors.

**Example:**
```javascript
document.addEventListener('click', () => console.log('capture phase'), true);
document.getElementById('cart')?.addEventListener('click', () => console.log('bubble phase'));
```


**Difficulty:** Screening

**Real-world:** Capturing runs from the window down to the target.

**Follow-up 1:** Which option registers a capture listener?

**Answer:** `addEventListener(type, fn, true)` or `{ capture: true }`.

**Follow-up 2:** Order relative to the target listener?

**Answer:** Capture listeners run on the way down, then the target, then bubble on the way up.

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


**Difficulty:** Intermediate

**Real-world:** Delegation is one listener on a parent for many children.

**Follow-up 1:** Why is that better for a long list?

**Answer:** You do not add a listener per row. Rows can be created later and still match.

**Follow-up 2:** What do you check in the handler?

**Answer:** `event.target` closest to the selector you care about. Ignore clicks on the gaps.

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


**Difficulty:** Screening

**Real-world:** The DOM is the browser document tree. Node has no DOM unless you parse HTML yourself.

**Follow-up 1:** Why do interviewers ask this of a backend candidate?

**Answer:** To see if you know where the browser stops and the server starts. Your API returns JSON. The client builds the DOM.

**Follow-up 2:** What is a virtual DOM in one sentence?

**Answer:** A plain structure React diffs before it touches the real DOM. It is not a Node concept.

---
### 49. localStorage vs sessionStorage?

**Answer:** Both store key-value string pairs in the browser. `localStorage` persists until cleared; `sessionStorage` clears when the tab closes. Neither should store sensitive tokens without caution — use httpOnly cookies for auth.

**Example:**
```javascript
localStorage.setItem('cart', JSON.stringify([{ id: 1, qty: 2 }]));
const cart = JSON.parse(localStorage.getItem('cart') || '[]');
sessionStorage.setItem('checkoutStep', '2');
```


**Difficulty:** Screening

**Real-world:** Do not put a refresh token in localStorage if you can use an httpOnly cookie.

**Follow-up 1:** Who can read localStorage?

**Answer:** Any script on that origin, including an XSS payload. sessionStorage dies with the tab. Neither is sent to the server automatically.

**Follow-up 2:** What does the server use instead for a session id?

**Answer:** An httpOnly, Secure, SameSite cookie, or a bearer token the client sends on purpose.

---
### 50. What is a cookie?

**Answer:** Cookies are small name-value pairs sent with HTTP requests, set via `Set-Cookie` headers or `document.cookie`. They support expiry, `Secure`, `HttpOnly`, and `SameSite` flags. Used for sessions, preferences, and tracking within size limits (~4KB).

**Example:**
```javascript
// Server sets: Set-Cookie: sessionId=abc; HttpOnly; Secure; SameSite=Strict
document.cookie = 'theme=dark; path=/; max-age=86400';
const hasTheme = document.cookie.includes('theme=dark');
```


**Difficulty:** Intermediate

**Real-world:** Cookies are the browser's automatic credential. That is why CSRF exists.

**Follow-up 1:** Which flags do you set on a session cookie?

**Answer:** HttpOnly, Secure, and SameSite. SameSite=Lax is the usual default. Strict if the product can stand it.

**Follow-up 2:** Why is a JWT in a cookie different from a JWT in a header?

**Answer:** The cookie is sent automatically, so a forged cross-site request can include it. A header is not sent automatically.

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


**Difficulty:** Intermediate

**Real-world:** CORS is a browser rule. curl does not enforce it.

**Follow-up 1:** Why does a credentialed request fail with `*`?

**Answer:** Browsers forbid `Access-Control-Allow-Origin: *` together with credentials. Reflect the specific origin from an allow-list.

**Follow-up 2:** What does a preflight check?

**Answer:** An OPTIONS request for methods and headers outside the simple set, including `Authorization` and `Content-Type: application/json` in many cases.

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


**Difficulty:** Screening

**Real-world:** JSON is the wire format. It is not a JavaScript object yet.

**Follow-up 1:** What does JSON drop or change?

**Answer:** `undefined` and functions disappear. `Date` becomes a string if you stringify a Date. Object keys are strings.

**Follow-up 2:** Why can a large integer id change?

**Answer:** JSON numbers are IEEE doubles. Integers above `2^53-1` lose precision. Send ids as strings.

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


**Difficulty:** Intermediate

**Real-world:** `fetch` resolves on 404. It rejects on network failure.

**Follow-up 1:** What do you check before `res.json()`?

**Answer:** `res.ok` or the status. A 500 HTML body is not your DTO.

**Follow-up 2:** How do you time it out?

**Answer:** `AbortSignal.timeout(ms)` as the `signal` in Node 18+. A hung downstream must not become a 10-second API.

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


**Difficulty:** Screening

**Real-world:** XHR is the older browser client. You do not use it in Node.

**Follow-up 1:** Why might a panel still say XHR?

**Answer:** Old full-stack question lists. Answer it in one line and move to `fetch` and timeouts.

**Follow-up 2:** What did XHR give you that early `fetch` did not?

**Answer:** Upload progress events. `fetch` has gained streams. For a file upload from Node, use a stream, not XHR.

---
### 55. Same-origin policy?

**Answer:** The same-origin policy restricts how documents and scripts from one origin interact with another. Origin = protocol + host + port. It prevents malicious sites from reading your bank session but is relaxed via CORS for intentional cross-origin APIs.

**Example:**
```javascript
// https://shop.com:443 and https://api.shop.com — different origins
// https://shop.com and https://shop.com/api — same origin
```


**Difficulty:** Intermediate

**Real-world:** Same-origin is scheme, host, and port. CORS is how the server relaxes it for browsers.

**Follow-up 1:** Is `https://a.com` and `https://api.a.com` the same origin?

**Answer:** No. The host differs. The API must allow that origin explicitly if the browser should read the response.

**Follow-up 2:** Does same-origin policy protect your API from a server-side caller?

**Answer:** No. A malicious server can call you directly. Auth and object-level checks do that job, not CORS.

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


**Difficulty:** Intermediate

**Real-world:** ESM is the module system you want for new Node.

**Follow-up 1:** What is a module's scope?

**Answer:** Its own. Top-level variables are not globals.

**Follow-up 2:** What does a circular import return?

**Answer:** The exports that have been initialised so far. A binding used before initialisation is undefined or throws in TDZ. Do not build cycles on purpose.

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


**Difficulty:** Advanced

**Real-world:** CommonJS `require` is synchronous. ESM `import` is static and live-bound.

**Follow-up 1:** Can you `require` an ESM file?

**Answer:** Not reliably from old CommonJS without a dynamic `import()`. Pick one module system for the service.

**Follow-up 2:** `__dirname` in ESM?

**Answer:** It does not exist. Build it from `import.meta.url` and `fileURLToPath`.

---
### 58. Tree shaking?

**Answer:** Tree shaking eliminates unused exported code during bundling. It requires static ESM imports so bundlers can analyze the dependency graph. Dead code elimination reduces bundle size for production SPAs.

**Example:**
```javascript
// utils.js exports many helpers; app only imports one
import { formatCurrency } from './utils.js'; // only formatCurrency bundled
console.log(formatCurrency(99.5));
```


**Difficulty:** Intermediate

**Real-world:** Tree shaking drops unused ESM exports when the bundler can see them.

**Follow-up 1:** Why does CommonJS tree-shake poorly?

**Answer:** `require` is dynamic. The bundler cannot always tell what is unused.

**Follow-up 2:** What stops a function from being dropped?

**Answer:** A side effect at import time, or a re-export the bundler cannot prove is unused. Mark `sideEffects` honestly in package.json.

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


**Difficulty:** Advanced

**Real-world:** Leaks in Node are retained objects, not a failure of the GC to run.

**Follow-up 1:** Name three retainers you have seen in services.

**Answer:** A global array of logs, an event listener added per request, and a cache Map with no cap.

**Follow-up 2:** How do you prove a leak?

**Answer:** Two heap snapshots under the same traffic. The retainer path shows the owner. RSS alone can be fragmentation.

---
### 60. Garbage collection?

**Answer:** JavaScript engines like V8 use automatic garbage collection, primarily mark-and-sweep, to reclaim memory from unreachable objects. Developers do not manually free memory but must avoid retaining references that prevent collection. Prefer `WeakMap` / `WeakSet` when you attach metadata or tags to objects and want those entries to disappear when the objects become unreachable (unlike `Map` / `Set`, which keep strong references).

**Example:**
```javascript
function processOrders(orders) {
  const cache = new WeakMap(); // keys can be GC'd when order objects are gone
  const seen = new WeakSet();  // membership only; also weak
  orders.forEach(o => {
    if (seen.has(o)) return;
    seen.add(o);
    cache.set(o, computeTotal(o));
  });
  return orders.map(o => cache.get(o));
}
```


**Difficulty:** Intermediate

**Real-world:** V8 collects what is unreachable from roots.

**Follow-up 1:** What is a root?

**Answer:** The stack, globals, and handles the runtime keeps, including closures that are still referenced.

**Follow-up 2:** Does setting a field to null help?

**Answer:** Only if that field was the last reference. Nulling a local that is about to return does nothing useful.

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


**Difficulty:** Screening

**Real-world:** The stack is synchronous calls. Async continuations are new turns.

**Follow-up 1:** What blows the stack?

**Answer:** Synchronous recursion that never unwinds, such as a deep `flatten` on a hostile payload. Iterative flatten has a heap cost instead.

**Follow-up 2:** Is an `await` on the stack while you wait?

**Answer:** No. The function pauses and the stack unwinds. The continuation runs later as a microtask.

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


**Difficulty:** Intermediate

**Real-world:** Recursion is fine when the depth is the depth of a small tree you control.

**Follow-up 1:** What is the base case you must state?

**Answer:** The condition that returns without calling itself. Missing it is the stack overflow.

**Follow-up 2:** When do you switch to a loop?

**Answer:** When the input can be deeper than a few thousand frames, or when a user controls the nesting.

---
### 63. BigInt?

**Answer:** `BigInt` represents integers of arbitrary precision using the `n` suffix or `BigInt()`. It cannot mix with regular `Number` in arithmetic without explicit conversion. Use for large IDs, crypto, or ledger calculations.

**Example:**
```javascript
const orderCount = 9007199254740991n;
const next = orderCount + 1n;
console.log(next.toString()); // 9007199254740992
```


**Difficulty:** Screening

**Real-world:** BigInt is for integers beyond `2^53-1`. JSON does not have BigInt.

**Follow-up 1:** Can you mix BigInt and Number?

**Answer:** Not with `+`. It throws. Convert on purpose.

**Follow-up 2:** How do you send a BigInt to a client?

**Answer:** As a string. `JSON.stringify` throws on BigInt unless you provide a replacer.

---
### 64. Object.freeze?

**Answer:** `Object.freeze` makes an object shallowly immutable — no add, delete, or reassign properties. Nested objects remain mutable unless deeply frozen. Use for constants and defensive copies in shared config.

**Example:**
```javascript
const TAX_RATES = Object.freeze({ US: 0.08, EU: 0.20 });
// TAX_RATES.US = 0.1; // fails silently or throws in strict mode
console.log(Object.isFrozen(TAX_RATES));
```


**Difficulty:** Intermediate

**Real-world:** `freeze` is shallow and blocks mutation of that object's properties.

**Follow-up 1:** Does freeze deep-freeze?

**Answer:** No. Nested objects remain mutable.

**Follow-up 2:** What does freeze do to a new property?

**Answer:** Adding, deleting, and writing existing properties fail in strict mode and fail silently otherwise. The object is not extensible.

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


**Difficulty:** Intermediate

**Real-world:** `seal` prevents adding and deleting keys. Existing properties can still change.

**Follow-up 1:** How is that different from freeze?

**Answer:** Freeze also makes properties non-writable. Seal does not.

**Follow-up 2:** When would you seal a config?

**Answer:** Almost never in an API. Prefer a typed config parsed once. Seal is a runtime guard, not a design.

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


**Difficulty:** Intermediate

**Real-world:** A polyfill implements a missing API. It does not type it.

**Follow-up 1:** Where do you put a polyfill in Node?

**Answer:** At the process entry, before other imports use the API, and only if the runtime you support lacks it. Node 22 does not need polyfills for `fetch` or `AbortSignal.timeout`.

**Follow-up 2:** What is the risk?

**Answer:** A bad polyfill changes behaviour for every file. Prefer running on a runtime that has the feature.

---
### 67. Transpilation?

**Answer:** Transpilation converts source code from one syntax level to another — e.g., TypeScript to JavaScript or ES2024 to ES2017 via Babel. It enables modern features in older browsers while developers write current syntax.

**Example:**
```javascript
// Source (ES2024): const total = items?.reduce((a, b) => a + b.price, 0) ?? 0;
// Babel output targets older engines with helper calls
```


**Difficulty:** Screening

**Real-world:** TypeScript and Babel transpile. Node runs the emit.

**Follow-up 1:** Does a type error fail production by itself?

**Answer:** Only if the build runs `tsc` and the pipeline blocks on it. `ts-node` or a strip-only loader may not typecheck. CI must run `tsc --noEmit`.

**Follow-up 2:** What is the emit target you want for Node 22?

**Answer:** ES2022 or newer, so the output does not include ancient helpers.

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


**Difficulty:** Screening

**Real-world:** Web Workers are a browser thread. Node's equivalent is `worker_threads`.

**Follow-up 1:** Do they share the DOM?

**Answer:** No. They message data. The DOM stays on the main browser thread.

**Follow-up 2:** When would a backend candidate mention them?

**Answer:** Only to contrast with Node worker threads. Do not propose a Web Worker inside Express.

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


**Difficulty:** Screening

**Real-world:** A service worker is a browser proxy for network and cache. It is not your API.

**Follow-up 1:** What can it do that your Node process cannot?

**Answer:** Intercept that browser's fetches and serve a cached shell offline.

**Follow-up 2:** What must it not hold?

**Answer:** Long-lived authority to your API beyond the token the page already has. A bug in a service worker caches an authenticated response for the wrong user if the cache key ignores auth.

---
### 70. Temporal API?

**Answer:** The **Temporal API** replaces the flawed `Date` object with immutable types (`PlainDate`, `PlainTime`, `ZonedDateTime`) and explicit timezone/calendar handling. **ECMAScript 2026** (ratified **June 30, 2026**) includes Temporal in the spec; it ships natively in **Chrome 131+**, **Firefox 134+**, and **Node.js 22+**. Use `@js-temporal/polyfill` only for older runtimes. In interviews: Temporal fixes midnight-UTC bugs and removes the need for `moment`/`dayjs` in new projects.

**Example:**
```javascript
// Native in Node 22+ / modern browsers (Aug 2026)
const shipDate = Temporal.PlainDate.from('2026-08-05');
const deadline = shipDate.add({ days: 7 });
const zoned = shipDate.toZonedDateTime('Asia/Kolkata');
console.log(deadline.toString(), zoned.toString());
```


**Difficulty:** Advanced

**Real-world:** Temporal is the modern date API. Many codebases still use `Date` or a library.

**Follow-up 1:** What is wrong with `Date` for an appointment in Asia/Kolkata?

**Answer:** `Date` is an absolute instant. Civil time needs a time zone. Parsing `2026-11-18` as UTC versus local shifts the slot by hours.

**Follow-up 2:** Do you need Temporal in production today?

**Answer:** Only if the runtime you ship supports it. Otherwise use an explicit time zone with a maintained library, and store UTC instants in Mongo.

---
### 71. Browser vs Node event loop — key difference?

**Answer:** Both use V8 and microtasks, but Node adds libuv phases and `process.nextTick`/`setImmediate`. Browser has rendering and `requestAnimationFrame`. In interviews: Node optimizes I/O; browser optimizes UI paint. Never block either loop with CPU-heavy sync work.

**Example:**
```javascript
// BAD in both — blocks loop for 2 seconds
function bad() { const start = Date.now(); while (Date.now() - start < 2000) {} }

// GOOD — offload CPU to Worker Threads (Node) or Web Worker (browser)
```


**Difficulty:** Advanced

**Real-world:** Browser loop paints. Node's loop runs libuv phases and `nextTick`.

**Follow-up 1:** Name one API that exists only in Node's loop.

**Answer:** `process.nextTick` and `setImmediate`. `requestAnimationFrame` is the browser's.

**Follow-up 2:** Where do promise microtasks sit in both?

**Answer:** After the current stack and, in Node, after the `nextTick` queue. Before the next timer or paint.

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


**Difficulty:** Intermediate

**Real-world:** `race` settles with the first outcome, rejection included. `any` waits for the first fulfilment.

**Follow-up 1:** A timeout wrapper uses which?

**Answer:** `Promise.race` between the work and a rejecting timer. Remember to clear the timer, or you leak the handle.

**Follow-up 2:** When does `any` reject?

**Answer:** When every input rejects. The error is an `AggregateError`.

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


**Difficulty:** Intermediate

**Real-world:** `extends` sets the prototype chain. `super` calls the parent constructor or method.

**Follow-up 1:** What happens if you use `this` before `super` in a subclass constructor?

**Answer:** It throws. The parent must finish constructing first.

**Follow-up 2:** Are subclass methods on the child prototype?

**Answer:** Yes. Lookup walks to the parent prototype if the child does not override them.

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


**Difficulty:** Intermediate

**Real-world:** Objects are passed by sharing the reference. Rebinding the parameter does not rebind the caller's variable.

**Follow-up 1:** You pass an appointment object and mutate `status`. Does the caller see it?

**Answer:** Yes, if it is the same object. Reassigning the parameter to a new object does not change the caller's binding.

**Follow-up 2:** How do you avoid that surprise in a cache?

**Answer:** Copy or freeze before you hand the object to a caller who might mutate it.

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


**Difficulty:** Screening

**Real-world:** `typeof null` is `"object"`. Use `=== null`.

**Follow-up 1:** What does `instanceof` check?

**Answer:** The prototype chain. It lies across realms: an Error from `vm` or another window can fail `instanceof Error`. `Error.isError` exists in ES2026 for that.

**Follow-up 2:** `typeof` an array?

**Answer:** `"object"`. Use `Array.isArray`.

---
### 76. for...of vs for...in?

**Answer:** `for...of` iterates **values** of iterables (arrays, strings, Maps, Sets). `for...in` iterates **enumerable keys** of objects (including prototype chain) — avoid on arrays. Use `for...of` or `forEach` for arrays; `Object.keys()` + loop for objects.

**Example:**
```javascript
const order = { id: 1, items: ['a', 'b'] };
for (const item of order.items) console.log(item); // 'a', 'b'
for (const key in order) console.log(key);         // 'id', 'items'
```


**Difficulty:** Screening

**Real-world:** `for...of` walks values of an iterable. `for...in` walks enumerable keys, including inherited ones.

**Follow-up 1:** Which do you use on an array?

**Answer:** `for...of` or a numeric loop. `for...in` can see extra keys and the order is not the index order you want.

**Follow-up 2:** What does `for...in` do on a hostile object?

**Answer:** It visits enumerable prototype keys. That is one reason `hasOwn` checks exist.

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


**Difficulty:** Screening

**Real-world:** Template literals interpolate. Tagged templates pass the parts to a function.

**Follow-up 1:** Why is a tagged template used for SQL?

**Answer:** The tag can separate the literal strings from the interpolated values and bind parameters. String concatenation is how injection happens.

**Follow-up 2:** Do template literals escape HTML?

**Answer:** No. They only build a string. Escape on output if the string is HTML.

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


**Difficulty:** Advanced

**Real-world:** Cancellation is how a disconnected client stops work.

**Follow-up 1:** What do you pass to `fetch` and to Mongo?

**Answer:** An `AbortSignal`. Mongo accepts `maxTimeMS` as well. Aborting the HTTP call does not abort Mongo unless you pass the signal or the time limit.

**Follow-up 2:** What is left running if you only abort the response?

**Answer:** The query and any downstream call you already started. Wire the same signal through.

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


**Difficulty:** Screening

**Real-world:** Falsy values are a favourite filter bug.

**Follow-up 1:** List the falsy values.

**Answer:** `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`.

**Follow-up 2:** Why is `if (!appointment.fee)` wrong?

**Answer:** A fee of 0 is free and falsy. You would treat a valid free slot as missing. Check `fee == null`.

---

## Node.js (80–157)

### 80. What is Node.js?

**Answer:** Node.js is a JavaScript runtime built on Chrome's V8 engine with libuv for asynchronous, non-blocking I/O. It enables server-side APIs, CLIs, and tooling using the same language as the browser. Node excels at I/O-bound workloads like APIs and real-time apps.

**As of Aug 2026:** **Node.js 24** is **Active LTS** (entered LTS October 2025, supported until April 2028). It ships **V8 13.6**, **npm 11**, **Undici 7**, global **URLPattern**, stable **`--permission`** model, and **`AsyncLocalStorage`** backed by **AsyncContextFrame**. Use **Node 24** for new production; **Node 22** remains Maintenance LTS; **Node 20** is end-of-life bound — upgrade if still on it.

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


**Difficulty:** Screening

**Real-world:** Node is a JavaScript runtime built on V8 with libuv for I/O.

**Follow-up 1:** What does Node add that the browser does not?

**Answer:** A filesystem, sockets, `process`, worker threads, and no DOM.

**Follow-up 2:** Why do teams pick it for an API?

**Answer:** The same language as a JS client, and a model that waits on many connections without a thread per request, as long as handlers do not block.

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


**Difficulty:** Intermediate

**Real-world:** The JavaScript thread is one. The process is not only one thread.

**Follow-up 1:** What runs off the main thread?

**Answer:** libuv's pool does some filesystem, DNS, and crypto. Network sockets are non-blocking and do not use that pool.

**Follow-up 2:** What still blocks everyone?

**Answer:** A tight loop, a huge `JSON.parse`, or `bcrypt` on the request path.

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


**Difficulty:** Intermediate

**Real-world:** CPU-heavy work and a need for predictable threads are the usual no.

**Follow-up 1:** Name a job you would move out of Node.

**Answer:** Video transcode, a large PDF render, or a scientific loop. Put it on a worker, a queue, or another service.

**Follow-up 2:** Is a CRUD API a bad fit?

**Answer:** No. Waiting on Mongo and HTTP is what the event loop is for.

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


**Difficulty:** Advanced

**Real-world:** libuv is the event loop and the pool behind Node's async I/O.

**Follow-up 1:** What is the default pool size, and what shares it?

**Answer:** Four threads, via `UV_THREADPOOL_SIZE`. DNS lookups that use the pool, file I/O, and some crypto share it. A burst of file reads can delay DNS.

**Follow-up 2:** Does incoming HTTP use the pool?

**Answer:** No. Sockets are completion-based. Blocking the JavaScript thread is a separate problem.

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


**Difficulty:** Screening

**Real-world:** npm installs the tree you locked. The registry is not your build.

**Follow-up 1:** What do you commit?

**Answer:** `package-lock.json` or the lockfile your tool uses. CI runs `npm ci`, not `npm install`, so the tree matches the lock.

**Follow-up 2:** What is a private registry for?

**Answer:** Internal packages and a place you can block a known-bad version.

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


**Difficulty:** Screening

**Real-world:** package.json is the manifest: name, scripts, dependencies, module type.

**Follow-up 1:** What does `"type": "module"` change?

**Answer:** `.js` files are ESM. `require` stops working in those files.

**Follow-up 2:** Where do engines belong?

**Answer:** `engines.node` should say the major you run in production, and CI should enforce it.

---
### 86. dependencies vs devDependencies?

**Answer:** `dependencies` are required at runtime in production. `devDependencies` are only for development — tests, linters, build tools. Production installs use `npm ci --omit=dev` to exclude devDeps and reduce image size.

**Example:**
```bash
npm install express          # dependencies
npm install -D jest nodemon    # devDependencies
# Docker prod: RUN npm ci --omit=dev
```


**Difficulty:** Screening

**Real-world:** devDependencies are for build and test. They should not be required at runtime.

**Follow-up 1:** What happens if TypeScript is only a devDependency?

**Answer:** Production install with `npm ci --omit=dev` has no `tsc`. That is correct if you compile before the image runs. It is a crash if you start `ts-node` in production.

**Follow-up 2:** Why must a runtime logger be a dependency?

**Answer:** The process imports it. Omitting devDependencies would remove it.

---
### 87. What is npx?

**Answer:** `npx` executes npm packages without global installation — either from local `node_modules/.bin` or by downloading temporarily. Useful for one-off scaffolding, CLIs, and running specific package versions.

**Example:**
```bash
npx create-express-api@latest shop-api
npx nodemon src/index.js
npx eslint . --fix
```


**Difficulty:** Screening

**Real-world:** npx runs a package binary, downloading it if needed.

**Follow-up 1:** Why is `npx some-cli` a supply-chain risk in CI?

**Answer:** It can fetch whatever that name points at today. Pin the version. Prefer a dependency you locked.

**Follow-up 2:** When is npx fine?

**Answer:** A one-off local generator, not the production build.

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


**Difficulty:** Screening

**Real-world:** Express is a minimal HTTP framework: middleware, routing, response.

**Follow-up 1:** What does it not give you?

**Answer:** A composition root, validation, or auth. You add those. It also does not catch async rejections unless you wrap the handler.

**Follow-up 2:** Why do teams still choose it?

**Answer:** It is small and the types and middleware are well known. Nest is the alternative when you want structure enforced.

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


**Difficulty:** Intermediate

**Real-world:** Middleware is a function of `(req, res, next)` that runs before the handler.

**Follow-up 1:** What order do you mount auth relative to the handler?

**Answer:** After the body parser and before the handler that reads `req.user`. Error middleware is last and has four arguments.

**Follow-up 2:** What happens if you forget `next` and do not send a response?

**Answer:** The request hangs until the client times out.

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


**Difficulty:** Screening

**Real-world:** Routing matches method and path and extracts params.

**Follow-up 1:** How do you version a route?

**Answer:** A `/v1` prefix or a header. Once shipped, do not change the meaning of a field. Add a field or a new version.

**Follow-up 2:** What is the difference between `app.use` and `app.get`?

**Answer:** `use` matches a prefix and all methods. `get` is GET and a path pattern.

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


**Difficulty:** Intermediate

**Real-world:** `req.body` exists only after a parser, and only up to the size limit.

**Follow-up 1:** What is in `req.body` if the client sends JSON and you forgot `express.json()`?

**Answer:** `undefined`. The handler then throws or writes nothing.

**Follow-up 2:** What limit do you set?

**Answer:** A small JSON limit, such as 100kb, unless this route is a file upload. A huge body is a memory DoS.

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


**Difficulty:** Screening

**Real-world:** Params are the path. Query is the search string. Body is the parsed entity.

**Follow-up 1:** Which one is a string even if it looks like a number?

**Answer:** Both params and query values arrive as strings. Cast and validate. `"10"` is not `10`.

**Follow-up 2:** Where must `orgId` not come from?

**Answer:** From the body or the query, if the caller can pick another organisation. Take it from the token.

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


**Difficulty:** Advanced

**Real-world:** Error middleware is `(err, req, res, next)` registered after routes.

**Follow-up 1:** Why did your error handler never run?

**Answer:** It had three parameters, so Express treated it as normal middleware, or the async rejection never called `next`.

**Follow-up 2:** What do you send to the client on a 500?

**Answer:** A code and a generic message. The stack stays in the log with the request id.

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


**Difficulty:** Screening

**Real-world:** `next()` continues the chain. `next(err)` jumps to error middleware.

**Follow-up 1:** What does `next()` after `res.json` do?

**Answer:** It can hit another handler that tries to write again and throws. Return after you send.

**Follow-up 2:** Is `next` required in the last handler?

**Answer:** No, if you ended the response. It is required if you did not.

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


**Difficulty:** Intermediate

**Real-world:** `next('route')` skips the rest of this route's handlers and tries the next matching route.

**Follow-up 1:** When is that useful?

**Answer:** A rare fallback when the same path has two handlers and the first declines. Most APIs do not need it. Prefer an explicit router.

**Follow-up 2:** What happens if no later route matches?

**Answer:** Express falls through to 404.

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


**Difficulty:** Intermediate

**Real-world:** `express.Router` groups a module's routes and middleware.

**Follow-up 1:** Why mount a router per module?

**Answer:** Scheduling routes stay in one file with their auth. The app file only mounts routers.

**Follow-up 2:** Does a router have its own error handler?

**Answer:** It can. If it does not call `next(err)`, the app-level handler never sees the error.

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


**Difficulty:** Intermediate

**Real-world:** CORS middleware sets the allow-list. It is not authentication.

**Follow-up 1:** What origin do you allow in production?

**Answer:** The known web origins, not `*`, if the browser sends cookies or auth.

**Follow-up 2:** A curl from a bad origin still hits your API. What stops it?

**Answer:** Authentication and authorisation. CORS does not.

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


**Difficulty:** Intermediate

**Real-world:** Helmet sets safer headers: no sniff, frame options, a CSP if you configure one.

**Follow-up 1:** Does Helmet replace input validation?

**Answer:** No. It hardens the browser's handling of your responses. Injection is a separate fix.

**Follow-up 2:** What header still needs a decision?

**Answer:** Content-Security-Policy. The default is conservative. A wrong CSP breaks a legitimate client. Test it.

---
### 99. morgan?

**Answer:** Morgan is HTTP request logging middleware for Express. It logs method, URL, status, and response time — invaluable in development and production debugging. Use `combined` format for production logs.

**Example:**
```javascript
import morgan from 'morgan';
app.use(morgan('dev')); // GET /api/orders 200 12.345 ms - 1024
```


**Difficulty:** Screening

**Real-world:** Morgan logs HTTP lines. It is a starting point, not structured logging.

**Follow-up 1:** What is missing from a Morgan line for an incident?

**Answer:** A request id you can correlate with Mongo logs, and a policy that does not log the body.

**Follow-up 2:** What do you use instead in production?

**Answer:** A JSON logger with level, request id, route, status, and latency.

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


**Difficulty:** Screening

**Real-world:** `express.json` and `express.urlencoded` replaced the old body-parser package for the common cases.

**Follow-up 1:** What does the JSON parser throw on bad JSON?

**Answer:** A `SyntaxError` that should become a 400, not a 500 stack the client can read.

**Follow-up 2:** Where do you not use the JSON parser?

**Answer:** On a raw webhook route that must verify a signature over the exact bytes. Use `express.raw` there.

---
### 101. JWT?

**Answer:** JSON Web Tokens are compact, signed tokens encoding claims (user ID, roles) for stateless authentication. Structure: header.payload.signature. Verify signature with a secret or public key; never store secrets in the payload.

**Example:**
```javascript
import jwt from 'jsonwebtoken';
const token = jwt.sign({ userId: 'u1', role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '15m' });
const payload = jwt.verify(token, process.env.JWT_SECRET);
```


**Difficulty:** Advanced

**Real-world:** A JWT is a signed set of claims. The signature is not encryption.

**Follow-up 1:** What do you check besides the signature?

**Answer:** `exp`, `iss`, `aud`, and the algorithm. Pin the algorithm. Do not accept `none`.

**Follow-up 2:** What must you not put in the payload?

**Answer:** Secrets or medical notes. The payload is base64, not hidden.

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


**Difficulty:** Advanced

**Real-world:** Login issues a short access token and a rotating refresh token.

**Follow-up 1:** Where is the refresh token stored?

**Answer:** Hashed, server-side, or in an httpOnly cookie. Logout deletes the server copy.

**Follow-up 2:** What still works after logout if you only delete the token in the browser?

**Answer:** The access token until it expires, unless you keep a denylist or the lifetime is only a few minutes.

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


**Difficulty:** Advanced

**Real-world:** Access tokens are minutes. Refresh tokens are longer and revocable.

**Follow-up 1:** Why not one token with a 30-day exp?

**Answer:** You cannot revoke it without a denylist of every token. A stolen token lives for 30 days.

**Follow-up 2:** What is rotation?

**Answer:** Each refresh issues a new refresh id and invalidates the old one. Reuse of an old refresh token is a theft signal. Delete the family.

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


**Difficulty:** Intermediate

**Real-world:** bcrypt is a slow hash for passwords. It is not encryption.

**Follow-up 1:** Why not SHA-256 for a password?

**Answer:** It is fast. Attackers guess billions a second. bcrypt and argon2 are built to be slow and salted.

**Follow-up 2:** Where do you run it?

**Answer:** Not on the request thread if the cost is high and traffic is large. A worker is reasonable. Do not log the password or the hash.

---
### 105. Session-based auth?

**Answer:** Session auth stores user state server-side (memory, Redis, DB) and sends a session ID via cookie. The server looks up the session on each request. Stateful but easy to revoke; requires sticky sessions or shared store when scaling.

**Example:**
```javascript
import session from 'express-session';
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.post('/login', (req, res) => { req.session.userId = user.id; res.json({ ok: true }); });
```


**Difficulty:** Intermediate

**Real-world:** A server session stores state in Redis or the database and sends only the id.

**Follow-up 1:** What is the scaling cost?

**Answer:** Every app instance must see the same store, or you need sticky sessions. Sticky sessions hurt deploys.

**Follow-up 2:** When is a session a better fit than a JWT?

**Answer:** When you must revoke immediately and the client is a first-party website that can hold a cookie.

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


**Difficulty:** Advanced

**Real-world:** OAuth 2.0 is delegated authorisation. OIDC adds identity on top.

**Follow-up 1:** Which grant do you use for a web app?

**Answer:** Authorization code with PKCE. Implicit is obsolete.

**Follow-up 2:** What do you store from the provider?

**Answer:** The subject and the link to your user. Validate the token's issuer and audience. Do not trust a profile URL as identity.

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


**Difficulty:** Advanced

**Real-world:** Rate limits belong in Redis so every pod shares the counter.

**Follow-up 1:** Key by what?

**Answer:** The user or API token. IP alone punishes a hospital NAT.

**Follow-up 2:** What do you return?

**Answer:** 429 and `Retry-After`. Fail open or closed when Redis is down is a product decision: closed for login, open for cached reads.

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


**Difficulty:** Advanced

**Real-world:** Validate at the edge with a schema. TypeScript does not see the JSON.

**Follow-up 1:** What do you reject besides types?

**Answer:** Unknown keys on a write, arrays longer than a bound, and strings that are not in an allow-list of statuses.

**Follow-up 2:** Where do you re-check?

**Answer:** Authorisation is not validation. A valid patient id can still belong to another organisation.

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


**Difficulty:** Screening

**Real-world:** Configuration comes from the environment. Secrets do not live in git.

**Follow-up 1:** What do you do when a required variable is missing?

**Answer:** Fail the process at boot. Do not start and then 500 on the first request.

**Follow-up 2:** What about `.env` files?

**Answer:** Local development only. Production injects the environment from a secret store.

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


**Difficulty:** Intermediate

**Real-world:** Twelve-factor is a checklist: config in the environment, logs on stdout, processes that are disposable.

**Follow-up 1:** Which factor do Node services violate most often?

**Answer:** Sticky local state: an in-memory session or a file upload stored on the pod disk.

**Follow-up 2:** What does disposable mean for a deploy?

**Answer:** SIGTERM drains requests and the pod can die. The next pod serves the same routes because state is in Mongo or Redis.

---
### 111. Streams?

**Answer:** Streams process data in chunks instead of loading everything into memory. Types: Readable, Writable, Duplex, Transform. Essential for large file uploads, CSV exports, and proxying responses.

**Example:**
```javascript
import { createReadStream, createWriteStream } from 'node:fs';
createReadStream('large-orders.csv')
  .pipe(createWriteStream('backup-orders.csv'));
```


**Difficulty:** Advanced

**Real-world:** Streams move bytes in chunks so a 200MB export does not sit in one buffer.

**Follow-up 1:** What happens if you ignore backpressure?

**Answer:** The readable side keeps pushing into memory while the client is slow. `pipeline` respects backpressure and destroys all sides on error.

**Follow-up 2:** Name the four stream types.

**Answer:** Readable, writable, duplex, and transform.

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


**Difficulty:** Advanced

**Real-world:** `pipeline` is the safe way to connect streams.

**Follow-up 1:** Why not `readStream.pipe(writeStream)`?

**Answer:** `pipe` does not forward errors and destroy both sides as reliably. You leak descriptors and you miss the error.

**Follow-up 2:** What do you do with the promise `pipeline` returns?

**Answer:** Await it or it becomes an unhandled rejection when the disk fills.

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


**Difficulty:** Intermediate

**Real-world:** Buffer is a fixed byte block. It is not a string.

**Follow-up 1:** When do you refuse to `Buffer.concat` a whole upload?

**Answer:** When the file can be large. Stream it to object storage. Concatenating it copies the bytes in the heap.

**Follow-up 2:** What encoding bug appears when you do `buf.toString()` on binary?

**Answer:** UTF-8 replacement characters. Images and PDFs must stay buffers or streams.

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


**Difficulty:** Intermediate

**Real-world:** EventEmitter is a pub-sub inside the process. Listeners are a leak if you add them per request.

**Follow-up 1:** What is the default max listeners warning?

**Answer:** A hint you added listeners in a loop, often ten. Raising the limit hides the bug.

**Follow-up 2:** How do you emit across processes?

**Answer:** You do not. Use a queue or Redis. An EventEmitter does not leave the process.

---
### 115. fs module?

**Answer:** The `fs` module provides file system operations — read, write, rename, watch. Promises API (`fs/promises`) is preferred over callbacks; avoid sync methods in servers. Essential for config files, uploads, and logs.

**Example:**
```javascript
import { readFile, writeFile } from 'node:fs/promises';
const config = JSON.parse(await readFile('./config.json', 'utf8'));
await writeFile('./output.json', JSON.stringify({ exported: true }));
```


**Difficulty:** Screening

**Real-world:** `fs` talks to the filesystem. Prefer the promise API and avoid the sync API on a server.

**Follow-up 1:** What blocks the loop?

**Answer:** `readFileSync` and `writeFileSync` in a handler.

**Follow-up 2:** What do you use for a large file?

**Answer:** `createReadStream` and `pipeline`, not `readFile`.

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


**Difficulty:** Intermediate

**Real-world:** Async fs yields during I/O. Sync fs holds the thread until the disk returns.

**Follow-up 1:** Is async fs free?

**Answer:** No. It uses the libuv pool. A stampede of file reads exhausts the pool and delays other pool users.

**Follow-up 2:** When is sync fs acceptable?

**Answer:** A one-off script or a boot-time read of a small config before the server listens.

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


**Difficulty:** Screening

**Real-world:** `path` joins segments without you guessing slashes.

**Follow-up 1:** Why not concatenate paths with `+`?

**Answer:** A user-controlled segment can include `..` and escape the directory if you also fail to normalise. Use `path.resolve` and check the result stays under the root.

**Follow-up 2:** `path.join` versus `path.resolve`?

**Answer:** `join` concatenates. `resolve` also applies the current working directory and collapses `..`.

---
### 118. os module?

**Answer:** The `os` module exposes operating system info — platform, CPU cores, total/free memory, hostname, network interfaces. Useful for health checks, worker sizing, and diagnostics.

**Example:**
```javascript
import os from 'node:os';
console.log(os.platform(), os.cpus().length, 'cores');
console.log(Math.round(os.freemem() / 1024 / 1024), 'MB free');
```


**Difficulty:** Screening

**Real-world:** `os` reports CPUs, memory, and network interfaces of the host.

**Follow-up 1:** Why is `os.cpus().length` a bad pod limit?

**Answer:** The container's CPU limit can be lower than the host's CPU count. `availableParallelism` and the cgroup limit are the better signals.

**Follow-up 2:** What should you not use `os.hostname` for?

**Answer:** As a unique id across replicas. Two processes can share a name scheme. Use the pod name if you need identity.

---
### 119. crypto module?

**Answer:** Node's `crypto` provides hashing (SHA-256), HMAC, encryption, random bytes, and key derivation. Use for password hashing (bcrypt preferred), API signatures, and secure tokens — not for rolling your own crypto protocols.

**Example:**
```javascript
import { createHash, randomBytes } from 'node:crypto';
const hash = createHash('sha256').update('order-123').digest('hex');
const apiKey = randomBytes(32).toString('hex');
```


**Difficulty:** Advanced

**Real-world:** `crypto` is for hashes, HMAC, and random bytes. It is not a reason to invent a cipher mode.

**Follow-up 1:** How do you create an idempotency token?

**Answer:** `randomUUID` or `randomBytes`. Do not use `Math.random`.

**Follow-up 2:** What must an HMAC include?

**Answer:** The secret and the exact bytes you will verify later. Parsing JSON and re-stringifying can change the bytes and fail a valid webhook.

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


**Difficulty:** Intermediate

**Real-world:** `http` is the built-in server. Express sits on it.

**Follow-up 1:** What does `server.close` do?

**Answer:** It stops new connections and waits for existing ones. It does not abort them. Pair it with a timeout on SIGTERM.

**Follow-up 2:** What keep-alive bug shows up behind a load balancer?

**Answer:** The balancer sends traffic to a process that has started closing. Readiness must fail before you close.

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


**Difficulty:** Advanced

**Real-world:** Cluster forks one process per core. Kubernetes replicas replace it in most deploys.

**Follow-up 1:** What state is not shared across workers?

**Answer:** Memory. A rate limit Map in one worker does not see the others. Use Redis.

**Follow-up 2:** What happens when a worker dies?

**Answer:** The primary can fork a replacement if you wrote that. The in-flight requests on that worker die. The load balancer should stop sending traffic.

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


**Difficulty:** Advanced

**Real-world:** Worker threads share the process and run CPU work off the main thread.

**Follow-up 1:** When do you not spawn a worker per request?

**Answer:** Creation is expensive. Use a small pool. A crash in native code can still take the process down.

**Follow-up 2:** How do you pass a large buffer?

**Answer:** Transfer the ArrayBuffer in the message so you do not copy it twice. Do not send a Mongoose document.

---
### 123. Cluster vs Worker Threads?

**Answer:** Cluster forks separate processes — best for scaling HTTP servers across cores with isolation. Worker Threads share one process — best for CPU-heavy tasks with lower overhead. Choose based on workload: I/O scaling vs CPU parallelism.

**Example:**
```javascript
// HTTP API scaling → cluster (or PM2 cluster mode)
// Image processing on upload → Worker Thread with sharp
```


**Difficulty:** Advanced

**Real-world:** Cluster is for more HTTP processes. Workers are for CPU inside one process.

**Follow-up 1:** Which one isolates a JavaScript exception?

**Answer:** A child process. A worker shares the process. An uncaught exception policy still depends on you.

**Follow-up 2:** What would you use for an image resize on upload?

**Answer:** A worker pool or a queue consumer, not the cluster master.

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


**Difficulty:** Intermediate

**Real-world:** PM2 supervises processes, reloads them, and can cluster.

**Follow-up 1:** What does a reload need from your app?

**Answer:** A SIGTERM handler that drains. Otherwise PM2 kills in-flight requests.

**Follow-up 2:** When do you not add PM2?

**Answer:** When Kubernetes already restarts the container. Two supervisors fight.

---
### 125. nodemon?

**Answer:** nodemon watches source files and automatically restarts Node on changes. It is a development-only tool — never use in production. Speeds up the edit-save-test loop for API development.

**Example:**
```json
// package.json
{ "scripts": { "dev": "nodemon src/index.js" } }
// npm run dev — restarts on file save
```


**Difficulty:** Screening

**Real-world:** nodemon restarts on file changes. It is a dev tool.

**Follow-up 1:** Why not in the production image?

**Answer:** It watches the filesystem and is another moving part. Production starts `node server.js` once.

**Follow-up 2:** What do you use in production to pick up a new version?

**Answer:** A new image and a rolling deploy.

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


**Difficulty:** Advanced

**Real-world:** uncaughtException means the process is no longer trustworthy.

**Follow-up 1:** What do you do?

**Answer:** Log it and exit. Let the supervisor restart. Do not keep serving.

**Follow-up 2:** What belongs in that handler besides a log?

**Answer:** A short flush of the logger, then `process.exit(1)`. Not a recovery attempt.

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


**Difficulty:** Advanced

**Real-world:** An unhandled rejection is a promise you forgot to catch.

**Follow-up 1:** What does modern Node do?

**Answer:** It can terminate the process, depending on version and flags. Treat it as a bug.

**Follow-up 2:** Where is the usual leak?

**Answer:** An async route without `catch(next)`, or a `setInterval` that fires an async function and ignores the promise.

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


**Difficulty:** Advanced

**Real-world:** Graceful shutdown is SIGTERM, stop accepting, finish in-flight work, close Mongo and Redis, exit.

**Follow-up 1:** What sends SIGTERM in Kubernetes?

**Answer:** The kubelet, before SIGKILL at the end of `terminationGracePeriodSeconds`.

**Follow-up 2:** What if a request ignores the shutdown?

**Answer:** A hard timeout exits anyway. Do not wait forever on a stuck query.

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


**Difficulty:** Advanced

**Real-world:** Pools reuse sockets. Opening a client per request exhausts ports and memory.

**Follow-up 1:** What does a too-small Mongo pool look like?

**Answer:** Handlers wait before the query starts. The database looks fast and the API looks slow.

**Follow-up 2:** What is the Node HTTP agent equivalent?

**Answer:** Keep-alive on the outbound client so you do not handshake every downstream call.

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


**Difficulty:** Intermediate

**Real-world:** REST here means resources, HTTP verbs, and status codes you can cache and retry safely.

**Follow-up 1:** Which methods are safe to retry?

**Answer:** GET and PUT if PUT is idempotent, and DELETE if repeating it is a no-op. POST is not, unless you have an idempotency key.

**Follow-up 2:** What is a resource in a booking API?

**Answer:** The appointment and the slot, not a verb like `/bookSlot` if you can use `POST /appointments`.

---
### 131. REST vs GraphQL?

**Answer:** REST exposes multiple endpoints with fixed response shapes. GraphQL uses one endpoint where clients query exactly the fields needed. REST is simpler and cache-friendly; GraphQL reduces over-fetching but adds complexity.

**Example:**
```javascript
// REST: GET /api/products/1 → full product object
// GraphQL:
// query { product(id: "1") { name price reviews { rating } } }
```


**Difficulty:** Intermediate

**Real-world:** GraphQL is one endpoint and a query language. REST is many URLs.

**Follow-up 1:** When do you refuse GraphQL?

**Answer:** A small CRUD API, or a team that will not solve N+1. The flexibility becomes an unbounded query.

**Follow-up 2:** What does REST make easier?

**Answer:** HTTP caching, logs that show the path, and a simple auth story per route.

---
### 132. Status codes 200, 201, 400, 401, 403, 404, 500?

**Answer:** 200 OK — success with body. 201 Created — resource created. 400 Bad Request — invalid input. 401 Unauthorized — authentication required. 403 Forbidden — authenticated but not allowed. 404 Not Found — resource missing. 500 Internal Server Error — server fault.

**Example:**
```javascript
app.post('/api/orders', (req, res) => res.status(201).json({ id: 'O1' }));
app.get('/api/orders/:id', (req, res) => res.status(404).json({ error: 'Not found' }));
// 401 vs 403: no token vs token but wrong role
```


**Difficulty:** Screening

**Real-world:** Status codes are the contract. 200 is not for a create and not for a failure.

**Follow-up 1:** 201 versus 200 on a replayed idempotent create?

**Answer:** 201 the first time, 200 when you return the stored result of the same key. Be consistent and document it.

**Follow-up 2:** 401 versus 403?

**Answer:** 401 the caller is not authenticated. 403 they are authenticated and not allowed.

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


**Difficulty:** Advanced

**Real-world:** Idempotency means the same request repeated once has the same effect as once.

**Follow-up 1:** Where do you store the key?

**Answer:** A unique index on the key, with the response you already sent.

**Follow-up 2:** What key do you send to the payment provider?

**Answer:** The same one, so the provider also treats the retry as the same charge.

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


**Difficulty:** Intermediate

**Real-world:** WebSocket is a long-lived full-duplex connection.

**Follow-up 1:** What breaks when you run two Node processes?

**Answer:** A socket on process A does not see an emit on process B. You need a pub-sub fan-out such as Redis.

**Follow-up 2:** How do you authenticate it?

**Answer:** During the handshake, with the same token as HTTP. Do not accept an anonymous socket that then receives private events.

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


**Difficulty:** Intermediate

**Real-world:** Socket.io adds rooms, fallbacks, and a protocol on top of WebSocket.

**Follow-up 1:** What is the scaling adapter?

**Answer:** A Redis adapter so rooms work across nodes. Without it, a room exists only in one process.

**Follow-up 2:** When is raw WebSocket enough?

**Answer:** When you do not need rooms or old-browser fallbacks and you will run the fan-out yourself.

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


**Difficulty:** Advanced

**Real-world:** Redis is an in-memory data structure server. It is not your source of truth for a booking.

**Follow-up 1:** Name three uses that must not share one eviction policy.

**Answer:** A cache, a lock, and a refresh-token store. Evicting a lock double-books.

**Follow-up 2:** What do you do when it is down for a read cache?

**Answer:** Read Mongo, serve, and alert. Do not fail the read.

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


**Difficulty:** Advanced

**Real-world:** Cache-aside is the default: read cache, on miss read the database, fill the cache.

**Follow-up 1:** How do you invalidate?

**Answer:** Delete the key on a successful write. TTL is the safety net when the delete fails.

**Follow-up 2:** What is a stampede?

**Answer:** Many misses rebuild the same key. One request takes a short lock and fills the cache. The others wait or serve stale data.

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


**Difficulty:** Intermediate

**Real-world:** Multer parses multipart uploads. It can store to disk or memory.

**Follow-up 1:** What do you limit?

**Answer:** File size, file count, and the MIME type you actually accept. Memory storage of a large file is a heap spike.

**Follow-up 2:** Where does the file go after parse?

**Answer:** Object storage, not the container disk, if more than one pod must read it.

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


**Difficulty:** Intermediate

**Real-world:** sharp resizes images. It is native and CPU-heavy.

**Follow-up 1:** Where do you run it?

**Answer:** Off the request thread, in a worker or a job. Doing it inline stalls the event loop.

**Follow-up 2:** What do you check before you decode?

**Answer:** The size and type. A hostile image can cost a lot of CPU.

---
### 140. child_process?

**Answer:** The `child_process` module spawns shell commands or other executables from Node. Use `spawn` for streaming output, `exec` for buffered results. Useful for git hooks, ffmpeg, or legacy CLI tools.

**Example:**
```javascript
import { spawn } from 'node:child_process';
const child = spawn('mongodump', ['--uri', process.env.MONGODB_URI, '--out', './backup']);
child.stdout.on('data', (d) => console.log(d.toString()));
```


**Difficulty:** Advanced

**Real-world:** child_process starts another program. `fork` is a Node process with IPC.

**Follow-up 1:** When do you pick fork over a worker?

**Answer:** When you want a crash boundary or you are launching a non-Node binary.

**Follow-up 2:** What do you do with stdout?

**Answer:** Stream it or cap it. A child that prints a huge log into a buffer will exhaust memory.

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


**Difficulty:** Screening

**Real-world:** The REPL is an interactive Node prompt. It is not a production tool.

**Follow-up 1:** When is it useful?

**Answer:** A local experiment. Not on a server console with production credentials.

**Follow-up 2:** What risk does a production REPL have?

**Answer:** Whoever has the shell has the process environment, including secrets.

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


**Difficulty:** Intermediate

**Real-world:** `__dirname` is CommonJS. ESM uses `import.meta.url`.

**Follow-up 1:** How do you get a path in ESM?

**Answer:** `fileURLToPath(new URL('.', import.meta.url))`.

**Follow-up 2:** What breaks if you mix them?

**Answer:** A ReferenceError for `__dirname` in an ES module, or a wrong root if you assume the current working directory is the source directory.

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


**Difficulty:** Screening

**Real-world:** Semver is major.minor.patch. Major may break callers.

**Follow-up 1:** What does a caret range allow?

**Answer:** Compatible minor and patch updates within the major. A lockfile is what you actually installed.

**Follow-up 2:** When do you bump major?

**Answer:** When you change a response field or a function signature callers already use.

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


**Difficulty:** Intermediate

**Real-world:** The lockfile pins the tree, including transitive versions.

**Follow-up 1:** Why did production install a different version from your laptop?

**Answer:** Someone ran `npm install` without the lock, or CI did not use `npm ci`.

**Follow-up 2:** Do you commit it?

**Answer:** Yes. Review lock changes. A surprise minor can include a break or a compromise.

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


**Difficulty:** Screening

**Real-world:** MVC splits routes, domain logic, and data access. Express does not enforce it.

**Follow-up 1:** What is the failure mode of a fat route?

**Answer:** The query, the auth check, and the email send live in one function. You cannot test the rule without HTTP.

**Follow-up 2:** What do you call the middle layer?

**Answer:** A service. The repository talks to Mongo. The controller talks HTTP.

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


**Difficulty:** Advanced

**Real-world:** Dependency injection means the caller passes collaborators instead of the module importing them.

**Follow-up 1:** How do you test a booking service?

**Answer:** Construct it with a fake repository. You do not need Mongo to prove the status rule.

**Follow-up 2:** What is not injection?

**Answer:** A global `getDb()` inside the service. That hides the dependency and races in tests.

---
### 147. API versioning?

**Answer:** API versioning preserves backward compatibility when breaking changes ship. Strategies: URL path (`/api/v1`), header (`Accept-Version`), or query param. URL versioning is most visible and common in REST APIs.

**Example:**
```javascript
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);
// v2 may return { data: order, meta: {} } while v1 returns flat order
```


**Difficulty:** Intermediate

**Real-world:** Version the contract when a change would break an existing client.

**Follow-up 1:** What change is safe without a new version?

**Answer:** Adding an optional response field. Removing a field or changing a type is not.

**Follow-up 2:** How long do you keep v1?

**Answer:** Until the clients you know have moved, plus a dated shutdown. Log the callers of the old route.

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


**Difficulty:** Advanced

**Real-world:** Liveness means the process should be restarted. Readiness means it should receive traffic.

**Follow-up 1:** What do you check in readiness?

**Answer:** Mongo connected, and optionally a critical dependency. Do not check Redis readiness if a Redis blip should not remove the pod when reads can fall back.

**Follow-up 2:** What belongs in liveness?

**Answer:** A simple alive check. A failing dependency in liveness causes a restart loop.

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


**Difficulty:** Intermediate

**Real-world:** The image runs one process, as non-root, on a pinned Node version.

**Follow-up 1:** What do you copy into the final stage?

**Answer:** The compiled JavaScript and production `node_modules`, not the TypeScript source and not the test runner.

**Follow-up 2:** Why a multi-stage build?

**Answer:** The compiler stays in the build stage. The runtime image stays smaller and has fewer tools.

---
### 150. process.nextTick vs setImmediate vs setTimeout (Node)?

**Difficulty:** Advanced. Asked at Accenture and EPAM-style Node rounds.

**Answer:** After the current synchronous stack, Node drains `process.nextTick`, then promise microtasks. `setTimeout` runs in the **timers** phase. `setImmediate` runs in the **check** phase, after poll. Those two are not a fixed pair.

From the main module, `setTimeout(fn, 0)` and `setImmediate(fn)` can print in either order. Inside an I/O callback, `setImmediate` runs on the way to check before the next timers phase, so it runs first. Do not memorise “immediate then timeout” as a universal rule. The example comment matches the fixed part only: sync, `nextTick`, promise. The timer and immediate lines are intentionally not given a single order.

**Example:**
```javascript
console.log('1');
setTimeout(() => console.log('timer'), 0);
setImmediate(() => console.log('immediate'));
Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));
console.log('6');
// Fixed: 1, 6, nextTick, promise
// Then timer and immediate, order not guaranteed at top level

const fs = require('node:fs');
fs.readFile(__filename, () => {
  setTimeout(() => console.log('timer-in-io'), 0);
  setImmediate(() => console.log('immediate-in-io'));
  // immediate-in-io, then timer-in-io
});
```

**Common mistake:** Quoting one order for every program. Interviewers who know Node will ask “inside `readFile`?”

**Follow-ups:** Why can a recursive `nextTick` stall a health check? When would you choose `setImmediate` to let I/O run before more work?

**Answers to those follow-ups:** A recursive `nextTick` never lets the loop reach poll, so a health check that depends on I/O or a timer does not run. Use `setImmediate` when you want to yield so I/O can run before the next chunk of work. Do not use a recursive `nextTick` for that.

---
### 151. Node.js event loop — six phases?

**Answer:** Node's loop has six phases: **timers** (setTimeout/setInterval), **pending callbacks**, **idle/prepare**, **poll** (I/O), **check** (setImmediate), **close callbacks**. After the current JavaScript stack, and again between phases, drain `process.nextTick` first, then promise microtasks. See Q150. This is why one process can wait on many connections, and why a recursive `nextTick` stops the loop from reaching poll.

**Example:**
```text
Incoming HTTP request
  → poll phase receives socket data
  → callback runs your Express handler (async)
  → await mongoose.find() yields to poll
  → DB response returns → handler resumes
  → response sent → loop continues
```


**Difficulty:** Advanced

**Real-world:** Six phases, and nextTick before promises between them.

**Follow-up 1:** What are the six phases in order?

**Answer:** Timers, pending callbacks, idle/prepare, poll, check, close.

**Follow-up 2:** Why did a top-level setTimeout and setImmediate swap order between runs?

**Answer:** At the top level the order is not guaranteed. Inside an I/O callback, setImmediate runs first.

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


**Difficulty:** Advanced

**Real-world:** XSS is injected script. CSRF is a forged request that carries the cookie.

**Follow-up 1:** How do you stop XSS in an API that returns JSON?

**Answer:** Send JSON, not HTML, set the content type, and do not reflect unsanitised strings into an HTML page. Helmet's headers are the belt.

**Follow-up 2:** How do you stop CSRF if you use a cookie session?

**Answer:** SameSite cookies and a CSRF token for state-changing requests. A bearer header is not sent cross-site by the browser.

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


**Difficulty:** Advanced

**Real-world:** asyncHandler forwards a rejected promise to next.

**Follow-up 1:** Show the one-liner.

**Answer:** `(fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)`.

**Follow-up 2:** What does it not do?

**Answer:** It does not choose the status code. The error middleware does.

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


**Difficulty:** Intermediate

**Real-world:** Compression saves bandwidth. CPU pays for it. A proxy often does it better.

**Follow-up 1:** Where do you skip it?

**Answer:** Already compressed images, and tiny responses. Compressing them wastes CPU.

**Follow-up 2:** What is the security note?

**Answer:** BREACH is a concern when you compress secrets together with attacker-controlled input over TLS. Do not compress a response that reflects a secret next to user input.

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


**Difficulty:** Screening

**Real-world:** Scripts are the supported way to start, test, and build.

**Follow-up 1:** What script does CI run?

**Answer:** `npm test` and `npm run build`, not a developer's alias that only exists on their laptop.

**Follow-up 2:** Why `npm run start` in the image?

**Answer:** It is the documented command. The image `CMD` can call `node server.js` directly so a missing shell does not matter.

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


**Difficulty:** Intermediate

**Real-world:** `express.static` serves files. Uploads are not a public folder.

**Follow-up 1:** What happens if you serve the upload directory?

**Answer:** A user who guesses a filename downloads another user's file. Put files in object storage and authorise the download.

**Follow-up 2:** What else can static serving leak?

**Answer:** Source maps, `.env`, or a backup if those files sit in the public directory.

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


**Difficulty:** Screening

**Real-world:** Caret allows minor and patch. Tilde allows patch only.

**Follow-up 1:** Which one did your lockfile actually install?

**Answer:** The exact version in the lock, inside the range. The range is what a future install may pick if you update.

**Follow-up 2:** When do you pin exactly?

**Answer:** A package that has burned you, or a security-sensitive parser, until you choose the next version on purpose.

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


**Difficulty:** Screening

**Real-world:** MongoDB stores BSON documents in collections. It is not a bag of JSON files.

**Follow-up 1:** What does a document give you that a row does not?

**Answer:** Nested fields and arrays in one read, when the access pattern wants them together.

**Follow-up 2:** What do you give up?

**Answer:** Joins are not the default. `$lookup` is a tool, not a reason to ignore data modelling.

---
### 159. SQL vs NoSQL?

**Answer:** SQL databases use tables, fixed schemas, and JOINs with strong ACID guarantees. NoSQL (MongoDB) uses flexible documents, embeds related data, and prioritizes horizontal scale and developer velocity. Choose SQL for complex relations and transactions; MongoDB for flexible, document-shaped data.

**Example:**
```javascript
// SQL: users JOIN orders JOIN order_items — normalized
// MongoDB: order embeds items array — one read for checkout receipt
```


**Difficulty:** Intermediate

**Real-world:** SQL enforces a schema and joins. Mongo enforces the shape you design and the indexes you create.

**Follow-up 1:** When do you pick SQL?

**Answer:** Money with complex constraints, ad hoc reporting, or a relational domain you will query in many shapes.

**Follow-up 2:** When do you pick Mongo?

**Answer:** A document you read and write as a unit, and a shape that changes by tenant, if you still index the queries.

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


**Difficulty:** Screening

**Real-world:** A document is the unit of atomic write in one collection.

**Follow-up 1:** What is the 16MB limit telling you?

**Answer:** Do not embed unbounded arrays, such as every appointment on a doctor document.

**Follow-up 2:** What is atomic without a transaction?

**Answer:** Updates to a single document, including nested fields.

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


**Difficulty:** Screening

**Real-world:** A collection is a set of documents. It is not required to share one schema unless you add validation.

**Follow-up 1:** What still must be consistent?

**Answer:** The fields you index and query. A collection where half the documents use `doctorId` and half use `doctor_id` will miss rows.

**Follow-up 2:** How do you enforce a shape?

**Answer:** JSON schema validation on the collection, plus Zod at the API.

---
### 162. _id?

**Answer:** Every MongoDB document requires a unique `_id` field, auto-generated as `ObjectId` if omitted. ObjectId embeds a timestamp and is indexable. Custom `_id` values are allowed but must be unique within the collection.

**Example:**
```javascript
db.users.insertOne({ name: "Alice", email: "alice@shop.com" });
// _id: ObjectId("665a1b2c3d4e5f6789012345") auto-created
```


**Difficulty:** Screening

**Real-world:** `_id` is the primary key. It is unique and indexed.

**Follow-up 1:** Is an ObjectId a timestamp?

**Answer:** The first bytes are a time, but do not parse that as your business clock. Store `createdAt` if you need a time you control.

**Follow-up 2:** When do you choose your own `_id`?

**Answer:** When the id comes from another system and must be stable, such as a code in a URL shortener. Do not use a guessable sequence if enumeration matters.

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


**Difficulty:** Screening

**Real-world:** BSON is the binary format. It has types JSON does not, including Date and ObjectId.

**Follow-up 1:** What happens to a Date through a careless JSON API?

**Answer:** It becomes a string. The driver gives you a Date if the field is a BSON date and you do not lean through a layer that stringifies it.

**Follow-up 2:** What is a Decimal128 for?

**Answer:** Money. A JavaScript number will not round currency the way you expect.

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


**Difficulty:** Intermediate

**Real-world:** Mongoose is an ODM: schemas, casts, hooks, and queries. The driver is enough when you want less magic.

**Follow-up 1:** What does a hook hide?

**Answer:** A write that also updates another collection. Callers do not see it in the route. Prefer an explicit service.

**Follow-up 2:** What is the cost of a Mongoose document versus lean?

**Answer:** A document tracks changes and uses more CPU and memory. `lean()` returns plain objects for read paths.

---
### 165. Schema vs Model?

**Answer:** A Mongoose Schema defines document structure, types, validators, and defaults. A Model is a compiled Schema class providing CRUD methods (`find`, `create`, `save`). One schema compiles to one model per connection.

**Example:**
```javascript
const userSchema = new Schema({ email: String, name: String });
const User = mongoose.model('User', userSchema); // Model
await User.create({ email: 'bob@shop.com', name: 'Bob' });
```


**Difficulty:** Screening

**Real-world:** The schema describes the shape. The model is the compiled handle you query.

**Follow-up 1:** Can two models share a collection?

**Answer:** Yes, with an explicit collection name, and it is confusing. One model per collection unless you have a discriminator you can explain.

**Follow-up 2:** Where do indexes live?

**Answer:** On the schema, and they must actually be created in production. Defining them in code does not create them if auto-index is off.

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


**Difficulty:** Advanced

**Real-world:** Embed what you read together and what does not grow without bound. Reference what is large or shared.

**Follow-up 1:** A doctor with every appointment embedded. What breaks?

**Answer:** The document grows toward 16MB, writes contend on one document, and a patient query cannot use an index inside that array well.

**Follow-up 2:** What do you embed instead?

**Answer:** A small snapshot the screen needs, such as the doctor's display name on the appointment, and you accept that a rename is stale until you update it.

---
### 167. When embed vs reference?

**Answer:** Embed when data is small, bounded, and read together (order line items, address on user). Reference when data is large, unbounded, shared across documents, or updated independently (user on many orders).

**Example:**
```javascript
// Embed: order.items — always fetched with order, bounded
// Reference: order.userId — user profile shared across orders
// Reference: product.reviews if millions of reviews per product
```


**Difficulty:** Advanced

**Real-world:** The access pattern decides. Not the diagram.

**Follow-up 1:** You always load a slot with its appointment. Embed or reference?

**Answer:** If there is at most one appointment, embedding can be one read. If you also list appointments by patient, reference the slot id and index it.

**Follow-up 2:** What is the write cost of embedding?

**Answer:** Every update rewrites the document. A hot parent becomes a hotspot.

---
### 168. find() vs findOne()?

**Answer:** `find()` returns a Query yielding an array (or cursor) — zero or more documents. `findOne()` returns a single document or `null`. Use `find` for lists; `findOne` for unique lookups by email or `_id`.

**Example:**
```javascript
const pending = await Order.find({ status: 'pending' });
const user = await User.findOne({ email: 'alice@shop.com' });
console.log(pending.length, user?.name);
```


**Difficulty:** Screening

**Real-world:** `find` returns a cursor of many. `findOne` returns one document or null.

**Follow-up 1:** What if two documents match `findOne`?

**Answer:** You get one, with no error. If that is a bug, use a unique index so two cannot exist.

**Follow-up 2:** Why not `find` and take `[0]`?

**Answer:** You pull more than you need and it is easy to forget the limit. `findOne` is explicit.

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


**Difficulty:** Intermediate

**Real-world:** `lean()` skips Mongoose document wrapping.

**Follow-up 1:** When must you not lean?

**Answer:** When you need setters, virtuals, or `.save()` change tracking.

**Follow-up 2:** What is the usual read path?

**Answer:** `lean()` for a GET that returns JSON. It uses less memory.

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


**Difficulty:** Intermediate

**Real-world:** `select` limits fields. It is how you keep a password hash out of a response.

**Follow-up 1:** What is the default if you forget it?

**Answer:** The whole document, including fields you added later and did not mean to expose.

**Follow-up 2:** How do you exclude a field?

**Answer:** `select('-passwordHash')` or a projection. Do not rely on the client to ignore it.

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


**Difficulty:** Intermediate

**Real-world:** `populate` is an application-level join. It is another query.

**Follow-up 1:** Why is populate in a loop an N+1?

**Answer:** Each document issues another find. Populate the list in one query, or `$lookup` after you have filtered.

**Follow-up 2:** What if the referenced id is missing?

**Answer:** You get null. Decide whether that is a 500 data bug or a tolerable hole.

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


**Difficulty:** Intermediate

**Real-world:** `$set` replaces the field. `$push` appends. `$inc` adds a number.

**Follow-up 1:** What does `$set` on an object do to the other keys?

**Answer:** `$set` of a nested path updates that path. Replacing the whole subdocument drops keys you did not send. Build the patch explicitly.

**Follow-up 2:** When is `$inc` wrong for a counter you also read and write?

**Answer:** When two operations must stay in lockstep with another document. `$inc` is atomic on one field, not across documents.

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


**Difficulty:** Intermediate

**Real-world:** `$pull` removes array elements that match.

**Follow-up 1:** Does it remove all matches?

**Answer:** Yes, every element that matches the condition.

**Follow-up 2:** What if the array is huge?

**Answer:** The document is still one write. Unbounded arrays are the design bug. Do not `$pull` your way out of a 16MB document.

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


**Difficulty:** Intermediate

**Real-world:** Upsert inserts if no document matches.

**Follow-up 1:** What unique index do you need?

**Answer:** On the fields that define identity, or two requests create two documents before the upsert sees them.

**Follow-up 2:** What surprise does upsert have with `$set`?

**Answer:** The insert is the query plus the update. Fields only in the query are stored. Check the created document, not just the filter.

---
### 175. Index?

**Answer:** Indexes are B-tree data structures speeding queries at the cost of write overhead and storage. Create indexes on fields used in `find`, `sort`, and `$match`. The `_id` index exists by default.

**Example:**
```javascript
db.orders.createIndex({ userId: 1, createdAt: -1 });
// Speeds: db.orders.find({ userId }).sort({ createdAt: -1 })
```


**Difficulty:** Advanced

**Real-world:** An index is a structure the planner can walk instead of scanning the collection.

**Follow-up 1:** How do you prove it is used?

**Answer:** `explain('executionStats')`. Compare docs examined with rows returned.

**Follow-up 2:** What is the write cost?

**Answer:** Every insert and update maintains the index. Index the queries you run, not every field.

---
### 176. Compound index?

**Answer:** A compound index includes multiple fields — order matters for query patterns. It supports queries on prefix fields. Put equality fields first, then sort/range fields for optimal index use.

**Example:**
```javascript
db.orders.createIndex({ status: 1, createdAt: -1 });
// Efficient: find({ status: 'pending' }).sort({ createdAt: -1 })
// Also uses index: find({ status: 'pending' })
```


**Difficulty:** Advanced

**Real-world:** A compound index supports a prefix of its keys. Equality fields come first.

**Follow-up 1:** Index `{ facilityId: 1, doctorId: 1, start: 1 }`. Which query uses it?

**Answer:** A filter on facilityId, or facilityId plus doctorId, or those plus a range on start. A filter on start alone does not.

**Follow-up 2:** What is ESR?

**Answer:** Equality, then sort, then range, so the sort does not become an in-memory sort.

---
### 177. Unique index?

**Answer:** A unique index enforces that indexed field values are distinct across documents. Duplicate inserts throw error code 11000. Use for emails, SKUs, and slugs.

**Example:**
```javascript
db.users.createIndex({ email: 1 }, { unique: true });
// Duplicate email insert → E11000 duplicate key error
```


**Difficulty:** Intermediate

**Real-world:** A unique index is how you enforce one slot, one booking. The application check is not enough.

**Follow-up 1:** What does a duplicate key error mean?

**Answer:** The write lost a race or the client retried. Return 409 or replay the idempotent response. Do not show the driver error to the client.

**Follow-up 2:** Can a unique index ignore soft-deleted rows?

**Answer:** A partial index can be unique only where `deleted` is false.

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


**Difficulty:** Intermediate

**Real-world:** A TTL index deletes documents after a time. It is not a precise clock.

**Follow-up 1:** What type must the field be?

**Answer:** A BSON date. A string date will not expire.

**Follow-up 2:** What is the deletion granularity?

**Answer:** The TTL monitor runs about once a minute. Do not use it for a five-second hold. Use a `heldUntil` check in the query.

---
### 179. Text index?

**Answer:** Text indexes support full-text search with `$text` and `$search`. One text index per collection combining multiple string fields. For advanced search in 2026, Atlas Search or Elasticsearch may be preferred.

**Example:**
```javascript
db.products.createIndex({ name: 'text', description: 'text' });
db.products.find({ $text: { $search: 'wireless headphones' } });
```


**Difficulty:** Intermediate

**Real-world:** A text index supports stemming search. It is not a substitute for a search engine at scale.

**Follow-up 1:** How many text indexes per collection?

**Answer:** One. Combine fields in that one index.

**Follow-up 2:** What would you use for doctor name search in a product?

**Answer:** Often Atlas Search or a dedicated engine if you need typos and relevance. A text index is the simple version.

---
### 180. COLLSCAN vs IXSCAN?

**Answer:** COLLSCAN is a full collection scan — slow on large data. IXSCAN uses an index — fast targeted lookup. Always run `.explain('executionStats')` on slow queries and aim for IXSCAN with low `docsExamined`.

**Example:**
```javascript
db.orders.find({ status: 'pending' }).explain('executionStats');
// winningPlan.stage: 'IXSCAN' — good
// 'COLLSCAN' with docsExamined: 1000000 — add index
```


**Difficulty:** Advanced

**Real-world:** COLLSCAN reads the collection. IXSCAN walks an index.

**Follow-up 1:** What ratio is a problem?

**Answer:** docs examined far above nReturned. A hundred thousand examined to return twenty is a missing or wrong index.

**Follow-up 2:** Does an index hint fix a bad query?

**Answer:** It can force a path. Fix the query or the index. A hint hides a planner change.

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


**Difficulty:** Advanced

**Real-world:** An aggregation is a pipeline of stages. Order matters.

**Follow-up 1:** Which stage should be first when you can?

**Answer:** `$match` on indexed fields, so later stages see fewer documents.

**Follow-up 2:** When do you refuse a pipeline in the request path?

**Answer:** When it is a reporting rollup over months of data. Precompute it.

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


**Difficulty:** Advanced

**Real-world:** `$match` filters. It should use an index when it is first.

**Follow-up 1:** Does a `$match` after a `$project` still use the index?

**Answer:** Often no, because the fields changed. Match on the original shape first.

**Follow-up 2:** What operator bug turns a match into a scan?

**Answer:** A leading wildcard regex, or a `$where` JavaScript predicate.

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


**Difficulty:** Intermediate

**Real-world:** `$group` buckets documents and accumulates.

**Follow-up 1:** What is `_id` in the output?

**Answer:** The group key, which may be a document of several fields. It is not the original document id unless you grouped by it.

**Follow-up 2:** What memory problem does a group have?

**Answer:** A group with a huge number of buckets uses memory. Filter first.

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


**Difficulty:** Advanced

**Real-world:** `$lookup` joins another collection. It is not free.

**Follow-up 1:** What index does the foreign side need?

**Answer:** An index on the field you match. Without it, each lookup scans.

**Follow-up 2:** Where do you put it in the pipeline?

**Answer:** After `$match` has reduced the set. Lookup then unwind on a million rows is how a dashboard falls over.

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


**Difficulty:** Intermediate

**Real-world:** `$unwind` emits one document per array element.

**Follow-up 1:** What does it do to a missing or empty array?

**Answer:** By default it drops the parent. `preserveNullAndEmptyArrays` keeps it.

**Follow-up 2:** What is the explosion?

**Answer:** A hundred parents with a hundred elements become ten thousand documents. Unwind late and only if you must.

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


**Difficulty:** Intermediate

**Real-world:** `$project` shapes fields. It can drop the password and compute a value.

**Follow-up 1:** What happens to fields you do not name, in an inclusion projection?

**Answer:** They are dropped, except `_id` unless you exclude it.

**Follow-up 2:** Why project before a large group?

**Answer:** Less data moves through the pipeline.

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


**Difficulty:** Intermediate

**Real-world:** `$sort` then `$limit` can stop early if the sort is supported by an index.

**Follow-up 1:** What if the sort is not indexed?

**Answer:** Mongo sorts in memory and may spill to disk with `allowDiskUse`. That is a slow dashboard.

**Follow-up 2:** Is limit alone enough?

**Answer:** No. A limit without a selective match still walks the collection to find the first matches unless an index serves the sort.

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


**Difficulty:** Advanced

**Real-world:** A multi-document transaction commits or aborts a group of writes. It needs a replica set.

**Follow-up 1:** What is atomic without one?

**Answer:** A single document update. Prefer that when the invariant fits in one document.

**Follow-up 2:** What do you retry?

**Answer:** Transient transaction errors, and only if the operation is idempotent.

---
### 189. When transactions?

**Answer:** Use transactions when multiple documents must update atomically — inventory deduction + order creation, account transfers, double-entry ledger. Skip for single-document updates which are already atomic.

**Example:**
```javascript
// NEED transaction: decrement stock AND create order — both or neither
// SKIP transaction: single doc update { $set: { status: 'shipped' } }
```


**Difficulty:** Advanced

**Real-world:** Use a transaction when two collections must agree, such as slot status and the appointment insert.

**Follow-up 1:** When do you not start one?

**Answer:** A single `findOneAndUpdate` that is already conditional. A transaction around one statement adds cost.

**Follow-up 2:** What isolation do you tell the interviewer?

**Answer:** Snapshot isolation for the transaction. It does not replace a unique index.

---
### 190. Replica set?

**Answer:** A replica set is a group of MongoDB nodes — one primary (writes) and secondaries (replicate oplog). Automatic failover elects new primary on failure. Minimum three nodes for production (or PSA architecture).

**Example:**
```javascript
// Connection string with replica set
mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/shop?replicaSet=rs0
```


**Difficulty:** Advanced

**Real-world:** A replica set is a primary plus secondaries copying the oplog.

**Follow-up 1:** Where do writes go?

**Answer:** The primary. A secondary read can be stale.

**Follow-up 2:** What do you do when the primary steps down?

**Answer:** The driver retries the connection. Your request should time out and surface a 503 rather than hang.

---
### 191. Sharding?

**Answer:** Sharding horizontally partitions data across multiple shards by a shard key. Each shard is a replica set. Enables write scaling and massive storage beyond single-server limits. Adds operational complexity.

**Example:**
```javascript
// sh.shardCollection('shop.orders', { userId: 1, createdAt: 1 })
// Routes queries by shard key — bad key causes scatter-gather
```


**Difficulty:** Advanced

**Real-world:** Sharding splits a collection across machines by a shard key.

**Follow-up 1:** When do you shard?

**Answer:** When one replica set cannot hold the working set or the write rate. Not because a diagram looks serious.

**Follow-up 2:** What do you say if you have never operated a sharded cluster?

**Answer:** That you know the idea and you have not run one. Then talk about indexes and the replica set you have run.

---
### 192. Shard key?

**Answer:** The shard key determines document distribution across shards. Choose high cardinality, even distribution, and alignment with common queries. A bad key (low cardinality like `status`) creates hotspots.

**Example:**
```javascript
// Good: { userId: 1, orderId: 1 } — even spread, query by user
// Bad: { status: 1 } — most orders 'completed', one chunk hot
```


**Difficulty:** Advanced

**Real-world:** The shard key decides where a document lives. You cannot change it casually.

**Follow-up 1:** What is a hot shard?

**Answer:** A key that sends most writes to one chunk, such as a monotonic id with no other prefix, or a single tenant.

**Follow-up 2:** What would you consider for a multi-facility app?

**Answer:** A key that starts with facility or organisation, after you check the cardinality.

---
### 193. Read preference?

**Answer:** Read preference controls which replica set members serve reads — `primary` (default), `primaryPreferred`, `secondary`, `nearest`. Secondaries may return slightly stale data; use for analytics, not checkout.

**Example:**
```javascript
mongoose.connect(uri, { readPreference: 'secondaryPreferred' });
// Analytics dashboard reads from secondary — reduces primary load
```


**Difficulty:** Advanced

**Real-world:** Read preference chooses which member serves a read.

**Follow-up 1:** Why did the user not see the write they just made?

**Answer:** The next read used a secondary that had not applied the oplog. Read your own write from the primary, or return the write in the POST response.

**Follow-up 2:** What is the default?

**Answer:** primary.

---
### 194. Write concern?

**Answer:** Write concern specifies acknowledgment level before reporting success — `w: 1` (primary only), `w: 'majority'` (majority of replicas). Higher concern = durability; trade-off with latency.

**Example:**
```javascript
await Order.create({ total: 99 }, {
  writeConcern: { w: 'majority', wtimeout: 5000 }
});
```


**Difficulty:** Advanced

**Real-world:** Write concern is how many members must acknowledge.

**Follow-up 1:** What is `majority`?

**Answer:** The write is on a majority of voting members before the driver returns. It is slower and survives a failover better.

**Follow-up 2:** What does `w: 1` risk?

**Answer:** The primary acknowledged and then died before replication. The write can roll back.

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


**Difficulty:** Intermediate

**Real-world:** A change stream tails the oplog and emits changes. It needs a replica set.

**Follow-up 1:** What do you use it for?

**Answer:** A projection or a websocket fan-out of new appointments. Not as a transaction log you invent yourself.

**Follow-up 2:** What happens if your consumer is slow?

**Answer:** The resume token and the oplog window matter. If you fall off the oplog, you must resync.

---
### 196. Capped collection?

**Answer:** Capped collections have fixed size and automatically overwrite oldest documents when full — circular buffer. Insert-order natural sorting. Use for logs, metrics, and message queues with bounded retention.

**Example:**
```javascript
db.createCollection('api_logs', { capped: true, size: 10485760, max: 5000 });
db.api_logs.insertOne({ method: 'POST', path: '/api/orders', ms: 45 });
```


**Difficulty:** Screening

**Real-world:** A capped collection is a fixed-size ring. Insert order is preserved.

**Follow-up 1:** What is a bad use?

**Answer:** Appointments you must update and delete freely. Capped collections restrict updates.

**Follow-up 2:** What is a fair use?

**Answer:** A small diagnostic log with a fixed size, if you do not need a real log pipeline.

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


**Difficulty:** Intermediate

**Real-world:** GridFS splits a large file across chunks in Mongo.

**Follow-up 1:** When do you not use it?

**Answer:** When object storage exists. GridFS puts file traffic on the database.

**Follow-up 2:** When might you?

**Answer:** A constraint that the only datastore you are allowed is Mongo, and the files are not huge.

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


**Difficulty:** Intermediate

**Real-world:** Collection validation rejects documents that do not match a JSON schema.

**Follow-up 1:** Does it replace Zod?

**Answer:** No. Validation at the database is the backstop. The API should reject first with a 400 the client understands.

**Follow-up 2:** What does a validation failure look like to the driver?

**Answer:** A write error. Map it to a 400. Do not retry it.

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


**Difficulty:** Intermediate

**Real-world:** Hooks run on save and on some updates. `findOneAndUpdate` does not run `save` hooks unless you opt in.

**Follow-up 1:** Why is that a bug?

**Answer:** A `pre('save')` that hashes a password never runs on a query update. The password is stored plain, or a stamp is missing.

**Follow-up 2:** What do you prefer?

**Answer:** Explicit code in the service over a hook that the next reader misses.

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


**Difficulty:** Screening

**Real-world:** A virtual is a computed field that is not stored.

**Follow-up 1:** Does it appear in `lean()`?

**Answer:** No. Lean objects do not have virtuals.

**Follow-up 2:** Does it appear in JSON?

**Answer:** Only if you set `toJSON` virtuals. Do not depend on it for a field the client must have unless you test the serialised shape.

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


**Difficulty:** Advanced

**Real-world:** Offset pagination gets slower as skip grows. Cursor pagination does not.

**Follow-up 1:** What do you return to the client?

**Answer:** The last id or the last sort key, and a limit. The next page queries `_id` greater than that cursor.

**Follow-up 2:** What can a cursor not do?

**Answer:** Jump to page 50. Say that trade-off. Offsets can, and they drift if rows are inserted.

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


**Difficulty:** Advanced

**Real-world:** A cursor is a stable position in a sorted index.

**Follow-up 1:** Which index do you need?

**Answer:** The sort fields, including the tie-break `_id`. Otherwise the page boundary is unstable.

**Follow-up 2:** What if the client forges a cursor?

**Answer:** Treat it as a value in the query, not as authorisation. The org filter still applies.

---
### 203. $regex?

**Answer:** `$regex` performs pattern matching on strings. Case-insensitive search with `$options: 'i'`. Slow on large collections without index — prefer text index, Atlas Search, or prefix regex `^term` with index.

**Example:**
```javascript
// Avoid: { name: { $regex: 'phone', $options: 'i' } } — COLLSCAN
// Better: db.products.find({ $text: { $search: 'phone' } })
db.users.find({ email: { $regex: '^alice', $options: 'i' } });
```


**Difficulty:** Intermediate

**Real-world:** A leading-wildcard regex cannot use a normal index efficiently.

**Follow-up 1:** What do you do for a prefix search?

**Answer:** Anchor the regex at the start, or use a text index, or store a normalised prefix.

**Follow-up 2:** What is the ReDoS angle?

**Answer:** User-supplied regex patterns. Escape them or refuse them. Mongo will spend CPU on a catastrophic pattern.

---
### 204. Atlas?

**Answer:** MongoDB Atlas is the managed cloud database service — automated backups, monitoring, scaling, and global clusters. Free tier available. Preferred over self-hosting for most production Node apps in 2026.

**Example:**
```bash
# Connection via Atlas dashboard
MONGODB_URI=mongodb+srv://admin:PASSWORD@cluster0.abc.mongodb.net/shop?retryWrites=true&w=majority
```


**Difficulty:** Screening

**Real-world:** Atlas is the managed service: backups, monitoring, and search features.

**Follow-up 1:** What do you still own?

**Answer:** The schema, the indexes, the query shape, and the connection string's privileges.

**Follow-up 2:** What do you not claim?

**Answer:** That Atlas makes a collection scan acceptable.

---
### 205. Connection string?

**Answer:** The connection string (URI) specifies protocol, credentials, hosts, database, and options. `mongodb+srv://` resolves DNS seedlist for Atlas. Include `retryWrites`, `w=majority`, and app name for observability.

**Example:**
```javascript
await mongoose.connect(
  'mongodb+srv://user:pass@cluster.mongodb.net/shop?retryWrites=true&w=majority&appName=shop-api'
);
```


**Difficulty:** Screening

**Real-world:** The connection string has the hosts, the database, and the options.

**Follow-up 1:** What must not be in git?

**Answer:** The password. Inject it. Use a user that can only touch this database.

**Follow-up 2:** What option matters for a replica set?

**Answer:** The replica set name, and TLS. `retryWrites` is on by default in modern drivers.

---
### 206. Connection pooling?

**Answer:** Mongoose maintains a pool of reusable TCP connections to MongoDB. Default `maxPoolSize` is 100. One `mongoose.connect()` per process; do not connect per request. Tune pool size vs application concurrency.

**Example:**
```javascript
// Single connect at startup
await mongoose.connect(uri, { maxPoolSize: 50, minPoolSize: 10 });
// Reuse connection across all requests in the process
```


**Difficulty:** Advanced

**Real-world:** The driver pools connections. One MongoClient per process.

**Follow-up 1:** What does a pool of 5 do under 200 concurrent queries?

**Answer:** The extras wait. Latency climbs before Mongo's CPU does.

**Follow-up 2:** What is too large a pool?

**Answer:** More connections than the server can accept, so new work is rejected and the database spends time scheduling.

---
### 207. Denormalization?

**Answer:** Denormalization duplicates data across documents to avoid joins and speed reads. Trade storage and sync complexity for query performance. Common in MongoDB — embed product name on order items at purchase time.

**Example:**
```javascript
// Denormalized order item — price at time of purchase
{ items: [{ sku: 'KB-01', name: 'Keyboard', price: 75, qty: 1 }] }
// Product price can change; order keeps historical price
```


**Difficulty:** Advanced

**Real-world:** Denormalisation copies a field so a read avoids a join.

**Follow-up 1:** What is the consistency cost?

**Answer:** The copy can be stale when the source changes. Update it, or accept the staleness and say so.

**Follow-up 2:** What would you copy onto an appointment?

**Answer:** The doctor's display name, if renaming a doctor need not be instant on old appointments.

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


**Difficulty:** Intermediate

**Real-world:** The bucket pattern groups events into a document by time so you do not insert a document per event.

**Follow-up 1:** What is the bound?

**Answer:** A maximum number of events per bucket, or the document grows without limit.

**Follow-up 2:** When do you use it?

**Answer:** High-rate telemetry. Not for appointments you update individually.

---
### 209. Outlier pattern?

**Answer:** The outlier pattern handles documents that grow far larger than average — e.g., a product with millions of reviews. Store the common case efficiently and move outlier data to a separate collection.

**Example:**
```javascript
// Normal product: embed last 20 reviews
// Outlier bestseller: { productId, reviewIds: [...] } in product_reviews collection
```


**Difficulty:** Intermediate

**Real-world:** The outlier pattern stores the huge exception elsewhere so the common document stays small.

**Follow-up 1:** Give an example.

**Answer:** A doctor with a normal schedule in the document, and a separate collection for a celebrity doctor's huge history.

**Follow-up 2:** What is the code cost?

**Answer:** Two read paths. Only worth it when one key is wildly larger than the rest.

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


**Difficulty:** Intermediate

**Real-world:** `$elemMatch` requires one array element to satisfy all the conditions.

**Follow-up 1:** Without it, what matches?

**Answer:** Different elements can satisfy different clauses, so you match a document that has no single element you wanted.

**Follow-up 2:** Where do you put the index?

**Answer:** A multikey index on the array field you match.

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


**Difficulty:** Advanced

**Real-world:** A partial index includes only documents that match a filter.

**Follow-up 1:** Why is that better than indexing every soft-deleted row?

**Answer:** The index stays small and can be unique among the live rows.

**Follow-up 2:** What query uses it?

**Answer:** A query that includes the partial filter. If you forget the filter, the planner cannot use the partial index.

---
### 212. Sparse index?

**Answer:** Sparse indexes include only documents where the indexed field exists. Useful for optional unique fields — multiple docs can omit the field without violating uniqueness.

**Example:**
```javascript
db.users.createIndex({ phone: 1 }, { unique: true, sparse: true });
// Many users without phone — not indexed, no duplicate conflict
```


**Difficulty:** Intermediate

**Real-world:** A sparse index skips documents that lack the field.

**Follow-up 1:** How is that different from partial?

**Answer:** Sparse is only 'field missing'. Partial is any predicate. Prefer partial. Unique sparse still allows many documents with the field missing.

**Follow-up 2:** What bug does that create?

**Answer:** You thought null emails were unique. Missing and null are not the same, and many missings are allowed.

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


**Difficulty:** Intermediate

**Real-world:** `$geoNear` returns documents by distance. It must be the first stage.

**Follow-up 1:** What index do you need?

**Answer:** A 2dsphere index on the location field.

**Follow-up 2:** What do you ask before designing it?

**Answer:** Whether you really need distance, or a city id is enough. Geo queries are easy to add and easy to misuse.

---
### 214. Backup strategy?

**Answer:** Production backup strategies include Atlas continuous cloud backup with point-in-time recovery, scheduled `mongodump` to object storage, and testing restores regularly. 3-2-1 rule: 3 copies, 2 media types, 1 offsite.

**Example:**
```bash
# Atlas: enable Cloud Backup in cluster settings
# Self-hosted cron:
mongodump --uri="$MONGODB_URI" --gzip --archive=backup-$(date +%F).gz
```


**Difficulty:** Intermediate

**Real-world:** Backups are a schedule plus a tested restore. A snapshot you have never restored is a hope.

**Follow-up 1:** What do you restore into?

**Answer:** A separate cluster, then you check a known document. Not over production on the first try.

**Follow-up 2:** What else must be consistent?

**Answer:** The application version and the index set. A restore of data without the indexes brings the scans back.

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


**Difficulty:** Intermediate

**Real-world:** An e-commerce schema separates catalog, cart, and order. Stock is not a cache.

**Follow-up 1:** Where is the invariant?

**Answer:** The stock decrement is conditional: only if `stock >= qty`. The order insert shares that fate or you compensate.

**Follow-up 2:** What is in the order document?

**Answer:** The price and sku at purchase time, so a later catalog edit does not rewrite history.

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


**Difficulty:** Intermediate

**Real-world:** Duplicate key is E11000. It is a constraint doing its job.

**Follow-up 1:** What do you return for a retried idempotency key?

**Answer:** The original response, 200, not a 500.

**Follow-up 2:** What do you return for a second booking of one slot?

**Answer:** 409. The unique index is the backstop.

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


**Difficulty:** Advanced

**Real-world:** 2026 practice is the same discipline: index the query, bound the document, project fields, time out the operation.

**Follow-up 1:** What is new enough to mention?

**Answer:** Queryable encryption range queries in 8.0, and Atlas search features if you use them. Do not recite marketing numbers you have not measured.

**Follow-up 2:** What do you still refuse?

**Answer:** `$where`, unbounded `skip`, and a collection scan on a hot path.

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


**Difficulty:** Advanced

**Real-world:** NoSQL injection is an operator in user input: `{ "$gt": "" }` as a password.

**Follow-up 1:** How do you prevent it?

**Answer:** Do not spread `req.body` into a filter. Cast ids to strings or ObjectIds. Reject keys that start with `$`.

**Follow-up 2:** What library is a backstop, not the design?

**Answer:** A sanitiser. The design is an allow-list of fields.

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


**Difficulty:** Screening

**Real-world:** `$or` and `$and` combine clauses. `$in` matches a list. `$exists` tests presence.

**Follow-up 1:** When does `$or` hurt?

**Answer:** When each branch cannot use an index. Two indexed equalities are fine. A scan plus a scan is not.

**Follow-up 2:** `$exists: false` versus null?

**Answer:** They differ. A field set to null exists. A missing field does not.

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


**Difficulty:** Advanced

**Real-world:** `findByIdAndUpdate` skips schema validators unless you pass `runValidators`.

**Follow-up 1:** What else does it skip?

**Answer:** `save` middleware. A password hook will not run.

**Follow-up 2:** What do you set on a partial update?

**Answer:** `runValidators: true` and an explicit `$set`. Check the return value. A null return is a missing id, not a success.

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


**Difficulty:** Intermediate

**Real-world:** Soft delete sets `deletedAt` instead of removing the row.

**Follow-up 1:** What must every query include?

**Answer:** `deletedAt: null`, or you serve deleted patients. A partial index can enforce uniqueness of the live rows.

**Follow-up 2:** Why not hard delete?

**Answer:** Audit and restore. If the product does not need either, hard delete is simpler. Do not soft-delete by habit.

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


**Difficulty:** Screening

**Real-world:** A static is on the model: `Appointment.findOpen()`. An instance method is on a document: `doc.cancel()`.

**Follow-up 1:** Where does a query helper belong?

**Answer:** A static or a repository function. Not an instance method that hides a second query.

**Follow-up 2:** What is hard to test?

**Answer:** An instance method that reaches out to another model via a global import.

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


**Difficulty:** Screening

**Real-world:** `timestamps: true` adds `createdAt` and `updatedAt`.

**Follow-up 1:** Does a raw `updateOne` refresh `updatedAt`?

**Answer:** Mongoose can, if the middleware runs. A driver call you wrote by hand will not unless you set the field.

**Follow-up 2:** What time zone are they?

**Answer:** UTC instants. Convert for display. Do not store a local string as the only timestamp.

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


**Difficulty:** Advanced

**Real-world:** `bulkWrite` sends many operations in one round trip. They are ordered by default.

**Follow-up 1:** What is unordered for?

**Answer:** Independent inserts you want to continue after one duplicate key.

**Follow-up 2:** Is a bulk write a transaction?

**Answer:** No. Other clients can see a prefix. Use a transaction if the set must be all or nothing, and keep the batch small.

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


**Difficulty:** Advanced

**Real-world:** `__v` is optimistic concurrency. You update only if the version matches, then increment it.

**Follow-up 1:** What do you return when matchedCount is 0?

**Answer:** 409. Reload. Do not overwrite.

**Follow-up 2:** What does this not solve?

**Answer:** Two documents that must change together. That is a transaction or a single document.

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


**Difficulty:** Advanced

**Real-world:** A design interview is requirements, the invariant, the data model, then the boxes.

**Follow-up 1:** What do you ask in the first two minutes?

**Answer:** Who uses it, what must never happen, and the rough scale. You state assumptions.

**Follow-up 2:** What do you draw last?

**Answer:** The boxes. Interviewers remember the write path and the failure, not the logo.

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


**Difficulty:** Advanced

**Real-world:** A public API needs a limit, auth, and a backpressure story.

**Follow-up 1:** Where is the counter?

**Answer:** Redis, keyed by token. A process-local map is wrong as soon as you run two pods.

**Follow-up 2:** What status and header?

**Answer:** 429 and Retry-After. Document whether Redis failure fails open or closed.

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


**Difficulty:** Advanced

**Real-world:** Cache-aside is the usual read path. Write-through writes both. Read-through hides the miss in the cache layer.

**Follow-up 1:** Which one do you start with?

**Answer:** Cache-aside. You control invalidation in the writer.

**Follow-up 2:** What do you not cache?

**Answer:** Slot availability as the authority. Cache the doctor profile. The booking reads the primary.

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


**Difficulty:** Advanced

**Real-world:** The access pattern and the constraints pick the database.

**Follow-up 1:** Give one reason to add Postgres next to Mongo.

**Answer:** A report that joins many shapes, or a ledger that wants constraints. Do not add it because a blog said so.

**Follow-up 2:** Give one reason to stay on Mongo.

**Answer:** The appointment is one document you always load by id and by doctor plus day, and you have the indexes.

---

### 230. What is horizontal vs vertical scaling?

**Answer:** Vertical scaling adds CPU/RAM to one machine — simpler but has a ceiling. Horizontal scaling adds more machines behind a load balancer — required at scale, needs stateless apps and shared stores (Redis, DB). Node cluster/PM2 uses multiple cores; Kubernetes scales pods across nodes.

**Example:**
```javascript
// Stateless API — safe to scale horizontally
// ❌ in-memory session map breaks with 2+ instances
// ✅ session in Redis; JWT or sticky-less design
```


**Difficulty:** Advanced

**Real-world:** Vertical scaling is a bigger machine. Horizontal scaling is more machines.

**Follow-up 1:** What must be true to add Node processes?

**Answer:** No sticky in-memory session, a shared database, and a pool that will not explode when pods double.

**Follow-up 2:** What does not scale horizontally by adding pods?

**Answer:** A single-primary write bottleneck and a collection scan.

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


**Difficulty:** Intermediate

**Real-world:** A load balancer spreads connections and stops sending traffic to a dead pod.

**Follow-up 1:** What health check do you give it?

**Answer:** Readiness, not a deep check that fails when a non-critical cache blips.

**Follow-up 2:** What does it not fix?

**Answer:** A slow query. It spreads the slowness.

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


**Difficulty:** Advanced

**Real-world:** A queue moves work that can finish after the response.

**Follow-up 1:** What do you put on it?

**Answer:** Email, reports, image resize. Not the booking decision the user is waiting on, unless the UX is explicitly asynchronous.

**Follow-up 2:** What must the consumer be?

**Answer:** Idempotent. Delivery is at least once.

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


**Difficulty:** Advanced

**Real-world:** At scale, retries are normal. Idempotency is how retries stay safe.

**Follow-up 1:** What is the unique key?

**Answer:** The client-supplied idempotency key, stored unique, plus the provider's key for a payment.

**Follow-up 2:** What do you return on a replay?

**Answer:** The same body and a success status. Not a second row.

---

### 234. CAP theorem — practical meaning?

**Answer:** In a network partition, you choose between **Consistency** (all nodes see same data) and **Availability** (every request gets a response). Partition tolerance is assumed in distributed systems. MongoDB with `w: majority` leans CP; Redis cache leans AP with TTL staleness. Explain tradeoffs, don't recite blindly.

**Example:**
```text
Payment service during partition → prefer consistency (reject writes)
Product catalog CDN cache → availability + eventual consistency OK
```


**Difficulty:** Advanced

**Real-world:** CAP: during a partition you choose availability or consistency. You do not get a magical both.

**Follow-up 1:** What does a booking choose?

**Answer:** Consistency. A partition must not create two holders of one slot. Refuse the write if you cannot be sure.

**Follow-up 2:** What can stay available?

**Answer:** A cached doctor profile that may be slightly stale.

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


**Difficulty:** Advanced

**Real-world:** Realtime notifications are a socket plus a fan-out bus.

**Follow-up 1:** Why a bus?

**Answer:** The user is connected to one process. The event happens on another. Redis pub/sub or a queue bridges them.

**Follow-up 2:** What do you do if the socket is gone?

**Answer:** Store the notification and deliver it on the next fetch. Do not block the booking on the push.

---

### 236. CDN — when and why?

**Answer:** Serve static assets (JS bundles, images, videos) from edge locations close to users. Reduces origin load and latency. Use signed URLs for private content. Node API still handles dynamic JSON; CDN handles cacheable files with long `Cache-Control`.

**Example:**
```javascript
// S3 + CloudFront — upload via sharp, serve via CDN URL
res.json({ imageUrl: `https://d111111.cloudfront.net/products/${id}.webp` });
```


**Difficulty:** Intermediate

**Real-world:** A CDN caches bytes close to the user.

**Follow-up 1:** What do you put on it?

**Answer:** Public, immutable assets. Not an authenticated patient JSON response, unless you have a cache key that includes auth and you understand the leak.

**Follow-up 2:** What is the invalidation story?

**Answer:** A content hash in the filename so you do not purge. A purge is the slow path.

---

### 237. Database connection pooling at scale?

**Answer:** Each Node process holds a pool of DB connections. Too many pods × too large a pool exhausts DB `max_connections`. Tune pool size per instance (often 5–20), use PgBouncer for Postgres, monitor active connections in Atlas/RDS.

**Example:**
```javascript
mongoose.connect(uri, { maxPoolSize: 10, minPoolSize: 2, serverSelectionTimeoutMS: 5000 });
// 8 pods × 10 = 80 connections — stay under DB limit
```


**Difficulty:** Advanced

**Real-world:** Pooling at scale is a limit per process times the number of processes.

**Follow-up 1:** What happens when you autoscale pods without a connection budget?

**Answer:** You open more Mongo connections than the cluster allows and new requests fail.

**Follow-up 2:** What do you set?

**Answer:** A pool size that times pods stays under the database limit, and a readiness check that fails when the pool cannot connect.

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


**Difficulty:** Advanced

**Real-world:** A saga is a sequence of local transactions with a compensating action.

**Follow-up 1:** When do you need one?

**Answer:** When the write spans services, such as book then charge. A Mongo transaction cannot cross the payment provider.

**Follow-up 2:** What is the compensation?

**Answer:** Release the hold. Do not delete the audit row.

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


**Difficulty:** Advanced

**Real-world:** A circuit breaker stops calling a dependency that is failing.

**Follow-up 1:** What do you count?

**Answer:** Failures and timeouts, not business 404s. A missing patient is not a down service.

**Follow-up 2:** What do you return when it is open?

**Answer:** A fast 503. A retry storm is what the breaker exists to prevent.

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


**Difficulty:** Advanced

**Real-world:** Webhook delivery is at least once, signed, and retried.

**Follow-up 1:** What do you persist before you ack the provider?

**Answer:** The event id, unique. A duplicate delivery returns 200 and does no work.

**Follow-up 2:** What if your handler is slow?

**Answer:** Ack after you store the event, and process on a queue. Do not make the provider time out and retry forever.

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


**Difficulty:** Advanced

**Real-world:** TypeScript removes a class of bugs at build time. It does not validate JSON.

**Follow-up 1:** What do you still parse at runtime?

**Answer:** `req.body`, query strings, and messages from other services. Zod or an equivalent schema.

**Follow-up 2:** What do you tell a panel that says types are enough?

**Answer:** Types are erased. The bytes are not.

---

### 242. interface vs type alias?

**Answer:** `interface` supports declaration merging and `extends`; preferred for object shapes and public APIs. `type` supports unions, intersections, mapped types, and tuples. Use `type` for unions like `Result = Success | Error`.

**Example:**
```typescript
type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

interface User { id: string; email: string; }
interface AdminUser extends User { role: 'admin'; permissions: string[]; }
```


**Difficulty:** Intermediate

**Real-world:** Interfaces merge and are a good fit for object shapes you will extend. Types handle unions and mapped forms.

**Follow-up 1:** Can you reopen a type alias?

**Answer:** No. You can reopen an interface of the same name. That is how Express Request is augmented.

**Follow-up 2:** Which do you use for a status union?

**Answer:** A type alias: `type Status = 'open' | 'booked'`.

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


**Difficulty:** Advanced

**Real-world:** A generic keeps a function honest about the type it returns.

**Follow-up 1:** Show a repository method.

**Answer:** `findById<T extends { id: string }>(...)` is only useful if the constraint matches what you read. Prefer a concrete `Appointment` if there is only one.

**Follow-up 2:** What is a bad generic?

**Answer:** `<T>(body: T): T` on a parser. The caller chooses T and the function does not check it.

---

### 244. Utility types — Pick, Omit, Partial, Required?

**Answer:** Transform existing types without duplication. `Pick<User, 'id'|'email'>` for public profile; `Partial<User>` for PATCH updates; `Omit<User, 'passwordHash'>` for safe responses.

**Example:**
```typescript
type PublicUser = Omit<User, 'passwordHash'>;
type UpdateUserDto = Partial<Pick<User, 'name' | 'avatarUrl'>>;
```


**Difficulty:** Intermediate

**Real-world:** Utility types derive a DTO so you do not copy a field list by hand.

**Follow-up 1:** Why is Partial of the whole entity a bad PATCH?

**Answer:** It makes `orgId` and `id` optional and writable. Pick the fields the caller may change.

**Follow-up 2:** Name Omit versus Pick.

**Answer:** Omit removes keys. Pick keeps only those keys. Create DTOs usually Omit server-generated fields.

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


**Difficulty:** Advanced

**Real-world:** A discriminant lets a switch narrow a union.

**Follow-up 1:** What field do you add?

**Answer:** A literal `kind` or `status` on every variant. A shared optional field does not narrow.

**Follow-up 2:** What does the default branch return?

**Answer:** `never`, so a new variant fails the build until you handle it.

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


**Difficulty:** Advanced

**Real-world:** `strict` is the set of flags you want on any folder you migrate.

**Follow-up 1:** Name three that bite.

**Answer:** `strictNullChecks`, `strictFunctionTypes`, and `strictPropertyInitialization`.

**Follow-up 2:** What if the repo cannot turn it on this week?

**Answer:** Turn it on for the new module. Do not add `any` to silence the old one.

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


**Difficulty:** Advanced

**Real-world:** Express types do not know your user. You add it once, carefully.

**Follow-up 1:** Why is `req.user!` unsafe?

**Answer:** The assertion compiles even when the auth middleware is missing on that route.

**Follow-up 2:** What is the safer pattern?

**Answer:** A guard that returns 401, then a local `const user = req.user` that is narrowed.

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


**Difficulty:** Advanced

**Real-world:** Zod is the runtime check. The TypeScript type is inferred from the schema.

**Follow-up 1:** Why infer instead of writing both?

**Answer:** Two sources drift. `z.infer<typeof Schema>` stays aligned.

**Follow-up 2:** Where do you parse?

**Answer:** At the route. The service receives the inferred type, not `unknown`.

---

### 249. ESM + TypeScript in Node?

**Answer:** Node 20+ supports `"type": "module"` with `.ts` via tsx/ts-node or compile to `.js`. Use `import.meta.url` for `__dirname` equivalent. Align `module`/`moduleResolution` in tsconfig with Node16/NodeNext.

**Example:**
```typescript
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
```


**Difficulty:** Advanced

**Real-world:** ESM in Node means the specifier Node will load, including `.js` on relative imports from TypeScript.

**Follow-up 1:** Why does the import say `.js` in a `.ts` file?

**Answer:** `tsc` does not rewrite the specifier under Node16 resolution. You write the emitted name.

**Follow-up 2:** What fails if you omit it?

**Answer:** `ERR_MODULE_NOT_FOUND` in production, while a bundler on a laptop may have hidden it.

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


**Difficulty:** Advanced

**Real-world:** Nest enforces modules, injection, and decorators. Express is a library you structure yourself.

**Follow-up 1:** When do you pick Nest?

**Answer:** A large team that wants one way to declare a provider and a controller.

**Follow-up 2:** When do you stay on Express?

**Answer:** A service you already own, or a team that does not want the decorator and module runtime. Structure is still your job.

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


**Difficulty:** Intermediate

**Real-world:** The pyramid is many unit tests, fewer API tests, a few end-to-end tests.

**Follow-up 1:** What is the unit under test in a booking service?

**Answer:** The service with a fake repository: taken slot, replayed key, missing org.

**Follow-up 2:** What is the one HTTP test you keep?

**Answer:** Auth rejection and a validation 400. You do not boot Mongo for every branch.

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


**Difficulty:** Intermediate

**Real-world:** Supertest sends HTTP at the app without binding a public port.

**Follow-up 1:** What do you not hit?

**Answer:** The real payment provider. Inject a fake at the composition root.

**Follow-up 2:** What status do you assert on a bad body?

**Answer:** 400 and the error code, not only that the promise rejects.

---

### 253. Mocking external services?

**Answer:** Mock HTTP clients (nock, msw), payment gateways, and LLM APIs in tests — never hit real APIs in CI. Inject dependencies so services accept interfaces/mocks (DI pattern).

**Example:**
```javascript
import nock from 'nock';
nock('https://api.stripe.com').post('/v1/charges').reply(200, { id: 'ch_test', status: 'succeeded' });
```


**Difficulty:** Advanced

**Real-world:** A mock replaces a collaborator. A mock that mirrors the real bug is useless.

**Follow-up 1:** What do you mock at the HTTP edge?

**Answer:** The downstream client, returning 503 and a timeout. You assert your deadline and your status.

**Follow-up 2:** What is the failure mode of mocking Mongo?

**Answer:** The test passes and the query cannot use an index. Keep one integration test if the query is the risk.

---

### 254. Contract testing?

**Answer:** Verify API consumer and provider agree on request/response shape without full E2E. Pact or OpenAPI diff in CI. Critical when mobile/frontend teams consume your Node API independently.

**Example:**
```text
Provider (Node): publish OpenAPI spec artifact in CI
Consumer: breaking change detector fails PR if response schema changes
```


**Difficulty:** Advanced

**Real-world:** A contract test checks that consumer and provider agree on the payload.

**Follow-up 1:** When do you add one?

**Answer:** When another team calls you, or you call a provider whose schema changes.

**Follow-up 2:** What do you not use it for?

**Answer:** Internal function arguments in the same process. A type and a unit test are enough.

---

### 255. CI pipeline essentials for Node?

**Answer:** On every PR: `npm ci`, lint, typecheck (`tsc --noEmit`), unit/integration tests, optional security audit (`npm audit`, Snyk). On main: build Docker image, deploy to staging, smoke test health endpoint.

**Example:**
```yaml
- run: npm ci
- run: npm run lint && npm run typecheck && npm test
- run: docker build -t api:${{ github.sha }} .
```


**Difficulty:** Intermediate

**Real-world:** CI installs from the lockfile, typechecks, tests, and builds an image.

**Follow-up 1:** What must fail the pipeline?

**Answer:** `tsc --noEmit`, tests, and a known-vulnerable dependency you have decided to block.

**Follow-up 2:** What do you not do in CI?

**Answer:** Talk to production Mongo.

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


**Difficulty:** Advanced

**Real-world:** A senior review looks for auth, the query, the error path, and the test that would have caught the bug.

**Follow-up 1:** What do you block on?

**Answer:** A write that trusts `orgId` from the body, a swallowed error, or a collection scan on a hot path.

**Follow-up 2:** What do you not block a release on?

**Answer:** A naming nit that a formatter can fix, when the behaviour is wrong and still unfixed. You can mention the name after the behaviour.

---

### 257. Technical debt — how do you manage it?

**Answer:** Track debt explicitly (tickets, ADRs), allocate ~15–20% sprint capacity, prioritize debt that blocks features or causes incidents. Refactor in small PRs with tests. Explain tradeoffs to product — "fast now vs slow later."

**Example:**
```text
STAR story prep: "We had no integration tests on checkout — after two outages,
I added Supertest suite + staging gate; deploy confidence went up, incidents dropped."
```


**Difficulty:** Intermediate

**Real-world:** Debt is a shortcut you can name, with a cost and a trigger to repay it.

**Follow-up 1:** Give a debt that is acceptable.

**Answer:** `strict` off in the legacy folder, with new code in a strict folder and a date you revisit.

**Follow-up 2:** Give a debt that is not.

**Answer:** A missing unique index on a payment key, left as a TODO.

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


**Difficulty:** Advanced

**Real-world:** Postgres next to Mongo is a second source of truth unless one owns each fact.

**Follow-up 1:** What belongs in Postgres?

**Answer:** A ledger or a relational report. Not a copy of every appointment you also update in Mongo.

**Follow-up 2:** What is the sync story?

**Answer:** One writer. The other store is a projection, built from events, and allowed to lag.

---

### 259. Indexes in PostgreSQL?

**Answer:** B-tree default for equality/range; GIN for JSONB/full-text; partial indexes for filtered queries. Run `EXPLAIN ANALYZE` to verify index use — avoid sequential scans on large tables.

**Example:**
```sql
CREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC);
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = '...' ORDER BY created_at DESC LIMIT 20;
```


**Difficulty:** Intermediate

**Real-world:** A Postgres index is the same idea as Mongo: the planner should not seq-scan a hot filter.

**Follow-up 1:** What do you look at?

**Answer:** `EXPLAIN ANALYZE`, rows versus estimates, and whether the index matches the WHERE and the ORDER BY.

**Follow-up 2:** What index is not free?

**Answer:** Each extra index slows writes, same as Mongo.

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


**Difficulty:** Advanced

**Real-world:** Isolation is how much concurrent transactions can see.

**Follow-up 1:** What do you use for a double-booking equivalent in SQL?

**Answer:** A unique constraint plus a transaction, or `SELECT ... FOR UPDATE` on the slot row.

**Follow-up 2:** What is a phantom?

**Answer:** A second transaction inserts a row your predicate would have matched. Unique constraints close the booking case more simply than a lecture on phantoms.

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


**Difficulty:** Advanced

**Real-world:** N+1 is one query for the list and one per row for a parent.

**Follow-up 1:** How do you see it?

**Answer:** Logs show a burst of identical finds. The fix is one query with an `IN` list or a join.

**Follow-up 2:** What is the GraphQL version?

**Answer:** A resolver per field that fetches. DataLoader batches the ids in one tick.

---

### 262. Database migrations?

**Answer:** Version schema changes with tools like `node-pg-migrate`, Knex, Prisma Migrate, or Flyway. Never manual prod edits. Backward-compatible migrations (expand → migrate data → contract) enable zero-downtime deploys.

**Example:**
```javascript
exports.up = (pgm) => pgm.addColumn('users', 'display_name', { type: 'text' });
```


**Difficulty:** Intermediate

**Real-world:** Migrations are versioned changes to a schema you can run forward.

**Follow-up 1:** What do you not do?

**Answer:** Edit a migration that has run in production. Add a new one.

**Follow-up 2:** How do you ship a rename?

**Answer:** Add the new column, write both, backfill, switch readers, then drop. Not one destructive change in the same deploy as the code.

---

### 263. Read replicas?

**Answer:** Primary handles writes; replicas serve read-heavy traffic with replication lag (eventual consistency). Route analytics/reporting to replica; critical reads from primary. MongoDB read preferences (Q176) follow similar logic.

**Example:**
```javascript
const writePool = new Pool({ connectionString: process.env.DATABASE_PRIMARY_URL });
const readPool = new Pool({ connectionString: process.env.DATABASE_REPLICA_URL });
```


**Difficulty:** Advanced

**Real-world:** A replica serves reads and can be stale.

**Follow-up 1:** What do you send to the replica?

**Answer:** A list or a report that can lag. Not the read-your-writes after a payment.

**Follow-up 2:** What is the failover story?

**Answer:** The replica can be promoted. Your client must reconnect. A connection string aimed at one host will not.

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


**Difficulty:** Intermediate

**Real-world:** Twelve-factor for a senior is disposable processes, config in the environment, and logs as a stream.

**Follow-up 1:** What local disk habit breaks it?

**Answer:** Uploads stored on the pod. The next pod cannot see them.

**Follow-up 2:** What config habit breaks it?

**Answer:** A config file baked into the image that differs per environment. Build once, configure at run.

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


**Difficulty:** Intermediate

**Real-world:** Multi-stage Docker builds compile in one stage and run in a smaller one.

**Follow-up 1:** What user does the process use?

**Answer:** A non-root user. The image should not need apt in production.

**Follow-up 2:** What do you pin?

**Answer:** The Node base image digest or at least the major, so a rebuild is not a surprise.

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


**Difficulty:** Advanced

**Real-world:** Kubernetes runs the container, restarts it, and sends SIGTERM.

**Follow-up 1:** What must the app do?

**Answer:** Close the server on SIGTERM and respect the grace period.

**Follow-up 2:** What is a Service?

**Answer:** A stable address and a load balance across pods. You do not hardcode pod IPs.

---

### 267. AWS services commonly paired with Node?

**Answer:** **Lambda** (serverless APIs), **ECS/Fargate** (containers), **S3** (files), **SQS/SNS** (queues), **RDS/Aurora** (Postgres), **ElastiCache** (Redis), **Secrets Manager**, **CloudWatch**. Know one cloud deeply; concepts transfer to GCP/Azure.

**Example:**
```javascript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
await s3.send(new PutObjectCommand({ Bucket: 'uploads', Key: key, Body: buffer }));
```


**Difficulty:** Intermediate

**Real-world:** The usual set is object storage, a queue, a secret store, and a managed database.

**Follow-up 1:** What do you not put in the interview if you have not used it?

**Answer:** A specific product name as if it were your production. Say the capability: object storage, queue, secrets.

**Follow-up 2:** What is the Node SDK habit?

**Answer:** A timeout on every client, and credentials from the environment, not from a checked-in file.

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


**Difficulty:** Advanced

**Real-world:** OpenTelemetry gives you a trace id across HTTP and Mongo.

**Follow-up 1:** What do you attach?

**Answer:** The incoming trace context, and a span around the database call. Logs include the same trace id.

**Follow-up 2:** What do you not log on the span?

**Answer:** The patient body or the token.

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


**Difficulty:** Advanced

**Real-world:** Structured logs are JSON objects. `console.log` of a string is a pile.

**Follow-up 1:** What fields are mandatory?

**Answer:** Time, level, message, request id, route, status, duration.

**Follow-up 2:** What do you never log?

**Answer:** Passwords, tokens, and full clinical payloads.

---

### 270. Secrets management in production?

**Answer:** Never commit secrets. Use AWS Secrets Manager, HashiCorp Vault, or K8s Secrets (encrypted at rest). Inject at runtime; rotate regularly. Scan repos with gitleaks in CI.

**Example:**
```javascript
if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY missing');
```


**Difficulty:** Advanced

**Real-world:** Secrets live in a manager or the platform's secret object. The app reads the environment.

**Follow-up 1:** What does a leak look like?

**Answer:** The secret in a log, in a source map, or in an error response that echoes config.

**Follow-up 2:** How do you rotate?

**Answer:** A new version, restart or reload, and the old version revoked. A secret baked into the image cannot be rotated without a rebuild.

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


**Difficulty:** Advanced

**Real-world:** Zero downtime means the old process drains while the new one becomes ready.

**Follow-up 1:** What order?

**Answer:** New pods ready, then old pods leave the balancer, then SIGTERM, then they exit.

**Follow-up 2:** What bug ruins it?

**Answer:** A migration that locks a hot table or a startup probe that is ready before Mongo is connected.

---

## Architecture & Production Patterns (272–279)

### 272. Monolith vs microservices?

**Answer:** Start monolith for speed; split when teams scale, deploy cadence conflicts, or domains need independent scaling. Microservices add network latency, distributed debugging, and ops overhead. Modular monolith is a 2026 sweet spot.

**Example:**
```text
Modular monolith: orders/, payments/, catalog/ — shared DB, clear boundaries
Extract payments microservice when PCI scope or team ownership demands it
```


**Difficulty:** Advanced

**Real-world:** A modular monolith is the default until a team or a failure domain forces a split.

**Follow-up 1:** What do you split first?

**Answer:** A worker with a different scale, such as notifications, not every folder.

**Follow-up 2:** What cost do you name?

**Answer:** Network failures, distributed traces, and data that used to be one transaction.

---

### 273. Event-driven architecture?

**Answer:** Services communicate via events (order.placed, payment.captured) through Kafka, SNS/SQS, or Redis streams. Loose coupling; consumers scale independently. Requires idempotent handlers and dead-letter queues.

**Example:**
```javascript
await eventBus.publish('order.placed', { orderId, userId, total });
```


**Difficulty:** Advanced

**Real-world:** Event-driven means the producer does not call the consumer. It records a fact.

**Follow-up 1:** What is the outbox?

**Answer:** The fact is written in the same database transaction as the booking, then a worker publishes it.

**Follow-up 2:** What if the consumer is down?

**Answer:** The booking still exists. The event waits. The consumer must be idempotent.

---

### 274. CQRS — when useful?

**Answer:** Command Query Responsibility Segregation separates write model from read-optimized views. Useful when read patterns differ heavily from writes (dashboards, search). Adds complexity — don't use for CRUD apps.

**Example:**
```text
Write: POST /orders → Postgres normalized tables
Read: GET /dashboard/sales → pre-aggregated Mongo collection updated by events
```


**Difficulty:** Advanced

**Real-world:** CQRS separates the write model from a read model shaped for a screen.

**Follow-up 1:** When is it worth it?

**Answer:** When the read is a heavy aggregation and the write is a small invariant. Not for a CRUD screen.

**Follow-up 2:** What is the lag?

**Answer:** The read model is stale until the projection catches up. The UI must tolerate that or read the write model for the owner's own change.

---

### 275. API Gateway pattern?

**Answer:** Single entry point for auth, rate limiting, routing, TLS termination, and request logging. Kong, AWS API Gateway, or Nginx. Backend services stay internal.

**Example:**
```text
Client → API Gateway (JWT verify, rate limit) → /orders → orders-service:3001
```


**Difficulty:** Intermediate

**Real-world:** A gateway is the front door: auth, rate limit, and routing.

**Follow-up 1:** What do you not put in it?

**Answer:** Business rules for a booking. Those change faster than the door.

**Follow-up 2:** What does every request get?

**Answer:** An identity, a request id, and a deadline.

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


**Difficulty:** Advanced

**Real-world:** Injection in Node is a constructor argument or a factory, not a framework requirement.

**Follow-up 1:** How do you wire it?

**Answer:** One composition root reads the environment and passes the repository in.

**Follow-up 2:** What bug does a service locator hide?

**Answer:** A global `getService()` that tests cannot replace, and a request-scoped value stored on a singleton.

---

### 277. Feature flags?

**Answer:** Toggle features without redeploy — gradual rollout, A/B tests, kill switch for bad releases. LaunchDarkly, Unleash, or simple Redis/DB flags.

**Example:**
```javascript
if (await flags.isEnabled('new-checkout', { userId })) return newCheckoutFlow(req);
return legacyCheckout(req);
```


**Difficulty:** Intermediate

**Real-world:** A feature flag turns a path on without a deploy.

**Follow-up 1:** Where do you evaluate it?

**Answer:** On the server, for a behaviour change. A flag in the client only is a hint.

**Follow-up 2:** What is the cleanup?

**Answer:** A flag that has been on for a month is a branch you delete. Flags rot.

---

### 278. OWASP Top 10 — Node-relevant highlights?

**Answer:** Injection (NoSQL injection — sanitize query objects), broken auth (weak JWT secrets), SSRF (validate outbound URLs in webhooks/AI tools), security misconfiguration, vulnerable dependencies (`npm audit`). Use helmet, validation, parameterized queries.

**Example:**
```javascript
const email = String(req.body.email);
await User.findOne({ email }); // not req.body directly as query object
```


**Difficulty:** Advanced

**Real-world:** The Node-relevant OWASP items are broken access control, injection, auth failures, and unrestricted resource use.

**Follow-up 1:** What is object-level authorisation?

**Answer:** The id in the URL must belong to the caller's organisation. A valid JWT is not enough.

**Follow-up 2:** What resource limit do you set?

**Answer:** Body size, rate limit, query timeout, and a maximum page size.

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


**Difficulty:** Advanced

**Real-world:** Profile before you tune. CPU, lag, and heap are different problems.

**Follow-up 1:** What tool do you name?

**Answer:** A CPU profile or clinic flame for CPU, heap snapshots for leaks, and `monitorEventLoopDelay` for lag.

**Follow-up 2:** What do you change first?

**Answer:** The hottest frame or the query that dominates the trace. Not a random cache.

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


**Difficulty:** Intermediate

**Real-world:** An LLM call is a slow, fallible dependency with a cost.

**Follow-up 1:** Where does it sit?

**Answer:** Behind a timeout, a queue if the user does not need it inline, and a log that does not store the full clinical note.

**Follow-up 2:** What do you not let it do?

**Answer:** Authorise a request or invent a booking status.

---

### 281. What is RAG (Retrieval-Augmented Generation)?

**Answer:** RAG grounds LLM answers in your data: embed documents → store vectors → on query, retrieve top-k chunks → inject into prompt. Reduces hallucination vs raw LLM. Node handles ingestion pipeline, query API, and prompt assembly.

**Example:**
```javascript
const chunks = await vectorStore.similaritySearch(userQuestion, 5);
const context = chunks.map(c => c.text).join('\n---\n');
const prompt = `Answer using ONLY this context:\n${context}\n\nQuestion: ${userQuestion}`;
```


**Difficulty:** Intermediate

**Real-world:** RAG retrieves your documents and puts them in the prompt.

**Follow-up 1:** What is the failure mode?

**Answer:** The retriever returns the wrong patient's chunk. Scope the search by organisation before you talk about the model.

**Follow-up 2:** What do you measure?

**Answer:** Whether the answer is grounded in the retrieved text, not only whether the model sounded sure.

---

### 282. Vector databases — options with Node?

**Answer:** **MongoDB Atlas Vector Search** (if already on Atlas), **Pinecone**, **Weaviate**, **pgvector** (Postgres extension), **Qdrant**. Choose based on existing stack, latency, and ops appetite.

**Aug 2026 update (MongoDB 8.3 / Atlas, May 2026):** Atlas Vector Search adds **Automated Voyage AI Embeddings** (preview) — embeddings generated on write/update. **`$scoreFusion`** aggregation stage (GA) combines vector + full-text scores for hybrid RAG. **LangGraph.js Long-Term Memory Store** (GA) uses Atlas as persistent agent memory for Node/TS stacks.

**Example:**
```javascript
// Hybrid vector + text search with scoreFusion (MongoDB 8.3+ / Atlas)
const results = await collection.aggregate([
  {
    $scoreFusion: {
      input: {
        pipelines: {
          vector: [{ $vectorSearch: { index: 'embedding_index', path: 'embedding', queryVector: queryEmbedding, numCandidates: 100, limit: 20 } }],
          text: [{ $search: { index: 'text_index', text: { query: userQuestion, path: 'body' } } }],
        },
      },
      combination: { weights: { vector: 0.7, text: 0.3 } },
    },
  },
  { $limit: 5 },
  { $project: { title: 1, text: 1, score: { $meta: 'scoreFusionScore' } } },
]).toArray();
```


**Difficulty:** Intermediate

**Real-world:** A vector index answers similarity. It is not a source of truth.

**Follow-up 1:** Where can it live?

**Answer:** Atlas Vector Search, pgvector, or a dedicated store. The choice follows the data you already have.

**Follow-up 2:** What do you filter first?

**Answer:** The tenant. A global similarity search is a data leak.

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


**Difficulty:** Intermediate

**Real-world:** SSE streams tokens to the browser over one HTTP response.

**Follow-up 1:** What do you set?

**Answer:** A timeout and a disconnect handler. A client that leaves must not keep the model call open.

**Follow-up 2:** How is this different from WebSocket?

**Answer:** SSE is server to client over HTTP. You do not need it for a normal JSON API.

---

### 284. Prompt injection — how to defend?

**Answer:** Untrusted user input can manipulate LLM behavior ("ignore previous instructions"). Mitigate: separate system vs user roles, output validation, allowlists for tools/actions, never execute LLM-suggested code blindly, log prompts, limit tool permissions.

**Example:**
```javascript
const system = 'You are a support bot. Answer ONLY about our product. Refuse unrelated requests.';
// Never pass raw user text as system prompt
```


**Difficulty:** Advanced

**Real-world:** Prompt injection is untrusted text that tries to override the instruction.

**Follow-up 1:** What is the API version of that?

**Answer:** A user field that says 'ignore the org filter'. The model must not be the component that applies the filter. The query does.

**Follow-up 2:** What do you log?

**Answer:** That the tool call was refused, not the whole prompt if it contains PHI.

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


**Difficulty:** Intermediate

**Real-world:** Cost is tokens times calls. A retry loop is a bill.

**Follow-up 1:** What limit do you set?

**Answer:** A per-tenant budget and a max token count, plus a cache for identical questions.

**Follow-up 2:** What do you not retry?

**Answer:** A 400 from the provider. Retrying a bad prompt spends money and fails again.

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


**Difficulty:** Advanced

**Real-world:** Structured output asks the model for JSON matching a schema, then you validate it.

**Follow-up 1:** Do you trust the JSON because the provider said it matches?

**Answer:** No. Parse it with Zod. The model still hallucinates fields.

**Follow-up 2:** What if validation fails?

**Answer:** One repair attempt or a 502. Do not save the broken object.

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


**Difficulty:** Advanced

**Real-world:** Tool calling lets the model request a function. Your code decides whether to run it.

**Follow-up 1:** What tool do you refuse?

**Answer:** One that books or deletes without a normal authorisation check in the function itself.

**Follow-up 2:** What is the loop limit?

**Answer:** A maximum number of tool rounds, or a prompt can keep calling forever.

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


**Difficulty:** Intermediate

**Real-world:** An embedding pipeline chunks, embeds, and stores vectors with the tenant id.

**Follow-up 1:** What do you re-embed?

**Answer:** Changed documents. Stale vectors answer from old text.

**Follow-up 2:** What do you not embed?

**Answer:** A blob the user is not allowed to retrieve later. The vector store is a copy of the data.

---

### 289. LangChain / Vercel AI SDK — when to use?

**Answer:** SDKs abstract chains, memory, tools, and streaming. Use for rapid prototyping and standard patterns; seniors should understand underlying API calls. Vercel AI SDK excels at streaming; LangChain at composable pipelines. Raw SDK fine for simple cases.

**Example:**
```javascript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
const { text } = await generateText({ model: openai('gpt-4o-mini'), prompt: 'Summarize this ticket...' });
```


**Difficulty:** Intermediate

**Real-world:** A framework is useful when it saves boilerplate and dangerous when you cannot see the prompt.

**Follow-up 1:** When do you skip it?

**Answer:** One call and a schema. A direct client is easier to reason about.

**Follow-up 2:** What do you still own?

**Answer:** Timeouts, evaluation, and the decision to send PHI.

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


**Difficulty:** Advanced

**Real-world:** Evaluate before you ship: a set of questions with expected facts, run on each prompt change.

**Follow-up 1:** What is a bad metric?

**Answer:** The model rating its own answer.

**Follow-up 2:** What is a useful one?

**Answer:** A human or a checked fact: did the cited id exist in the retrieved set?

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


**Difficulty:** Advanced

**Real-world:** PHI in a prompt is a disclosure. Minimise it and know the processor.

**Follow-up 1:** What do you redact?

**Answer:** Identifiers the model does not need. Do not log the prompt in the application log.

**Follow-up 2:** What is the retention question?

**Answer:** Does the provider train on the data, and how long do they store it? You need an answer before production.

---

### 292. Local vs cloud LLMs for Node?

**Answer:** Cloud APIs: best quality, no GPU ops, pay per token. Local (Ollama, vLLM): data privacy, no per-token cost, but ops burden. Hybrid: route sensitive data locally, general tasks to cloud.

**Example:**
```javascript
const local = new OpenAI({ baseURL: 'http://localhost:11434/v1', apiKey: 'ollama' });
const res = await local.chat.completions.create({ model: 'llama3.2', messages: [{ role: 'user', content: prompt }] });
```


**Difficulty:** Intermediate

**Real-world:** Local models keep data on your network and cost hardware. Cloud models are faster to adopt and are a processor.

**Follow-up 1:** What do you ask?

**Answer:** The data class and the latency budget. A coding assistant and a patient summary are different decisions.

**Follow-up 2:** What do you not claim?

**Answer:** That local means safe if the logs still leave the machine.

---

### 293. How AI changes the senior Node developer role in 2026?

**Answer:** You're expected to integrate AI features (search, chat, summarization, classification), not train models. Core skills remain: API design, security, scaling, observability. Add: prompt engineering basics, RAG pipelines, cost/latency tradeoffs, eval discipline, and skepticism toward AI-generated code — **you** own production reliability.

**Example:**
```text
"I've shipped RAG over MongoDB Atlas Vector Search with BullMQ ingestion,
SSE streaming, Zod-validated tool calls, and Redis caching — p95 latency 800ms,
cost capped at $0.002/query via gpt-4o-mini routing."
```


**Difficulty:** Intermediate

**Real-world:** The senior job is still the API, the data, and the failure mode. Models are a dependency.

**Follow-up 1:** What skill do you add?

**Answer:** Evaluation, cost limits, and knowing when not to call a model.

**Follow-up 2:** What skill do you not drop?

**Answer:** Indexes, auth, and idempotency. A model does not fix a double booking.

---

## Behavioral & Leadership (294–300)

### 294. Tell me about a production incident you handled.

**Answer:** Use STAR: Situation, Task, Action, Result. Mention correlation IDs, logs, rollback, graceful degradation, and blameless postmortem.

**Example:**
```text
"S: Checkout 500s spiked after deploy. T: On-call lead. A: Traces showed Mongo pool exhausted;
rolled back; increased pool + added connection alert. R: MTTR 12 min, postmortem added staging load test."
```


**Difficulty:** Advanced

**Real-world:** Tell a real incident or say you will describe how you would run one. Do not borrow this file's booking story as yours.

**Follow-up 1:** What is the shape?

**Answer:** What broke, what you checked, what you changed, how you knew it was fixed.

**Follow-up 2:** What do you leave out?

**Answer:** A percentage you cannot explain, and a patient detail.

---

### 295. How do you mentor junior developers?

**Answer:** Pair on PRs, assign scoped tasks with clear acceptance criteria, review with teaching comments, share runbooks. Measure growth by independence and code quality over time.

**Example:**
```text
"I gave them auth middleware with test cases first — reviewed security edge cases in 1:1.
Within 6 weeks they owned the whole users module."
```


**Difficulty:** Intermediate

**Real-world:** Mentoring is review comments that teach, and pairing on a real bug.

**Follow-up 1:** What do you not do?

**Answer:** Rewrite their change overnight and leave them no trail.

**Follow-up 2:** What is a good review comment?

**Answer:** The failure case: this query has no org filter. Here is the test.

---

### 296. Disagreement with product or manager on technical choice?

**Answer:** Data over opinions: prototype, estimate cost/risk, present options with tradeoffs. Accept decision once made unless safety/compliance is at stake.

**Example:**
```text
"Product wanted real-time LLM on every page load — I showed $40K/month projection;
we agreed on cached summaries + on-demand chat."
```


**Difficulty:** Advanced

**Real-world:** Disagreement is about the invariant, not the status of the person.

**Follow-up 1:** How do you argue a read-then-write?

**Answer:** Show two parallel requests both passing the read. Offer the conditional update.

**Follow-up 2:** What if you are overruled?

**Answer:** Record the risk. If it is data loss or a privacy hole, do not ship it quietly.

---

### 297. How do you estimate tasks?

**Answer:** Break into subtasks, compare to similar past work, add buffer for unknowns, state assumptions. Re-estimate when scope changes.

**Example:**
```text
"RAG MVP: ingestion (3d), vector index (1d), query API (2d), eval set (2d), hardening (2d) ≈ 2 weeks with buffer."
```


**Difficulty:** Intermediate

**Real-world:** Estimate the work you can see, and say what you have not seen.

**Follow-up 1:** What do you include?

**Answer:** Review, a test, and a migration, not only the happy path.

**Follow-up 2:** What do you do with a date you cannot hit?

**Answer:** Say what can be cut: the export, not the auth check.

---

### 298. Code review conflict — how do you handle it?

**Answer:** Ask clarifying questions, focus on code not person, cite standards/docs, offer to pair. If stalemate, involve tech lead or spike. Document in ADR if architectural.

**Example:**
```text
"We paired on one endpoint, agreed repositories for testability, raw SQL only in reporting module."
```


**Difficulty:** Intermediate

**Real-world:** A review conflict is a second look at the failure case.

**Follow-up 1:** How do you unblock?

**Answer:** A short call on the specific line, then a decision. Not a thread of opinions.

**Follow-up 2:** When do you ask for a third person?

**Answer:** When you disagree on behaviour, not on style, and the two of you are stuck.

---

### 299. Keeping up with tech (AI, Node releases)?

**Answer:** Curate inputs (official blogs, Node release notes), build small side experiments, share learnings in team tech talks. Depth on fundamentals beats chasing every framework.

**Example:**
```text
"Monthly: read Node release blog, test one feature in sandbox, run one AI eval experiment."
```


**Difficulty:** Screening

**Real-world:** You follow release notes for the runtime you run, and you try one feature in a branch.

**Follow-up 1:** What did you actually look at recently?

**Answer:** Say a real item, or say you have read the Node 22/24 and Mongo 8 notes in this pack and have not shipped them. Do not invent a production upgrade.

**Follow-up 2:** What do you not do?

**Answer:** Rewrite the service every time a blog announces a version.

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


**Difficulty:** Advanced

**Real-world:** Hire me for the way I handle a request: auth, the query, the failure, and an honest limit.

**Follow-up 1:** What proof do you offer?

**Answer:** One real module and one real bug, or you say which part you have not owned.

**Follow-up 2:** What do you not say?

**Answer:** That you are a quick learner as the whole answer.

---

### 301. What DSA topics matter most for Node backend roles?

**Answer:** Arrays/strings, hash maps, two pointers, BFS/DFS, trees, heaps (top-K), binary search, basic DP. Focus on clean code, complexity analysis, and explaining tradeoffs.

**Example:**
```text
Practice: Two Sum, Valid Parentheses, Merge Intervals, LRU Cache, Number of Islands, Top K Frequent, Flatten Nested List Iterator / implement flatten
Target: 40–60 medium problems with patterns recognized
```


**Difficulty:** Intermediate

**Real-world:** Backend loops care about hash maps, intervals, trees, and complexity you can say out loud.

**Follow-up 1:** What do you skip until a product company calls?

**Answer:** Hard graph DP. You still need to be able to detect overlapping intervals.

**Follow-up 2:** What do you say before coding?

**Answer:** The approach and the complexity, then the code.

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


**Difficulty:** Intermediate

**Real-world:** Talk through the invariant, the example, then the code.

**Follow-up 1:** What if you are stuck?

**Answer:** Say what you know and which case you are not handling yet. Silence looks like a freeze.

**Follow-up 2:** What do you test aloud?

**Answer:** An empty input and a duplicate.

---

### 303. Build vs buy — coding interview angle?

**Answer:** Sometimes asked as hybrid: implement rate limiter, LRU cache, task scheduler, or TTL cache. Classic patterns map to production components (Redis, BullMQ).

**Example:**
```text
"Implement a simple TTL cache" → Map + expiry timestamps + lazy eviction on get
```


**Difficulty:** Intermediate

**Real-world:** Build when it is the product or the security boundary. Buy when it is email or payments.

**Follow-up 1:** What do you not build?

**Answer:** Card processing and a queue system, if a provider exists.

**Follow-up 2:** What do you still own if you buy?

**Answer:** Idempotency, the webhook signature, and the state machine.

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


**Difficulty:** Intermediate

**Real-world:** A take-home is a small API with validation, a test, and a README that says how to run it.

**Follow-up 1:** What do you not add?

**Answer:** A microservice mesh. Depth on one path beats breadth.

**Follow-up 2:** What do you write at the top?

**Answer:** Assumptions and what you would do with more time.

---

### 305. Using AI tools (Cursor, Copilot) — interview honesty?

**Answer:** Many teams allow AI daily but expect you to understand generated code in interviews. Senior value: review, test, and fix AI output — not paste blindly.

**Example:**
```text
"I use AI for boilerplate and exploration, but I verify security, types, and tests manually."
```

---


---



**Difficulty:** Screening

**Real-world:** Say if you used a tool. Be able to explain every line you submit.

**Follow-up 1:** What is the failure?

**Answer:** A solution you cannot debug when the interviewer changes a constraint.

**Follow-up 2:** What is the honest line?

**Answer:** I use tools to draft. I re-read, I run the tests, and I can rewrite the core without the tool.

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


**Difficulty:** Intermediate

**Real-world:** Choose GraphQL when clients need to shape reads and you will pay for the resolver discipline.

**Follow-up 1:** What do you add on day one?

**Answer:** A depth limit, a cost limit, and auth on each field that touches data.

**Follow-up 2:** When is REST the better answer?

**Answer:** A small set of known screens and HTTP caching.

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


**Difficulty:** Intermediate

**Real-world:** The schema is the contract. Resolvers fetch the fields.

**Follow-up 1:** Where does N+1 start?

**Answer:** A field resolver that queries by parent id, called once per parent.

**Follow-up 2:** What type do you give an error?

**Answer:** A structured error with a code. A thrown string becomes a 500 the client cannot branch on.

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


**Difficulty:** Advanced

**Real-world:** DataLoader batches ids requested in one tick and caches them for the request.

**Follow-up 1:** What is the cache scope?

**Answer:** The request. A process-wide cache leaks another user's row.

**Follow-up 2:** What is the fix without DataLoader?

**Answer:** Collect ids and query once in the parent resolver.

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


**Difficulty:** Advanced

**Real-world:** Auth in GraphQL is per resolver, not once at the query root.

**Follow-up 1:** What is the bug?

**Answer:** A field that returns a patient because the parent query was allowed, without checking the field.

**Follow-up 2:** Where do you check?

**Answer:** In the resolver or a shared function it must call, using the caller's org.

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


**Difficulty:** Advanced

**Real-world:** GraphQL responses are POST by default, so HTTP caching is weaker.

**Follow-up 1:** How do you paginate?

**Answer:** Cursors, not offsets, on a connection.

**Follow-up 2:** How do you persist errors?

**Answer:** Log the path and the code. Do not log the variables if they contain clinical text.

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


**Difficulty:** Advanced

**Real-world:** Strings, hashes, lists, sets, sorted sets, and streams cover the cases you actually use.

**Follow-up 1:** What is a sorted set for?

**Answer:** A ranking or a delay queue by score. Not a source of truth for money.

**Follow-up 2:** What is a hash for?

**Answer:** A small object such as a session, with a TTL.

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


**Difficulty:** Advanced

**Real-world:** Pub/sub drops messages if nobody is listening. Streams keep them for a consumer group.

**Follow-up 1:** When do you use a stream?

**Answer:** A job another worker must see even if it was down for a minute.

**Follow-up 2:** What is the ack?

**Answer:** The consumer acknowledges after the work. A crash before the ack redelivers, so the work is idempotent.

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


**Difficulty:** Advanced

**Real-world:** A lock is SET key value NX PX ttl. The value is the request id.

**Follow-up 1:** How do you release it?

**Answer:** A script that deletes only if the value is still yours. Another request may own the key if yours expired.

**Follow-up 2:** What if Redis is down?

**Answer:** Do not skip the lock and book. Return 503.

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


**Difficulty:** Advanced

**Real-world:** Invalidate on write. TTL covers the missed delete.

**Follow-up 1:** What is the race?

**Answer:** You delete, then an old read fills the cache with stale data. A short lock around the fill, or a version in the value, closes it.

**Follow-up 2:** What do you not do?

**Answer:** Update the cache and the database with no order you can explain.

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


**Difficulty:** Advanced

**Real-world:** Cluster shards keys. Sentinel promotes a primary. One node is a single point of failure.

**Follow-up 1:** What key bug appears in Cluster?

**Answer:** A multi-key command without a hash tag can hit different slots and fail. Put a lock and its metadata in one tag if you must touch both.

**Follow-up 2:** What does eviction do to a lock?

**Answer:** It can delete it. Do not use an allkeys policy on the instance that holds locks.

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


**Difficulty:** Screening

**Real-world:** React renders UI from state. It is not the backend interview.

**Follow-up 1:** What do you say in a backend round?

**Answer:** Enough to consume your own API, then steer back to the contract and the error codes.

**Follow-up 2:** What is the state that matters to you?

**Answer:** The request the UI sends and the status it must handle, especially 409 and 401.

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


**Difficulty:** Screening

**Real-world:** useEffect runs after paint. A fetch there needs a cleanup.

**Follow-up 1:** What is the bug?

**Answer:** A response from an old patient id lands after the user navigated. Ignore it if the effect was cleaned up.

**Follow-up 2:** Where should the fetch really live?

**Answer:** A data library with caching, if the app is large. The backend still must authorise. The UI is not the control.

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


**Difficulty:** Screening

**Real-world:** SSR renders on the server. SSG renders at build. API routes are server functions.

**Follow-up 1:** What does that mean for your API?

**Answer:** The browser may not be the only caller. A server render needs a token strategy that is not a public env var.

**Follow-up 2:** What do you not put in an API route?

**Answer:** The only copy of a booking invariant, if you already have a backend. One owner.

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


**Difficulty:** Screening

**Real-world:** Context is for a small tree. A store is for client state many components edit.

**Follow-up 1:** What state belongs on the server?

**Answer:** The appointment. The client cache is a copy.

**Follow-up 2:** What do you say if you have not used Redux?

**Answer:** Say so. You can explain server state versus client state without naming a library you have not shipped.

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


**Difficulty:** Screening

**Real-world:** Memoisation skips a render when props are unchanged. It is not the first performance tool.

**Follow-up 1:** What do you measure?

**Answer:** A slow interaction, not a belief that every component needs useMemo.

**Follow-up 2:** What is the backend equivalent?

**Answer:** Do not compute a heavy DTO the client will not use. Projection, not memo, is your lever.

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


**Difficulty:** Intermediate

**Real-world:** A hash map gives you O(1) membership. Two pointers scan a sorted pair.

**Follow-up 1:** Where do two pointers show up in bookings?

**Answer:** A sorted list of intervals, left to right, checking overlap.

**Follow-up 2:** What is the complexity you state?

**Answer:** Sort is n log n. The scan is n. Say it before you code.

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


**Difficulty:** Intermediate

**Real-world:** A stack matches nested structure. A queue is BFS. Intervals want a sort.

**Follow-up 1:** What problem is a stack?

**Answer:** Matching brackets, or a parser. Not a rate limit.

**Follow-up 2:** What problem is an interval sort?

**Answer:** Overlapping appointments. Sort by start, then compare with the previous end.

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


**Difficulty:** Intermediate

**Real-world:** BFS and DFS walk a graph. The queue versus the stack is the difference.

**Follow-up 1:** What backend problem is a graph?

**Answer:** Dependencies between services, or a referral chain. Say if you have not coded one in production.

**Follow-up 2:** What do you watch?

**Answer:** A cycle. A visited set is the difference between a walk and an infinite loop.

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


**Difficulty:** Intermediate

**Real-world:** A heap gives you the next earliest slot in log n. Binary search needs a sorted array.

**Follow-up 1:** What do you binary search?

**Answer:** The first slot at or after a time, on an array that is already sorted. Otherwise sort or use the Mongo index.

**Follow-up 2:** What is a heap for?

**Answer:** Merging k sorted lists, or the next timeout. Not for a query the database can index.

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



**Difficulty:** Intermediate

**Real-world:** DP is for overlapping subproblems. Most API work is not DP.

**Follow-up 1:** What do you say in a service interview?

**Answer:** You can recognise it and you will not force it onto a CRUD bug.

**Follow-up 2:** What design question is more likely?

**Answer:** Idempotency and a conditional update, which this pack treats as the senior coding design.

---

# Part IV — Extended Topics — 2026 Complete

## Modern JavaScript ES2023–2026 (326–334)

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


**Difficulty:** Intermediate

**Real-world:** `Promise.withResolvers` gives you the resolve and reject outside the executor.

**Follow-up 1:** When is that useful?

**Answer:** Bridging a callback API without nesting. You still must settle exactly once.

**Follow-up 2:** What bug remains?

**Answer:** Forgetting to reject on a timeout, so the caller awaits forever.

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


**Difficulty:** Intermediate

**Real-world:** `toSorted` and `toReversed` return a copy. `sort` and `reverse` mutate.

**Follow-up 1:** Why does that matter in a cache?

**Answer:** Mutating a cached array changes it for the next request. Use the copying form or copy first.

**Follow-up 2:** Does `toSorted` use the same default comparator?

**Answer:** Yes. Numbers still need `(a, b) => a - b`.

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


**Difficulty:** Intermediate

**Real-world:** `Object.groupBy` groups values by a key you compute.

**Follow-up 1:** What key do you use for appointments?

**Answer:** The doctor id or the day, for a small in-memory page. A large set belongs in `$group`.

**Follow-up 2:** What is the prototype of the result?

**Answer:** A null-prototype object in the spec's groupBy, so a key `__proto__` is safer than a normal object. Still do not use user input as a key without care.

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


**Difficulty:** Advanced

**Real-world:** `structuredClone` copies structured data. JSON clone drops and converts.

**Follow-up 1:** Name three JSON losses.

**Answer:** `undefined`, `Date` becomes a string, and a cycle throws.

**Follow-up 2:** What does structuredClone refuse?

**Answer:** Functions and DOM nodes. A class instance comes back as a plain clone of its data, without methods.

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


**Difficulty:** Intermediate

**Real-world:** Iterator helpers let you map a large iterator without building a full array first.

**Follow-up 1:** When is that better than `Array.map`?

**Answer:** A cursor of many rows. You can `take` a page without realising the whole result.

**Follow-up 2:** What do you still watch?

**Answer:** A helper that pulls the whole iterator by accident, such as spreading it into an array.

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


**Difficulty:** Intermediate

**Real-world:** Named groups make a regex readable. They do not make it safe.

**Follow-up 1:** What is the ReDoS check?

**Answer:** Nested quantifiers on user input. Prefer a parser or an escaped literal.

**Follow-up 2:** What flag do you need for `.` to match a newline?

**Answer:** The `s` or dotAll flag. The default dot does not match a newline.

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


**Difficulty:** Advanced

**Real-world:** WeakRef does not keep the target alive. FinalizationRegistry runs after collection, not at a reliable time.

**Follow-up 1:** What must you not use it for?

**Answer:** A lock or a booking. Collection timing is not a deadline.

**Follow-up 2:** What is a fair use?

**Answer:** A cache that may lose entries, with the database as the source of truth.

---

### 333. globalThis?

**Answer:** Standard way to access the global object in any environment — `window` in browser, `global` in Node, `self` in workers. Use for polyfills or libraries that must run everywhere. Prefer module scope over globals in application code.

**Example:**
```javascript
// Library that works in browser and Node
const g = globalThis;
if (!g.fetch) g.fetch = require('node-fetch');
```


**Difficulty:** Screening

**Real-world:** `globalThis` is the global object in both the browser and Node.

**Follow-up 1:** Why not `window` or `global`?

**Answer:** `window` is absent in Node. `global` is absent in the browser. `globalThis` is the portable name.

**Follow-up 2:** What do you not put on it?

**Answer:** Request state. It is process-wide and races.

---

### 334. Error.cause, AggregateError, and Error.isError?

**Answer:** `Error` constructor accepts `{ cause }` to chain errors — preserves stack context in async pipelines. `AggregateError` wraps multiple errors (e.g., `Promise.any` rejection). **`Error.isError(value)`** (ES2026 / Node 24) reliably detects Error objects **across realms** — `instanceof Error` breaks in iframes, `vm` contexts, and workers; `Object.prototype.toString` can be spoofed via `Symbol.toStringTag`.

**Example:**
```javascript
try {
  await syncInventory();
} catch (err) {
  throw new Error('Checkout failed', { cause: err });
}

// ES2026 — safe cross-realm check
if (Error.isError(err)) logger.error({ err, cause: err.cause });

Promise.any([api1(), api2()]).catch((e) => {
  console.log(e instanceof AggregateError); // true
  console.log(e.errors);
});
```


**Difficulty:** Advanced

**Real-world:** `Error.cause` chains the original error. `AggregateError` holds many. `Error.isError` checks across realms.

**Follow-up 1:** Where do you set cause?

**Answer:** When you wrap a driver error into `AppError`, so the log still has the original.

**Follow-up 2:** Why not `instanceof Error` alone?

**Answer:** An error from another realm can fail it. `Error.isError` is the ES2026 check.

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


**Difficulty:** Advanced

**Real-world:** amqplib talks to RabbitMQ. A channel publishes and consumes.

**Follow-up 1:** What do you ack?

**Answer:** After the work succeeds. A nack or a dead-letter handles poison messages.

**Follow-up 2:** What is the prefetch?

**Answer:** How many unacked messages the consumer holds. Unlimited prefetch will bury a slow consumer.

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


**Difficulty:** Advanced

**Real-world:** Kafka is a log. Consumers track offsets.

**Follow-up 1:** What is the idempotency story?

**Answer:** The offset can be replayed. The handler must tolerate the same message twice.

**Follow-up 2:** What partition key do you use?

**Answer:** Something that keeps one appointment's events in order, such as the slot id, if order matters.

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


**Difficulty:** Advanced

**Real-world:** BullMQ stores jobs in Redis and retries them.

**Follow-up 1:** What happens if the job is not idempotent?

**Answer:** A retry double-sends the email or double-charges. Store a job id unique on the side effect.

**Follow-up 2:** What happens if Redis evicts job keys?

**Answer:** You lose jobs. The queue Redis must not use an eviction policy that deletes keys you need.

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


**Difficulty:** Advanced

**Real-world:** Call directly when the user needs the answer now and the dependency is required. Queue when the work can finish later.

**Follow-up 1:** Give an example of each for a booking.

**Answer:** The conditional slot update is direct. The email is queued.

**Follow-up 2:** What do you tell the client for queued work?

**Answer:** 202 and a way to see status, if they care. Do not pretend the email is done.

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


**Difficulty:** Advanced

**Real-world:** A dead-letter queue holds messages that failed enough times.

**Follow-up 1:** What do you do with them?

**Answer:** Alert, inspect, and replay after the bug is fixed. Do not retry forever.

**Follow-up 2:** What is a poison message?

**Answer:** One that throws every time, such as a payload that no longer matches the schema.

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


**Difficulty:** Advanced

**Real-world:** An order event is written, then consumers update stock, email, and analytics.

**Follow-up 1:** What is the source of truth?

**Answer:** The order row, written first. Consumers are projections.

**Follow-up 2:** What if the email consumer fails?

**Answer:** The order stays paid. The email retries. The API does not roll back the payment because mail failed.

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


**Difficulty:** Intermediate

**Real-world:** An ORM generates SQL and hides the query. You still own the query plan.

**Follow-up 1:** When do you drop to SQL?

**Answer:** A hot query the ORM emits badly, or a report. Measure first.

**Follow-up 2:** What is the migration story?

**Answer:** The ORM's migrations are still versioned SQL. Review them.

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


**Difficulty:** Intermediate

**Real-world:** Prisma generates a client from a schema and uses SQL under the hood.

**Follow-up 1:** Where is the N+1?

**Answer:** A loop of `findUnique` for each parent. Use a relation include or a join.

**Follow-up 2:** What do you not do in a transaction callback?

**Answer:** A slow HTTP call. You hold a database connection the whole time.

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


**Difficulty:** Intermediate

**Real-world:** Sequelize is a mature ORM for SQL databases. Models and associations are the API.

**Follow-up 1:** What do you check in the log?

**Answer:** The SQL. Associations can emit a query per row.

**Follow-up 2:** How do you add an index?

**Answer:** In a migration, not only on the model decorator, and you verify the database has it.

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


**Difficulty:** Intermediate

**Real-world:** TypeORM uses decorators and entities. The decorator metadata must be enabled.

**Follow-up 1:** What is the production footgun?

**Answer:** `synchronize: true` alters tables on boot. Turn it off and use migrations.

**Follow-up 2:** What does a missing decorator emit?

**Answer:** A runtime schema that does not match the type. The type compiler will not run the query.

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


**Difficulty:** Intermediate

**Real-world:** Drizzle is a thin typed SQL layer. You see the query.

**Follow-up 1:** When is that better than Prisma?

**Answer:** When you want SQL control and types without a generated client runtime.

**Follow-up 2:** What do you still write?

**Answer:** Migrations and indexes. The types do not create them.

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


**Difficulty:** Advanced

**Real-world:** Mongoose is documents. Prisma and Sequelize are SQL. Pick from the database you have.

**Follow-up 1:** What do you not do?

**Answer:** Run two ORMs against one database with two migration histories.

**Follow-up 2:** How do you choose for a new service?

**Answer:** The database first, then the thinnest library the team can operate.

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


**Difficulty:** Intermediate

**Real-world:** Prisma migrations are generated SQL. Raw SQL migrations are written by you.

**Follow-up 1:** Which do you review?

**Answer:** Both, as SQL. A generated drop column is still a drop.

**Follow-up 2:** How do you roll back?

**Answer:** A forward migration that restores, unless the tool's down migration is tested. Do not invent a rollback in the interview if you have not run one.

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


**Difficulty:** Advanced

**Real-world:** An ORM N+1 is a loop of lazy loads.

**Follow-up 1:** How do you prove it?

**Answer:** The query log shows N similar statements. Enable logging in the test.

**Follow-up 2:** What is the fix?

**Answer:** A join or an `IN` query, then a map in memory.

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


**Difficulty:** Advanced

**Real-world:** A Deployment keeps a desired number of pods running your image.

**Follow-up 1:** What is the rolling strategy?

**Answer:** New pods must be ready before old ones terminate. Set a readiness probe.

**Follow-up 2:** What resource limits do you set?

**Answer:** CPU and memory. A Node process without a memory limit will be killed late and opaquely.

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


**Difficulty:** Advanced

**Real-world:** A Service is a stable virtual IP. An Ingress is HTTP routing. A ConfigMap is config. A Secret is a secret.

**Follow-up 1:** Which one is safe to log?

**Answer:** Neither the Secret nor a ConfigMap that you mistakenly put a password in.

**Follow-up 2:** How does the app see them?

**Answer:** Environment variables or mounted files. The app does not call the Kubernetes API to read its own DB password.

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


**Difficulty:** Advanced

**Real-world:** Liveness restarts the pod. Readiness removes it from the Service.

**Follow-up 1:** What if Mongo is down?

**Answer:** Fail readiness so you stop taking traffic. Do not fail liveness or you restart forever.

**Follow-up 2:** What if the event loop is stuck?

**Answer:** A liveness check that cannot get on the loop will fail, and a restart is reasonable.

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


**Difficulty:** Advanced

**Real-world:** HPA adds pods from CPU or a custom metric.

**Follow-up 1:** What metric is a trap?

**Answer:** CPU alone, when the bottleneck is Mongo. You add pods that open more connections.

**Follow-up 2:** What do you scale on?

**Answer:** Request rate or lag, with a connection budget.

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


**Difficulty:** Screening

**Real-world:** You can get pods, logs, and describe a deployment. You do not need to be the cluster admin.

**Follow-up 1:** What do you run during an incident?

**Answer:** `kubectl logs`, `describe pod` for the probe failure, and the recent events.

**Follow-up 2:** What do you not run?

**Answer:** A delete of a production deployment as a first step.

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


**Difficulty:** Screening

**Real-world:** Helm templates a chart into Kubernetes manifests and tracks releases.

**Follow-up 1:** What do you review?

**Answer:** The values for replicas, probes, and resources. The chart is not magic.

**Follow-up 2:** What is a bad chart?

**Answer:** One that defaults `latest` as the image tag.

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


**Difficulty:** Advanced

**Real-world:** Lambda runs a function for a burst and scales the concurrency. Cold starts and connection reuse matter.

**Follow-up 1:** What is the Mongo problem?

**Answer:** A new environment per cold start opens connections. Use a pool that survives across invocations in the same environment, and a limit.

**Follow-up 2:** When is Lambda a poor fit?

**Answer:** A long-lived WebSocket or a steady high-CPU worker. A container may be simpler.

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


**Difficulty:** Advanced

**Real-world:** A presigned URL lets the client upload or download without proxying the bytes through Node.

**Follow-up 1:** What do you lock down?

**Answer:** The content type, the size, the expiry, and the key prefix for that tenant.

**Follow-up 2:** What do you not presign?

**Answer:** A URL that stays valid for a week for a clinical file, unless the product explicitly wants that.

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


**Difficulty:** Advanced

**Real-world:** SQS is a queue. Visibility timeout hides a message while you work.

**Follow-up 1:** What if the handler takes longer than the timeout?

**Answer:** The message becomes visible and another worker runs it. The handler must be idempotent.

**Follow-up 2:** What is the dead-letter queue?

**Answer:** The place a message goes after N receives. Alert on its depth.

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


**Difficulty:** Advanced

**Real-world:** ECS runs containers. EKS is Kubernetes. Lambda is functions.

**Follow-up 1:** How do you choose?

**Answer:** The team's operational skill and whether you need long-running processes. Do not pick EKS for one API if nobody can run it.

**Follow-up 2:** What stays the same in the app?

**Answer:** SIGTERM, readiness, and a connection budget.

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


**Difficulty:** Screening

**Real-world:** Terraform describes infrastructure as code and plans a change before it applies.

**Follow-up 1:** What do you review?

**Answer:** The plan, especially destroys and security group openings.

**Follow-up 2:** What do you not do?

**Answer:** Apply from a laptop against production with no review.

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

# Part V — Missing Topics — Gap Fill

> Topics commonly asked in interviews but previously only mentioned in passing. Pairs with WeakSet (Q42) and WeakMap usage in Q60.


**Difficulty:** Intermediate

**Real-world:** GitHub Actions runs the pipeline on push and on pull request.

**Follow-up 1:** What secrets does the job get?

**Answer:** Only what that job needs. A pull request from a fork should not see production credentials.

**Follow-up 2:** What steps do you run?

**Answer:** Install from the lockfile, typecheck, test, then build the image.

---

### 361. WeakMap vs Map (and vs WeakSet)?

**Answer:** `Map` stores any key type with **strong** references — keys and values stay in memory until deleted. `WeakMap` accepts **objects only** (or registered symbols) as keys; keys are held **weakly** so they can be garbage-collected when nothing else references them. WeakMap has no `.size`, is not iterable, and only supports `.get`, `.set`, `.has`, `.delete`.

Use **Map** for general caches and lookups. Use **WeakMap** to attach metadata to objects (DOM nodes, request contexts, class instances) without preventing GC. **WeakSet** (Q42) is the membership-only variant — no values, just `.has`/`.add`.

| | Map | WeakMap | WeakSet |
|--|-----|---------|---------|
| Keys / values | Any key → any value | Object key → any value | Object values only |
| Iterable / size | Yes | No | No |
| GC | Strong | Weak keys | Weak values |
| Typical use | Cache, counts | Private metadata on objects | “Already seen” tags |

**Example:**
```javascript
const metadata = new WeakMap();

class Order {
  constructor(id) {
    metadata.set(this, { createdAt: Date.now(), id });
  }
  getMeta() {
    return metadata.get(this);
  }
}

const order = new Order('ORD-1');
console.log(order.getMeta()); // { createdAt: ..., id: 'ORD-1' }
// When `order` is unreachable, WeakMap entry can be GC'd — unlike Map.set(order, ...)
```


**Difficulty:** Advanced

**Real-world:** WeakMap keys are objects and are not kept alive by the map. Map keys are.

**Follow-up 1:** When is WeakMap the right cache?

**Answer:** Metadata about a request or a document object that should vanish with the object.

**Follow-up 2:** When is it wrong?

**Answer:** A cache keyed by a string id. WeakMap cannot use a string key.

---
### 362. Prototype pollution — what is it and how do you prevent it?

**Answer:** Prototype pollution is an attack (or accidental bug) that modifies `Object.prototype` (or other built-in prototypes) by merging untrusted keys like `__proto__`, `constructor.prototype`, or nested `prototype` paths. Polluted properties then appear on **every** plain object — enabling bypass of auth checks (`isAdmin`), RCE via polluted `exec` paths, or denial of service.

Prevent by: never deep-merging user input into objects blindly; block dangerous keys; use `Object.create(null)` for lookup maps; use libraries with pollution guards (`lodash` 4.17.21+); validate with schema whitelist (Zod/Joi).

**Example:**
```javascript
// Vulnerable deep merge (simplified)
function merge(target, source) {
  for (const key of Object.keys(source)) {
    if (typeof source[key] === 'object' && source[key]) {
      target[key] = merge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}
// Attacker body: { "__proto__": { "isAdmin": true } }
// After merge, ({}).isAdmin === true — every object "inherits" isAdmin

// Safer: schema validation — only allow known fields
const UpdateSchema = z.object({ name: z.string(), qty: z.number().int().min(0) });
const safe = UpdateSchema.parse(req.body);
```


**Difficulty:** Advanced

**Real-world:** Prototype pollution assigns `__proto__` or `constructor.prototype` from user JSON.

**Follow-up 1:** How do you block it?

**Answer:** Do not merge untrusted JSON into an object with a recursive assign. Reject `__proto__` keys. Use `Object.create(null)` for maps.

**Follow-up 2:** What is the impact?

**Answer:** A property on `Object.prototype` is visible to almost every object. Auth checks that trust a property can be bypassed.

---
### 363. AsyncLocalStorage — request context in Node?

**Answer:** `AsyncLocalStorage` (from `node:async_hooks`) stores data that follows async execution context across `await`, callbacks, and Promises within a request — without passing `req` through every function. Use for **correlation IDs**, user ID, tenant ID, and request-scoped loggers. Replaces deprecated `cls-hooked`.

**Node.js 24 (2026):** `AsyncLocalStorage` defaults to **`AsyncContextFrame`** internally — faster and more reliable context propagation. No API change; upgrade to Node 24 for production performance gains.

Initialize once per incoming HTTP request; read anywhere downstream in that async chain.

**Example:**
```javascript
import { AsyncLocalStorage } from 'node:async_hooks';
import pino from 'pino';

const als = new AsyncLocalStorage();
const baseLogger = pino();

export function requestContextMiddleware(req, res, next) {
  const store = {
    requestId: req.headers['x-request-id'] || crypto.randomUUID(),
    userId: req.user?.id,
    logger: baseLogger.child({ requestId: req.headers['x-request-id'] }),
  };
  als.run(store, () => next());
}

export function getContext() {
  return als.getStore();
}

// Deep in service layer — no req parameter needed:
export async function createOrder(data) {
  const ctx = getContext();
  ctx?.logger.info({ userId: ctx.userId }, 'creating order');
  return orderRepo.insert(data);
}
```


**Difficulty:** Advanced

**Real-world:** AsyncLocalStorage keeps a value across awaits without passing it through every function.

**Follow-up 1:** What do you store?

**Answer:** The request id. Not the whole request body.

**Follow-up 2:** What is the bug?

**Answer:** Reading it outside a request and getting another request's value, or losing it across a callback that lost the async context. Test it.

---
### 364. HTTP caching — ETag, Cache-Control, and 304?

**Answer:** HTTP caching reduces bandwidth and latency. **`Cache-Control`** tells clients and CDNs how long to cache (`max-age`, `private`, `no-store`). **`ETag`** is a version fingerprint of a response body. On repeat requests, the client sends **`If-None-Match: "<etag>"`**; if unchanged, the server returns **`304 Not Modified`** with no body — client uses its cached copy.

Use ETag for dynamic JSON that changes occasionally; use long `max-age` + fingerprinted filenames for static assets at CDN.

**Example:**
```javascript
import crypto from 'node:crypto';
import express from 'express';

const app = express();

app.get('/api/products/:id', async (req, res) => {
  const product = await db.products.findById(req.params.id);
  const body = JSON.stringify(product);
  const etag = crypto.createHash('sha1').update(body).digest('hex');

  res.set('Cache-Control', 'private, max-age=60');
  res.set('ETag', `"${etag}"`);

  if (req.headers['if-none-match'] === `"${etag}"`) {
    return res.status(304).end(); // no body — saves bandwidth
  }
  res.type('json').send(body);
});
```


**Difficulty:** Advanced

**Real-world:** ETag and Cache-Control tell a client it may reuse a response. 304 means not modified.

**Follow-up 1:** What must the cache key include?

**Answer:** The user or the org, if the body is private. A shared cache of `/patients/1` is a leak.

**Follow-up 2:** What do you set on a booking POST?

**Answer:** `Cache-Control: no-store`. Do not cache a write.

---
### 365. gRPC vs REST — when to use gRPC?

**Answer:** **REST** uses HTTP/JSON — human-readable, browser-friendly, easy to debug with curl/Postman. **gRPC** uses HTTP/2 + **Protocol Buffers** — binary, strongly typed, supports **streaming** (client, server, bidirectional), and generates client/server stubs from `.proto` files.

Choose gRPC for internal microservice-to-microservice calls needing low latency, type safety, and streaming. Choose REST (or GraphQL) for public APIs, mobile/web clients, and third-party integrations.

**Example:**
```protobuf
// product.proto
syntax = "proto3";
package shop;

service ProductService {
  rpc GetProduct (GetProductRequest) returns (Product);
  rpc ListProducts (ListRequest) returns (stream Product);
}

message GetProductRequest { string id = 1; }
message Product { string id = 1; string name = 2; double price = 3; }
```

```javascript
// Node server (@grpc/grpc-js)
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const packageDef = protoLoader.loadSync('product.proto');
const shop = grpc.loadPackageDefinition(packageDef).shop;

const server = new grpc.Server();
server.addService(shop.ProductService.service, {
  GetProduct: (call, callback) => {
    callback(null, { id: call.request.id, name: 'USB-C Cable', price: 12.99 });
  },
});
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => server.start());
```


**Difficulty:** Advanced

**Real-world:** gRPC is HTTP/2 plus protobuf. Use it between services that share a contract.

**Follow-up 1:** What do you set on every call?

**Answer:** A deadline. A hung callee must not hold the caller.

**Follow-up 2:** What do you not retry?

**Answer:** A create, unless the idempotency key makes the retry safe.

---
### 366. Array.some, .every, .findLast, .findLastIndex?

**Answer:** These short-circuit array methods are common in interviews and production code:

- **`some(fn)`** — returns `true` if **any** element matches (stops early).
- **`every(fn)`** — returns `true` if **all** elements match (stops early).
- **`findLast(fn)`** — returns the **last** matching element (ES2023).
- **`findLastIndex(fn)`** — index of last match (ES2023).

Unlike `filter`, they don't build a new array — better for existence checks and validation.

**Example:**
```javascript
const orders = [
  { id: 1, status: 'pending', total: 50 },
  { id: 2, status: 'paid', total: 120 },
  { id: 3, status: 'paid', total: 30 },
];

const hasPending = orders.some(o => o.status === 'pending');     // true
const allPaid = orders.every(o => o.status === 'paid');          // false
const lastPaid = orders.findLast(o => o.status === 'paid');      // { id: 3, ... }
const lastPaidIdx = orders.findLastIndex(o => o.status === 'paid'); // 2

// Validation in API handler:
if (!items.every(i => i.qty > 0)) {
  throw new ValidationError('Quantity must be positive');
}
```


**Difficulty:** Screening

**Real-world:** `some` and `every` short-circuit. `findLast` walks from the end.

**Follow-up 1:** When is `every` on an empty array true?

**Answer:** By the spec, yes. Do not use `every` to mean 'we had items and all were valid' unless you also check length.

**Follow-up 2:** What is `findLast` for?

**Answer:** The latest status event in an ordered array, without reversing a copy.

---
### 367. MongoDB $facet — parallel sub-pipelines?

**Answer:** `$facet` runs **multiple aggregation sub-pipelines on the same input documents** in one round-trip — ideal for dashboards that need counts, top-N lists, and breakdowns simultaneously. Avoids multiple separate queries and race conditions on live data.

Each facet key names an output array field.

**Example:**
```javascript
const dashboard = await db.orders.aggregate([
  { $match: { createdAt: { $gte: startOfMonth } } },
  {
    $facet: {
      byStatus: [
        { $group: { _id: '$status', count: { $sum: 1 }, revenue: { $sum: '$total' } } },
      ],
      topProducts: [
        { $unwind: '$items' },
        { $group: { _id: '$items.sku', qty: { $sum: '$items.qty' } } },
        { $sort: { qty: -1 } },
        { $limit: 5 },
      ],
      totalOrders: [{ $count: 'count' }],
    },
  },
]).toArray();
// One result: { byStatus: [...], topProducts: [...], totalOrders: [{ count: 842 }] }
```


**Difficulty:** Advanced

**Real-world:** `$facet` runs several pipelines on the same input.

**Follow-up 1:** What is the cost?

**Answer:** Each branch can use memory, and index use inside later branches is not the same as a top-level match.

**Follow-up 2:** When do you prefer two queries?

**Answer:** When one branch is a count that should hit an index and the facet plan does not.

---
### 368. OpenID Connect (OIDC) vs OAuth 2.0?

**Answer:** **OAuth 2.0** is an **authorization** framework — “this app can access my Google calendar.” It issues **access tokens** for API scopes. **OpenID Connect (OIDC)** is an **identity layer on top of OAuth 2.0** — “this user is pradeep@example.com.” It adds an **ID token** (JWT) with claims (`sub`, `email`, `name`) and a `/userinfo` endpoint.

In interviews: OAuth = permission; OIDC = authentication + profile. “Login with Google” uses **authorization code + PKCE** flow and returns both access token (API) and ID token (identity).

**Example:**
```javascript
// After OIDC callback (simplified — use openid-client or passport-openidconnect in production)
const tokens = await exchangeCodeForTokens(code, { code_verifier: pkceVerifier });
const idTokenPayload = decodeJwt(tokens.id_token); // { sub, email, iss, aud, exp }
const userinfo = await fetch(issuer + '/userinfo', {
  headers: { Authorization: `Bearer ${tokens.access_token}` },
}).then(r => r.json());

// Store session: idTokenPayload.sub as stable user ID
req.session.userId = idTokenPayload.sub;
```


**Difficulty:** Advanced

**Real-world:** OAuth authorises. OIDC identifies. OIDC sits on OAuth and adds the ID token.

**Follow-up 1:** What do you validate on an ID token?

**Answer:** Issuer, audience, expiry, and the signature against the provider's keys.

**Follow-up 2:** What is the subject?

**Answer:** The stable id at the provider. Map it to your user. Do not use the email as the only key if emails can change.

---
### 369. Reflect API — what and why with Proxy?

**Answer:** `Reflect` provides methods that mirror internal object operations (`get`, `set`, `has`, `deleteProperty`, `apply`, `construct`). In **Proxy traps**, call the corresponding `Reflect` method to apply default behavior, then add validation or logging. Keeps traps correct and forward-compatible.

**Example:**
```javascript
const cart = new Proxy({ items: [] }, {
  set(target, prop, value, receiver) {
    if (prop === 'items' && !Array.isArray(value)) {
      throw new TypeError('items must be an array');
    }
    return Reflect.set(target, prop, value, receiver); // default [[Set]] behavior
  },
  get(target, prop, receiver) {
    if (prop === 'itemCount') return target.items.length;
    return Reflect.get(target, prop, receiver);
  },
});

cart.items = [{ sku: 'A1', qty: 2 }];
console.log(cart.itemCount); // 2
```


**Difficulty:** Intermediate

**Real-world:** Reflect is the standard API for the operations a Proxy traps.

**Follow-up 1:** Why use `Reflect.get` inside a trap?

**Answer:** It forwards the operation correctly, including the receiver, instead of a hand-rolled get that breaks inheritance.

**Follow-up 2:** Do you need it outside Proxies?

**Answer:** Rarely. Do not import it for ordinary property reads.

---
### 370. Stream backpressure and highWaterMark?

**Answer:** **Backpressure** occurs when a data producer (Readable) is faster than the consumer (Writable). Node pauses the readable stream until the writable drains — preventing memory blow-up on large files or slow clients. **`highWaterMark`** (default 16KB in binary mode, 16 objects in object mode) controls internal buffer size before `write()` returns `false` and `'drain'` is needed.

Always pipe with **`pipeline()`** (Q112) — it handles errors and backpressure. Manual writes must listen for `'drain'`.

**Example:**
```javascript
import { Readable, Writable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const slowWriter = new Writable({
  highWaterMark: 2, // small buffer — backpressure kicks in sooner
  write(chunk, enc, cb) {
    setTimeout(() => { console.log('wrote', chunk.toString()); cb(); }, 100);
  },
});

const fastReader = Readable.from(['a', 'b', 'c', 'd', 'e']);

// pipeline handles pause/resume automatically
await pipeline(fastReader, slowWriter);
```


**Difficulty:** Advanced

**Real-world:** Backpressure is the writable side saying it is full. `pipeline` honours it.

**Follow-up 1:** What is highWaterMark?

**Answer:** How much data may buffer before `write` returns false. Raising it hides a slow consumer and grows memory.

**Follow-up 2:** What do you do when `write` returns false?

**Answer:** Wait for `drain` before writing more. Or use `pipeline` and do not write by hand.

---
### 371. SSE vs WebSocket vs long polling?

**Answer:**

| | SSE | WebSocket | Long polling |
|--|-----|-----------|--------------|
| Direction | Server → client only | Bidirectional | Client polls; server holds until data |
| Protocol | HTTP | WS upgrade | Repeated HTTP |
| Reconnect | Built-in (`EventSource`) | Manual | Automatic (new request) |
| Use case | Live feeds, LLM tokens, notifications | Chat, games, collaborative edit | Legacy real-time fallback |

Node APIs often use **SSE** for one-way streams (cheaper, works through HTTP/2 proxies) and **WebSocket** when the client must send frequent messages (chat). **Long polling** is a fallback when SSE/WS are blocked.

**Example:**
```javascript
// SSE — Express
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.flushHeaders();
  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify({ ts: Date.now() })}\n\n`);
  }, 2000);
  req.on('close', () => clearInterval(interval));
});
```


**Difficulty:** Intermediate

**Real-world:** WebSocket is two-way. SSE is server to client. Long polling is repeated HTTP.

**Follow-up 1:** What do you pick for appointment notifications?

**Answer:** SSE or a socket if the client is already connected. Polling if you must support a simple client and the delay is acceptable.

**Follow-up 2:** What is the scaling issue they share?

**Answer:** The connection lives on one process. Fan-out needs a shared bus.

---
### 372. argon2 vs bcrypt for password hashing?

**Answer:** Both are slow password hashes resistant to brute force. **bcrypt** (1999) is widely supported, simple (`bcrypt.hash` / `compare`), and fine for most apps — tune **cost factor** (rounds). **Argon2** (2015, Password Hashing Competition winner) adds **memory hardness** — harder to crack with GPUs/ASICs; preferred for high-security or compliance-heavy systems.

Use bcrypt by default in Node (mature ecosystem); choose argon2 when security requirements explicitly demand memory-hard hashing or you are greenfield with `argon2` npm package.

**Example:**
```javascript
import argon2 from 'argon2';
import bcrypt from 'bcrypt';

// bcrypt — Q104 pattern
const bcryptHash = await bcrypt.hash(password, 12);

// argon2 — memory + time cost
const argon2Hash = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 65536, // 64 MB
  timeCost: 3,
  parallelism: 4,
});
const ok = await argon2.verify(argon2Hash, password);
```


**Difficulty:** Advanced

**Real-world:** argon2 is the newer password hash. bcrypt is still acceptable and widely available.

**Follow-up 1:** What do you not use?

**Answer:** A single SHA-256 of the password.

**Follow-up 2:** What do you tune?

**Answer:** The cost so a login takes a bounded time and an attacker cannot guess quickly. Do it off the hottest thread if it blocks.

---
### 373. RBAC — role-based access control in Node APIs?

**Answer:** **RBAC** assigns permissions to **roles** (`admin`, `editor`, `viewer`), and users get one or more roles. Middleware checks role or permission before route handlers run. Simpler than per-user ACLs for most B2B SaaS.

Store roles in JWT claims (short lists only), session, or DB; enforce on every protected route — never trust client-only UI hiding.

**Example:**
```javascript
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const roles = req.user?.roles ?? [];
    if (!allowedRoles.some(r => roles.includes(r))) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

app.delete('/api/products/:id', requireRole('admin'), deleteProduct);
app.patch('/api/products/:id', requireRole('admin', 'editor'), updateProduct);
app.get('/api/orders', requireRole('admin', 'editor', 'viewer'), listOrders);
```


**Difficulty:** Advanced

**Real-world:** RBAC is roles that grant permissions. The check is on the server, on the resource.

**Follow-up 1:** Why is a role in the JWT not enough?

**Answer:** The role may be stale, and it does not prove this organisation owns this id.

**Follow-up 2:** What do you check?

**Answer:** Permission plus `orgId` from the token against the row.

---
### 374. ReDoS — regex denial of service?

**Answer:** **Regular Expression Denial of Service** happens when a regex with catastrophic backtracking takes exponential time on crafted input (e.g. `(a+)+$` against `aaaaaaaaaaaaaaaaaaaa!`). A single `RegExp.test()` in a request handler can block the Node event loop.

Mitigate: prefer simple regex; use **`re2`** or **`safe-regex`** linting; set timeouts on user-input validation; use string methods or parsers instead of complex regex for email/URL; never pass unbounded user input to nested quantifier patterns.

**Example:**
```javascript
// Dangerous — nested quantifiers
const evil = /^(a+)+$/;
// evil.test('aaaaaaaaaaaaaaaaaaaaaaaaaaaa!'); // hangs for seconds

// Safer — linear pattern or library
import RE2 from 're2';
const safe = new RE2('^[a-z]+$');
safe.test(userInput); // linear time guarantee

// Or: length limit + schema validation first
if (input.length > 100) return res.status(400).json({ error: 'Too long' });
```


**Difficulty:** Advanced

**Real-world:** ReDoS is a regex that takes exponential time on a crafted string.

**Follow-up 1:** How do you find it?

**Answer:** A pattern with nested quantifiers, fed by user input, on the request path.

**Follow-up 2:** What is the fix?

**Answer:** Rewrite the pattern, limit the input length, or use a linear parser. A timeout around a regex is a poor fix because it still blocks the loop until the timeout fires if the regex is synchronous.

---
### 375. try/catch/finally — behavior and pitfalls?

**Answer:** `try` runs code that may throw; `catch` handles errors; `finally` **always** runs (cleanup). If `finally` returns a value or throws, it **overrides** a `try`/`catch` return or rethrow (tricky interview trap — see tricky Q35).

Use `try/catch` around `await` in async functions; use `finally` for releasing locks, closing DB sessions, and `session.endSession()` in MongoDB transactions.

**Example:**
```javascript
async function chargeWithCleanup(orderId) {
  let lock;
  try {
    lock = await acquireLock(`order:${orderId}`);
    const order = await db.orders.findById(orderId);
    if (!order) throw new NotFoundError('Order');
    return await paymentClient.charge(order);
  } catch (err) {
    logger.error({ orderId, err }, 'charge failed');
    throw err; // rethrow unless converting to HTTP response
  } finally {
    if (lock) await lock.release(); // always runs
  }
}

// Trap: finally return wins
function trap() {
  try { return 1; }
  finally { return 2; } // returns 2, not 1
}
```


**Difficulty:** Intermediate

**Real-world:** `finally` runs on the way out, including on return and on throw.

**Follow-up 1:** What if `finally` throws or returns?

**Answer:** It replaces the pending return or error. A `return` in `finally` hides the real result. Avoid it.

**Follow-up 2:** Does `finally` run after an `await` throw?

**Answer:** Yes, if it is inside the same try. The rejection still propagates after `finally` unless you swallow it.

---
### 376. Private class fields (#) in JavaScript?

**Answer:** ES2022 **private fields** use `#name` syntax — only accessible inside the class body, not from subclasses or instances externally. True encapsulation without WeakMap hacks. Also: **private methods** (`#helper()`), **static private** (`static #count`).

**Example:**
```javascript
class Cart {
  #items = [];
  #discount = 0;

  add(product, qty) {
    this.#items.push({ product, qty });
  }

  #subtotal() {
    return this.#items.reduce((s, i) => s + i.product.price * i.qty, 0);
  }

  total() {
    return this.#subtotal() * (1 - this.#discount);
  }

  applyCoupon(pct) {
    if (pct < 0 || pct > 1) throw new RangeError('Invalid discount');
    this.#discount = pct;
  }
}

const cart = new Cart();
cart.add({ price: 10 }, 2);
// cart.#items — SyntaxError: private field
console.log(cart.total()); // 20
```


**Difficulty:** Advanced

**Real-world:** `#field` is private at runtime. TypeScript `private` is not.

**Follow-up 1:** What does JSON.stringify do with a hash field?

**Answer:** It omits it. That is useful for a secret and surprising if you expected it in a log.

**Follow-up 2:** Can a subclass read `#secret`?

**Answer:** No. Not even a subclass. `private` in TypeScript can be reached with a cast. `#` cannot.

---
### 377. express-mongo-sanitize and NoSQL injection defense?

**Answer:** NoSQL injection (Q218) happens when attackers send objects like `{ "$gt": "" }` instead of strings in query/body — operators bypass filters. **`express-mongo-sanitize`** strips keys starting with `$` or containing `.` from `req.body`, `req.query`, and `req.params`.

Defense in depth: sanitize middleware + **schema validation** (Zod whitelist) + never pass raw `req.body` to Mongoose/`find()`.

**Example:**
```javascript
import mongoSanitize from 'express-mongo-sanitize';
import { z } from 'zod';

app.use(express.json());
app.use(mongoSanitize()); // removes { "$gt": "" } keys

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

app.post('/api/login', (req, res) => {
  const { email, password } = LoginSchema.parse(req.body);
  // Safe — email is guaranteed string, not { $gt: '' }
  return User.findOne({ email, passwordHash: hash(password) });
});
```


**Difficulty:** Advanced

**Real-world:** express-mongo-sanitize strips `$` and dotted keys from input.

**Follow-up 1:** Is that the whole fix?

**Answer:** No. Do not pass the object to `find`. Cast the fields you expect. The middleware is a backstop.

**Follow-up 2:** What does it miss?

**Answer:** A string that is a regex, or a field you still spread because it looked safe.

---
### 378. MongoDB arrayFilters and positional updates ($[], $)?

**Answer:** Updating **specific array elements** without replacing the whole array:

- **`$`** — first matching element (positional operator) after query matches array item.
- **`$[]`** — all elements matching the query filter on the array field.
- **`arrayFilters`** — update specific elements by condition (e.g. only line items with `sku: 'A1'`).

**Example:**
```javascript
// Mark first matching item as shipped
await Order.updateOne(
  { _id: orderId, 'items.sku': 'SKU-99' },
  { $set: { 'items.$.status': 'shipped' } }
);

// Update ALL items to processed
await Order.updateOne(
  { _id: orderId },
  { $set: { 'items.$[].status': 'processed' } }
);

// Update only items where qty > 5 (arrayFilters)
await Order.updateOne(
  { _id: orderId },
  { $set: { 'items.$[elem].bulkDiscount': true } },
  { arrayFilters: [{ 'elem.qty': { $gt: 5 } }] }
);
```


**Difficulty:** Advanced

**Real-world:** The positional `$` updates the first match. `arrayFilters` chooses which elements. `$[]` updates all.

**Follow-up 1:** When is `$` wrong?

**Answer:** Two array elements match and you only wanted one of them, or you wanted both.

**Follow-up 2:** What index helps?

**Answer:** An index on the array field if you query by it. The update still loads the document.

---
### 379. Object.hasOwn vs `in` vs hasOwnProperty?

**Answer:**

- **`Object.hasOwn(obj, key)`** — `true` if **own** property (ES2022; prefer over `hasOwnProperty`).
- **`key in obj`** — `true` if own **or inherited** (prototype chain).
- **`obj.hasOwnProperty(key)`** — own only, but can be shadowed if obj has no prototype or custom `hasOwnProperty`.

Use `hasOwn` for safe iteration; use `in` when prototype methods matter (e.g. `'toString' in obj`).

**Example:**
```javascript
const child = Object.create({ inherited: 1 });
child.own = 2;

Object.hasOwn(child, 'own');        // true
Object.hasOwn(child, 'inherited');  // false
'inherited' in child;               // true — walks prototype
child.hasOwnProperty('own');        // true (avoid if obj may lack prototype)

for (const key of Object.keys(child)) {
  // only 'own' — use Object.keys + hasOwn for own enumerable props
}
```


**Difficulty:** Intermediate

**Real-world:** `Object.hasOwn` checks an own property and does not consult the prototype.

**Follow-up 1:** Why not `obj.hasOwnProperty`?

**Answer:** A hostile object can override it, or be created with `Object.create(null)` and not have it.

**Follow-up 2:** When do you use `in`?

**Answer:** When you intentionally want inherited keys. For user objects, you usually do not.

---
### 380. MongoDB $merge, $out, and collation?

**Answer:**

- **`$out`** — writes aggregation results to a **collection** (replace or create). Snapshot for reports; use carefully in production (permissions, disk).
- **`$merge`** — upsert aggregation output into a target collection (merge, replace, fail on duplicate) — ETL and materialized view patterns.
- **Collation** — locale-aware string comparison (sort, `$match` on strings). Set on collection, index, or per-operation `{ locale: 'en', strength: 2 }`.

**Example:**
```javascript
// Nightly sales summary → summary collection
await db.orders.aggregate([
  { $match: { status: 'paid', createdAt: { $gte: yesterday } } },
  { $group: { _id: '$userId', total: { $sum: '$amount' }, count: { $sum: 1 } } },
  { $merge: { into: 'daily_user_totals', on: '_id', whenMatched: 'replace', whenNotMatched: 'insert' } },
]).toArray();

// Case-insensitive sort
await db.products.find().sort({ name: 1 }).collation({ locale: 'en', strength: 2 }).toArray();
```

---

# Part VI — Mid-2026 Release Updates (Aug 2026)

> Verified against releases through **August 5, 2026**: ECMAScript 2026 (ratified June 30, 2026), Node.js 24 LTS, MongoDB 8.0 GA + 8.3 GA (May 7, 2026).


**Difficulty:** Advanced

**Real-world:** `$out` replaces a collection with the pipeline result. `$merge` upserts into an existing one.

**Follow-up 1:** Which one can wipe production?

**Answer:** `$out` on the wrong name. Review it like a migration.

**Follow-up 2:** What is collation for?

**Answer:** Language-aware string compare, so a case-insensitive unique name does what you think. Set it on the index, not only on one query, if the constraint must hold.

---

## ECMAScript 2026 (381–389, 399)

### 381. What shipped in ECMAScript 2026?

**Answer:** **ECMAScript 2026** (17th edition) was ratified by Ecma International on **June 30, 2026**. It is an incremental release focused on utility APIs and long-standing pain points — not syntax-heavy like ES2015. Highlights:

- `Array.fromAsync`, `Math.sumPrecise`, `Error.isError`
- `Map` / `WeakMap` **`getOrInsert`** / **`getOrInsertComputed`**
- `Iterator.concat`, `Uint8Array` Base64/Hex helpers
- `JSON.rawJSON` / `JSON.isRawJSON` + reviver **source text access**
- **Temporal API** in the language spec (see Q70)
- **`using` / `await using`** (Explicit Resource Management) widely available in Node 24+

Most features land in V8/Node 24 during 2026; check [caniuse.com](https://caniuse.com) or `node --version` before dropping polyfills.


**Difficulty:** Intermediate

**Real-world:** ES2026 adds a set of standard library features. You adopt the ones your runtime ships.

**Follow-up 1:** Which three are useful in an API?

**Answer:** `Error.isError`, `RegExp.escape`, and a precise sum if you were fighting float drift.

**Follow-up 2:** What do you not do?

**Answer:** Rewrite working code to use a new method the Node version in production does not have.

---
### 382. Array.fromAsync?

**Answer:** Creates an array from an **async iterable** or from a sync iterable that yields Promises — the async counterpart to `Array.from`. Essential for consuming async generators, streaming paginated APIs, and `for await` pipelines without manual loops.

**Example:**
```javascript
async function* fetchOrderPages() {
  for (let page = 1; page <= 3; page++) {
    yield fetch(`/api/orders?page=${page}`).then(r => r.json());
  }
}

const allOrders = await Array.fromAsync(fetchOrderPages(), page => page.items);
// flat list of items from all pages
```


**Difficulty:** Intermediate

**Real-world:** `Array.fromAsync` collects an async iterable into an array.

**Follow-up 1:** What is the memory risk?

**Answer:** A huge cursor becomes one array. Prefer iterating and writing out as you go.

**Follow-up 2:** How is it different from `Promise.all` on a mapped array?

**Answer:** `fromAsync` walks an async iterable. `Promise.all` waits on an array of promises you already created, which may have started all the work at once.

---
### 383. Math.sumPrecise?

**Answer:** Sums numbers in a **numerically stable** way (Neumaier/compensated summation) — avoids floating-point drift that bites financial and analytics code. Prefer over naive `reduce((a,b) => a+b)` for money, metrics, and billing totals.

**Example:**
```javascript
const lineItems = [0.1, 0.2, 0.3, 0.4, 0.5];
Math.sumPrecise(lineItems);           // 1.5 — stable
lineItems.reduce((a, b) => a + b, 0); // may drift: 1.4999999999999998

// Works on iterables
Math.sumPrecise(cart.items.map(i => i.price * i.qty));
```


**Difficulty:** Intermediate

**Real-world:** `Math.sumPrecise` reduces float error compared with a naive add.

**Follow-up 1:** Does it make money safe?

**Answer:** No. Money should be integers of the minor unit or a decimal type. Precise sum is for float series, not a ledger.

**Follow-up 2:** When is the naive sum wrong?

**Answer:** `0.1 + 0.2` style accumulation over many rows.

---
### 384. Map.getOrInsert and getOrInsertComputed?

**Answer:** ES2026 **upsert** helpers on `Map` and `WeakMap`:

- **`getOrInsert(key, value)`** — returns existing value or inserts `value` if missing.
- **`getOrInsertComputed(key, callback)`** — returns existing value or computes, inserts, and returns.

Replaces the common `if (!map.has(k)) map.set(k, factory())` boilerplate. **`WeakMap`** gets the same methods — useful for per-object lazy caches without strong key retention beyond the object itself.

**Note:** `getOrInsert(key, value)` still **evaluates `value` before the call** (normal JS argument rules). Use **`getOrInsertComputed`** when creation is expensive.

**Example:**
```javascript
const cache = new Map();

function getConfig(tenantId) {
  return cache.getOrInsertComputed(tenantId, () => loadConfigFromDb(tenantId));
}

// WeakMap — metadata on request object, GC-friendly
const meta = new WeakMap();
function getRequestMeta(req) {
  return meta.getOrInsertComputed(req, () => ({ start: Date.now(), id: crypto.randomUUID() }));
}
```


**Difficulty:** Advanced

**Real-world:** `getOrInsert` evaluates the default before the call. `getOrInsertComputed` calls the function only on a miss.

**Follow-up 1:** What bug does that cause?

**Answer:** An expensive or effectful default runs even when the key exists, if you write `getOrInsert(key, expensive())`.

**Follow-up 2:** Which form do you use for a cache fill?

**Answer:** `getOrInsertComputed`, and the function must still be safe if two callers race. The map method is not a distributed lock.

---
### 385. Iterator.concat?

**Answer:** ES2026 adds **`Iterator.concat(...sources)`** — lazily sequences multiple iterables/iterators into one iterator without building intermediate arrays. Complements ES2024 iterator helpers (Q330). Use for paginated streams, chained log sources, and multi-file line readers.

**Example:**
```javascript
const pages = [
  ['order:1', 'order:2'],
  ['order:3'],
];
const allLines = Iterator.concat(...pages.map(p => p[Symbol.iterator]()))
  .filter(line => line.startsWith('order:'))
  .toArray();
// ['order:1', 'order:2', 'order:3']
```


**Difficulty:** Intermediate

**Real-world:** Iterator concat chains iterators lazily.

**Follow-up 1:** When is that better than array concat?

**Answer:** Large or infinite iterators you will only take a page from.

**Follow-up 2:** What is the cost if you spread the result?

**Answer:** You pull everything into an array and lose the laziness.

---
### 386. JSON.rawJSON and JSON.parse source text access?

**Answer:** Large integers and precise decimals are **lossy** in JavaScript `Number`. ES2026 extends JSON handling:

- **`JSON.rawJSON(text)`** — mark raw JSON fragments for `JSON.stringify` (no re-serialization through Number).
- **`JSON.isRawJSON(value)`** — check raw JSON wrapper.
- **`JSON.parse` reviver** — third argument **`context.source`** gives original source text for unmodified primitives — parse big IDs as strings safely.

**Example:**
```javascript
const payload = '{"orderId":9007199254740993,"total":99.99}';

JSON.parse(payload, (key, value, context) => {
  if (key === 'orderId' && context?.source) return context.source; // keep as string
  return value;
});
// orderId stays "9007199254740993" — no precision loss

const doc = { meta: JSON.rawJSON('{"version":1}') };
JSON.stringify(doc); // embeds raw JSON without parsing
```


**Difficulty:** Advanced

**Real-world:** `JSON.rawJSON` and the parse `source` let you see the original number text.

**Follow-up 1:** Why does that matter?

**Answer:** A large integer in JSON is not exact as a JavaScript number. The source text lets you keep it as a string.

**Follow-up 2:** What do you do for ids today if you cannot use that yet?

**Answer:** Quote them as strings in the JSON.

---
### 387. Uint8Array Base64 and Hex helpers?

**Answer:** ES2026 adds native binary encoding on **`Uint8Array`** — no more `Buffer.from(x, 'base64')` only in Node. Methods: **`toBase64()`**, **`fromBase64()`**, **`setFromBase64()`**, **`toHex()`**, **`fromHex()`**, **`setFromHex()`**. Works in modern browsers and Node 24+ for JWT segments, file hashes, and crypto payloads.

**Example:**
```javascript
const bytes = Uint8Array.from([72, 101, 108, 108, 111]);
bytes.toBase64(); // 'SGVsbG8='

const decoded = Uint8Array.fromBase64('SGVsbG8=');
new TextDecoder().decode(decoded); // 'Hello'

const hash = Uint8Array.fromHex('48656c6c6f');
```


**Difficulty:** Intermediate

**Real-world:** Uint8Array gained helpers to parse and produce base64 and hex without a hand-rolled loop.

**Follow-up 1:** When do you use them?

**Answer:** Tokens and checksums. Not as a reason to load a whole file into one typed array.

**Follow-up 2:** What encoding bug remains?

**Answer:** Base64 of a string you encoded with the wrong UTF-8 conversion. Bytes in, bytes out.

---
### 388. Error.isError vs instanceof Error?

**Answer:** **`Error.isError(value)`** (ES2026) returns `true` for genuine Error objects across **realms** (workers, vm, iframes). **`instanceof Error`** fails when the object comes from a different global. **`Symbol.toStringTag`** can be spoofed. Use `Error.isError` in logging middleware, error boundaries, and micro-frontend error aggregation.

**Example:**
```javascript
import vm from 'node:vm';

const context = vm.createContext({});
const foreignErr = vm.runInContext('new Error("db down")', context);

foreignErr instanceof Error; // false — different realm
Error.isError(foreignErr);   // true

app.use((err, req, res, next) => {
  if (!Error.isError(err)) err = new Error(String(err));
  logger.error(err);
  next(err);
});
```


**Difficulty:** Advanced

**Real-world:** `Error.isError` is true for Error instances from another realm. `instanceof` may be false.

**Follow-up 1:** Where does that realm boundary appear?

**Answer:** A `vm` context, a worker message that reconstructed an error poorly, or a different window.

**Follow-up 2:** What do you still check?

**Answer:** Your own `AppError` fields. `isError` does not tell you the status code.

---
### 389. using and await using — Explicit Resource Management?

**Answer:** **`using`** and **`await using`** (ES2024+, stable in **Node 24** / TypeScript 5.2+) declare resources that auto-dispose at block exit — like `try/finally` but syntactic. Objects need **`Symbol.dispose`** or **`Symbol.asyncDispose`**. Ideal for DB connections, file handles, locks, and temp directories.

**Example:**
```javascript
import { open } from 'node:fs/promises';

async function exportOrders() {
  await using file = await open('orders.csv', 'w'); // auto-closes at end of block
  await file.write('id,total\n');
  for await (const order of orderStream()) {
    await file.write(`${order.id},${order.total}\n`);
  }
} // file closed here — even on throw
```


**Difficulty:** Advanced

**Real-world:** `using` disposes a resource at the end of the block. `await using` awaits an async dispose.

**Follow-up 1:** What would you dispose?

**Answer:** A database session or a lock wrapper you wrote, if the runtime you ship supports the syntax.

**Follow-up 2:** What if the runtime does not?

**Answer:** A `try/finally` that calls `session.endSession()`. The pattern is the same.

---

## Node.js 24 LTS (390–393, 400)

### 390. Node.js 24 — key changes for backend developers?

**Answer:** **Node.js 24.0.0** released **May 6, 2025**; became **Active LTS October 2025** (supported until ~April 2028). Major backend-relevant changes:

| Area | Change |
|------|--------|
| V8 | **13.6** — ES2026 features, `Error.isError`, `RegExp.escape`, Float16Array |
| HTTP | **Undici 7** — faster `fetch`, modern HTTP features |
| Context | **AsyncLocalStorage** → AsyncContextFrame by default |
| Security | **`--permission`** stable (was `--experimental-permission`) |
| DX | Global **URLPattern**, **npm 11**, JSON module **import attributes** |
| Test | Built-in test runner auto-awaits subtests |
| Crypto | OpenSSL 3.5, post-quantum algorithms in `node:crypto` |

**Recommendation (Aug 2026):** Node **24 LTS** for new production; Node **22** acceptable; migrate off **20** before EOL.

**Example:**
```bash
node --version    # v24.x.x
node --permission --allow-fs-read=./data --allow-fs-write=./logs app.js
```


**Difficulty:** Advanced

**Real-world:** Node 24 is the LTS this pack names for new work. Know what you run, not every bullet.

**Follow-up 1:** What do you check on an upgrade?

**Answer:** Native addons, deprecated punycode or other warnings, and the test suite. Then the image tag.

**Follow-up 2:** What behaviour do you re-test?

**Answer:** Fetch, TLS, and the event loop order you depend on. Do not assume a patch changed `nextTick`.

---
### 391. URLPattern in Node.js 24?

**Answer:** **`URLPattern`** is a declarative URL/router matcher (like RegExp for URLs) — **global in Node 24** (no import). Match pathname, hostname, search params; extract groups. Useful for lightweight routing, CDN rules, service workers, and BFF path classification without Express.

**Example:**
```javascript
const pattern = new URLPattern({ pathname: '/api/orders/:id' });
const match = pattern.exec('https://shop.com/api/orders/42');

if (match) {
  console.log(match.pathname.groups.id); // '42'
}

// Express-style guard
app.use((req, res, next) => {
  const m = pattern.exec(req.url);
  if (m) req.orderId = m.pathname.groups.id;
  next();
});
```


**Difficulty:** Intermediate

**Real-world:** URLPattern matches URLs with a standard pattern instead of a hand-rolled regex.

**Follow-up 1:** Where do you use it?

**Answer:** A gateway or a test router. Express already has its own matcher. You do not need both unless you are sharing patterns with the platform.

**Follow-up 2:** What do you still validate?

**Answer:** The matched parameters. A match is not authorisation.

---
### 392. Node.js permission model (--permission)?

**Answer:** Node **24** promotes the **Permission Model** from experimental to stable. Run with **`node --permission`** and explicitly allow sensitive capabilities:

- `--allow-fs-read`, `--allow-fs-write` — file paths
- `--allow-net` — host:port
- `--allow-env` — environment variables
- `--allow-child-process`, `--allow-worker`

Violations throw **`ERR_ACCESS_DENIED`**. Defense-in-depth for running untrusted scripts, CI sandboxes, and supply-chain attack containment.

**Example:**
```bash
# API that only reads ./config and connects to MongoDB host
node --permission \
  --allow-fs-read=./config \
  --allow-net=mongodb.net:27017 \
  --allow-env=MONGODB_URI,PORT \
  server.js
```


**Difficulty:** Advanced

**Real-world:** The permission model can deny filesystem, network, or worker creation unless granted.

**Follow-up 1:** When would you turn it on?

**Answer:** A process that runs less-trusted code or a plugin. A normal API server needs network and will be a noisy flag set.

**Follow-up 2:** What is the failure?

**Answer:** A permission error at runtime that looks like a bug in your client. Log the permission, not a generic 500 with no cause.

---
### 393. Import JSON modules with import attributes?

**Answer:** Node **24** has full support for **`import config from './config.json' with { type: 'json' }`** (import attributes syntax). Typed, static, tree-shakeable JSON imports in ESM — replaces `readFileSync` + `JSON.parse` for config files. Also aligns with browser ESM JSON modules.

**Example:**
```javascript
import packageMeta from './package.json' with { type: 'json' };
import localConfig from './config/development.json' with { type: 'json' };

console.log(packageMeta.version, localConfig.port);
```


**Difficulty:** Intermediate

**Real-world:** JSON modules can be imported with an import attribute that states the type.

**Follow-up 1:** Why the attribute?

**Answer:** So a JSON import is explicit and not a JavaScript module that happens to be data.

**Follow-up 2:** What do you not import this way?

**Answer:** A config that contains a secret and is baked into the bundle. Load secrets from the environment.

---

## MongoDB 8.0 / 8.3 (394–398)

### 394. MongoDB 8.0 — what changed?

**Answer:** **MongoDB 8.0** (GA 2024, patches through **8.0.28 July 2026**) is a major release with broad performance and ops improvements:

- **~25%+ throughput/latency** gains; **54% faster bulk inserts**, **60% faster time-series aggregations**
- **Queryable Encryption** — **range queries** on encrypted fields (new use cases for PII)
- **Ingress queue** — admission control for traffic spikes
- **Multi-collection `bulkWrite` command** — many ops across collections in one request
- **`$lookup` inside transactions** on sharded collections
- **Resharding / unshard** improvements; config shards
- **`workingMillis`** in profiler/advisor (Mongo processing time vs total latency)
- **`$toUUID`** helper expression

Upgrade via MongoDB Upgrade Guide; check compatibility and deprecated features before production cutover.

**Example:**
```javascript
// Multi-collection bulkWrite (8.0+)
await db.adminCommand({
  bulkWrite: 1,
  ops: [
    { insert: 0, document: { _id: 1, sku: 'A' } },
    { update: 1, filter: { _id: 2 }, updateMods: { $set: { qty: 5 } } },
  ],
  nsInfo: [{ ns: 'shop.products' }, { ns: 'shop.inventory' }],
});
```


**Difficulty:** Advanced

**Real-world:** MongoDB 8.0 is a performance release and adds queryable encryption range queries.

**Follow-up 1:** What do you say you have used?

**Answer:** Only what you have run. You may describe the feature and say you have not enabled encryption in production.

**Follow-up 2:** What planning does range encryption need?

**Answer:** Which fields are queried by range, the keys, and the performance cost versus a normal index.

---
### 395. MongoDB 8.3 — performance and AI platform (May 2026)?

**Answer:** **MongoDB 8.3** GA **May 7, 2026** (.local London). Compounds 8.0 gains with compiler optimizations (PGO/LTO):

- **+45% reads**, **+35% writes**, **+15% ACID transactions**, **+30% complex ops** vs 8.0 (same app code)
- **Automated Voyage AI Embeddings** in Atlas Vector Search (preview) — embed on write/update
- **`$scoreFusion`** — hybrid vector + full-text ranking (GA)
- **LangGraph.js Long-Term Memory Store** on Atlas (GA) — agent memory for Node/TS
- **Cross-region AWS PrivateLink** (GA) — private backbone between Atlas regions
- New **data transformation query expressions**

Interview angle: MongoDB positions as **unified AI data platform** — OLTP + search + vector + agent memory in one stack.


**Difficulty:** Intermediate

**Real-world:** 8.3 continues the performance work and adds Atlas search features such as score fusion.

**Follow-up 1:** What number do you not quote as your result?

**Answer:** A vendor percentage you have not measured on your data.

**Follow-up 2:** What can you say?

**Answer:** You would compare a slow query on your version with `explain`, not by upgrading and hoping.

---
### 396. MongoDB $scoreFusion — hybrid search?

**Answer:** **`$scoreFusion`** (8.3 / Atlas GA May 2026) combines scores from multiple search pipelines — typically **vector search** + **Atlas Search full-text** — with configurable weights. Better RAG retrieval than vector-only when queries mix semantic and keyword signals ("MongoDB 8.3 release notes" vs embedding similarity alone).

**Example:** See updated Q282 — weights `{ vector: 0.7, text: 0.3 }` is a common starting point; tune with offline eval on your corpus.


**Difficulty:** Advanced

**Real-world:** `$scoreFusion` mixes vector and text scores.

**Follow-up 1:** What do you tune?

**Answer:** The weights, against a set of real queries. A default weight is a guess.

**Follow-up 2:** What do you filter before you score?

**Answer:** The tenant. Fusion does not replace an authorisation filter.

---
### 397. MongoDB Queryable Encryption — range queries?

**Answer:** **Queryable Encryption** lets apps query encrypted fields without decrypting on the server. **MongoDB 8.0** adds **range query** support on encrypted data — e.g. `age > 18`, salary bands, date ranges — expanding beyond equality queries. Critical for HIPAA/PCI-style compliance while keeping queryability.

Tradeoffs: schema planning, key management (KMS), and performance vs unencrypted indexes. Mention in security-focused senior interviews alongside field-level encryption and CSFLE.

**Example:**
```javascript
// Conceptual — encrypted field with range predicate (8.0+)
await db.patients.find({
  age: { $gt: 18, $lt: 65 }, // supported on Queryable Encryption range fields
});
```


**Difficulty:** Advanced

**Real-world:** Queryable encryption can answer a range without decrypting on the server.

**Follow-up 1:** What is the cost?

**Answer:** Key management, a limited set of queries, and slower writes. You do not encrypt every field.

**Follow-up 2:** What is the alternative?

**Answer:** Field-level encryption you manage, or not storing the field. Say the threat model.

---
### 398. MongoDB ingress queue and workingMillis?

**Answer:** **Ingress queue (8.0):** Operations wait in a queue before entering the server under load — **admission control** against traffic spikes that would OOM or thrash WiredTiger. Tune for resilience during flash sales or DDoS-like patterns.

**workingMillis (8.0):** Profiler, Performance Advisor, and Atlas telemetry report **`workingMillis`** (time MongoDB spent processing) vs **`durationMillis`** (total round-trip including network/queue). Use **`workingMillis`** to find truly slow queries vs network latency.

**Example:**
```javascript
const plan = db.orders.find({ status: 'pending' }).explain('executionStats');
plan.executionStats.executionTimeMillis; // total
// 8.0+ explain also exposes queryPlanner.optimizationTimeMillis
```


**Difficulty:** Advanced

**Real-world:** An ingress queue admits work. `workingMillis` is a measure of time spent working, not a substitute for your own trace.

**Follow-up 1:** How do you use a server-side timing field?

**Answer:** As a clue that the database was busy, next to your handler timings.

**Follow-up 2:** What do you not do?

**Answer:** Tune an index from one metric you cannot define. Ask what the number includes.

---

### 399. RegExp.escape?

**Answer:** **`RegExp.escape(string)`** (ES2026 / V8 in Node 24) returns a string safe to embed in a RegExp — escapes `. * + ? ^ $ { } ( ) | [ ] \` etc. Prevents **ReDoS** and accidental pattern bugs when building regex from user search input. Prefer over manual replace chains.

**Example:**
```javascript
function searchProducts(userQuery) {
  const safe = RegExp.escape(userQuery.trim());
  return db.products.find({ name: { $regex: safe, $options: 'i' } });
}
// User input "C++ (sale)" won't break regex syntax
```


**Difficulty:** Advanced

**Real-world:** `RegExp.escape` escapes a string so it is a literal in a regex.

**Follow-up 1:** Where do you use it?

**Answer:** A user search string you turn into a pattern. Never concatenate the raw string into `new RegExp`.

**Follow-up 2:** What if the runtime lacks it?

**Answer:** Escape the metacharacters yourself, or refuse regex search.

---
### 400. Which Node.js version to use in August 2026?

**Answer:**

| Version | Status (Aug 2026) | Use for |
|---------|-------------------|---------|
| **Node 24.x** | **Active LTS** | **New production** — default choice |
| **Node 22.x** | Maintenance LTS | Existing apps; plan upgrade to 24 |
| **Node 20.x** | End-of-life approaching | **Migrate urgently** |
| **Node 23.x** | EOL (short Current release) | Do not use in production |

Check [nodejs.org/en/about/releases](https://nodejs.org/en/about/releases) for exact dates. Pin version in `.nvmrc`, Docker `FROM node:24-bookworm-slim`, and CI matrix. Pair with **MongoDB 8.0+** (prefer **8.3** on Atlas for AI/hybrid search).

**Example:**
```dockerfile
FROM node:24-bookworm-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
USER node
CMD ["node", "server.js"]
```


**Difficulty:** Advanced

**Real-world:** Run the LTS you can patch. This pack names Node 24 for new work and 22 as the previous LTS.

**Follow-up 1:** What do you pin?

**Answer:** The image and `engines`, and CI on that major.

**Follow-up 2:** What do you do before you upgrade production?

**Answer:** Run the tests, read the changelog for deprecations, and roll out one service first.

---


# Part VII — TypeScript for a 5–6 year Node interview (401–445)

These sit after Q241–Q250. Q241–Q250 stay the short set. This part is the senior set: types that fail in production, Express boundaries, and migration. Each question has an answer, an example, and two follow-ups.

### 401. `unknown`, `any`, and `never` — which do you accept at an API boundary?

**Difficulty:** Advanced

**Answer:** `any` disables checking and spreads. `unknown` is the honest type for `req.body`, JSON, and messages from another service: you cannot touch it until you narrow it. `never` is the empty set. A function returns `never` when it always throws, and a `never` in a switch means a union member was not handled.

**Example:**
```ts
function readBody(input: unknown): { id: string } {
  if (typeof input !== "object" || input === null || !("id" in input)) {
    throw new Error("bad body");
  }
  const id = (input as { id: unknown }).id;
  if (typeof id !== "string" || id.length === 0) throw new Error("bad id");
  return { id };
}
function assertNever(x: never): never {
  throw new Error("unhandled " + String(x));
}
```

**Real-world:** A webhook handler typed as `any` will compile when the provider renames `eventId`. `unknown` plus a parser fails the build or the request instead.

**Follow-up 1:** Why is a type assertion `as Appointment` not a substitute for `unknown`?
**Answer:** The assertion tells the compiler to trust you. The bytes on the wire are still unchecked. Parse first, then the value can be typed.

**Follow-up 2:** Where is `never` useful in an Express error mapper?
**Answer:** A `switch` on a discriminated error `kind`. The `default` assigns the leftover to `never`. Adding a new kind fails compilation until you map it to a status code.


---

### 402. Generic constraints — what goes in `extends`?

**Difficulty:** Advanced

**Answer:** A constraint limits what the caller can pass and what the function can do with `T`. `T extends { id: string }` lets you read `id`. Without the constraint, `T` is only assignable to itself.

**Example:**
```ts
function idOf<T extends { id: string }>(row: T): string {
  return row.id;
}
```

**Real-world:** A repository method `update<T>(id: string, patch: Partial<T>)` is unsafe if `T` includes `orgId`. Constrain the patch to the fields a caller may change.

**Follow-up 1:** What is the difference between `T extends string` and a union parameter?
**Answer:** `T extends string` can be a string literal type inferred from the caller. A parameter typed `string` widens a literal to `string` unless you use a const type parameter.

**Follow-up 2:** When is a constraint too wide?
**Answer:** `T extends Record<string, unknown>` accepts almost any object, including arrays. Constrain the fields you actually read.


---

### 403. Conditional types?

**Difficulty:** Advanced

**Answer:** `T extends U ? X : Y` picks a type based on a test. It distributes over naked type parameters: `Wrapped<A | B>` becomes `Wrapped<A> | Wrapped<B>` when the checked type is a bare parameter.

**Example:**
```ts
type ApiResult<T> = T extends Error ? { ok: false; error: T } : { ok: true; value: T };
type Loaded = ApiResult<string | Error>;
```

**Real-world:** Mapping a database row union to a response DTO without a hand-written overload for every variant.

**Follow-up 1:** How do you stop distribution?
**Answer:** Wrap the checked type in a tuple: `[T] extends [U] ? X : Y`.

**Follow-up 2:** Why can a conditional type surprise a caller who passed a union?
**Answer:** They expected one object type and got a union of two result shapes. Say that out loud before you use a distributive conditional on a public API.


---

### 404. `infer` in conditional types?

**Difficulty:** Advanced

**Answer:** `infer` declares a type variable inside `extends` and captures part of a matched type. `ReturnType` and `Parameters` are written this way.

**Example:**
```ts
type ElementOf<T> = T extends ReadonlyArray<infer E> ? E : never;
type Id = ElementOf<Array<{ id: string }>>;
```

**Real-world:** Deriving the document type from a Mongoose model’s function signature instead of maintaining a second interface that drifts.

**Follow-up 1:** What does `infer` produce when the match fails?
**Answer:** The false branch. If you forget the false branch and the input is not an array, the whole type becomes the false branch you wrote, often `never`.

**Follow-up 2:** Can `infer` replace a generic on a function?
**Answer:** No. `infer` works in type position. A function that must return the caller’s type still needs a generic parameter.


---

### 405. Mapped types?

**Difficulty:** Advanced

**Answer:** A mapped type walks keys: `{ [K in keyof T]: ... }`. Modifiers `readonly` and `?` can be added or removed with `-readonly` and `-?`.

**Example:**
```ts
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type RequiredFields<T> = { [K in keyof T]-?: T[K] };
```

**Real-world:** A patch DTO that makes every field optional except `id`, without copying the interface by hand.

**Follow-up 1:** How is `Partial<T>` defined?
**Answer:** `{ [K in keyof T]?: T[K] }`. It is a mapped type, not a special compiler feature.

**Follow-up 2:** What key do you drop when you map a Mongoose document to a response?
**Answer:** Whatever must not leave the server: password hash, internal flags. Use `Omit` before the map, or remap that key to `never` and flatten. Do not rely on JSON serialization to hide a field you still typed as present.


---

### 406. `keyof`, `typeof`, and indexed access?

**Difficulty:** Advanced

**Answer:** `keyof T` is the union of keys. `typeof value` in type position captures the type of a value. `T[K]` reads the property type. Together they keep a function argument tied to a real object.

**Example:**
```ts
const statusCode = { booked: 201, taken: 409 } as const;
type StatusName = keyof typeof statusCode;
function code(name: StatusName): (typeof statusCode)[StatusName] {
  return statusCode[name];
}
```

**Real-world:** A metrics helper `inc(name: keyof typeof counters)` cannot record a metric you forgot to declare.

**Follow-up 1:** Why `as const`?
**Answer:** Without it, `statusCode.booked` is `number` and the keys may widen. `as const` keeps the literal `201` and the readonly keys.

**Follow-up 2:** What is `T[keyof T]`?
**Answer:** The union of all property types. Useful for a heterogeneous map, too wide if you only wanted one field.


---

### 407. Template literal types?

**Difficulty:** Advanced

**Answer:** They build string types from unions: `` `user:${string}` `` or `` `${Method} ${Path}` ``. They document a route key and reject a typo at compile time. They do not validate a runtime URL by themselves.

**Example:**
```ts
type Method = "GET" | "POST";
type RouteKey = `${Method} /v1/appointments`;
const allow: Record<RouteKey, boolean> = {
  "GET /v1/appointments": true,
  "POST /v1/appointments": true,
};
```

**Real-world:** Cache keys and audit actions (`appointment.booked`) stay consistent across services.

**Follow-up 1:** Does this stop a bad request at runtime?
**Answer:** No. The client can still send anything. Validate with Zod. The template type only checks your own code.

**Follow-up 2:** When is a template type worse than a union of constants?
**Answer:** When the set is large and the error messages become unreadable. A small union of known routes is easier to review.


---

### 408. Function overloads versus a union of parameters?

**Difficulty:** Advanced

**Answer:** Overloads describe several call shapes and the return type that matches each one. A single signature with a union parameter often returns a union, so the caller must narrow again. Implementation signatures are not visible to callers.

**Example:**
```ts
function find(id: string): Promise<{ id: string } | null>;
function find(id: string, opts: { required: true }): Promise<{ id: string }>;
function find(id: string, opts?: { required?: boolean }) {
  return Promise.resolve(opts?.required ? { id } : null);
}
```

**Real-world:** `res.json` style helpers where a 201 with a body and a 204 with no body are different calls.

**Follow-up 1:** Why can the implementation use wider types than the overloads?
**Answer:** Callers only see the overload list. The implementation has to be assignable to each overload, and it can accept the combined parameter set.

**Follow-up 2:** When do you refuse overloads?
**Answer:** When two calls differ only by documentation. A discriminated options object is easier to maintain than four overloads.


---

### 409. Classes and access modifiers in a Node service?

**Difficulty:** Intermediate

**Answer:** `public` is the default. `private` and `protected` are erased and only checked by TypeScript. A JavaScript caller can still reach them. ECMAScript `#field` is truly private at runtime. Use `#` for secrets held on an instance. Prefer functions and explicit parameters over deep class hierarchies in Express services.

**Example:**
```ts
class TokenSigner {
  #secret: string;
  constructor(secret: string) { this.#secret = secret; }
  sign(payload: string): string { return payload + this.#secret.length; }
}
```

**Real-world:** A signer kept as a class so the secret is not passed through every function argument, without pretending `private secret` is hidden from `JSON.stringify` of a different object.

**Follow-up 1:** Does `private` stop `JSON.stringify` from leaking a field?
**Answer:** No. `private` is a compile-time check. Do not put a secret on an object you serialize. `#` fields are omitted from `JSON.stringify`.

**Follow-up 2:** `protected` versus composition?
**Answer:** `protected` exists for inheritance. A service that takes a repository in the constructor is easier to test than a subclass that overrides a protected method.


---

### 410. Abstract class versus interface?

**Difficulty:** Intermediate

**Answer:** An interface is erased and can be implemented by any object. An abstract class exists at runtime and can hold shared code. You cannot `new` an abstract class. In a Node API, interfaces or type aliases describe data. A class is worth it when there is real behaviour and construction.

**Example:**
```ts
interface Clock { now(): Date }
class SystemClock implements Clock { now() { return new Date(); } }
```

**Real-world:** Tests pass a fake clock. Production passes `SystemClock`. The service depends on `Clock`, not on `Date.now` scattered through handlers.

**Follow-up 1:** Can a class implement a type alias?
**Answer:** Yes, if the alias is an object type. `implements` checks the instance shape.

**Follow-up 2:** Why avoid a base `Controller` class with ten protected helpers?
**Answer:** It hides dependencies and makes tests construct the world. Functions and a small service object keep the dependencies in the constructor.


---

### 411. Decorators and `emitDecoratorMetadata`?

**Difficulty:** Advanced

**Answer:** TypeScript 5 supports the standard decorator proposal. NestJS and `reflect-metadata` still rely on `experimentalDecorators` and `emitDecoratorMetadata`, which are a different implementation. Design-time types are erased unless that experimental emit is on, and even then only some types become runtime metadata. Do not claim a decorator validates a request. Validation is Zod or a schema at the boundary.

**Example:**
```ts
function logCall<This, Args extends unknown[], Result>(
  original: (this: This, ...args: Args) => Result,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Result>
) {
  const name = String(context.name);
  return function (this: This, ...args: Args): Result {
    console.log(name);
    return original.call(this, ...args);
  };
}
```

**Real-world:** If the service is Express, skip decorators. If the service is Nest, know which decorator pipeline the `tsconfig` actually enables before you debug a missing metadata error.

**Follow-up 1:** Why did a parameter type become `Object` in emitted metadata?
**Answer:** Interfaces are erased. `emitDecoratorMetadata` cannot see them. A class or an explicit `@Body()` schema is what the framework can read.

**Follow-up 2:** Are decorators required for dependency injection?
**Answer:** No. Passing collaborators to a constructor is dependency injection. Decorators are one way to declare it.


---

### 412. Dependency injection without a framework?

**Difficulty:** Advanced

**Answer:** Construct the graph in one place, usually `server.ts`. The service receives a repository and a clock. Tests construct the service with fakes. You do not import the Mongo client inside the service file.

**Example:**
```ts
type Repo = { book(input: { slotId: string }): Promise<{ id: string }> };
function makeService(repo: Repo) {
  return { book: (slotId: string) => repo.book({ slotId }) };
}
```

**Real-world:** A handler test can fail a duplicate booking without a database. The composition root is the only file that knows Mongo.

**Follow-up 1:** What is the cost of a container?
**Answer:** Another runtime to debug when a provider is missing. A hand-written graph is enough until the graph is large enough that Nest or a small container pays for itself.

**Follow-up 2:** How do you inject a request-scoped id?
**Answer:** Pass it as an argument, or use `AsyncLocalStorage` for the request id. Do not store it on a singleton service field. That field races under concurrent requests.


---

### 413. Typing an Express request after auth?

**Difficulty:** Advanced

**Answer:** Add a field on `Express.Request` once, in a declaration file, after the auth middleware has run. Do not sprinkle `as` in every handler. Give unauthenticated routes the stock `Request`.

**Example:**
```ts
export {};
declare global {
  namespace Express {
    interface Request { user?: { id: string; orgId: string } }
    interface Response { status(code: number): { end(): void } }
  }
}
function requireUser(req: Express.Request, res: Express.Response, next: (err?: unknown) => void) {
  if (!req.user?.orgId) { res.status(401).end(); return; }
  next();
}
```

**Real-world:** Every query uses `req.user.orgId` from the token. A handler that reads `orgId` from the body is the bug this type is supposed to make obvious. The type still will not stop you if `user` is optional and you use `!`.

**Follow-up 1:** Why is `req.user!` a production bug waiting?
**Answer:** The non-null assertion compiles even when the middleware was not mounted on that route. Check, then use a narrowed variable.

**Follow-up 2:** Module augmentation versus a custom `AuthedRequest` type?
**Answer:** A custom type is local and honest. Augmentation is convenient and global. Prefer a custom type if only some routes are authenticated.


---

### 414. Type-safe handlers and a shared error type?

**Difficulty:** Advanced

**Answer:** The service returns a result or throws a typed `AppError` with `status` and `code`. The error middleware is the only place that maps that to JSON. Handlers do not build error bodies ad hoc, or clients cannot rely on the shape.

**Example:**
```ts
type ErrBody = { error: { code: string; message: string } };
class AppError extends Error {
  constructor(readonly status: number, readonly code: string, message: string) { super(message); }
}
```

**Real-world:** A 409 `SLOT_TAKEN` is a code the client switches on. A plain `Error` becomes a 500 and hides the conflict.

**Follow-up 1:** Can TypeScript force every throw to be `AppError`?
**Answer:** No. Libraries throw `Error`. The middleware must handle `unknown` and wrap it as 500.

**Follow-up 2:** Where does Zod’s error type fit?
**Answer:** At the edge. Convert a ZodError to a 400 `AppError` once. The service then receives the inferred type, not `unknown`.


---

### 415. `tsconfig` flags that change production behaviour?

**Difficulty:** Advanced

**Answer:** TypeScript does not change runtime except for downlevel emit and decorators. The flags that change what bugs you catch are `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and `verbatimModuleSyntax`. `strict` includes `strictNullChecks`. Turn them on at the start of a migration folder, not after thousands of `any`s exist.

**Example:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "verbatimModuleSyntax": true,
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16"
  }
}
```

**Real-world:** `noUncheckedIndexedAccess` makes `arr[0]` possibly undefined. That matches a missing Mongo document in an array you assumed was full.

**Follow-up 1:** What does `exactOptionalPropertyTypes` reject?
**Answer:** Assigning `undefined` to an optional property unless `undefined` is in the type. It distinguishes a missing key from a key that was sent as `null` or `undefined`, which matters for PATCH.

**Follow-up 2:** `module: Node16` versus `CommonJS`?
**Answer:** Node16 follows the package `type` and file extensions. It matches what Node actually loads. `CommonJS` emit can hide ESM mistakes until runtime.


---

### 416. JavaScript to TypeScript without stopping delivery?

**Difficulty:** Advanced

**Answer:** Enable `allowJs`. Do not turn on `checkJs` for the whole repo on day one. Rename leaves first. Type the boundary: Zod in, typed repository out. Enable `strict` per folder. CI rejects new `any` in files you touch. The detailed sequence is in the playbook scenario on migration.

**Example:**
```json
{ "compilerOptions": { "allowJs": true, "strict": false, "checkJs": false } }
```

**Real-world:** A healthcare API keeps shipping appointments while `src/modules/scheduling` becomes strict. A big-bang rewrite is how the migration stalls.

**Follow-up 1:** What is the first file you convert?
**Answer:** A pure function with no I/O, then the DTO at the route. Not the 2,000-line utility that everything imports, unless it is already broken.

**Follow-up 2:** How do you measure progress?
**Answer:** Count of files under `strict`, and defects caught by the compiler. Not a promise that the rewrite finishes in a sprint.


---

### 417. `satisfies` versus a type annotation?

**Difficulty:** Advanced

**Answer:** An annotation widens the value to the annotation. `satisfies` checks the value and keeps the inferred keys. A literal such as `201` still widens to `number` when the target field is `number`. `as const satisfies` keeps `201` and still rejects a missing `auth` or a bad key. Use that for route tables and config.

**Example:**
```ts
type Routes = { "POST /v1/appointments": { auth: boolean; code: number } };
const routes = {
  "POST /v1/appointments": { auth: true, code: 201 },
} as const satisfies Routes;
type Code = (typeof routes)["POST /v1/appointments"]["code"];
const code: Code = routes["POST /v1/appointments"].code;
type _keepsLiteral = Code extends 201 ? true : never;
const _checked: _keepsLiteral = true;
```

**Real-world:** A config map that must contain `auth`, while callers still see `code` as `201` and not `number`.

**Follow-up 1:** What do you lose with `: Routes` instead?
**Answer:** `code` becomes `number`, so a caller can no longer tell `201` from any other status. An annotation on a fresh object still excess-checks the literal, then throws that narrower type away.

**Follow-up 2:** Can `satisfies` replace Zod?
**Answer:** No. It is compile-time only.


---

### 418. Branded IDs?

**Difficulty:** Advanced

**Answer:** A brand stops you passing a `DoctorId` where a `PatientId` is required, even though both are strings at runtime. You construct the brand at the boundary after validation.

**Example:**
```ts
type PatientId = string & { readonly __brand: "PatientId" };
function asPatientId(id: string): PatientId {
  if (!id) throw new Error("empty");
  return id as PatientId;
}
```

**Real-world:** A booking function cannot swap the two ids because both parameters were `string`.

**Follow-up 1:** Does the brand exist in JSON?
**Answer:** No. It is a type-level mark. The database still stores a string. Validate when you read it back.

**Follow-up 2:** Why not two classes?
**Answer:** You can. A class costs allocations and does not match a string coming from Mongo unless you wrap every read. A brand is enough when the only bug is mixing ids.


---

### 419. Assertion functions and type predicates?

**Difficulty:** Advanced

**Answer:** A type predicate `x is Patient` narrows in a boolean check. An assertion function `asserts x is Patient` narrows after it returns and throws if the check fails. Use the assertion at the boundary. Use the predicate in filters.

**Example:**
```ts
function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}
function assertRecord(x: unknown): asserts x is Record<string, unknown> {
  if (!isRecord(x)) throw new Error("not an object");
}
```

**Real-world:** `Array.filter(isAppointment)` without a predicate returns the wider element type, and the next line crashes on a missing field.

**Follow-up 1:** What if the predicate lies?
**Answer:** The compiler believes you. A predicate that returns `true` for every value is a hole. Keep the check real.

**Follow-up 2:** `asserts x` versus `asserts x is T`?
**Answer:** `asserts x` only says the function throws when `x` is falsy. It does not change `x` to a richer type.


---

### 420. Exhaustive switches?

**Difficulty:** Advanced

**Answer:** After handling every member of a union, the leftover is `never`. Calling a function that accepts `never` fails the build when someone adds a status and forgets a branch.

**Example:**
```ts
type Status = "open" | "booked";
function label(s: Status): string {
  switch (s) {
    case "open": return "Open";
    case "booked": return "Booked";
    default: return assertNever(s);
  }
}
function assertNever(x: never): never { throw new Error(String(x)); }
```

**Real-world:** A new appointment status ships in the database and the API still returns 200 with an empty label. The `never` check makes that a compile error in the mapper.

**Follow-up 1:** Why did `default` hide the missing case before?
**Answer:** A default that returns `""` accepts every future member. Remove it or make it `never`.

**Follow-up 2:** Does this catch a bad string from Mongo?
**Answer:** No. The value is `Status` only if you parsed it. An unexpected string is a runtime path: log it and return 500 or a fallback you chose on purpose.


---

### 421. Utility types you should be able to rewrite?

**Difficulty:** Intermediate

**Answer:** `Partial`, `Pick`, `Omit`, `Required`, `Readonly`, `Record`, `Exclude`, `Extract`, `NonNullable`, `ReturnType`, `Parameters`. They are aliases over mapped and conditional types. `Omit` is `Pick` plus `Exclude`.

**Example:**
```ts
type Slot = { id: string | null; status: "open" | "booked"; doctorId: string };
type CreateSlot = Omit<Slot, "id" | "status">;
type Id = NonNullable<Slot["id"]>;
```

**Real-world:** A create DTO that cannot include `status` because the server sets it. If `Omit` is your only guard, Zod must still reject a client who sends `status`.

**Follow-up 1:** Why is `Partial<Appointment>` a bad PATCH type?
**Answer:** It makes `id` and `orgId` optional and patchable. Pick the fields a caller may change.

**Follow-up 2:** What is `ReturnType<typeof setTimeout>` in Node?
**Answer:** `NodeJS.Timeout`, not `number`. Browser code that stores a number and calls `clearTimeout` still works at runtime in Node, but the annotation `number` is the lie.


---

### 422. Enums versus string unions?

**Difficulty:** Intermediate

**Answer:** A string union is erased and matches JSON. A numeric enum emits a runtime object and invites reverse mapping surprises. A string enum emits an object too. Prefer a union, or `as const` object, unless a framework requires an enum.

**Example:**
```ts
const SlotStatus = { Open: "open", Booked: "booked" } as const;
type SlotStatus = (typeof SlotStatus)[keyof typeof SlotStatus];
```

**Real-world:** Mongo stores `"open"`. A numeric enum stored as `0` is a migration you do not want.

**Follow-up 1:** `const enum`?
**Answer:** It inlines members and breaks when `isolatedModules` or Babel emits file by file. Avoid it in a Node codebase that uses modern transpilation.

**Follow-up 2:** How do you validate the union at the edge?
**Answer:** `z.enum(["open", "booked"])`. The type and the runtime list should be one source. `z.enum` can be the source and the type inferred from it.


---

### 423. Declaration merging and Express augmentation?

**Difficulty:** Advanced

**Answer:** Interfaces with the same name merge. Type aliases do not. That is why `Express.Request` can be extended from another file, and why a `type Request = ...` cannot be reopened. Merging is global. A mistake in one file affects every handler.

**Example:**
```ts
export {};
declare global {
  namespace Express {
    interface Request { requestId?: string }
  }
}
```

**Real-world:** A logging middleware sets `requestId`. Handlers read it without importing a custom request type. The `export {}` makes the file a module so the augmentation is legal.

**Follow-up 1:** Why did the augmentation do nothing?
**Answer:** The file was not included by `tsconfig`, or it was not a module, or the namespace name did not match `@types/express`.

**Follow-up 2:** When is merging a trap?
**Answer:** Two libraries augment the same field with different types. The merge becomes an intersection and then `never` if they conflict. You find out as a confusing error far from either library.


---

### 424. `this` parameters?

**Difficulty:** Intermediate

**Answer:** A leading `this` argument is fake. It types the receiver and is erased. Use it when a function will be extracted from an object and you want the compiler to reject the bare call. For Express, `bind` or a closure is the runtime fix. The `this` parameter only makes the mistake visible at compile time.

**Example:**
```ts
function label(this: { name: string }) { return this.name; }
const user = { name: "a", label };
user.label();
```

**Real-world:** A class method passed to `app.get("/me", controller.me)` loses `this` at runtime. The type of `this` does not bind it for you. Pass `controller.me.bind(controller)` or an arrow wrapper.

**Follow-up 1:** Does a `this` parameter count in `arguments.length`?
**Answer:** No. It is erased.

**Follow-up 2:** Arrow function as a class field?
**Answer:** It captures `this` and allocates a function per instance. Fine for a few handlers. Noisy if you expected a shared prototype method.


---

### 425. Typing errors from `JSON.parse` and `fetch`?

**Difficulty:** Advanced

**Answer:** `JSON.parse` returns `any` in the DOM lib and is still not a validated object. `fetch` resolves on HTTP 404. Type the function you write, not the raw call: check `response.ok`, parse as `unknown`, run Zod.

**Example:**
```ts
async function getJson<T>(url: string, parse: (x: unknown) => T): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(String(res.status));
  return parse(await res.json());
}
```

**Real-world:** A downstream 500 HTML body was passed to `JSON.parse` and thrown as a syntax error that looked like a bug in your mapper. Check status first.

**Follow-up 1:** Why is `getJson<Appointment>` unsafe if the function only asserts?
**Answer:** The generic is chosen by the caller and does not check the bytes. The parser argument is what makes it honest.

**Follow-up 2:** `response.json() as Promise<Appointment>`?
**Answer:** That is a lie with extra steps. Delete it.


---

### 426. Readonly collections and mutation bugs?

**Difficulty:** Intermediate

**Answer:** `readonly` on a property and `ReadonlyArray` stop assignment through that type. They do not deep-freeze, and they do not stop another reference that is still mutable. `Object.freeze` is the runtime tool, and it is shallow.

**Example:**
```ts
function total(rows: readonly { amount: number }[]): number {
  return rows.reduce((sum, row) => sum + row.amount, 0);
}
```

**Real-world:** A function that sorts a caller’s array in place changes a cache. Accept `readonly` and copy before you sort.

**Follow-up 1:** Does `Readonly<T>` protect nested objects?
**Answer:** No. It is one level. Nested objects stay mutable.

**Follow-up 2:** How does this interact with Mongo documents?
**Answer:** Mongoose documents are mutable by design. Map to a plain DTO before you hand data to code that assumes `readonly`.


---

### 427. Const type parameters?

**Difficulty:** Advanced

**Answer:** `function f<const T>(arg: T)` infers literal types the way `as const` does at the call. Useful for route tables passed into a registrar.

**Example:**
```ts
function keys<const T extends readonly string[]>(xs: T): T { return xs; }
const methods = keys(["GET", "POST"]);
```

**Real-world:** A permission list inferred as `readonly ["appointment:read", "appointment:write"]` rather than `string[]`, so a typo in a check is a type error.

**Follow-up 1:** What still widens?
**Answer:** A value that is already annotated as `string[]` before the call. Const inference cannot recover literals that were thrown away.

**Follow-up 2:** When is this worse than `as const` at the object?
**Answer:** When the object is built far from the function. Put `as const` at the source if many callers need the literals.


---

### 428. Recursive and JSON types?

**Difficulty:** Advanced

**Answer:** A JSON value is a recursive union. Using `any` for “arbitrary JSON” is how `any` re-enters a strict codebase. A recursive type documents it. It will not stop a circular object at runtime. `JSON.stringify` throws on cycles.

**Example:**
```ts
type Json = null | string | number | boolean | Json[] | { [key: string]: Json };
function send(body: Json) { return JSON.stringify(body); }
```

**Real-world:** An audit payload typed as `Json` cannot include a function or a `Date` unless you convert the date to a string first.

**Follow-up 1:** Where do `Date` and `undefined` go?
**Answer:** They are not JSON. `undefined` object fields disappear. `Date` becomes a string only if you convert it yourself. `JSON.stringify` turns `Date` into an ISO string, which means the type that comes back from `parse` is `string`, not `Date`.

**Follow-up 2:** Why can this type make the compiler slow?
**Answer:** Deep recursive conditional types expand. Keep the JSON type simple. Do not add a fancy `DeepPartial` on top without a need.


---

### 429. Async functions and rejected types?

**Difficulty:** Advanced

**Answer:** An `async` function’s return type is `Promise<T>`. The rejection type is not part of the type system. `Promise<User>` can still reject with anything. Document failures with a result union if callers must handle them, or with `AppError` plus a middleware if they must not.

**Example:**
```ts
type Booked = { ok: true; id: string } | { ok: false; code: "SLOT_TAKEN" };
async function book(): Promise<Booked> {
  return { ok: false, code: "SLOT_TAKEN" };
}
```

**Real-world:** A caller `catch` that treats every rejection as 500 will turn a full slot into a server error. A result union makes the conflict a normal return.

**Follow-up 1:** Why not `Promise<User | Error>`?
**Answer:** Rejected promises do not become the `Error` arm. That union only describes a fulfilled value that happens to be an `Error` object. Easy to misuse.

**Follow-up 2:** How do you test the failure arm?
**Answer:** Call the function and expect `ok: false`. You do not need `rejects` unless the function actually throws.


---

### 430. Project references and composite builds?

**Difficulty:** Advanced

**Answer:** `composite` and project references typecheck a package against the other package’s `.d.ts` instead of its source. Useful in a monorepo. A single Node service does not need them. They add a build step you must run or the declarations are stale.

**Example:**
```json
{ "references": [{ "path": "../shared" }] }
```

**Real-world:** The API and a shared DTO package. If someone edits the DTO and forgets the build, the API compiles against yesterday’s types.

**Follow-up 1:** What flag makes the reference emit declarations?
**Answer:** `composite` implies declaration emit and incremental build constraints. `tsc -b` builds in order.

**Follow-up 2:** When is path mapping a footgun?
**Answer:** `paths` in `tsconfig` does not rewrite runtime imports. Node will not find `@shared/x` unless the bundler or a loader rewrites it. Prefer real package exports.


---

### 431. `import type` and `verbatimModuleSyntax`?

**Difficulty:** Advanced

**Answer:** A type import is erased. `verbatimModuleSyntax` forces `import type` when the import is types only, so a leftover value import is not emitted and does not crash Node. It also makes `import { type X }` explicit. The example declares the two modules so the snippet typechecks by itself. In a Node16 service those specifiers are `./types.js` and `./service.js`.

**Example:**
```ts
// file: scheduling.d.ts
declare module "scheduling/types" {
  export type Appointment = { id: string };
}
declare module "scheduling/service" {
  import type { Appointment } from "scheduling/types";
  export function book(id: string): Promise<Appointment>;
}
```
```ts
// file: handler.ts
import type { Appointment } from "scheduling/types";
import { book } from "scheduling/service";
export async function load(id: string): Promise<Appointment> {
  return book(id);
}
```

**Real-world:** An ESM service crashed because a type-only binding was emitted as a runtime import from a file that only had interfaces. `isolatedModules` and `verbatimModuleSyntax` catch that in CI.

**Follow-up 1:** `importsNotUsedAsValues`?
**Answer:** Older flag. `verbatimModuleSyntax` replaces that family in modern TypeScript. Do not set both and hope.

**Follow-up 2:** Does `import type` create a runtime cycle?
**Answer:** No. It is erased. A value import in the cycle still can.


---

### 432. Source maps and production stack traces?

**Difficulty:** Advanced

**Answer:** Enable `sourceMap` for the build you ship if you can store the maps off the public server. Node’s `--enable-source-maps` prints TypeScript lines. Do not publish `.map` files to a public bucket next to the client bundle if they contain source you meant to hide. On a server, maps in the image are normal.

**Example:**
```json
{ "compilerOptions": { "sourceMap": true, "inlineSources": false } }
```

**Real-world:** A 500 log shows `dist/server.js:400`. With source maps it shows `appointment.ts:88`. That is the difference between a one-hour search and a ten-minute fix.

**Follow-up 1:** `inlineSourceMap` in production?
**Answer:** It bloats the file. Separate `.map` files are enough. Turn them on in Node when you read a crash, or always if the image is private.

**Follow-up 2:** What does a map not tell you?
**Answer:** The request body, the query plan, or which pod. You still want a request id in the log.


---

### 433. Debugging a type error that only happens at the boundary?

**Difficulty:** Advanced

**Answer:** Isolate the expression. Hover the inferred type. If it is `any`, find who introduced it: `JSON.parse`, a library without types, or an assertion. Replace that point with `unknown` and a parser. Do not fix it by adding `as` at the call site. That moves the lie outward.

**Example:**
```ts
type Req = { body: unknown };
declare const req: Req;
const CreateAppointment = {
  parse(body: unknown): { slotId: string } {
    if (typeof body !== "object" || body === null || !("slotId" in body)) throw new Error("bad body");
    const slotId = (body as { slotId: unknown }).slotId;
    if (typeof slotId !== "string" || slotId.length === 0) throw new Error("bad slot");
    return { slotId };
  },
};
const body: unknown = req.body;
const input = CreateAppointment.parse(body);
```

**Real-world:** A bug report said TypeScript allowed `orgId` from the client. The handler had `req.body as { orgId: string }`. The fix was to delete the assertion and take `orgId` from `req.user`.

**Follow-up 1:** `skipLibCheck` hid a real error. Now what?
**Answer:** It skips `.d.ts` checks. Turning it off may reveal library conflicts. Fix the conflict or pin the library. Do not use `skipLibCheck` to hide your own files. It does not skip them.

**Follow-up 2:** The error is in `node_modules` after a TypeScript upgrade?
**Answer:** The library’s types lag the compiler. Pin TypeScript or upgrade the library. A path mapping that overrides the library types is a last resort you document.


---

### 434. Excess property checks?

**Difficulty:** Intermediate

**Answer:** Object literals are checked for unknown keys when assigned to a fresh target type. The same object stored in a variable first is not excess-checked. So a typo `orId` fails on a literal and passes once you spread a wider object.

**Example:**
```ts
type Q = { orgId: string };
const good: Q = { orgId: "a" };
const extra = { orgId: "a", orId: "b" };
const loose: Q = extra;
```

**Real-world:** A PATCH built as a variable silently forwards `role: "admin"` if the target type does not list it and you then pass the object to Mongo. Whitelist fields. Do not spread `req.body`.

**Follow-up 1:** Why did excess checks not save you?
**Answer:** Because the value was not a fresh literal. Zod’s `.strict()` or an explicit pick does.

**Follow-up 2:** How does this relate to `satisfies`?
**Answer:** `satisfies` also excess-checks the literal against the target, and keeps the inferred type, including extra keys if the target allows an index signature. An index signature undoes the protection. Avoid `[key: string]: unknown` on a DTO.


---

### 435. Index signatures and `Record<string, unknown>`?

**Difficulty:** Advanced

**Answer:** An index signature says every string key has that value type. It hides typos. `Record<string, never>` is one way to say “empty object”. Prefer explicit fields for DTOs. Use `Record` for maps whose keys are dynamic, such as header bags you do not enumerate.

**Example:**
```ts
type InboundHeaders = Record<string, string | string[] | undefined>;
```

**Real-world:** A config type with an index signature accepted `retrys: 3` next to `retries: 3`. The app used the default and the typo looked like a runtime bug.

**Follow-up 1:** `object` versus `Record<string, unknown>`?
**Answer:** `object` accepts arrays and functions’ lack of useful keys. `Record<string, unknown>` is an object you can index, and it still includes arrays unless you exclude them.

**Follow-up 2:** How do you iterate keys safely?
**Answer:** `Object.keys` returns `string[]`, not `keyof T`. Check the key before you use it as `keyof T`, or iterate a known key list.


---

### 436. Discriminated unions for API responses?

**Difficulty:** Advanced

**Answer:** A shared literal field (`ok`, `kind`, `status`) lets `switch` narrow the rest. Without a discriminant, overlapping fields do not narrow. Put the discriminant on every variant, including errors.

**Example:**
```ts
type Reply =
  | { kind: "created"; id: string }
  | { kind: "taken" };
function text(r: Reply): string {
  return r.kind === "created" ? r.id : "taken";
}
```

**Real-world:** The client and the server share the type through a package or a generated schema. If only the server has the type, the client can still drift. A schema is the contract. The union is the developer view.

**Follow-up 1:** Why did narrowing fail?
**Answer:** The common field was `string`, not a literal. Or the variants were a union of interfaces that both had optional fields and no discriminant.

**Follow-up 2:** How does this show up in logs?
**Answer:** Log `kind` and `code`, not the whole patient payload.


---

### 437. Typing a Mongo filter without accepting operators from the client?

**Difficulty:** Advanced

**Answer:** The repository accepts a typed id and org id, and builds the filter inside the function. The type of the public function does not include `$gt` or `$where`. A generic `Filter<T>` parameter on a controller is how NoSQL injection gets a type-checker’s blessing.

**Example:**
```ts
function byOrg(orgId: string, id: string): { orgId: string; _id: string } {
  return { orgId, _id: id };
}
```

**Real-world:** `req.query` spread into `find()` compiled because the parameter was `Record<string, unknown>`. The fix is a whitelist.

**Follow-up 1:** Where may operators appear?
**Answer:** Inside the repository, written by you: `{ start: { $gte: from, $lt: to } }` with `from` and `to` already parsed as dates.

**Follow-up 2:** What type do you give a date range?
**Answer:** `{ from: Date; to: Date }` after Zod. Not `string` that you hope is ISO.


---

### 438. Middleware generics and `next`?

**Difficulty:** Advanced

**Answer:** Express’s `next` is a function. Type the middleware as `(req, res, next) => void`. An async middleware must catch and call `next(err)`. The return type `Promise<void>` does not mean Express waits. A generic wrapper is the honest type.

**Example:**
```ts
export {};
declare global {
  namespace Express {
    interface Request { body: unknown }
    interface Response { status(code: number): Response; json(body: unknown): void }
  }
}
type Fn = (req: Express.Request, res: Express.Response, next: (err?: unknown) => void) => Promise<unknown>;
const asyncHandler = (fn: Fn) =>
  (req: Express.Request, res: Express.Response, next: (err?: unknown) => void) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
```

**Real-world:** A typed `async` handler still became an unhandled rejection because the route was registered without the wrapper. The type of `app.get` from `@types/express` accepts a function and does not force the wrapper. A thin `route()` helper you own can require it.

**Follow-up 1:** Can the type system see that `res.json` ended the response?
**Answer:** Not in stock Express types. Don’t teach the compiler that. Return after `res.json` so you do not write twice.

**Follow-up 2:** What belongs in the wrapper versus the error middleware?
**Answer:** The wrapper only forwards the rejection. Status codes live in the error middleware so there is one JSON shape.


---

### 439. A typed composition root?

**Difficulty:** Advanced

**Answer:** `createApp` returns the Express app and receives already constructed services. `server.ts` reads env, connects Mongo, constructs repositories, and listens. Tests call `createApp` with fakes and `listen` on port 0. Types on the service interfaces are the architecture.

**Example:**
```ts
class AppError extends Error {
  constructor(readonly status: number, readonly code: string, message: string) { super(message); }
}
const CreateAppointment = {
  parse(body: unknown): { slotId: string } {
    if (typeof body !== "object" || body === null || !("slotId" in body)) throw new Error("bad body");
    const slotId = (body as { slotId: unknown }).slotId;
    if (typeof slotId !== "string" || slotId.length === 0) throw new Error("bad slot");
    return { slotId };
  },
};
type HttpRequest = { body: unknown; user?: { orgId?: string } };
type HttpResponse = { status(code: number): { json(body: unknown): void } };
type Next = (err?: unknown) => void;
type Handler = (req: HttpRequest, res: HttpResponse, next: Next) => Promise<unknown>;
const asyncHandler = (fn: Handler) => (req: HttpRequest, res: HttpResponse, next: Next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
type App = { post(path: string, handler: (req: HttpRequest, res: HttpResponse, next: Next) => void): void };
function express(): App {
  return { post() { return undefined; } };
}
type Services = { bookings: { book(slotId: string, orgId: string): Promise<{ id: string }> } };
function createApp(services: Services): App {
  const app = express();
  app.post("/v1/appointments", asyncHandler(async (req, res) => {
    const orgId = req.user?.orgId;
    if (!orgId) throw new AppError(401, "UNAUTHENTICATED", "Missing user");
    const body = CreateAppointment.parse(req.body);
    res.status(201).json(await services.bookings.book(body.slotId, orgId));
  }));
  return app;
}
```

**Real-world:** This is the file you draw in a Deloitte design round: one composition root, one place that knows the database, handlers that know HTTP.

**Follow-up 1:** Why is `orgId` an argument to `book` and not read from a global?
**Answer:** A global races across requests and disappears in tests. The argument is the authorization scope.

**Follow-up 2:** What do you not type?
**Answer:** You do not spend a day typing a third-party SDK wrapper you call once. You type the boundary you own.


---

### 440. `noImplicitOverride`, `useUnknownInCatchVariables`, and the strict family?

**Difficulty:** Advanced

**Answer:** `strict` turns on a set: `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, and others. `useUnknownInCatchVariables` makes `catch (e)` an `unknown`, which matches reality. `noImplicitOverride` forces `override` on subclass methods so a renamed base method does not leave a dead function.

**Example:**
```ts
export {};
class AppError extends Error {
  constructor(readonly status: number, readonly code: string, message: string, options?: { cause?: unknown }) {
    super(message, options);
  }
}
declare function book(): Promise<void>;
try {
  await book();
} catch (e) {
  if (e instanceof AppError) throw e;
  throw new AppError(500, "INTERNAL", "Unexpected", { cause: e });
}
```

**Real-world:** `catch (e: any)` then `e.status` crashed when a string was thrown. `unknown` forces `instanceof` or a type guard.

**Follow-up 1:** Name three flags inside `strict` that people trip on?
**Answer:** `strictNullChecks`, `strictFunctionTypes`, and `strictPropertyInitialization`. The last one requires class fields to be set in the constructor.

**Follow-up 2:** You cannot enable `strict` on the whole repo this week. What do you do?
**Answer:** Enable it on the folder you are migrating. Leave a dated comment on the root config. Do not add `any` to get green CI.


---

### 441. Variance in function types — why a handler is not assignable?

**Difficulty:** Advanced

**Answer:** Function parameters are checked contravariantly under `strictFunctionTypes`. A function that accepts a wide input cannot be used where a narrower input is required, and the reverse error is the one you usually see: your handler expects a custom request, but Express calls it with `Request`. Widen the parameter or overload the registration helper.

**Example:**
```ts
type Handler<Req> = (req: Req) => void;
type Wide = Handler<{ id?: string }>;
type Narrow = Handler<{ id: string }>;
```

**Real-world:** `app.get(path, (req: AuthedRequest, res) => ...)` fails because Express will pass a plain `Request`. Make `user` optional and narrow inside, or wrap with middleware that returns a narrowed type in your own `route()` helper.

**Follow-up 1:** Return types are covariant. What does that mean here?
**Answer:** A function that returns a more specific object may be used where a wider return is expected. Parameters go the other way. That is why input types cause the surprising error.

**Follow-up 2:** Method syntax versus function syntax?
**Answer:** Methods on objects are still bivariant for compatibility. A standalone function type is strict. The error appears or disappears based on how the type was declared. Prefer a function type for handlers you want checked.


---

### 442. Dual packages and `.ts` extensions in Node?

**Difficulty:** Advanced

**Answer:** Node’s type stripping and modern loaders change the story, but the interview answer that stays true is: the runtime must understand the import you emit. `moduleResolution: Node16` requires the specifier Node will use, including `.js` extensions on relative imports even when the source file is `.ts`. That looks wrong and is correct for ESM.

**Example:**
```ts
// file: service.ts
export function book(id: string): { id: string } {
  return { id };
}
```
```ts
// file: handler.ts
import { book } from "./service.js";
export const row = book("slot_1");
```

**Real-world:** A deploy failed with `ERR_MODULE_NOT_FOUND` for `./service`. The file on disk was `service.ts` in dev and `service.js` after `tsc`. The import must name the emitted file.

**Follow-up 1:** Why `.js` inside a `.ts` file?
**Answer:** TypeScript copies the specifier. It does not rewrite `.ts` to `.js` when you wrote `.ts`, under Node16 resolution. You write the runtime specifier.

**Follow-up 2:** What about a bundler?
**Answer:** A bundler can rewrite specifiers. A service run with `node dist/server.js` cannot, unless you use a loader. Match the config to how you actually start the process.


---

### 443. Testing types with `expectType`?

**Difficulty:** Intermediate

**Answer:** Runtime tests do not prove a generic still infers. A type assertion helper `Expect<Equal<A, B>>` fails compilation when a public type changes by accident. Use it for a small set of exported types, not for every interface.

**Example:**
```ts
type CreateSlot = { slotId: string; doctorId: string };
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Assert<T extends true> = T;
type _check = Assert<Equal<CreateSlot["slotId"], string>>;
```

**Real-world:** A refactor widened an id from `PatientId` to `string` and tests still passed. The type test failed in CI.

**Follow-up 1:** Is this a substitute for Zod tests?
**Answer:** No. Type tests do not run the parser. Keep one runtime test that rejects a bad body.

**Follow-up 2:** Where do these tests live?
**Answer:** Next to the type, in a file that is included by `tsc` and not executed. If `tsconfig` excludes tests, the check never runs.


---

### 444. Performance of the type checker in a large API?

**Difficulty:** Advanced

**Answer:** Slow checking usually comes from huge unions, deep recursive conditionals, or inferring a generic through a large object literal. Give an explicit type on the big object. Avoid giant distributive conditionals on hot paths in `.d.ts` files you control. `tsc --generateTrace` and the `diagnostics` flag show the cost. This is a developer-time problem, not a request-latency problem.

**Example:**
```ts
type RouteTable = Record<string, { auth: boolean }>;
const routes: RouteTable = {
  "GET /v1/appointments": { auth: true },
  "POST /v1/appointments": { auth: true },
};
```

**Real-world:** CI typecheck went from 20 seconds to 3 minutes after a “clever” `DeepReadonly` on the whole config. Annotating the config and deleting the deep mapped type fixed CI. Production latency did not change.

**Follow-up 1:** Does TypeScript affect p95 of the API?
**Answer:** Not after compilation, unless the emit left expensive helpers, which modern targets do not. A slow API is a runtime problem. Do not profile `tsc` when the pod CPU is high.

**Follow-up 2:** `skipLibCheck: true` as a performance fix?
**Answer:** It speeds CI by skipping library `.d.ts`. It also skips real conflicts. Measure first. Prefer project references if the repo is actually several packages.


---

### 445. What do you refuse to type?

**Difficulty:** Advanced

**Answer:** You refuse to spend a week typing a prototype, and you refuse to ship `any` on the booking path because the schema was boring. Type the boundary, the service result, and the repository return. Leave a third-party client as `unknown` until you wrap the two methods you call. A senior answer is where the types earn their keep: wrong organisation, wrong status, wrong id brand, bad JSON.

**Example:**
```ts
type CreateAppointment = { slotId: string };
type BookingRepo = { insert(input: CreateAppointment, orgId: string): Promise<{ id: string }> };
export function createBookingService(repo: BookingRepo) {
  return {
    async book(input: CreateAppointment, orgId: string) {
      return repo.insert(input, orgId);
    },
  };
}
```

**Real-world:** In a Deloitte or EPAM round, draw this function and say what `orgId` must not come from `input`. That is the TypeScript question they are actually asking.

**Follow-up 1:** The interviewer says interfaces are enough and Zod is extra. What do you say?
**Answer:** Interfaces disappear. The request does not. Zod or an equivalent check stays. The interface can be inferred from the schema so there is one source.

**Follow-up 2:** How do you review a PR that adds `as any`?
**Answer:** Ask what failed to type. If it is a test fake, give the fake the interface. If it is `req.body`, parse it. Approve `any` only at a documented boundary with a ticket to remove it, not on the write path.



# Appendix — Study Guide & Learning Plans

## Study Guide

| Experience | Focus |
|------------|-------|
| Fresher | Q 1–30, 80–99, 158–177 — JS basics, Express routing, MongoDB CRUD, event loop & falsy traps; **Flatten Deep Dive** after Q29 |
| 2–4 years | Q 30–79, 100–130, 178–200 — async patterns, auth, aggregation, NoSQL injection, soft delete |
| 5–6 years (Senior) | Q 60–79, 110–157, 190–225, **226–279, 294–300** — system design, Docker, sharding, architecture, behavioral |
| 6+ years (Senior + AI era) | All Senior rows + **241–250**, **401–445**, **251–257**, **258–263**, **264–271**, **280–293**, **301–305**, **321–325**, **326–400** (ES2024–2026, queues, ORMs, K8s, AWS, gap-fill, Aug 2026 releases) |
| Full-stack Node + React JD | Add **316–320** + one Next.js page calling your API |
| GraphQL API role | **306–310** + DataLoader exercise |
| AI-focused Node role | **280–293** deep dive + build one RAG side project |
| Message queue / event-driven JD | **335–340** + BullMQ or Kafka spike |
| ORM-heavy SQL role | **341–348** + Prisma or Sequelize exercise |
| K8s / platform JD | **349–354** + deploy API to minikube |
| AWS / DevOps JD | **355–360** + GitHub Actions pipeline |
| Gap-fill / security / gRPC JD | **361–380** (WeakMap, prototype pollution, AsyncLocalStorage, HTTP cache, gRPC, RBAC, Mongo $facet) |
| Aug 2026 release awareness | **381–400** (ES2026, Node 24 LTS, MongoDB 8.3, $scoreFusion) |

### Recommended 4-week plan (6 years, Node + AI market)

| Week | Daily (2h) | Goal |
|------|------------|------|
| 1 | Senior Q 226–240 + draw 2 system designs on paper | System design fluency |
| 2 | Q 241–257 + write Supertest suite for one route | TypeScript + testing credibility |
| 3 | Q 280–293 + build mini RAG API (Mongo Atlas or pgvector) | AI integration portfolio piece |
| 4 | Q 294–300 (STAR stories out loud) + Q321–325 (2 LC/day) | Behavioral + coding round |

### Recommended 12-week plan (complete coverage — all 400 Q)

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
| 12 | 321–325, 294–300, **361–400** | LC patterns + mocks + gap-fill + Aug 2026 updates |

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
| 10 | 294–300, 326–400 (skim Part IV–VI) | Full mock interview × 2 |

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
| **6** | Behavioral + mocks + apply | Q 294–300, 326–400 (Part IV–VI skim), review weak Q | 8 STAR stories + applications |

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
| Extended (Part IV–VI) | Skim Q 326–400; hands-on ES2026, Node 24, or MongoDB 8.3 topic |
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
| Already strong on security / gRPC / ES2026 | Q 361–400 — skim; deep-dive any weak area |

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

*Last updated: August 5, 2026 — 400 Q&A total (Parts I–VI + Appendix)*
