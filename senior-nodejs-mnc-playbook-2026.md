# Senior Node.js Backend — MNC Interview Playbook (2026)

Prepared for **B. Pradeep Chandu**
Backend Developer, 5 years · Maren Solutions (since February 2022) · Healthcare
Stack you can defend today: Node.js, JavaScript, TypeScript, Express.js, MongoDB, Redis, REST, gRPC
Target: Senior Backend / Node.js · ₹20–30+ LPA · Hyderabad, Bengaluru, Pune, or remote

This file is the interview operating manual: companies, how you speak, designs, salary, and the mock. It does not repeat the 400-question bank.

| Need | File |
|---|---|
| Full Q&A, code, system-design questions 226–240, TypeScript 241–250, gRPC Q365, Redis 311–315 | [`interview-prep-2026.md`](./interview-prep-2026.md) |
| Output order and traps | [`interview-tricky-qsns-2026.md`](./interview-tricky-qsns-2026.md) |
| One-page redraw before the call | [`brief-topics-flowcharts-2026.md`](./brief-topics-flowcharts-2026.md) |
| Blank-page flowcharts | [`basics-js-node-flowcharts-2026.md`](./basics-js-node-flowcharts-2026.md) |
| How to study | [`README.md`](./README.md) |

Runtime assumed across the repo: Node.js 22 or newer for `nextTick` before promises and `AbortSignal.timeout`. Node.js 24 LTS, ES2026, and MongoDB 8.3 are the named current versions in the README. Do not invent project metrics in any of these files.

**Rule for every answer:** say what you did, why you chose it, what broke, and what you would change. If you have not done it in production, say “I have read and practised this; in production I have done X.” Interviewers at Deloitte, EPAM, and product companies punish inflated claims in the follow-up.

---

## 0. How a senior answer sounds

A fresher defines the term. A senior answers in this order:

1. **Context** — what was failing or what the requirement was.
2. **Mechanism** — how the runtime, database, or protocol actually behaves.
3. **Decision** — what you chose and the trade-off you accepted.
4. **Production check** — logs, metrics, index, timeout, or test that proves it.
5. **Limit** — when this design stops working.

Example, event loop:

> JavaScript in Node runs on one main thread. I/O is offloaded through libuv. If an API handler runs a 500ms CPU loop, every other request on that process waits, even if the database is fast. I keep handlers async, move CPU work to a worker thread or a queue, and I watch event-loop lag. I do not “scale Node” by hoping async fixes a blocking loop.

---

## 1. Company patterns — reported vs typical

Label meaning:

- **Reported:** a public candidate write-up from 2024–2026 (LinkedIn, Glassdoor, Reddit, blogs). Processes vary by business unit, client, and vendor. Treat them as patterns, not a script.
- **Typical:** what these companies usually do when a public Node-specific report was not found. Do not quote this as “Deloitte always asks X.”

### Deloitte (priority)

**Reported**

| Source | What actually happened |
|---|---|
| MERN candidate, LinkedIn (Sharad Kumar, 2025) | Tech 1: JS (let/const, closures, hoisting, promises, debounce, prototype), small coding (flatten array, reverse string), Express REST, MongoDB, CORS. Tech 2: blogging-platform design, auth, RBAC, pagination, indexes, middleware, SQL vs NoSQL, load balancing, production logs. Then managerial scenarios and HR (salary, location). |
| Full-stack Node + React, ~5 YOE, Gurugram, Jan 2025 (techtics.xyz) | Third-party recruiter from Naukri. Screen: years, Node relevance, people handled, notice, current and expected CTC, 5-day office. One Teams technical round after introduction. They asked why Node over other runtimes. Candidate’s takeaway: memorised answers failed; they wanted scenarios. |
| Senior Software Engineer, Bengaluru, Glassdoor, process ~Apr 2026 | Three technical rounds: project discussion, React, solution architecture. About 3 weeks. Moderate. No offer in that report. |
| Senior frontend subscriber story, LinkedIn (~35 LPA claim) | Four rounds: JS screen, live coding and debugging, architecture (1M sessions, caching trade-offs, TypeScript), then HR/managerial. Negotiation described as limited. This is a second-hand story; use the topics, not the salary as a promise. |
| Glassdoor, partner round (non-India, 2024) | After technicals: behavioural with partners, psychometric test, then salary. Rejection later attributed by the candidate to pay mismatch. |

**What this means for you**

Deloitte USI / consulting interviews for a backend profile usually test:

- Can you explain your healthcare project without slides.
- JavaScript you can code, not only define (closures, event loop, promises).
- Express middleware, JWT, validation, error handling.
- MongoDB indexes, pagination, one aggregation.
- One practical design: appointments, notifications, or RBAC.
- How you talk to a client, a delay, and a production bug.
- HR: CTC, notice, location, “why Deloitte”.

Coding is usually short (array, string, async), not a 90-minute LeetCode hard. Architecture is scenario-based, not a Google-style 45-minute HLD with capacity math — unless the role is a specialist architect loop.

**Typical, not verified as a fixed Deloitte Node loop:** online aptitude for some bulk drives; sometimes a hiring-manager round separate from tech. Ask the recruiter for the exact loop before you prepare.

### Other companies

| Company | Reported pattern | Typical expectation if the report is thin |
|---|---|---|
| **Accenture** | Apr 2026, Level 10 Senior Analyst: L1 = 3 DSA + React/Node. L2 ≈ 1 hour, 40+ rapid questions on servers, networking, design. Aug 2026, Node ~3 YOE: OA, then ~1 hour on single-thread vs libuv, event loop, `nextTick`, JWT, palindrome, flatten array. | Custom Software Engineering is stricter than a generic ASE drive. Level and client decide depth. |
| **EPAM** | 6 YOE Node (Glassdoor forum): deep Node, TypeScript, JavaScript, OWASP, SOLID, security, logging, monitoring, profiling, HTTP/2, authz, caching, AWS. Offer can stall after “all rounds cleared”. Feb 2026 senior frontend A3: 2 tech + manager + HR; coding included a `setTimeout` Promise polyfill; manager asked SDLC, PR review, CI/CD. | EPAM is the closest “product engineering bar” inside this MNC list. They go deep on one concept. |
| **Infosys** | Glassdoor 2024–2026, Node, including Hyderabad: JS and Node basics, promises, SQL, indexes, microservices, one DSA, “call 3 APIs together”, transaction locking. Second round often managerial / client handling. | Fundamentals + communication. Coding is light unless the panel is project-specific. |
| **Amazon** | 2025–2026 SDE II India write-ups: OA, DSA (trees, graphs, heaps, stacks, medium), LLD (Splitwise, filters), HLD (auction, monitoring, global distribution), Leadership Principles in every round, bar raiser. One loop rejected a candidate who skipped requirements in LLD. | This is a different exam from Deloitte. ₹30+ here requires DSA medium in 30–40 minutes plus design structure. Node is not the interview; engineering judgment is. |
| **Microsoft** | No Node-specific 2026 loop verified here. | DSA + LLD/HLD + project deep dive. Similar bar to Amazon, different behavioural style. |
| **Google** | No Node-specific India loop verified here. | Algorithms, complexity, and design. Rare as a pure “Node developer” hire. |
| **IBM, Oracle** | No fresh Node loop verified in this pass. | IBM: project + Java/Node fundamentals + one design. Oracle product teams lean toward data structures and SQL; services teams look like other MNCs. |
| **Capgemini, Cognizant, TCS, Wipro, Tech Mahindra, HCLTech, LTIMindtree, ValueLabs** | No reliable Node-specific 2026 write-up used here. | Recruiter screen → 1–2 technicals (JS, Node, DB, your project) → manager → HR. Coding is usually easy. Depth depends entirely on the panel. ValueLabs and LTI product accounts sometimes ask more design than TCS/Wipro bulk drives. |

**Practical split**

- **Service MNC loop (Deloitte, Infosys, TCS, Wipro, Cognizant, Capgemini, HCL, TechM, LTI):** project story, JS/Node depth, Mongo/Redis, one design, client communication.
- **Engineering MNC loop (EPAM, Accenture CSE, IBM specialist, Oracle product):** the above, plus testing, security, cloud, and tighter coding.
- **Product loop (Amazon, Microsoft, Google, strong GCC):** DSA medium, LLD, HLD with numbers, behavioural proof. Your healthcare domain helps only if you can go deep on consistency, latency, and failure.

---

## 2. JavaScript — questions they actually use

Answer from the runtime, then give a production use.

### Execution context and call stack

Each function call creates an execution context: variable environment, `this`, and the code. Contexts sit on the call stack. When the stack throws or a function returns, that frame is gone.

Senior point: a stack overflow is a sync recursive bug. An unhandled rejection is not on the stack anymore; you catch it with `.catch`, `try/catch` around `await`, or `process.on('unhandledRejection')` as a last log, not as business logic.

```js
function parseClaim(claim) {
  if (!claim.id) throw new Error("claim id missing");
  return claim.id;
}
```

### Event loop and microtasks

Order you must be able to write on a board:

1. Run the current synchronous stack to the end.
2. Drain the `process.nextTick` queue.
3. Drain the microtask queue (`Promise.then`, `queueMicrotask`, `async` continuations).
4. Enter the next libuv phase and run those callbacks. After that phase, steps 2 and 3 run again.

libuv phases, in order: **timers** (`setTimeout`, `setInterval`) → pending callbacks → idle/prepare → poll (I/O) → **check** (`setImmediate`) → close callbacks. Q151 in the long guide lists the same six. This file had dropped idle/prepare; do not drop it in the interview. “Macrotask” is a browser word. In Node, name the phase.

`setTimeout(fn, 0)` and `setImmediate(fn)` from the main module have no guaranteed order. Inside an I/O callback, `setImmediate` runs in the check phase before the next timers phase, so it runs first. Say that if they ask. A recursive `nextTick` never lets the loop reach poll, so I/O stalls. That is the production bug.

```js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
process.nextTick(() => console.log("D"));
console.log("E");
// A, E, D, C, B
```

If you cannot explain why `D` is before `C`, do not claim Node expertise. `nextTick` starvation is a production bug: a recursive `nextTick` never lets I/O run.

### Closures

A function keeps the variables of the scope where it was created. Use it for per-request state, once-only initialisation, and debounce timers. Cost: those variables stay in memory until the function is unreachable.

```js
function createLimiter(limit) {
  let inFlight = 0;
  const queue = [];
  const run = (fn) => new Promise((resolve, reject) => {
    const start = () => {
      inFlight++;
      fn().then(resolve, reject).finally(() => {
        inFlight--;
        if (queue.length) queue.shift()();
      });
    };
    if (inFlight < limit) start();
    else queue.push(start);
  });
  return run;
}
```

### Hoisting and TDZ

`var` and `function` declarations are hoisted. `let` and `const` are hoisted into the temporal dead zone and throw if touched before the line. Use `const` unless you reassign.

### Promises and async/await

`async` functions return a promise. `await` pauses that function, not the thread. Sequential `await` in a loop is a latency bug when the calls are independent.

```js
const [patient, slots] = await Promise.all([
  patientService.get(id),
  slotService.list(doctorId),
]);
```

Use `Promise.allSettled` when one failure must not hide the others (fan-out to three downstreams — this exact question showed up in an Infosys Node interview).

### Prototype

Methods live on the prototype so instances share them. `class` is syntax over the same chain. For plain data, prefer objects and factory functions. Know `Object.create`, `instanceof`, and why mutating `Object.prototype` is a production incident.

### `this`

| Call | `this` |
|---|---|
| `obj.method()` | `obj` |
| bare `method()` / passing the method as a callback | `undefined` in strict mode |
| `call` / `apply` / `bind` | the value you set |
| arrow function | lexical `this` of the enclosing scope |

Express handlers as class methods lose `this` unless you bind them or use arrows. That bug shows up as `Cannot read properties of undefined`.

### Debounce and throttle

Debounce: run after the calls stop (search box, resize). Throttle: run at most once per window (scroll, rate of log shipping).

```js
function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
```

On the server, the same idea is coalescing cache refreshes or preventing double-submit. Do not say “I only use this in React.”

### Memory leaks and GC

V8 garbage-collects unreachable objects. Leaks in Node services are usually:

- globals, caches with no cap or TTL
- listeners added per request and never removed
- closures holding large buffers
- uncleared timers
- a growing array used as a “log”

Debug with `process.memoryUsage()`, heap snapshots in Chrome DevTools (`node --inspect`), and clinic.js / `--heapsnapshot-near-heap-limit` on Node 20+.

### Shallow vs deep copy

Shallow: `structuredClone` is not needed; `{...obj}` and `Object.assign` copy one level. Nested objects stay shared. Deep: `structuredClone(value)` for plain data. It does not clone functions, class instances with methods, or DOM nodes. `JSON.parse(JSON.stringify(x))` drops `undefined`, `Date` becomes a string, and it throws on cycles. Say that out loud; interviewers still hear people recommend JSON clone.

### ES6+ you should use without reciting a list

Destructuring, rest/spread, modules, optional chaining, nullish coalescing, `Map`/`Set` (object keys, frequent add/delete), `Promise.allSettled`, top-level await in ES modules, `Array.prototype.at`, `Object.hasOwn`, `Error.cause`.

---

## 3. Node.js — architecture and production

### What is actually single-threaded

Your JavaScript runs on one thread per process. libuv uses a thread pool (default 4, `UV_THREADPOOL_SIZE`) for some blocking work: file system, DNS (`dns.lookup`), and some crypto. Network I/O is non-blocking and does not use that pool.

