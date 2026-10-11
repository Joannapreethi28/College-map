# Campus Navigator — Build Plan

Work phase by phase. Do not start a phase until the previous one passes its "Done when" check. The order must not change.

Read `context.md` first.

---

## Phase 0 — Setup

Tasks
- [ ] Create `campus-navigator/` with `server/` and `client/`; run `git init`; add `.gitignore` (node_modules, .env, audit.log)
- [ ] `server/`: `npm init -y`, install `express mongoose cors dotenv bcryptjs`, dev-install `nodemon`; add `start` and `dev` scripts
- [ ] `client/`: create the Angular app with the CLI (routing enabled, CSS)
- [ ] Create `.env` with `PORT=3000` and `MONGO_URI=mongodb://127.0.0.1:27017/campus_nav` (or the Atlas URI)
- [ ] `config/db.js` connects Mongoose; `server.js` starts Express with `cors` and `express.json()` and a `GET /api/health` route

Done when: `GET http://localhost:3000/api/health` returns `{ status: "ok" }`, the console says MongoDB connected, and `ng serve` shows the default Angular page.

## Phase 1 — Models and seed data

Tasks
- [ ] Mongoose models: `Block` (with embedded `rooms` and `svg`), `Faculty`, `User`, with required fields and enums (`room.type`, `user.role`)
- [ ] `seed/seed.json` with placeholder data: 6-8 blocks laid out so rectangles do not overlap on an SVG about 800x500, 30-40 rooms, 15-20 faculty, 1 admin user (password in plain text in the seed file only; hashed by the script)
- [ ] `seed/seed.js` wipes and reloads all three collections, hashing the admin password with `bcryptjs`
- [ ] Run the seed and inspect the data in MongoDB Compass

Done when: Compass shows 3 collections with the expected counts, and re-running the seed does not create duplicates.

## Phase 2 — Public API

Tasks
- [ ] `middleware/logger.js` (method, URL, status, ms) and `middleware/errorHandler.js`; register them in `server.js`
- [ ] Block routes and controller: `GET /api/blocks`, `GET /api/blocks/:code` (404 if missing)
- [ ] Faculty route: `GET /api/faculty` with optional `department` and `blockCode` filters
- [ ] Search route: `GET /api/search?q=` using escaped, case-insensitive `$regex` with `$or` over room name, room number, and faculty name; return `{ blocks, faculty }`; return empty arrays for an empty `q`
- [ ] Test every endpoint with curl or Postman, including bad input

Done when: all public endpoints return correct JSON and sensible status codes, the logger prints each request, and `q=lab` finds the expected rooms.

## Phase 3 — Auth and admin API

Tasks
- [ ] `POST /api/auth/register` (role forced to `visitor`, `bcryptjs` hash, duplicate email returns 400) and `POST /api/auth/login` (401 on bad credentials; return `{ _id, name, role }` only)
- [ ] `middleware/requireAdmin.js` reads `x-user-id`, loads the user, returns 401 or 403 as appropriate
- [ ] Admin routes: create, update, delete blocks; add and delete rooms; faculty create, update, delete
- [ ] `events/appEvents.js` with an `EventEmitter`; controllers emit `blockCreated`, `blockUpdated`, `blockDeleted`; a listener appends to `audit.log`
- [ ] Test: admin calls succeed with the admin id, fail without it and with a visitor id

Done when: admin endpoints are blocked for everyone but the admin, and each admin change adds a line to `audit.log`.

**Checkpoint: the backend is complete. Commit and tag `backend-done`.**

## Phase 4 — Angular foundation

Tasks
- [ ] Interfaces in `models/`: `Block`, `Room`, `Faculty`, `User`
- [ ] `BlockService` and `FacultyService` using `HttpClient` against `http://localhost:3000/api`
- [ ] Routes from `context.md` section 8 set up, with placeholder components and a simple navbar (Map, Search, Login)
- [ ] Verify the services by logging blocks from the API in the console

Done when: navigating between routes works without page reloads and block data from MongoDB appears in the browser console.

## Phase 5 — Interactive map

