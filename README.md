# Node.js interview preparation — 2026

Notes for **B. Pradeep Chandu**, a backend developer with about 5 years of experience, preparing for senior Node.js interviews at Deloitte and other MNCs.

**Versions these notes assume**

| Runtime | What to say in an interview |
|---|---|
| Node.js 22 or newer | `process.nextTick` runs before promise microtasks. `AbortSignal.timeout` exists. |
| Node.js 24 LTS | The current LTS named in the long guide: V8 13.6, Undici 7, permission model. |
| ECMAScript 2026 | `Array.fromAsync`, `Math.sumPrecise`, `Error.isError`, `Map.getOrInsert`. |
| MongoDB 8.x | Aggregation and index behaviour in the long guide. 8.3 is the release called out in Part VI. |

If a panel is on Node 18, `nextTick`-before-promises and the libuv phases are still the right model. Do not depend on an ES2026 method unless you know the runtime.

## Which file does what

Read one file for one job. The same idea may appear twice. The job of each copy is different.

| File | Job | When you open it |
|---|---|---|
| [senior-nodejs-mnc-playbook-2026.md](./senior-nodejs-mnc-playbook-2026.md) | Companies, how to speak, eight designs, eight production scenarios, coding set, introductions, HR, salary, 21-day plan, mock rules | Every study day, and the night before a Deloitte round |
| [interview-prep-2026.md](./interview-prep-2026.md) | 445 numbered questions. 1–400 have a follow-up pair with answers. 401–445 are the senior TypeScript set. JavaScript 1–79, Node 80–157, MongoDB 158–225, design 226–240, TypeScript 241–250 and 401–445 | When a playbook topic needs the full explanation |
| [interview-tricky-qsns-2026.md](./interview-tricky-qsns-2026.md) | Output prediction and traps. Q36–Q45 are the event-loop drills | After you think you know the order |
| [brief-topics-flowcharts-2026.md](./brief-topics-flowcharts-2026.md) | 82 short topics and diagrams for the evening before | Revision, not first learning |
| [basics-js-node-flowcharts-2026.md](./basics-js-node-flowcharts-2026.md) | 21 flowcharts to redraw from a blank page. Topics 1–2 are the browser loop. Topic 12 is Node | When you need to draw, not recite |
| [mock/db.json](./mock/db.json) | Sample healthcare JSON (doctors, slots, appointments) for a practice API | When you want realistic payloads for an Express or aggregation exercise |
| [mock/routes.json](./mock/routes.json) | json-server rewrites from `/api/v1/...` onto those collections | Keep it matched to `db.json`. It is not an interview score file |

TypeScript examples are checked with TypeScript 5.7: `npm run check:ts`. That script reads the fenced examples. It does not score a mock interview.

`mock/` is not a question bank and it does not score answers. Changing a route without checking the collection name breaks the practice API. The collections used by `routes.json` (`availabilitySummary`, `availability`, `reviews`, `doctorServices`, `doctorGallery`, `doctors`, `searchSuggestions`, `cities`, `insuranceProviders`, `paymentMethods`) are present in `db.json`.

## Study order for Deloitte and similar MNC loops

1. Playbook sections 14 and 10. Speak the safe introduction. Fill your real module, index, and production issue before you use the longer version.
2. Playbook section 1 and 16.1. Know which rounds are **reported** and which are **typical**.
3. Redraw basics topics 1, 12, and 21. Then answer interview-prep Q9, Q10, and Q150 without looking.
4. Tricky Q36, Q42, and Q43. If the order surprises you, stop and reread Q150.
5. Interview-prep Node (80–157), MongoDB (158–225), TypeScript (241–250 and 401–445), Redis (311–315), gRPC (365).
6. Playbook designs and the eight scenarios. Use interview-prep 226–240 when you want a second wording, not a second memorised script.
7. Playbook coding C1–C12, timed.
8. HR and salary only after the technical story is honest. Your CTC and notice period are still yours to write in.

Product loops (Amazon, Microsoft, Google) add a timed algorithms block. The playbook says when to switch. The MNC files do not replace that block.

## How to use a question

- Cover the answer. Speak for two minutes: what it does, what breaks in production, what you would check.
- Then read the written answer and note the gap.
- A question is not “done” because the file contains an answer. It is done when you can say it without the file and survive a follow-up.
- Skip fresher definitions once you can answer the follow-up. Q1–Q8 in the long guide are the short versions of topics you must still be able to draw.

## Mock interviews

Say which company and which round. The interviewer asks one question, waits, scores it out of 10, explains the gap, gives a better answer, and asks a follow-up from your words.

The playbook section 11 is the rule set. Section 16.13 is the Deloitte, EPAM, Accenture, and Infosys question list.

Track this separately from “the file contains the topic”:

| Round | Last score | Weak point | Next question level |
|---|---|---|---|
| Deloitte introduction | not yet scored | — | — |

Raise the level after a 7 or higher. A 6 means the next question stays on the same idea.

## The night before

1. Playbook section 15, the one-page card, rewritten in your own words.
2. Brief topics 9, 55, 17, and 24 (Node loop, `nextTick`, indexes, Redis).
3. One design: appointment booking, from the playbook, without notes.
4. Your real project paragraph. If a blank is still empty, do not invent the sentence.

## Author

[Pradeep chandu](https://github.com/Pradeep-chandu)