So: Node is excellent at many concurrent I/O waits. It is poor at long CPU work on the main thread (big JSON transform, image resize, synchronous bcrypt with a huge cost, a tight loop).

**Worker threads:** same machine, shared memory via `SharedArrayBuffer` or message passing. Use for CPU.  
**Child processes:** separate memory, crash isolation, `fork` for Node scripts or `execFile` for binaries.  
**Cluster / multiple processes:** one process per core behind a load balancer. PM2 cluster or Kubernetes replicas. The OS or the platform balances connections. Do not build your own balancer in application code unless you have a reason.

### Streams and buffers

`Buffer` is a fixed byte block outside the V8 heap limit in older designs; treat large payloads as streams. HTTP upload → `req.pipe` or `pipeline()` into a parser or object storage. `pipeline` forwards errors and destroys streams. Loading a 200 MB export with `fs.readFile` is how you OOM a pod.

### Error handling

| Layer | What to do |
|---|---|
| Expected failure (validation, not found, conflict) | Throw or return a typed error with HTTP status. No stack spam at `error` level. |
| Programmer bug | Log with request id, return 500, do not leak internals to the client. |
| Process-level | Log `uncaughtException` / `unhandledRejection`, then exit and let the orchestrator restart. Do not keep serving after a corrupt state. |

```js
class AppError extends Error {
  constructor(status, code, message, { cause } = {}) {
    super(message, { cause });
    this.status = status;
    this.code = code;
  }
}
```

Express needs a 4-argument middleware **after** routes. Async errors are not caught unless you wrap them (`express-async-errors` pattern or a small wrapper). This is a favourite panel question.

### Middleware order

Typical order: request id → logging → security headers → body parser with a size limit → rate limit → auth → validation → route → error handler.

Auth before the handler. Validation before business logic. Error handler last.

### Authentication and authorization

Authentication: who is this user. Authorization: what may they do.

JWT access token: short life (10–15 minutes), sent in `Authorization: Bearer`. Refresh token: longer life, stored hashed, rotated on use, revocable in Redis or the database. A JWT is not “logged out” until it expires unless you keep a denylist or use short expiry plus rotation.

```txt
login → access JWT + refresh (httpOnly cookie)
API call → verify access signature, iss, aud, exp
401 → client calls /refresh with refresh token
refresh → rotate refresh, issue new access
logout → delete refresh server-side
```

RBAC for healthcare: roles on the token are a hint. The server checks permission against the resource (this doctor, this patient, this facility). Never authorize from a role string alone if the record is tenant-scoped.

### Rate limiting

Token bucket or sliding window in Redis (`INCR` + `PEXPIRE`, or a sorted set of timestamps). Key by user id when authenticated, else by IP. Return `429` and `Retry-After`. A process-local `Map` breaks as soon as you run two pods.

### Caching

Cache only data that is read often and tolerates a bounded staleness, or data you can invalidate on write.

- Cache-aside: read cache, on miss read DB, fill cache. Your app owns this. Most REST services should start here.
- Write-through: write cache and DB together. More consistency, slower writes.
- TTL as a safety net, explicit delete on update as the real invalidation.

Stampede: many misses rebuild the same key. Use a short lock (`SET key:lock NX PX 3000`) so one request rebuilds.

### Logging, monitoring, debugging

Log JSON with `requestId`, `userId`, route, status, latency. Do not log tokens, passwords, or full medical payloads.

Minimum metrics: request rate, latency (p50/p95/p99), error rate, event-loop lag, heap, Mongo op time, Redis hit rate, downstream error rate.

An API at 10 seconds (see section 8) is a trace problem: where did the time go.

### Security you will be asked (EPAM-style)

- Validate and allow-list input. Limit body size.
- Parameterised queries. Mongo: do not pass user objects into `$where` or query operators (`$gt` injection).
- Helmet-style headers, CORS allow-list (not `*` with credentials).
- Hash passwords with bcrypt or argon2. Never roll your own.
- Secrets in a secret manager, not in git.
- Dependency audit. Least-privilege DB user.
- Idempotency on payments and bookings.

OWASP API list is enough: broken auth, broken object-level authorization, unrestricted resource consumption, mass assignment.

### Performance

Measure first. Typical wins on a Node API:

1. Missing Mongo index (largest win).
2. N+1 queries or sequential awaits.
3. Over-fetching documents.
4. No timeout on downstream HTTP.
5. JSON serialization of huge arrays.
6. Logging every request body in production.
7. GC pressure from creating large objects per request.

---

## 4. TypeScript and Express

### interface vs type

Use `interface` for object shapes you expect to extend or implement. Use `type` for unions, intersections, tuples, and mapped types. Both are erased at compile time. They do not validate runtime JSON.

### Generics

```ts
class AppError extends Error {
  constructor(readonly status: number, readonly code: string, message: string) { super(message); }
}
async function findById<T>(model: { findById(id: string): Promise<T | null> }, id: string): Promise<T> {
  const doc = await model.findById(id);
  if (!doc) throw new AppError(404, "NOT_FOUND", "Resource not found");
  return doc;
}
```

### Utility types you should use

`Partial`, `Pick`, `Omit`, `Record`, `Readonly`, `Required`, `ReturnType`, `Parameters`. Example: `type CreateAppointment = Omit<Appointment, "id" | "createdAt">`.

### Decorators

Useful in NestJS (`@Injectable`, `@Get`). In plain Express they are optional. If you have not shipped Nest, say you use Express middleware and typed request objects. Do not pretend a decorator framework.

### Narrowing

`typeof`, `in`, `instanceof`, discriminated unions (`kind: "fixed" | "percent"`), and custom type guards. This is how you avoid `as`.

### Project shape that scales

```txt
src/
  modules/appointment/  routes, controller, service, repository, schema
  modules/auth/
  shared/errors, logger, middleware, db
  app.ts                wire middleware and routes
  server.ts             listen, graceful shutdown
```

Controller: HTTP in, HTTP out. Service: rules. Repository: Mongo. Do not call Mongo from the route file in a design discussion; you can admit a smaller service did, and what pain it caused.

### Request validation

TypeScript does not check `req.body`. Use Zod (or Joi) and infer the type:

```ts
type ZodString = { min(n: number): ZodString; datetime(): ZodString };
type ZodObject<T> = { refine(check: (value: T) => boolean, message: string): ZodObject<T> };
declare const z: {
  object<T extends Record<string, ZodString>>(shape: T): ZodObject<{ [K in keyof T]: string }>;
  string(): ZodString;
};
declare namespace z { export type infer<T> = T extends ZodObject<infer Out> ? Out : never; }
const CreateSlot = z.object({
  doctorId: z.string().min(1),
  start: z.string().datetime(),
  end: z.string().datetime(),
}).refine((s) => s.end > s.start, "end must be after start");

type CreateSlotInput = z.infer<typeof CreateSlot>;
```

Validate at the edge. Trust the typed value inside the service.

### Error middleware

```ts
class AppError extends Error {
  constructor(readonly status: number, readonly code: string, message: string, options?: { cause?: unknown }) {
    super(message, options);
  }
}
type NextFunction = (err?: unknown) => void;
interface Request { log: { error(obj: unknown): void } }
interface Response { status(code: number): { json(body: unknown): void } }
function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const appErr = err instanceof AppError
    ? err
    : new AppError(500, "INTERNAL", "Unexpected error", { cause: err });
  req.log.error({ err: appErr, code: appErr.code });
  res.status(appErr.status).json({ error: { code: appErr.code, message: appErr.message } });
}
```

---

## 5. MongoDB

### Indexes

An index is a separate structure (B-tree) the planner can walk instead of scanning the collection. Equality fields first, then sort or range fields. ESR: Equality, Sort, Range.

```js
db.appointments.createIndex(
  { facilityId: 1, doctorId: 1, start: 1 },
  { name: "facility_doctor_start" }
);
```

A query `{ facilityId, doctorId, start: { $gte, $lt } }` can use that index. A query that only filters `start` cannot use it efficiently (leftmost prefix).

`explain("executionStats")`: look at `totalDocsExamined` vs `nReturned`. If you examine 100k docs to return 20, the index is wrong or missing.

Too many indexes slow writes. Do not index every field “to be safe.”

### Pagination

Offset (`skip`/`limit`) gets slower as the page number grows because Mongo still walks skipped docs. For large sets use range pagination:

```js
db.appointments.find({
  facilityId,
  doctorId,
  start: { $gte: dayStart, $lt: dayEnd },
  _id: { $gt: lastId },
}).sort({ start: 1, _id: 1 }).limit(20);
```

Return `nextCursor` to the client. Tell the interviewer the trade-off: offsets support “go to page 50”; cursors support infinite scroll and stable performance.

### Aggregation exercise — daily load per doctor

```js
db.appointments.aggregate([
  { $match: {
      facilityId: "fac_1",
      start: { $gte: ISODate("2026-11-01"), $lt: ISODate("2026-12-01") },
      status: { $in: ["booked", "completed", "no_show"] },
  }},
  { $group: {
      _id: {
        doctorId: "$doctorId",
        day: { $dateToString: { format: "%Y-%m-%d", date: "$start", timezone: "Asia/Kolkata" } },
      },
      total: { $sum: 1 },
      noShows: { $sum: { $cond: [{ $eq: ["$status", "no_show"] ], 1, 0 } } },
  }},
  { $project: {
      _id: 0,
      doctorId: "$_id.doctorId",
      day: "$_id.day",
      total: 1,
      noShows: 1,
      noShowRate: { $cond: [{ $eq: ["$total", 0] }, 0, { $divide: ["$noShows", "$total"] }] },
  }},
  { $sort: { day: 1, doctorId: 1 } },
]);
```

`$match` first so the index works. `$lookup` only after you have reduced the set. `$unwind` multiplies documents; put it late and only if you need one doc per array element.

### Transactions

Multi-document transactions need a replica set. Use them when two writes must commit or abort together (decrement a slot count and insert the appointment). They are slower and can abort on transient errors; retry the transaction, not blindly the whole HTTP request (see idempotency).

A single document update is atomic. Prefer embedding or one document when the consistency boundary is small.

### Replication and sharding

Replica set: one primary, secondaries replicate the oplog. Read preference `secondary` can return stale data. Writes go to the primary.

Sharding: split a collection by a shard key when one replica set cannot hold the working set or the write rate. A poor shard key (monotonic `_id` only, or a field with one hot value) creates a hot shard. For a multi-tenant healthcare app, `facilityId` (or a hashed compound) is the conversation to have. Do not claim you sharded production if you only used a single replica set.

### Large data

- Project only needed fields.
- Stream cursors (`cursor.forEach` / async iteration) for exports.
- Pre-aggregate into a summary collection if the dashboard hits the same pipeline all day.
- Archive old appointments out of the hot collection.

---

## 6. Redis, microservices, gRPC

### Redis patterns

| Use | Key | Notes |
|---|---|---|
| Cache-aside entity | `doctor:{id}` | TTL 5–15 min + delete on update |
| Slot lock | `lock:slot:{id}` | `SET NX PX 5000`, value = request id |
| Rate limit | `rl:{user}:{route}` | INCR + PEXPIRE |
| Refresh token | `refresh:{userId}:{tokenId}` | hashed, TTL = refresh life |
| Leaderboard / queue | sorted set / list / stream | Stream if you need consumer groups |

Eviction: `allkeys-lru` is fine for a pure cache. If Redis also holds locks and sessions, a memory eviction can delete a lock or a session. Split cache and durable-ish keys, or use `volatile-ttl` and set TTLs only on cache keys. Say this. It is a senior distinction.

### Cache invalidation

Delete the key on successful write. TTL covers the writer that crashed before delete. Do not update the cache and the database in an order you cannot explain. If you delete after commit and the delete fails, the next read may be stale until TTL. Log that failure.

### If Redis is down

The request path must have a policy:

- **Cache:** skip cache, read Mongo, serve. Latency rises. Alert. Do not fail the appointment read because the cache is down.
- **Rate limit:** fail open (allow) or fail closed (429) is a product decision. For login, fail closed is safer. For reads, fail open is usual.
- **Lock / idempotency:** do not skip. Return 503. A missing lock that still books the slot will double-book.

```js
async function getDoctor(id) {
  try {
    const hit = await redis.get(`doctor:${id}`);
    if (hit) return JSON.parse(hit);
  } catch (err) {
    logger.warn({ err, id }, "redis cache skipped");
  }
  const doctor = await doctors.findOne({ _id: id });
  if (doctor) {
    redis.set(`doctor:${id}`, JSON.stringify(doctor), "EX", 300).catch(() => {});
  }
  return doctor;
}
```

### Microservices

Split on a business boundary and an independent failure domain, not on folders. A healthcare backend can stay a modular monolith until a team or a scaling limit forces a split (notifications, eligibility, billing).

Sync (REST/gRPC): the caller needs the answer now. Couple on latency. Always set a timeout.

Async (queue): the caller needs the work done, not the result in this request. Email, SMS, audit, report generation. At-least-once delivery means consumers must be idempotent.

### gRPC

HTTP/2, protobuf contracts, streaming if you need it. Strong types, smaller payloads, deadlines instead of “hope the HTTP client times out”.

You should be able to say:

- `.proto` is the contract; generated code is not hand-edited.
- Deadlines propagate. A 300 ms deadline on the gateway must be passed downstream.
- Status codes (`NOT_FOUND`, `INVALID_ARGUMENT`, `UNAVAILABLE`) map to client behaviour.
- Retries only on idempotent calls (`UNAVAILABLE`, deadline exceeded). Do not retry a non-idempotent `CreateAppointment` without an idempotency key.

If gRPC in your project is only one client call, describe that call. Do not draw ten services you do not operate.

### Retry, circuit breaker, discovery, tracing

Retry: exponential backoff + jitter, max attempts, only on safe errors. A retry storm takes down the dependency that was trying to recover.

Circuit breaker: after N failures, open the circuit and fail fast for a cool-down, then allow one trial. Use it on a flaky downstream, not on your own database by default.

Discovery: in Kubernetes, a Service DNS name is enough. Consul/Eureka is an extra system; mention it only if you used it.

Tracing: one `traceId` / `requestId` from the gateway through Node, Mongo comments or logs, and gRPC metadata. You cannot debug a 10-second call without it.

---

## 7. System design — how to spend 25 minutes

1. Clarify who uses it and the one action that must be correct (2 min).
2. Numbers you assume, and say they are assumptions (1 min).
3. API and data model (8 min).
4. Flow for the critical write (6 min).
5. Failure, scale, and what you would not build yet (8 min).

Draw boxes only after the data model. Deloitte panels often stop you at “how is the appointment stored and what index do you need.”

### 7.1 Appointment booking

**Correctness rule:** one slot, one confirmed booking.

**API**

```txt
POST /v1/appointments
Idempotency-Key: <uuid>
{ patientId, slotId }

200 { appointmentId, status: "confirmed" }     // replay of same key
201 { appointmentId, status: "confirmed" }
409 { error: "SLOT_TAKEN" }
```

**Schema**

```txt
slots:        { _id, doctorId, facilityId, start, end, status: "open"|"held"|"booked", version }
appointments: { _id, slotId, patientId, idempotencyKey, status, createdAt }
unique index: slots._id is the slot
unique index: appointments.idempotencyKey
unique partial index: { slotId: 1 } where status == "confirmed"
```

**Write path**

1. If this idempotency key already has an appointment, return it.
2. Update the slot only if it is still open:

```js
const slot = await slots.findOneAndUpdate(
  { _id: slotId, status: "open" },
  { $set: { status: "booked" } },
  { returnDocument: "after" }
);
if (!slot) throw new AppError(409, "SLOT_TAKEN", "Slot is no longer available");
```

3. Insert the appointment. If the insert fails, set the slot back to `open` or use a transaction around both writes.

Two parallel requests: only one `findOneAndUpdate` matches `status: "open"`. That is the concurrency answer. A transaction is the cleaner version when you also write the appointment in the same commit.

**Scale:** read replicas or a cache for “show the calendar”. The booking write stays on the primary. Hold the slot for 5 minutes with a `heldUntil` if the product has a payment step; a worker releases expired holds.

**Do not:** lock the whole doctor document, or check availability in Node and insert later without a conditional update.

### 7.2 Healthcare backend (modular)

Boundaries: identity, patients, scheduling, clinical documents, notifications, audit.

Sensitive data: encrypt in transit (TLS), restrict fields by role, audit every read of a clinical record if the product requires it, keep PHI out of logs. Multi-tenant: every query includes `facilityId` or `orgId`, backed by an index, checked on the server from the token’s tenant, not from the body.

You work in this domain. In the interview, walk through one real flow you built (even a simple one): who calls, which collection, which index, what happens on failure. That beats a fictional hospital platform.

### 7.3 URL shortener

Write: generate a random 7-character id (base62), insert `{ code, url }` with a unique index on `code`, retry on duplicate. Read: cache hot codes in Redis, 301/302 to the long URL. 302 if you need click counts (every hit reaches you); 301 if you can give up counts. Do not use a SQL auto-increment exposed as the code if you care about enumeration.

### 7.4 Notification service

API accepts `{ userId, channel, template, data, idempotencyKey }` and writes an outbox row in the same transaction as the business event when you can. A worker publishes to a queue. Consumers send email/SMS/push. Store delivery status. Retries with backoff. User preference check before send. The booking API does not call the SMS vendor inline.

### 7.5 Rate limiter

Sliding window in Redis. For a global limit across pods, Redis is the counter; the app is stateless. Token bucket if you want to allow short bursts. Return 429. For fairness, key by API token, not only IP (NAT shares one IP across a hospital).

### 7.6 E-commerce backend (short)

Catalog reads are cacheable. Cart can live in Redis. Checkout is the consistency boundary: reserve stock with a conditional update, create order, take payment, then confirm or release. Do not decrement stock in the browser’s favourite-item call.

### 7.7 Payments (short)

You are not the source of money movement; a provider is. Your job is an idempotency key on `POST /payments`, a unique constraint, store provider reference, and a webhook that is also idempotent (`eventId` unique). Verify webhook signatures. Never mark paid from the browser redirect alone. Double-charge is prevented by the unique key plus “create once” at the provider using the same idempotency key.

### 7.8 Distributed cache

See section 6. Add: local LRU in the process for tiny hot sets, Redis as the shared layer, database as source of truth. Invalidation is explicit. Eviction policy must not delete locks.

---

## 8. Scenario answers — say this shape

These are practice incidents, not stories from Maren Solutions. In the interview, use this shape and swap in a real incident only when you have one. For each case say how you investigate, the root cause you expect, the fix, how you prove it, and what stops it happening again.

### API takes 10 seconds

Investigate: one route or all routes, one tenant or all, p95 versus a single client. Split the handler: time before Mongo, Mongo, Redis, and each downstream call. A trace id beats a guess.

Root cause to look for: missing index, an unbounded query, sequential awaits, no timeout, a retry loop, DNS, a lock, or a huge payload.

Fix: the largest slice only. Add a deadline so the next failure fails in about a second.

Validate: the same request, timings before and after. Do not invent a millisecond number.

Prevent: timeouts on outbound calls, an index review on new filters, and an alert on p95.

### Slow aggregation

Investigate: `explain("executionStats")` on the real pipeline. Compare `nReturned` with `totalDocsExamined`.

Root cause: `$match` too late, a sort that is not the index order, `$lookup` on an unindexed field, or `$unwind` exploding the set.

Fix: match first, index the foreign field, project early. If the dashboard runs all day, write a summary collection.

Validate: docs examined drops toward rows returned. `allowDiskUse` is a bypass, not a design.

Prevent: a query review on aggregation changes, and a latency alert on that route.

### Memory leak

Investigate: heap and RSS across hours, not one spike after deploy. Two heap snapshots. The retainer path tells you who holds the object.

Root cause: a listener per request, an unbounded Map, a timer, or a closure holding a buffer.

Fix: register the listener once, cap the cache, clear the timer.

Validate: heap stays flat over the same traffic that used to climb.

Prevent: a heap metric and a snapshot when it crosses a line. A restart is only a bridge.

### High CPU

Investigate: event-loop lag versus CPU percent. One hot route in the logs. A profile (`node --cpu-prof` or clinic flame) if the lag is in JavaScript.

Root cause: a sync loop, `JSON.parse` of a huge body, bcrypt on the request thread, a bad regex (ReDoS), or a retry storm.

Fix: move CPU work to a worker or a queue, limit body size, cap bcrypt cost, reject the bad pattern.

Validate: lag and CPU drop on the same route. Other routes were waiting on that thread, so they should improve too.

Prevent: a body limit, a timeout, and a ban on sync crypto in handlers.

### Concurrent requests and race conditions

Investigate: duplicate bookings or lost updates that only appear under parallel calls. Reproduce with two requests, not one.

Root cause: read-then-write. Both requests saw `open` and both wrote.

Fix:

```js
const slot = await slots.findOneAndUpdate(
  { _id: slotId, status: "open" },
  { $set: { status: "booked" } },
  { returnDocument: "after" }
);
if (!slot) throw new AppError(409, "SLOT_TAKEN", "Slot is no longer available");
```

A version field gives the same guarantee on a general update. A transaction wraps the slot write and the appointment insert.

Validate: a unique index rejects the second insert. A parallel test expects one 201 and one 409.

Prevent: conditional writes on every status change, and a test that fires two requests.

### Redis unavailable

Investigate: error logs for connection refused or timeout, and whether the failing routes are reads, rate limits, or locks.

Root cause: Redis is down, evicting the wrong keys, or the app treats cache and locks as the same dependency.

Fix: cache reads fall through to Mongo. Login and slot locks return 503. Do not book without the lock.

Validate: stop Redis in a test. Reads still return 200 from Mongo. A booking returns 503, not a double book.

Prevent: separate eviction policy for cache and locks, and an alert on Redis errors.

### Microservice or gRPC failure

Investigate: which hop consumed the time. Deadline exceeded, `UNAVAILABLE`, or a retry storm in the logs. One trace id across the gateway and the callee.

Root cause: no deadline, a retry of a non-idempotent create, or a dependency that is down while callers keep hammering it.

Fix: propagate the deadline, retry only idempotent calls with jitter, open a circuit after repeated failures.

Validate: a killed callee fails fast with a clear status, and a replay with the same idempotency key does not create a second row.

Prevent: deadlines in the contract, and a load test with the dependency disabled.

### Authentication and object-level authorization

Investigate: a user can read another facility’s patient by changing the id. Check whether `orgId` comes from the token or from the body.

Root cause: the handler loads by id and never compares the resource’s organisation with the caller’s.

Fix: query `{ _id, orgId }` where `orgId` is from the verified token. Return 404 when it does not match so you do not reveal that the id exists.

Validate: a test token for facility A cannot read facility B’s id.

Prevent: one repository helper that always takes the caller’s organisation, and a review comment that blocks a query without it.

### Duplicate payment or booking

Investigate: two rows with the same client action, or two provider charges. Look for a missing unique key and a webhook that was applied twice.

Root cause: the POST was retried and both attempts inserted. Or the webhook handler is not idempotent.

Fix: require `Idempotency-Key`, unique index, store the first response, and unique `providerEventId` on webhooks. Send the same key to the provider.

Validate: replay the POST and the webhook. One row, the same response body.

Prevent: the unique index is the backstop even if the application check is skipped.

### Large-scale performance

Investigate: define the number. Requests per second, concurrent connections, and the slow query are different problems. Check pool wait, CPU, event-loop lag, and Mongo.

Root cause: the app is often fine and the database, the pool, or a synchronous section is not.

Fix: stateless pods, indexes, Redis for hot reads, a queue for work that can wait, 429 when the pool is full, and a timeout everywhere.

Validate: a load test to a stated target, with the database metrics on the same graph.

Prevent: capacity is a number you measured, not a slogan about Node being async.

### Migrating a large JavaScript app to TypeScript

Investigate: which files throw at runtime because a value was assumed. Start at the API boundary and the database documents.

Fix, without a stop-the-world rewrite: `allowJs`, type the edges with Zod, `strict` one folder at a time, CI fails on new `any` in touched files.

Validate: a migrated module catches a bad payload in tests that JavaScript let through.

Prevent: new files are TypeScript. Old files move when they are touched.

---

## 9. Coding round — write these until they are boring

Medium, then senior. Speak the approach, then code, then complexity.

### C1. Flatten (reported at Deloitte and Accenture)

```js
function flatten(input) {
  const out = [];
  const walk = (value) => {
    if (Array.isArray(value)) {
      for (const item of value) walk(item);
    } else {
      out.push(value);
    }
  };
  walk(input);
  return out;
}
```

Iterative version if they ban recursion. `Array.prototype.flat(Infinity)` is acceptable if you then write the manual version.

### C2. Group appointments by doctor

```js
function groupBy(rows, key) {
  const map = new Map();
  for (const row of rows) {
    const k = row[key];
    const list = map.get(k);
    if (list) list.push(row);
    else map.set(k, [row]);
  }
  return map;
}
```

`Map` over `{}` when keys are not safe strings.

### C3. Retry with backoff, only on 503

```js
async function withRetry(fn, { attempts = 3, baseMs = 100 } = {}) {
  let last;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      last = err;
      if (err.status !== 503 || i === attempts - 1) throw err;
      const jitter = Math.random() * baseMs;
      await new Promise((r) => setTimeout(r, baseMs * 2 ** i + jitter));
    }
  }
  throw last;
}
```

### C4. LRU cache (senior)

```js
class Lru {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // Map keeps insertion order
  }
  get(key) {
    if (!this.map.has(key)) return undefined;
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }
  set(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest);
    }
  }
}
```

O(1) get and set. This is the design they want when they say “cache in memory”.

### C5. Express handler skeleton

```js
app.post("/v1/appointments", async (req, res, next) => {
  try {
    const input = CreateSlot.parse(req.body); // or appointment schema
    const key = req.get("Idempotency-Key");
    if (!key) throw new AppError(400, "IDEMPOTENCY_KEY_REQUIRED", "Missing key");
    const appointment = await service.book({ ...input, key, actor: req.user });
    res.status(201).json(appointment);
  } catch (err) {
    next(err);
  }
});
```

### C6. Mongo — patients with more than 3 no-shows in 90 days

```js
db.appointments.aggregate([
  { $match: {
      status: "no_show",
      start: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
  }},
  { $group: { _id: "$patientId", noShows: { $sum: 1 } } },
  { $match: { noShows: { $gt: 3 } } },
  { $lookup: {
      from: "patients",
      localField: "_id",
      foreignField: "_id",
      as: "patient",
  }},
  { $unwind: "$patient" },
  { $project: { _id: 0, patientId: "$_id", noShows: 1, name: "$patient.name" } },
]);
```