Tasks
- [ ] `MapComponent`: `<svg viewBox="0 0 800 500">` with `<g *ngFor="let b of blocks">` rendering a `<rect>` from `b.svg` and a `<text>` label
- [ ] Event binding `(click)="selectBlock(b)"`, property binding `[class.selected]`, hover style in CSS
- [ ] `BlockPanelComponent` shows the selected block: name, description, rooms (grouped or coloured by `type` with `[ngClass]`), and faculty whose `cabin.blockCode` matches
- [ ] `*ngIf` for the "click a block to see details" empty state and for blocks with no rooms
- [ ] Selecting a block updates the URL to `/block/:code`; opening that URL directly selects the block

Done when: clicking any block highlights it and shows its real data from MongoDB, and a direct link to `/block/MB` works.

## Phase 6 — Search

Tasks
- [ ] `SearchComponent` with a template-driven form (`[(ngModel)]`), min length 2, submit calls `/api/search`
- [ ] Results list rooms (with their block) and faculty (with their cabin), using `*ngFor`
- [ ] Clicking a result goes to `/block/:code` so the block is highlighted on the map
- [ ] "No results" empty state

Done when: searching "data science lab" finds the room and one click highlights the right block on the map.

## Phase 7 — Login and admin UI

Tasks
- [ ] `AuthService`: `login()`, `logout()`, `currentUser`, stored in `localStorage`; helper that adds the `x-user-id` header to admin calls
- [ ] `LoginComponent` (template-driven) with error message for bad credentials; navbar shows Login or Logout and the user's name
- [ ] `adminGuard`: allows `/admin` only if `currentUser.role === 'admin'`, otherwise redirects to `/login`
- [ ] `AdminComponent`: list of blocks with Edit and Delete buttons (confirm before delete); reactive form for add/edit with validators (name required, code required and uppercase, `svg` numbers positive) and a `FormArray` for rooms (add and remove room rows)
- [ ] Saving refreshes the list and the map shows the new or changed block without a reload

Done when: an admin can add a block that immediately appears on the map, edit it, delete it, and a visitor is redirected away from `/admin`.

## Phase 8 — Polish and viva prep

Tasks
- [ ] Add `server/demo/simple-server.js`: a tiny server using only the core `http` module (one route returning JSON, one callback-style file read), with a comment block explaining how it differs from Express. This covers "Simple Server Creation using Node.js" and "Callbacks" from Unit 3
- [ ] Syllabus audit: go through every topic in `context.md` section 2.1 and note the file where each one is used; fix any gap before the demo
- [ ] Replace placeholder seed data with real college data and adjust SVG rectangles so the map resembles the real campus layout
- [ ] Check every form for validation messages, every list for empty states, every request for error handling
- [ ] Responsive check at laptop and projector sizes
- [ ] `README.md`: prerequisites, install, seed, run both servers, default admin login
- [ ] `VIVA.md`: one-page cheat sheet covering the points below
- [ ] Rehearse a 3-minute demo: open map, click a block, search, log in as admin, add a block, show it on the map, show `audit.log`

Done when: a fresh clone can be set up from the README alone and the demo runs without surprises.

---

## Viva cheat sheet topics (for VIVA.md)

- Why a SPA, and what changes between client-side and server-side rendering
- Why MongoDB: nested rooms inside a block, flexible fields, no joins
- Embedded (rooms in blocks) versus referenced (faculty by block code), and the trade-off
- How Angular talks to Express: service, `HttpClient`, JSON, CORS
- Dependency injection: what it is and where it appears here
- Template-driven versus reactive forms, and which one is used where and why
- What middleware is, with `logger` and `requireAdmin` as examples
- What `EventEmitter` does here and why it is Node-specific
- How the route guard works, and the honest limit of this auth design (no JWT)
- Regex search: what `$regex` and `$options: "i"` do, and why input is escaped

## Risk list

- Seed data takes longer than the code: start collecting real room and faculty data during Phase 1
- SVG block positions will need a few rounds of tuning: keep `svg` coordinates in the data, not in the template
- Scope creep: if a feature is not in `context.md`, do not build it until every "Done when" above passes