Index `{ status: 1, start: 1, patientId: 1 }` or `{ patientId: 1, start: 1 }` depending on which query is common. Explain that choice.

---

## 10. Project round — only your real work

Facts that are safe to say today:

- Name: B. Pradeep Chandu
- About 5 years as a backend / Node.js developer
- Maren Solutions since February 2022
- Domain: healthcare
- Technologies you listed: Node.js, JavaScript, TypeScript, Express.js, MongoDB, Redis, REST, gRPC

Anything else — team size, your module, a bug you fixed, a latency drop, an index you added — must come from you. **Do not memorise a fake metric.** Panels ask “show me the query” and “what was p95 before”.

Fill this before the interview. One honest paragraph beats a polished fiction.

```txt
[FILL] System in one sentence:
[FILL] Business purpose of that system:
[FILL] My module:
[FILL] Modules I do not own:
[FILL] Collections I touch:
[FILL] One index I rely on, and the exact query:
[FILL] One API I wrote (method, path, who calls it):
[FILL] One production bug — symptom, what I checked, cause, fix:
[FILL] One performance change — what was slow, what I changed:
[FILL] One technical decision I argued for, and the option I rejected:
[FILL] One result I can defend without a made-up percentage:
```

Say this shape once the blanks are filled. Until then, use the safe two-minute introduction and do not invent the bracketed lines.

1. Overview. “I work on a healthcare backend at Maren Solutions. The API is Node and Express.” Then one sentence from [FILL] system.
2. Purpose. Who the software is for, from [FILL] business purpose. If you cannot name the user, say you work on the API layer of a healthcare product and stop.
3. Technologies. Only the list above, plus a tool you have actually used.
4. Architecture. Client, API, Mongo, Redis, and a downstream only if you call it. gRPC only if you can name the call.
5. Responsibilities. Verbs you perform on [FILL] my module. Name what you do not own.
6. Modules. [FILL] my module, and one neighbouring module you only call.
7. Database. One collection and [FILL] index. Embedding versus reference only if you made that choice.
8. API. [FILL] one endpoint: validation, auth, the query, the error code.
9. Production challenge. [FILL] bug, in the order symptom → check → cause → fix.
10. Performance. [FILL] performance change. `explain()` moving from a collection scan to an index scan is enough if you have no timing number.
11. Decision. [FILL] decision, including the trade-off.
12. Achievement. [FILL] result. If the only honest result is “the wrong status could no longer be saved”, say that.

Questions I still need from you before this section is interview-ready:

- What does the product do, in one sentence you are allowed to say?
- Which module is yours?
- Which collections and which index?
- One endpoint you can draw.
- One real bug and one real performance change.
- What you explicitly do not own.

### How to explain the project (90 seconds)

> I work as a backend developer at Maren Solutions, on a healthcare product, and I have been there since February 2022. The API layer is Node and Express. We use MongoDB for the main data, Redis where we need cache or short-lived keys, and REST for most clients. gRPC is part of the stack for service calls. My day-to-day work is API behaviour, data access, and production issues on the services I own. The part I can go deep on is [your module]. The hardest production issue I handled was [symptom → cause → fix].

Then stop. Let them choose the thread.

### Questions and how to handle them

| Question | How to answer |
|---|---|
| Architecture | One diagram: client → API → services/modules → Mongo / Redis → downstream. Name only components you can open in the repo. |
| Your responsibilities | Verbs: designed the endpoint, wrote the aggregation, reviewed PRs, handled the incident. Avoid “we” for five minutes, then credit the team. |
| Biggest achievement | One problem, your action, the result in words you can defend. If you have no measurement, say what changed in behaviour (“the double booking stopped after the conditional update”) and do not invent a percentage. |
| Production issue | Timeline: alert or complaint, what you checked first, what the data showed, the fix, how you stopped a repeat. |
| Why this database design | Access pattern first, then document shape, then index. |
| Code review | Correctness, security (authz, injection), queries, error paths, tests, naming. One example of a comment you gave. |
| Deadline | What you cut (a non-critical report) and what you refused to cut (auth, data integrity). |
| Conflict | Disagreement on a technical point, how you decided, what you did when you were wrong. |
| Why are you leaving | Growth: you want a senior backend scope — design ownership, harder scale or domain problems, and compensation in line with that work. No complaints about people. |
| Why should we hire you | You have spent ~5 years on healthcare APIs, you can debug a slow Mongo query and a Node failure, and you can explain trade-offs without hand-waving. Then one proof from the worksheet. |
| Strength | Production debugging and taking an API from “it works on my machine” to a predictable contract. |
| Weakness | Pick a real one with a practice already in place. Example shape: “I used to stay too long on a single bug before asking for a second pair of eyes. I now time-box 45 minutes, write what I have checked, and pull someone in.” Do not say “I work too hard.” |
| Five years | Senior engineer who owns a service: design, quality, and mentoring. Not a title fantasy. |

### Follow-ups your introduction will trigger

If you say it, they will ask it:

- gRPC: show a proto or describe one RPC, deadline, and error code.
- Redis: which keys, what TTL, what you do when Redis is down.
- MongoDB: one schema, one index, one slow query.
- TypeScript: where types stop and Zod starts.
- Healthcare: how you avoid logging PHI, how tenant id is enforced.

If any of those would be a bluff, take that noun out of the introduction.

---

## 11. Mock interview rules

A written answer in this repo is not a completed interview. The scorecard starts empty and changes only after you speak an answer.

When you say “start mock”, name the company and the round (screening, L1, L2, coding, design, managerial, HR):

1. One question only.
2. You answer in your own words. No pasted definitions.
3. Score /10 on correctness, depth, production judgment, and clarity.
4. Missing points listed.
5. An interview-ready answer.
6. A follow-up taken from what you just said.
7. Weak areas carried forward.
8. The next question stays at this level until you score 7 or higher.
9. Company question lists are in section 16.13. Concept depth is in `interview-prep-2026.md`. Output drills are in `interview-tricky-qsns-2026.md`.

Company modes:

- **Deloitte:** project → JS/Node → Mongo → one scenario → short code → HR.
- **EPAM:** one topic until you run out of depth, plus security.
- **Amazon-style:** one DSA or one design, plus one behavioural story with your real role.

### How the next question is chosen

The healthcare files in `mock/` stay a practice API. They do not store scores. This table is the selector. Ask the first unanswered row for that company. One question, then wait. Write the score only after a spoken answer. Leave the score blank until then.

| Order | Company | Round | Topic | Difficulty | Question |
|---|---|---|---|---|---|
| 1 | Deloitte | L1 | Introduction | Screening | Section 14, one-minute version, in your own words |
| 2 | Deloitte | L1 | Project | Intermediate | Section 10, only filled blanks |
| 3 | Deloitte | L1 | JavaScript | Advanced | interview-prep Q9, then Q150 if the score is 7+ |
| 4 | Deloitte | L1 | Coding | Intermediate | Playbook C1, then C8 if the score is 7+ |
| 5 | Deloitte | L2 | MongoDB | Advanced | Q180 and Q202 |
| 6 | Deloitte | L2 | Scenario | Advanced | Section 8, race, then the 10-second API |
| 7 | Deloitte | L2 | Design | Advanced | Section 7.1 appointment booking |
| 8 | Deloitte | HR | Salary | Screening | Section 12, after you know your real CTC |
| 9 | EPAM | L1 | Node | Advanced | Q122 and Q150 |
| 10 | EPAM | L2 | Security | Advanced | Q152, Q278, Q362 |
| 11 | Accenture | Coding | Arrays | Intermediate | C7 then C1 |
| 12 | Infosys | L1 | Async | Intermediate | Q12, then section 8 microservice failure |

### Progress log

Do not prefill this. A row exists only after you answer.

| Date | Company | Question | Score /10 | Weak point | Next stays on same topic? |
|---|---|---|---|---|---|
| | | | | | |

---

## 12. Salary and positioning

### Market, late 2026 (public ranges, they disagree)

These are published ranges, not offers.

| Source | What it says for ~5 years |
|---|---|
| Switchly, product-company fixed CTC | Backend about ₹16–28 LPA. Bengaluru ₹18–32, Hyderabad ₹16–28, Pune ₹15–26 across SWE roles. Services often 20–40% lower than those product figures. |
| Omnivoo, product / GCC, “mid-senior” 5–8 years | About ₹22–40 LPA, with Hyderabad close to Bengaluru for senior backend. |
| Training-site Node guides (GUVI, 4Achievers) | Often lower and inconsistent (senior Node sometimes shown around ₹12–25). Use them as a floor conversation, not as your target proof. |

**How to read this for ₹20–30+**

- ₹20–25 LPA is a realistic ask at Deloitte-class, EPAM, Accenture specialist, IBM, and many GCCs if the interview is strong and your current pay is not far below.
- ₹25–30 LPA is realistic at product companies and better GCC bands, and at the top of some service-firm specialist levels.
- ₹30+ at Amazon/Microsoft/Google is total compensation territory (base + bonus + stock). The interview is DSA + design + behaviour, not a Node quiz.
- TCS, Infosys, Wipro, and similar bulk bands often sit under ₹20 LPA at 5 years unless the role is a rare lateral specialist. Ask the band before you spend a day off.

Deloitte’s exact India band numbers were not verified in this research. Candidates report limited negotiation once level is fixed, and at least one rejection tied to a pay mismatch. Get the level (analyst / consultant / senior consultant or the USI equivalent) from the recruiter before the HR round.

### How to say the number

Do not speak first if you can avoid it. If forced:

> I am targeting a senior backend scope. Based on offers and ranges I see for 5 years of Node, TypeScript, and production API work in Hyderabad and Bengaluru, I am looking at ₹X to ₹Y fixed, depending on level and bonus. I am flexible if the role and the level are right. What band is this position in?

Pick X and Y from your current CTC. A common switch is about 30–40% when the market supports it. If you are already near ₹24 LPA, asking ₹30 is coherent. If you are at ₹10 LPA, jumping to ₹30 in one HR call at a service MNC usually dies; aim the next step at ₹18–22 and use a product loop for the larger jump. I do not know your current CTC, so do not memorise ₹30 as the opening number.

Say **fixed** and **variable** separately. “30 LPA” with 20% variable is not a 30 cash offer.

### Notice period

State the contractual notice and any buyout you are actually allowed to use. “I can join in N days” only if your current employer will release you. Do not promise 15 days to win the interview and then miss it.

### HR questions

Why this company, why leave, location, night shifts if it is a US client (Deloitte and Accenture often care), compensation breakdown, other offers, counter-offer plan. Decide the counter-offer answer now: usually you do not use an offer only as leverage with your current employer unless you are willing to stay.

### Senior positioning

They hire a senior when you reduce risk. Show:

- You own a flow end to end.
- You can find a slow query and a bad retry.
- You protect data (idempotency, authz, no PHI in logs).
- You can disagree with a simple design and say what you would cut.

Titles on the resume matter less than those four.

---

## 13. Fourteen-day plan (about 2 hours on workdays, 4 on weekends)

You already have concept notes. This plan is rehearsal.

| Day | Focus | Output |
|---|---|---|
| 1 | Fill the project worksheet. Record a 90-second intro. | Honest architecture paragraph |
| 2 | Event loop, microtasks, `nextTick`, closures. Code C3. | Explain A/E/D/C/B without notes |
| 3 | `this`, prototypes, debounce, memory leak story. | One heap-leak explanation from a real or practised bug |
| 4 | Express middleware order, async errors, Zod, JWT rotation. | Draw the request path |
| 5 | Mongo indexes, ESR, explain(), cursor pagination. | C6 from memory |
| 6 | Transactions, conditional update, idempotency. | Book-a-slot answer in 5 minutes |
| 7 | Redis: cache, lock, eviction, Redis-down policy. | Three keys from your real app, or mark them unknown |
| 8 | gRPC deadline, retry, circuit breaker, when not to split a service. | One real RPC or a clear “we use REST here” |
| 9 | Design: appointments + notifications. | 25-minute whiteboard |
| 10 | Design: rate limiter + URL shortener. | Trade-offs only, no new theory |
| 11 | Coding C1–C5 timed, 25 min each. | Speak complexity |
| 12 | Deloitte mock: intro, project, one scenario, one code, HR. | Scores |
| 13 | EPAM mock: security + one deep Node topic. | Scores |
| 14 | Weak topics only. Salary script out loud. | One-page cheat sheet in your words |

After day 14, repeat mocks. Add Amazon-style DSA only if a product company is actually in the pipeline: arrays, hash maps, two pointers, intervals, heaps, BFS/DFS, binary search. One medium a day.

---

## 14. Introductions

Speak these. Do not add numbers you cannot defend. Replace the bracket only with real work.

### 30 seconds — HR screen

> I am Pradeep Chandu, a backend developer with 5 years of experience, currently at Maren Solutions since February 2022. I work on healthcare APIs using Node.js, TypeScript, Express, MongoDB, and Redis, with REST and gRPC. I am looking for a senior backend role where I can own service design and production quality, in Hyderabad, Bengaluru, Pune, or remote.

### 1 minute — technical round

> I am Pradeep Chandu. I have spent 5 years on backend systems, and I have been with Maren Solutions since February 2022, working in healthcare. Most of my work is Node.js and Express: REST APIs, MongoDB queries and indexes, and Redis for cache or short-lived keys. TypeScript is on the codebase. gRPC is in the stack where a call needs a strict contract. I will only describe a specific RPC if I have worked on that call. Day to day I work on API behaviour, query performance, and production issues. I can walk a request from the route to the database, including a slow dependency. If you ask about a write race, I will explain a conditional update, and I will say whether that pattern is already in our service or whether it is how I would fix one. I am looking for a senior backend role with more design ownership.

### 2 minutes — safe version you can say today

This version is interview-ready. It does not claim a module, a bug, or a metric.

> I am Pradeep Chandu, a backend developer with 5 years of experience. I have been at Maren Solutions since February 2022, on a healthcare product. The services I work on are Node.js and Express, with TypeScript, MongoDB, Redis, REST, and gRPC.
>
> A change I take from the API contract through validation and auth, then the Mongo query behind that route, then how the failure is logged and returned to the caller. Where we cache, Redis is in front of reads that can be slightly stale, and Mongo remains the source of truth. I review other people’s changes for auth on the resource, the shape of the query, and error handling.
>
> I can go as deep as the panel wants on the request path, on what happens when Mongo or Redis is slow, and on how I would stop two writes from corrupting one record. I am looking for a senior backend role with end-to-end ownership of a service: design, reliability, and mentoring. Hyderabad, Bengaluru, Pune, or remote.

### 2 minutes — only after you fill the blanks with real work

> I am Pradeep Chandu, a backend developer with 5 years of experience. I have been at Maren Solutions since February 2022, on a healthcare product. The backend is Node.js and Express, with TypeScript, MongoDB, Redis, REST, and gRPC.
>
> In the current project I work on [your module, in your words]. A typical change for me starts at the API contract, then the validation and auth check, then the Mongo query and the index that query needs, and then how we log and handle failures.
>
> The flow I can discuss in detail is [one real flow]. A production problem I handled was [symptom, what you checked, the fix]. I also review other people’s changes, mainly for auth, query shape, and error handling.
>
> I am looking for a senior backend position because I want to own a service more end to end: design, reliability, and mentoring. My locations are Hyderabad, Bengaluru, Pune, or a remote role.

### Deloitte

> I am Pradeep Chandu, a backend developer with 5 years of experience, at Maren Solutions since February 2022. My work is healthcare APIs on Node.js, TypeScript, Express, MongoDB, and Redis. In a client setting I am used to explaining a technical limit in plain language: what the API guarantees, what happens when Mongo is slow, and what we should not promise in a sprint. I have worked with REST and gRPC contracts, so I am careful about backward-compatible changes. I want a senior role at Deloitte where I can build reliable backend services for enterprise clients and still stay close to the design and the production issues.

### Product company

> I am Pradeep Chandu. For 5 years I have been building backends, and since February 2022 I have been at Maren Solutions on a healthcare system. I care about queries that match an index, failures that carry a request id, and write paths that stay correct when two requests arrive together. Our stack is Node.js, TypeScript, Express, MongoDB, Redis, REST, and gRPC. I would rather walk one real flow — the data model and the index — than list frameworks. If I have not personally fixed a race on that flow, I will say so and then show the conditional update I would use. I am looking for a senior backend role with a higher bar on design and operability.

### Why Deloitte — only if they ask

> Deloitte’s work is enterprise delivery, often in regulated domains. My background is healthcare APIs, so I am used to correctness, access control, and explaining trade-offs to people who are not on the repo. I want that environment at a senior scope, with stronger design ownership than I have today.

### Why a change — only if they ask

> I have been in the same product since 2022 and I have gone deep on this stack. I am looking for a senior backend role with a wider design scope and compensation that matches that level. I am not running away from the work; I want the next level of it.

### Where in five years — only if they ask

> I see myself as a senior engineer who owns a backend service: the API, the data, the on-call quality, and the growth of one or two engineers around that service. I am not aiming at a people-manager title as the next step unless the work needs it.

---

## 15. One-page card (rewrite in your own handwriting)

- Node: one JS thread, libuv for I/O, do not block the loop.
- Order: sync, `nextTick`, microtasks, timers.
- JWT: short access, rotating refresh, server-side revoke.
- Mongo: filter = index prefix; `explain`; conditional update for races; cursor pagination.
- Redis down: cache fail-open, locks fail-closed.
- Booking: `update if status == open` + unique idempotency key.
- 10s API: split the timeline before you tune.
- Intro nouns must survive a follow-up.
- No metric you cannot explain.

---

## 16. Full-coverage addendum

Sections 1–15 are the operating manual. This addendum fills every item from the original brief that was only a sketch: per-company rounds, the missing code, the thin designs, managerial and HR scripts, coding that includes sorting and TypeScript, and the roadmap that maps 1:1 to the brief.

Labels stay strict:

- **Reported** — a public 2024–2026 candidate write-up. It is one loop, not a rule.
- **Typical** — how that company usually hires in India when a Node-specific public report was not found. Do not tell an interviewer “your company always asks this.”

---

### 16.1 Every named company — six rounds

For each company the six stages you asked about are: screening, L1, L2, coding, managerial / project, system design, HR and pay. Where a company merges two of these into one meeting, that is stated.

#### Deloitte — priority

| Stage | What to expect | Label |
|---|---|---|
| Screening | Third-party or in-house recruiter. Years, relevant Node years, people you have guided, notice, current CTC, expected CTC, city, 5-day office. | Reported (Gurugram, Jan 2025, ~5 YOE Node/React) |
| L1 technical | JavaScript you can code, Express, Mongo basics, CORS, one small program (flatten, reverse, promises). | Reported (MERN write-up) |
| L2 technical | Design scenario (blogging, chat, RBAC), indexes, pagination, middleware, SQL vs NoSQL, load balancing, production logs. | Reported (same MERN write-up) |
| Coding | Short, inside L1. Not a 90-minute LeetCode hard. | Reported |
| Managerial | Situation questions: client delay, ownership, conflict. Sometimes merged with a partner / director round. | Reported |
| System design | Practical MERN-style design inside L2, not a separate Google HLD, unless the role is architect. | Reported |
| HR / pay | Location, notice, salary. Negotiation often limited once level is fixed. One non-India report added a psychometric test; do not assume India USI does this unless the recruiter says so. | Reported + one non-India report |

A Bengaluru senior engineer loop (Glassdoor, ~Apr 2026) was three technicals: project, React, solution architecture, about three weeks. Ask your recruiter which of these two shapes you are in.

#### Accenture

| Stage | What to expect | Label |
|---|---|---|
| Screening | Level (for example Level 10 Senior Analyst), notice, location, CTC. | Typical |
| L1 | Coding plus Node/React fundamentals. One 2026 report: 3 DSA problems. | Reported Apr 2026 |
| L2 | Long rapid-fire: servers, networking, design, real constraints. A separate ~3 YOE Node report had a single ~1 hour skill round after an online assessment: event loop, libuv, `nextTick`, JWT, palindrome, flatten. | Reported 2026 |
| Coding | Palindrome, flatten, plus whatever the online assessment draws. | Reported |
| Managerial | Often folded into the second interviewer if they are a lead. Client communication and Agile. | Typical |
| System design | “How would this behave under load” inside L2, not always a dedicated round. | Reported as rapid-fire design talk |
| HR / pay | Band is tied to career level. Variable pay is part of CTC. Get the level in writing. | Typical |

#### EPAM

| Stage | What to expect | Label |
|---|---|---|
| Screening | English, years, stack match, notice. | Typical |
| L1 | Deep JavaScript: promises, event loop, variables. Coding such as a `setTimeout` polyfill with a Promise (frontend loop, Feb 2026; the same trick appears for backend). | Reported |
| L2 | Tech lead. Testing, Node, AWS, CI/CD, Docker, design principles, security. A 6 YOE Node forum post listed OWASP, SOLID, logging, monitoring, profiling, HTTP/2, auth, caching, AWS. | Reported |
| Coding | Inside both technicals. They watch whether you finish. | Reported |
| Managerial | Project, your day, SDLC, sprint, what you look for in a PR. About 30 minutes in the Feb 2026 report. | Reported |
| System design | Principles and one scenario inside L2, plus AWS. | Reported |
| HR / pay | After the manager. Candidates report offer delays after “all rounds cleared”. Do not resign on a verbal. | Reported |

#### Capgemini

| Stage | What to expect | Label |
|---|---|---|
| Screening | Skill match, notice, location, CTC, sometimes a communication check. | Typical |
| L1 | JavaScript, Node event loop, Express middleware, Mongo or SQL, your project. | Typical |
| L2 | Scenario on the project: a slow API, auth, a production bug. Sometimes a client manager. | Typical |
| Coding | One easy or medium problem, often string/array, sometimes SQL. | Typical |
| Managerial | Client calls, deadlines, are you willing to support a release. | Typical |
| System design | Light: “design this API and its tables/collections.” | Typical |
| HR / pay | CTC breakup, variable, location, notice buyout. Bands are often below product companies at 5 years. Confirm the number before you invest a leave day. | Typical |

#### Cognizant

Same six-stage shape as Capgemini. **Typical.** GenC and bulk drives are not your loop; a lateral Node hire is one or two technicals plus HR. Panels vary wildly. Prepare the Deloitte technical set and you are covered. Ask whether the project is maintain-and-support or build.

#### Infosys

| Stage | What to expect | Label |
|---|---|---|
| Screening | Recruiter call, sometimes a month after the application. | Reported |
| L1 | JavaScript (promises, async/await, find vs filter, let vs const), Node architecture, sync vs async, SQL, indexes, microservices, “call 3 APIs at once” (Promise.all), a locking / transaction question. Hyderabad report, 2026. | Reported |
| L2 | Managerial: client handling. Sometimes this is the only second round. | Reported |
| Coding | One DSA or a SQL snippet inside L1. | Reported |
| Managerial | Client communication, not a second coding test. | Reported |
| System design | Microservices at a conversational level inside L1. | Reported |
| HR / pay | After the manager. Process length in one report was about 4 weeks. | Reported |

#### TCS, Wipro, HCLTech, Tech Mahindra

**Typical** for all four. No Node-specific 2026 public loop was used here.

| Stage | Pattern |
|---|---|
| Screening | Notice and CTC dominate. Many loops die here if the expectation is far above the project band. |
| L1 | Project plus JavaScript plus Node plus one database. Definitions are still asked; answer them in the senior shape from section 0 anyway. |
| L2 | A senior or the project lead. They repeat the project and add one scenario. |
| Coding | Easy to medium. Reverse a string, find duplicates, a simple SQL or Mongo filter. |
| Managerial | “Are you comfortable with shifts if the client is in the US?” “How do you handle a requirement change?” |
| System design | Rarely a full 45-minute HLD. Be ready for a 10-minute API plus schema. |
| HR / pay | Band-bound. ₹20 LPA+ happens on some digital-practice laterals and is not the default digital-badged bulk offer. Ask the band on the first call. |

#### ValueLabs

**Typical.** Smaller than TCS/Wipro, often more technical. Two technical rounds are common: JavaScript and Node in L1, design and project in L2, then manager and HR. Coding is practical (transform a payload, write an API). Prepare at the EPAM depth for Node and at the Deloitte depth for design. This is a useful Hyderabad target inside your city list.

#### LTIMindtree

**Typical.** After the LTI and Mindtree merger, loops still depend on the account. A product or cloud account asks indexes, Redis, and a small design. A maintain account stays at L1 fundamentals. Screening asks notice and CTC early. Managerial round is about client handling. HR closes salary. Treat it like Infosys plus a possible design round, and confirm the account.

#### IBM

**Typical.** Two shapes. Consulting / GBS looks like Deloitte: project, JavaScript, one scenario, manager, HR. Product or data teams add a stronger coding or SQL round and may ask cloud (OpenShift, containers). No Node-specific 2026 script was verified. Prepare both the scenario answers and one medium coding problem.

#### Oracle

**Typical.** Services and product are different companies in practice. Product and cloud teams (OCI, Fusion adjacent) lean on SQL, data structures, and “why this API”. Node roles still exist around integrations. Expect project deep-dive, one coding problem, and a hiring-manager round. System design is data-model heavy: keys, constraints, consistency. HR at the end. ₹20–30 LPA is more plausible on product/cloud laterals than on a pure services bench role.

#### Amazon

| Stage | What to expect | Label |
|---|---|---|
| Screening | Recruiter, then often an online assessment. | Reported SDE II India 2025–2026 |
| L1 / loop | The “loop” is usually 4–5 interviews, not a single L1/L2. Each has a leadership-principle story. | Reported |
| Coding | Medium, finished cleanly: trees, graphs, heaps, stacks, intervals. Examples from write-ups: LCA, time-based key-value store, asteroid collision, serialize tree, median in a stream, closest K in a BST. | Reported |
| LLD | Splitwise, filters, browser history. Requirements first, then entities, then APIs. | Reported |
| HLD | Auction, monitoring, global file distribution, or “design your current system”. | Reported |
| Managerial | There is no separate “manager round”. The bar raiser and the hiring manager test ownership with follow-ups on your story. | Reported |
| HR / pay | Recruiter, after the loop. Stock and sign-on are part of the conversation. Base alone is the wrong comparison to a service-firm CTC. | Typical for Amazon India |

#### Microsoft

**Typical**, no Node-specific 2026 loop verified here. Expect an online screen or recruiter coding check, then a loop: one or two coding rounds (medium), one low-level design, one high-level design or project deep-dive, and a hiring-manager conversation. Behavioural questions are about collaboration and ambiguity, not Amazon’s leadership-principle names. Node is relevant only if the team is a JavaScript team; the bar is still engineering, not Express trivia.

#### Google

**Typical**, no Node-specific India loop verified here. Coding is the gate: algorithms, complexity, clean code. Then design for senior-leaning levels. A pure “Node.js developer” req is uncommon. Use this loop only if a recruiter has actually scheduled it. Your MNC preparation does not replace a dedicated algorithms block for Google.

---

### 16.2 JavaScript — practical questions for every topic in the brief

Answer each in under three minutes, with the code on a blank editor.

**Execution context.** What is on the stack when `JSON.parse` throws inside a request handler? The handler frame, then `JSON.parse`. The rest of the process keeps running if you catch it. If you do not catch it and the rejection is unhandled, the process can die. Show a `try/catch` around the parse and a 400 response.

**Call stack vs event loop.** Why can `setTimeout(fn, 0)` run seconds later? The timer fires, then the callback waits until the stack is clear and microtasks are drained. A long synchronous loop blocks it. Code you must write: a `for` loop of 1e9 beside a 0 ms timer, and explain the delay without running it.

**Microtasks.** Predict the output, then change one line to swap two logs:

```js
async function run() {
  console.log(1);
  await null;
  console.log(2);
}
console.log(3);
run();
queueMicrotask(() => console.log(4));
console.log(5);
// 3, 1, 5, 2, 4
```

`await null` schedules the continuation as a microtask. `2` and `4` are both microtasks; `2` was queued first.

**Closures.** Make a function `once(fn)` that runs `fn` only the first time. The “already ran” flag lives in the closure. Say what stays in memory.

```js
function once(fn) {
  let done = false;
  let value;
  return (...args) => {
    if (done) return value;
    done = true;
    value = fn(...args);
    return value;
  };
}
```

**Lexical scope.** Why can’t an inner function see `const` from a sibling block? Scope is where the function is written, and blocks are scope boundaries. This is also why a loop variable with `let` is per iteration and `var` is not.

**Hoisting.** What does this throw, and on which line?

```js
function demo() {
  console.log(a); // undefined, var hoisted
  console.log(b); // ReferenceError, TDZ
  var a = 1;
  let b = 2;
}
```

**Promises.** Implement `mapLimit(items, limit, fn)` using the limiter in section 2, or write `Promise.all` yourself:

```js
function all(promises) {
  return new Promise((resolve, reject) => {
    const out = [];
    let left = promises.length;
    if (left === 0) return resolve([]);
    promises.forEach((p, i) => {
      Promise.resolve(p).then(
        (v) => {
          out[i] = v;
          if (--left === 0) resolve(out);
        },
        reject
      );
    });
  });
}
```

Preserve index order. Reject on the first failure. That is the senior detail.

**async/await.** Rewrite a `.then` chain that mixes a required call and two optional calls. Required failure throws. Optional failures become `null` via `allSettled`.

**Prototype.** Why do these two objects share one function?

```js
function User(name) { this.name = name; }
User.prototype.label = function () { return this.name; };
```

`label` is not copied onto each `User`. `class User` does the same. If you assign `user.label = ...` you shadow the prototype for that one object.

**`this`.** Fix a class method passed into `app.get("/me", controller.me)` so `this.service` exists. Either `app.get("/me", controller.me.bind(controller))` or an arrow field. Explain which one you use and why an arrow field is awkward to mock.

**Debounce and throttle.** Debounce is in section 2. Throttle:

```js
function throttle(fn, wait) {
  let last = 0;
  let timer = null;
  let lastArgs;
  return (...args) => {
    const now = Date.now();
    const remaining = wait - (now - last);
    lastArgs = args;
    if (remaining <= 0) {
      last = now;
      fn(...args);
    } else if (!timer) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = null;
        fn(...lastArgs);
      }, remaining);
    }
  };
}
```

Server use: throttle a metrics emit; debounce a cache rebuild.

**Memory leak.** Given an Express app that does `emitter.on("log", handler)` inside a route, what grows? One listener per request. Fix: register the listener once at startup, or use `once`, and never close over the full `req` body in a long-lived structure.

**GC.** What does V8 collect? Objects with no path from roots (stack, globals, closures that are still referenced). A cache `Map` on `global` is a root. WeakMap does not keep the key alive; use it for metadata on objects, not as a general cache.

**Shallow vs deep.** After `const b = { ...a }` and `b.address.city = "Pune"`, why did `a` change? `address` is still one object. Fix with `structuredClone` when the value is plain data. State the JSON-clone losses from section 2.

**ES6+ practical set.** Write, from memory: optional chaining on `order.patient?.name`, nullish coalescing so `0` is kept (`count ?? 10`), a `Map` counting statuses, `Object.hasOwn(obj, key)` instead of `obj.hasOwnProperty` (safer if the prototype is untrusted), and a rest collect of query flags.

---

### 16.3 Node.js — the implementations that were only named

**Worker thread** for a CPU chunk so the event loop stays free:

```js
// hash-worker.js
const { parentPort, workerData } = require("node:worker_threads");
const { createHash } = require("node:crypto");
const digest = createHash("sha256").update(workerData.payload).digest("hex");
parentPort.postMessage(digest);

// main.js
const { Worker } = require("node:worker_threads");
function sha256(payload) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./hash-worker.js", { workerData: { payload } });
    worker.once("message", resolve);
    worker.once("error", reject);
    worker.once("exit", (code) => {
      if (code !== 0) reject(new Error(`worker exited ${code}`));
    });
  });
}
```

Use this for CPU. Do not spawn a worker per HTTP request without a pool; creation is expensive. A fixed pool (for example Piscina) is the production shape.

**Child process** when you need isolation or a non-Node binary:

```js
const { fork } = require("node:child_process");
const child = fork("./report-job.js");
child.send({ from: "2026-11-01", to: "2026-11-18" });
child.on("message", (msg) => console.log(msg));
```

`fork` is a Node process with IPC. A crash in the child does not take the parent. `worker_threads` share the process; a native crash can still kill it. Say that trade-off.

**Streams.** Export without buffering the whole file:

```js
const { pipeline } = require("node:stream/promises");
const { createGzip } = require("node:zlib");
async function gzipFile(src, dest) {
  await pipeline(
    require("node:fs").createReadStream(src),
    createGzip(),
    require("node:fs").createWriteStream(dest)
  );
}
```

`pipeline` destroys all streams on error. `Buffer` is for small frames (a hash, a token), not for a patient-document export.

**Cluster.** Prefer the platform. If you must show the API:

```js
const cluster = require("node:cluster");
const os = require("node:os");
if (cluster.isPrimary) {
  for (let i = 0; i < os.availableParallelism(); i++) cluster.fork();
  cluster.on("exit", (worker) => {
    console.error("restart", worker.process.pid);
    cluster.fork();
  });
} else {
  require("./server");
}
```

In Kubernetes, set replicas and let the Service load-balance. Two schedulers (PM2 cluster plus HPA) need a reason. Sticky sessions are unnecessary if the app is stateless; JWT and Redis are how you stay stateless.

**Graceful shutdown**, which panels ask after clustering:

```js
const server = app.listen(3000);
function shutdown() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on("SIGTERM", shutdown);
```

`server.close` stops new connections and waits for in-flight ones. Close the Mongo client and Redis after that. Kubernetes sends SIGTERM, then SIGKILL after `terminationGracePeriodSeconds`.

**Backpressure.** If a client is slow, a stream that ignores the return value of `write()` grows memory. `pipeline` handles this. For a queue, a bounded channel plus `429` or delayed ack is the same idea: the producer must slow down.

**Connection pools.** The Mongo driver pools sockets (default pool is enough until metrics say otherwise). Do not open `MongoClient` per request. HTTP keep-alive via undici/agent avoids a TCP handshake per downstream call. A pool that is too small queues requests and looks like a slow API. Check pool wait time before you add indexes.

**Production debugging checklist**

1. One request id from the edge.
2. Latency split: queueing, handler, Mongo, Redis, gRPC.
3. Event-loop lag and active handles (`process._getActiveHandles` only as a last resort; prefer `monitorEventLoopDelay`).
4. Heap and RSS versus a deploy or a traffic change.
5. Recent config, dependency, and index changes.
6. Fix, then watch the same graph. A restart that “fixes” it for an hour is a leak or a pool, not a solution.

---

### 16.4 TypeScript and Express — code for every bullet

**interface vs type**

```ts
interface Appointment {
  id: string;
  slotId: string;
  status: "booked" | "cancelled" | "completed";
}
type Failure =
  | { kind: "validation"; field: string }
  | { kind: "conflict"; slotId: string };
```

Extend an `interface` when a module adds fields. Use a `type` union when the value is one of several shapes.

**Generics.** A typed repository boundary:

```ts
interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  insert(row: Omit<T, "id"> & { id?: string }): Promise<T>;
}
```

**Utility types.** `Partial<Appointment>` for a patch is dangerous if it allows `id` to change. Prefer:

```ts
interface Appointment { id: string; status: "booked" | "cancelled" | "completed" }
type PatchAppointment = Partial<Pick<Appointment, "status">> & { id: string };
```

**Discriminated narrowing**

```ts
type Failure =
  | { kind: "validation"; field: string }
  | { kind: "conflict"; slotId: string };
function toHttp(f: Failure): number {
  switch (f.kind) {
    case "validation":
      return 400;
    case "conflict":
      return 409;
    default: {
      const _exhaustive: never = f;
      return _exhaustive;
    }
  }
}
```

If you add a union member and the switch is not exhaustive, turn on `strict` and a `never` default so the build fails.

**Decorators.** You do not need them for Express. If a panel insists, this is the idea: a decorator wraps a method. Nest uses that for routing. In this codebase the equivalent is a middleware function. Say that plainly if you have not shipped decorators.

**Typed middleware and validation**

```ts
class AppError extends Error {
  constructor(readonly status: number, readonly code: string, message: string) { super(message); }
}
type NextFunction = (err?: unknown) => void;
interface Request { header(name: string): string | undefined }
interface Response { status(code: number): Response }
type Authed = { userId: string; facilityId: string };
declare function verifyAccess(token: string): Authed;

function requireUser(req: Request, res: Response, next: NextFunction) {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) {
    next(new AppError(401, "UNAUTHENTICATED", "Missing token"));
    return;
  }
  const user = verifyAccess(header.slice(7));
  (req as Request & { user: Authed }).user = user;
  next();
}
```

Better than a cast scattered everywhere: one `AuthedRequest` interface and a type guard. Validation stays in Zod at the edge so the service receives `CreateAppointmentInput`, not `unknown`.

**Scalable Express design**

- One module per business capability, as in section 4.
- Timeouts on every outbound call.
- Idempotency on every unsafe POST that creates money or a booking.
- Config from the environment, validated at boot. Fail boot if Mongo URL is missing.
- Health: `/healthz` is process up; `/readyz` checks Mongo and, if you choose, Redis. Readiness must fail when the process should leave the load balancer.
- Tests: one service test with a fake repository, one HTTP test for auth and validation. You do not need 100% coverage to discuss this honestly.

---

### 16.5 MongoDB — transaction, troubleshooting, second aggregation

**Transaction** around slot plus appointment:

```js
const session = client.startSession();
try {
  await session.withTransaction(async () => {
    const slot = await slots.findOneAndUpdate(
      { _id: slotId, status: "open" },
      { $set: { status: "booked" } },
      { session, returnDocument: "after" }
    );
    if (!slot) throw new AppError(409, "SLOT_TAKEN", "Slot is no longer available");
    await appointments.insertOne(
      { slotId, patientId, idempotencyKey, status: "confirmed" },
      { session }
    );
  });
} finally {
  await session.endSession();
}
```

Retry only transient transaction errors (`UnknownTransactionCommitResult`, `TransientTransactionError`), and only if the idempotency key makes a second attempt safe.

**Troubleshooting order when a query is slow**

1. `explain("executionStats")` on the exact filter, sort, and limit.
2. `COLLSCAN` or `totalDocsExamined` much larger than `nReturned` → index.
3. In-memory sort (`SORT` stage with a high limit) → the index must include the sort fields.
4. `$lookup` without an index on the foreign field → index that field.
5. Working set larger than RAM → smaller projection, or a summary collection, or more RAM. Sharding is the later step.
6. Write concern and a far secondary → you are waiting on replication, not on the query.
7. Lock or a transaction held open → check current ops, not the index.

**Aggregation — daily schedule with doctor name and a facet for totals**

```js
db.appointments.aggregate([
  { $match: {
      facilityId: "fac_1",
      start: { $gte: ISODate("2026-11-18T00:00:00+05:30"), $lt: ISODate("2026-11-19T00:00:00+05:30") },
  }},
  { $lookup: {
      from: "doctors",
      localField: "doctorId",
      foreignField: "_id",
      pipeline: [{ $project: { name: 1 } }],
      as: "doctor",
  }},
  { $unwind: { path: "$doctor", preserveNullAndEmptyArrays: true } },
  { $facet: {
      rows: [
        { $project: { _id: 0, start: 1, status: 1, doctorName: "$doctor.name" } },
        { $sort: { start: 1 } },
        { $limit: 100 },
      ],
      counts: [
        { $group: { _id: "$status", n: { $sum: 1 } } },
      ],
  }},
]);
```

`$lookup` with a sub-pipeline avoids dragging every doctor field. `$facet` runs two pipelines on the same matched set. It does not use indexes inside later branches as cleanly as a simple find; for a hot dashboard, pre-aggregate counts instead of faceting the raw collection all day.

**Large data.** Batch with a range on `_id` or `start`, stream the cursor, write to object storage, and do not `toArray()` a month of appointments in the API process.

**Replication lag.** A read-your-writes bug: the user books on the primary and the next GET uses a secondary that has not caught up. Fix: read that user’s fresh write from the primary, or include the write in the POST response so the client does not need an immediate GET.

**Shard key conversation.** Only if they push. A hashed `facilityId` spreads load across tenants and makes a single-facility query a targeted or a scatter depending on whether `facilityId` is the prefix. Say you would measure cardinality before choosing. Do not claim you have operated a sharded cluster unless you have.

---

### 16.6 Redis, microservices, gRPC — the missing artifacts

**Protobuf**

```proto
syntax = "proto3";
package scheduling.v1;

service SlotService {
  rpc HoldSlot (HoldSlotRequest) returns (HoldSlotResponse);
}

message HoldSlotRequest {
  string slot_id = 1;
  string patient_id = 2;
  string idempotency_key = 3;
}
message HoldSlotResponse {
  string appointment_id = 1;
  string status = 2;
}
```

Field numbers are the contract. You do not renumber them. Adding a field is compatible. Removing or changing a type is not.

**Deadline.** The gateway sets a deadline. Each hop subtracts time already spent. When the deadline is gone, return `DEADLINE_EXCEEDED` and do not start a Mongo write you cannot finish.

**Circuit breaker**

```js
function createBreaker({ failureThreshold = 5, resetMs = 10_000 } = {}) {
  let failures = 0;
  let openedAt = 0;
  return async function call(fn) {
    if (openedAt && Date.now() - openedAt < resetMs) {
      throw new AppError(503, "CIRCUIT_OPEN", "Downstream unavailable");
    }
    try {
      const result = await fn();
      failures = 0;
      openedAt = 0;
      return result;
    } catch (err) {
      failures++;
      if (failures >= failureThreshold) openedAt = Date.now();
      throw err;
    }
  };
}
```

This is the idea, per process. With many pods, each pod opens on its own view of the errors, which is usually what you want. A shared breaker in Redis is extra coordination; mention it only as a follow-up.

**Retry** sits inside the closed circuit, with backoff and jitter, and only for idempotent RPCs. The booking RPC is idempotent only because of `idempotency_key`.

**Service discovery.** Kubernetes DNS: `slot-service.default.svc.cluster.local`. You do not hardcode pod IPs. Consul or a cloud registry is an alternative when you are not on Kubernetes. Say which one you have actually used.

**Distributed tracing.** Generate `traceId` at the gateway. Put it on the log line, on the HTTP header `traceparent` (W3C), and on gRPC metadata. Mongo logs should include the same id if the driver command monitoring is on. Then a 10-second request is one search, not a meeting.

**Sync vs async.** Booking confirmation to the patient is synchronous: the API returns booked or taken. Email and audit are asynchronous: an outbox row committed with the appointment, a worker publishes it. If the worker is down, the booking still exists and the message waits.

**Saga.** When payment and booking are two services, a Mongo transaction cannot span them. The saga is: book (pending) → charge → mark confirmed, or cancel the hold if the charge fails. Each step is idempotent. Compensating action is “release hold”, not “delete history”.

**Distributed cache design** (full treatment for the brief)

- Source of truth: Mongo.
- Shared cache: Redis, cache-aside, TTL plus delete-on-write.
- Optional process-local LRU (section 9, C4) for a tiny hot set. It can be stale for the TTL of that process; do not use it for slot availability.
- Invalidation: the writer deletes `doctor:{id}` after a successful update. A second key, `doctor:{id}:version`, is unnecessary until you have a stampede measurement.
- Eviction: `volatile-ttl` if locks live in the same Redis; otherwise a separate Redis for locks with no eviction.
- Faults: cache miss and Redis outage both read Mongo. Lock outage returns 503.
- Scale: Redis Cluster when one node’s memory or CPU is the ceiling. Hash tags keep a lock and its value on the same slot if you use a multi-key script.
- Trade-off: more cache layers, more stale reads. Measure hit rate before adding the local LRU.

---

### 16.7 System designs that were too short

Each one below has the six things the brief asked for: architecture, schema, API, scale, faults, trade-offs. Appointment booking in section 7.1 stays the reference write-path.

#### Healthcare application backend

**Architecture.** Clients (web, hospital desk) → API gateway (auth, rate limit, request id) → modular Node service: identity, patients, scheduling, documents, notifications. Mongo for records. Redis for sessions/cache/locks. Object storage for files, with only a key in Mongo. An async worker for notifications. Audit log append-only.

**Schema.**

```txt
patients:      { _id, orgId, mrn, name, dob, status }
encounters:    { _id, orgId, patientId, facilityId, openedAt, status }
appointments:  as in section 7.1, always with orgId
audit:         { _id, orgId, actorId, action, resourceId, at }
index:         { orgId: 1, mrn: 1 } unique
index:         { orgId: 1, patientId: 1, openedAt: -1 }
```

**API.** `GET /v1/patients/:id` returns demographics the caller’s role allows. `POST /v1/appointments` as in 7.1. Every query includes `orgId` from the token, never from the body.

**Scale.** Read-heavy chart opens: cache demographics, not clinical notes, until you know the product allows it. Writes stay on the primary.

**Faults.** Notification failure does not roll back the booking (outbox). A downstream eligibility gRPC timeout fails the eligibility call and leaves scheduling up.

**Trade-off.** A modular monolith is the right call until a team needs to deploy notifications alone. Splitting earlier adds network failures you then have to explain in the interview.

#### URL shortener

**Architecture.** API → Redis (hot codes) → Mongo (source of truth). Redirect is the hot path.

**Schema.** `{ _id: code, url, ownerId, createdAt, expiresAt }`, unique `_id`. Optional `clicks` updated asynchronously so the redirect does not wait on a write.

**API.** `POST /v1/links { url }` → `{ code }`. `GET /:code` → 302 Location. 404 if missing or expired.

**Scale.** Generate a random 7-character base62 code and retry on duplicate. Cache `code → url` in Redis. 302 so you can count; 301 if the browser may skip you next time.

**Faults.** Redis down: read Mongo. Mongo down: serve from Redis only if you accept that expired codes might still redirect until TTL.

**Trade-off.** Counting every click on the redirect path adds a write to the hottest endpoint. Queue the click.

#### Notification service

**Architecture.** Producers write an outbox. A publisher worker reads the outbox and publishes to a queue (or Redis Stream). Channel workers (email, SMS, push) consume, check preferences, send, store status.

**Schema.**

```txt
notifications: { _id, idempotencyKey, userId, channel, template, payload, status, attempts }
unique: idempotencyKey
preferences:   { userId, email: bool, sms: bool }
```

**API.** `POST /v1/notifications` accepts the message and returns `202 { id }` after the outbox insert. It does not wait for the vendor.

**Scale.** Consumers scale horizontally. Use a leasing status `sending` with a timeout so a crashed worker’s message is retried.

**Faults.** Vendor 429: backoff. Vendor 400: mark failed, do not retry forever. Poison message after N attempts goes to a dead-letter collection.

**Trade-off.** At-least-once delivery means the vendor can receive two sends if you crash after send and before status update. Put the same idempotency key on the vendor API when the vendor supports it.

#### Rate limiter

**Architecture.** Middleware in each API pod, counters in Redis, so the limit is global.

**Schema.** Redis key `rl:{subject}:{route}:{window}` → count, TTL = window. Subject is user id, else API key, else IP.

**API.** No public API. Behaviour: allow, or `429` with `Retry-After`.

**Scale.** `INCR` is O(1). For a sliding window, a sorted set of timestamps is more accurate and costs more memory. Token bucket (one Lua script) allows a burst.

**Faults.** Redis timeout: fail open on read APIs, fail closed on login and booking. Document the choice.

**Trade-off.** Per-IP limits punish a hospital NAT. Authenticated limits are the real control.

#### E-commerce backend

**Architecture.** Catalog service (read-heavy, cacheable), cart (Redis), checkout (order + stock + payment), notification worker.

**Schema.**

```txt
products:  { _id, sku, price, stock }
           index { sku: 1 } unique
carts:     Redis hash, TTL 7 days
orders:    { _id, userId, items, status, idempotencyKey, paymentRef }
           unique idempotencyKey
```

**API.** `POST /v1/checkout` with `Idempotency-Key`. Steps: validate cart, conditional stock decrement, insert order `pending_payment`, charge, mark `paid` or compensate stock.

**Scale.** Catalog reads from Redis. Checkout writes to the primary. Do not cache stock as the authority.

**Faults.** Payment timeout: order stays `pending_payment` and a reconciler asks the provider. Never mark paid from the browser return URL.

**Trade-off.** Decrementing stock before payment holds inventory and can lock it if the reconciler is slow. Decrementing after payment can oversell. For a senior answer, pick “reserve then confirm” and say how the hold expires.

#### Payment processing

**Architecture.** Your API, a payments collection, the provider, a signed webhook, a reconciler.

**Schema.**

```txt
payments: { _id, idempotencyKey, orderId, amount, currency, status, providerRef }
          unique idempotencyKey
          unique providerRef
events:   { _id: providerEventId, paymentId, type, at }
```

**API.** `POST /v1/payments` creates or replays. `POST /v1/payments/webhook` verifies the signature, inserts `providerEventId` (duplicate → 200 and stop), then updates status.

**Scale.** Webhooks must be fast: verify, persist, ack, process async if the update is heavy.

**Faults.** Duplicate webhook is normal. Out-of-order webhooks: ignore a `pending` event that arrives after `paid` (state machine, not last-write-wins).

**Trade-off.** You store money movement; you do not implement card processing yourself.

#### Distributed caching

Use the design in section 16.6. In a 25-minute round, draw three boxes (client, Redis, Mongo), walk one read and one write, then spend the remaining time on eviction, stampede, and Redis down.

---

### 16.8 Scenarios from the brief — depth check

These eight are the brief. The core answer is in section 8. Add this sentence so the answer is senior, not a list.

| Scenario | Extra line that changes the score |
|---|---|
| 10-second API | Quote a split: “4.5s was `docsExamined`, 5s was a downstream with no timeout.” Use your real split if you have one. |
| Slow aggregation | Put `$match` first and show the index. Offer a summary collection if the same pipeline runs all day. |
| Redis down | Cache fail-open, lock fail-closed. Say which keys in your app are which. |
| Concurrent updates | Conditional update or a transaction. Mention the unique index so a retry cannot insert a second booking. |
| Millions of requests | Define the unit. Then stateless pods, pool limits, Redis, queue, 429. The database fails before Node’s “single thread” slogan becomes the issue. |
| Duplicate transactions | Unique idempotency key, same key at the provider, unique webhook event id. |
| JS to TypeScript | `allowJs`, type the boundaries, strict per folder, no big-bang rewrite. |
| Memory leak | Two heap snapshots, retainer path, fix, metric. A periodic restart is a bridge. |

---

### 16.9 Coding — sorting, searching, strings, TypeScript

C1–C6 stay in section 9. These continue from medium to senior.

**C7. Palindrome (reported at Accenture).** Two pointers, O(n) time, O(1) extra space. Skip nothing unless they ask for ignoring case.

```js
function isPalindrome(s) {
  let lo = 0;
  let hi = s.length - 1;
  while (lo < hi) {
    if (s[lo] !== s[hi]) return false;
    lo++;
    hi--;
  }
  return true;
}
```

**C8. Overlapping appointments (sort + scan).**

```js
function overlaps(slots) {
  const sorted = [...slots].sort((a, b) => a.start.localeCompare(b.start));
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].start < sorted[i - 1].end) return true;
  }
  return false;
}
```

Sorting is O(n log n). The scan is O(n). This is the coding version of the booking problem.

**C9. Binary search — first slot at or after a time.**

```js
function firstAtOrAfter(slots, isoTime) {
  let lo = 0;
  let hi = slots.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (slots[mid].start < isoTime) lo = mid + 1;
    else hi = mid;
  }
  return lo === slots.length ? -1 : lo;
}
```

The array must already be sorted. Say that. If it is not, sort first or use the Mongo index instead of doing this in Node.

**C10. First non-repeating character.** One pass to count with a `Map`, second pass to return the first character whose count is 1. O(n) time, O(1) extra space for a fixed alphabet, O(k) for arbitrary characters.

```js
function firstUnique(s) {
  const count = new Map();
  for (const ch of s) count.set(ch, (count.get(ch) ?? 0) + 1);
  for (const ch of s) if (count.get(ch) === 1) return ch;
  return null;
}
```

**C11. TypeScript — exhaustive status transition.**

```ts
class AppError extends Error {
  constructor(readonly status: number, readonly code: string, message: string) { super(message); }
}
type Status = "open" | "booked" | "cancelled";
const allowed: Record<Status, Status[]> = {
  open: ["booked"],
  booked: ["cancelled"],
  cancelled: [],
};
function assertTransition(from: Status, to: Status) {
  if (!allowed[from].includes(to)) {
    throw new AppError(409, "BAD_TRANSITION", `${from} -> ${to}`);
  }
}
```

**C12. Node API.** Extend C5 with: Zod parse, idempotency header, `201` vs `200` on replay, errors through `next`. Talk for two minutes, then type.

Practice order: C7, C1, C10 (strings and arrays) → C2, C8 (objects, sort) → C9 (search) → C3, the `all` implementation (promises) → C5, C11, C12 (API and types) → C4, C6 (senior).

---

### 16.10 Project and managerial round — scripts

These are answer shapes for a scheduling service used as a practice case. They are not your Maren achievements. In the interview, keep the shape and replace every concrete bug with something you did. If you have not done that thing, say how you would handle it and stop.

**Architecture.** Draw four boxes and stop. Name the database and the cache. Say what you do not run (for example “I have not operated the Kubernetes cluster”).

**Your role.** “I own [module]. I write the handlers and the queries, I review PRs on this service, and I take the production questions on this module. I do not own [billing / mobile / infra].”

**Technical challenge.** Situation, your action, result you can stand behind.

**Production issue.** Alert or ticket, the first query or log you opened, the cause, the change, what you added so it pages earlier next time.

**Performance.** One index or one removed sequential `await`. If you have no before/after number, describe the `explain()` change from `COLLSCAN` to `IXSCAN`. That is a real result.

**Database decision.** “We filter by facility, doctor, and day, so the index starts with those equality fields and then `start`. We did not embed appointments inside the doctor document because the array would grow without a bound.”

**Code review.** “I look for missing auth on the resource id, a query with no index, a swallowed error, and a test that only covers the happy path. Last review I asked for [real comment].”

**Collaboration.** “I disagreed with hiding a failed notification inside the booking response. We split it: the booking commits, the notification goes to the outbox, and the UI does not show a false error. I wrote the note in the ticket so the next person sees why.”

**Tight deadline.** “I cut the export filters and shipped the booking path with the conditional update and the unique key. I did not cut auth or the index. I said what would land the following week.”

**Ownership.** “A bug in a function I did not write was still my module. I patched it, added a regression test, and told the author what I found. I did not wait to be assigned.”

**Conflict with a senior.** “They wanted a read-then-write. I showed two parallel requests both passing the read. We shipped `findOneAndUpdate` with a status filter. The point was the race, not who won the argument.”

**Ambiguous requirement.** “I wrote the three cases I assumed — double submit, slot taken, Redis down — and asked the product owner to confirm those three lines before I built the fourth feature.”

**Why leave, why hire, strength, weakness, five years.** Section 10 and section 14. Memorise your real weakness, not a humble-brag.

---

### 16.11 HR and salary — full scripts

**Market.** Section 12. Repeat only this: ₹20–25 LPA is a coherent senior ask at Deloitte-class, EPAM, Accenture specialist, IBM, Oracle product, and GCCs when the interview is strong. ₹30 LPA+ is product, stock-inclusive, or a top specialist band. Bulk TCS/Infosys/Wipro/HCL/TechM offers at 5 years are often under ₹20 LPA. Ask the band first.

**When they ask current CTC.** Answer with fixed, variable, and bonus separately. “My fixed is A, variable is B, last year’s payout was C.” Do not inflate. They ask for slips later.

**Expected CTC.** “For a senior backend scope I am looking at X to Y fixed. I am open if the level is right. Which band is this role?” X is about 30% above your fixed if you are moving for scope, not 3× , unless you are leaving a very low base and the company is a product firm.

**If they push one number.** Give the top of your honest range, then stop talking.

**Notice.** “My contract says N days. I [can / cannot] buy out. I will not resign until I have a written offer.” If you do not know N, find it before the recruiter screen. It is the first question.

**Other offers.** “I am in process with other teams. I do not use a fake offer. If I have a deadline, I will tell you the date.”

**Why Deloitte / why this company.** Section 14. Add one real reason after you read the job description: the domain, the stack, or the kind of clients. A generic “best company” line is easy to ignore.

**Shifts.** If you can do US-overlap hours, say the window you can actually do. If you cannot, say so in screening. Do not discover this at HR.

**Counter-offer.** Decide now. A clean answer: “I am leaving for scope and level. I would not stay for a match on pay alone.” Use it only if that is true.

**Strengths.** Production debugging, API correctness, explaining a trade-off.

**Weakness.** The time-box example in section 10, unless you have a better real one.

**Five years.** Own a service. Mentor. Not a director title as a slogan.

---

### 16.12 Advanced topics that move a 5-year loop from “pass” to “senior”

Prepare these after the core, in this order. They are the follow-ups at EPAM, product companies, and a strict Deloitte L2.

1. Idempotency and the outbox pattern.
2. Conditional updates versus multi-document transactions.
3. Timeouts, retries, jitter, circuit breakers.
4. Pool sizing, event-loop lag, graceful shutdown.
5. Object-level authorization (the caller’s id must match the resource’s org).
6. Mongo `explain`, ESR indexes, cursor pagination.
7. Redis eviction versus locks.
8. gRPC deadlines and compatible protobuf changes.
9. Tracing with one id across HTTP and gRPC.
10. Testing the race and the replay, not only the happy path.
11. API versioning and backward-compatible changes.
12. Containers at a conversational level: one process per container, readiness versus liveness, SIGTERM. Go deeper on Kubernetes only if the job description says so.

You do not need to pretend you built all of these. “I have used 1–6 in production; I have practised 7–12” is a senior sentence when it is true. Adjust the split to your real work.

---

### 16.13 Company mock banks

Use these when a live mock starts. One question at a time still applies.

Ask these as spoken scenarios. A topic name is not a question.

**Deloitte**

1. Tell me about yourself and what you do at Maren Solutions.
2. Walk me through one request on your service, from the route to the database. What do you personally own on that path?
3. Two receptionists book the last slot at the same time. What does the database do, and what does the API return to each of them?
4. A client says the appointment API sometimes takes about 10 seconds. What do you check first, and what do you refuse to change before you have evidence?
5. What does this log order print, and why: sync logs, `nextTick`, a resolved promise, `setTimeout(0)`?
6. Which Mongo index serves “one doctor, one facility, one day”, and how do you prove it?
7. Write a function that flattens a nested array. Then say what you would do if the array can be deeply nested and large.
8. The client wants the feature on Friday. The new query has not been explained, and auth on the resource id is still a TODO. What do you ship?
9. Why Deloitte, what is your notice period, and what fixed CTC are you expecting?

**EPAM**

1. Your handler hashes a large file on the request path and the event loop lag goes up. Worker thread, child process, or a queue? Pick one and say what breaks with the other two.
2. Redis holds both a doctor cache and a slot lock. Which eviction policy do you set, and what does the API do when Redis is unreachable for each of those keys?
3. A reviewer sends a PR that logs the full patient payload and catches errors with an empty `catch`. What do you comment, and what do you block?
4. Design the retry around a gRPC call that creates a record. When is a retry safe?

**Accenture**

1. Why do we use Node for an I/O-heavy API, and which work must not run on that thread?
2. Write a palindrome check, then flatten `[1, [2, [3]]]`.
3. Explain access token, refresh token, and logout. What still works after logout if you only delete the token on the client?
4. Three downstreams, one of them slow. How do you stop a 10-second tail?

**Infosys**

1. Call three APIs together. One of them fails. What does the user see, and which Promise API did you choose?
2. Where does auth middleware sit relative to validation and the error handler?
3. Write the Mongo filter and the index for “patients of this facility whose status is active”.
4. A client changes the requirement the day before the demo. What do you say on the call?

**Amazon-style, only if a loop is scheduled**

1. Given sorted appointment intervals, detect whether any two overlap. State complexity before you code.
2. Design the booking write path. Start with requirements and the failure you will not allow. Stop when they interrupt.
3. Tell me about a decision you owned. What did you measure, and what still failed?

**Product generic**

Design appointment booking for 25 minutes using section 7.1. When they interrupt with “what if Redis dies?” or “how do you paginate the calendar?”, answer that, then return to the conditional update.

---

### 16.14 Roadmap mapped to the original brief

Each original section is now in this file. The live mock is a practice session, not a chapter you can “finish” by reading.

| Original section | Where it is | Status after this addendum |
|---|---|---|
| 1 Profile | Header, section 10, section 14 | Addressed. No facts were added beyond what you supplied. |
| 2 Company rounds | Section 1 and 16.1 | Addressed for all 17 companies. Reported and typical are labeled. Several companies have no public Node loop; those rows are typical on purpose. |
| 3 JavaScript | Section 2 and 16.2 | Addressed, including throttle, `Promise.all`, `once`, and a question per topic. |
| 4 Node.js | Section 3 and 16.3 | Addressed, including worker, child process, streams, cluster, shutdown, pools. |
| 5 TypeScript and Express | Section 4 and 16.4 | Addressed, including generics, utility types, narrowing, middleware, validation, errors, layout. |
| 6 MongoDB | Section 5 and 16.5 | Addressed, including a second aggregation, transactions, troubleshooting, large scans. |
| 7 Redis, microservices, gRPC | Section 6 and 16.6 | Addressed, including protobuf, breaker, discovery, tracing, saga, distributed cache. |
| 8 System design | Section 7 and 16.7 | Addressed for all eight systems, with schema, API, scale, faults, and trade-offs. |
| 9 Scenarios | Section 8 and 16.8 | Addressed for all eight prompts. |
| 10 Coding | Section 9 and 16.9 | Addressed across JS, TS, Node, Mongo, including sort and binary search. |
| 11 Project and managerial | Section 10 and 16.10 | Addressed as scripts. Your real module, bug, and index still have to be filled by you. |
| 12 Interview simulation | Section 11 and 16.13 | Method and company banks are addressed. A full scored mock is not done until you answer and we iterate. |
| 13 Salary and HR | Section 12 and 16.11 | Addressed. Your current CTC is still unknown, so the script uses X and Y on purpose. |
| 14 Daily plan | Section 13 and the 21-day plan below | Addressed. |
| 15 Self-introduction and the ten follow-up questions | Section 14 and section 10 | Addressed. Brackets stay empty until you fill them with real work. |

#### 21-day plan

About 2 hours on a workday, 4 hours on each weekend day. Days 1–14 in section 13 still stand. This schedule names the addendum so nothing in the brief is “later”.

| Day | Work | Done when |
|---|---|---|
| 1 | Write the six project lines in section 10. Speak the 1-minute intro. | You can survive “which index?” |
| 2 | Section 16.2 event loop, microtasks, closures, TDZ. | You predict the `async` log order on a blank page. |
| 3 | `this`, prototype, debounce, throttle, leak. | Throttle and `once` from memory. |
| 4 | Section 16.3 worker, child, stream, cluster, SIGTERM. | You can say when not to use a worker. |
| 5 | Section 16.4 TypeScript plus Express error middleware. | C11 and C12. |
| 6 | Mongo indexes, explain, pagination. | ESR stated in one sentence. |
| 7 | Transaction code and the facet aggregation. | You refuse `$lookup` before `$match`. |
| 8 | Redis policy, protobuf, breaker, tracing. | Cache fail-open, lock fail-closed, said out loud. |
| 9 | Appointment design, 25 minutes, no notes. | Conditional update and idempotency key. |
| 10 | Healthcare, notifications, rate limiter. | One trade-off each. |
| 11 | URL shortener, e-commerce, payments, distributed cache. | Webhook idempotency without notes. |
| 12 | Scenarios in section 8, timed at 4 minutes each. | You start from measurement, not from a definition. |
| 13 | C7, C8, C9, C10 timed. | Complexity stated before code. |
| 14 | C1–C6 cleanup. | No syntax hunting. |
| 15 | Deloitte mock bank, spoken. | Intro plus project plus one code. |
| 16 | EPAM mock bank, spoken. | Security and shutdown included. |
| 17 | Managerial scripts with your real stories only. | Six lines filled, zero invented numbers. |
| 18 | HR and salary script with your real CTC and notice. | One number range you will actually say. |
| 19 | Weak topic from the mocks only. | That topic re-answered at a higher score. |
| 20 | Full Deloitte dry run, 45 minutes. | One sitting, no notes. |
| 21 | Handwritten one-page card, section 15. | You can redraw it from memory. |

If a product loop is scheduled, replace days 13–14 with one medium algorithm a day (hash map, two pointers, intervals, heap, BFS, binary search) and keep day 9’s design.

---

### 16.15 What is still yours, not the file’s

- The real module name, the real bug, the real index, the real team boundary.
- Current CTC, variable pay, and notice period.
- Whether you have actually used gRPC, Kubernetes, or transactions in production. The intro must match that answer.

A mock score cannot be given for those until you say them.

---

### 16.16 Quality pass — topics that were easy to miss

**`unknown` versus `any`.** `any` turns type-checking off. `unknown` forces a check before use. Request bodies and JSON from other services should be `unknown` until Zod parses them.

**Abort and timeouts.** A 10-second API often has no deadline. Pass `AbortSignal.timeout(1500)` (Node 18+) into `fetch` and into the Mongo driver where the driver accepts a signal or `maxTimeMS`. When the caller disconnects, stop the work. A retry without a deadline multiplies the 10 seconds.

**Read and write concern.** Write concern `majority` means the write is on a majority of replica-set members before the driver returns. That is slower and safer for a booking. Read concern `majority` avoids reading a write that can still roll back. A secondary read can still be stale. Say this if they ask “why did the user not see the booking they just made?”

**N+1.** Loading 50 appointments and then querying the doctor inside a loop is 51 round trips. Fix it with one `$lookup` after `$match`, or one `find({ _id: { $in: ids } })`. Caching each doctor is the second step, not the first.

**Covered query.** If the index contains every field the query returns, Mongo can answer from the index alone (`totalDocsExamined` stays low and the fetch stage disappears). Projection has to match. This is the follow-up after “I added an index.”
