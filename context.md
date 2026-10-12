# Campus Navigator — Project Context

Read this file fully before writing any code. It is the source of truth for scope, stack, data model, and rules.

## 1. What we are building

An interactive campus map web app (MEAN-style: MongoDB, Express, Angular, Node). Visitors click a building (block) on an SVG map of the college and see its departments, labs, rooms, and faculty in a side panel. They can also search ("where is the DS lab?") and the matching block lights up on the map. Admins log in and add, edit, or delete blocks and rooms, and the map updates without any code change.

This is a **Full Stack Web Development lab mini project**. It is graded against a fixed syllabus and explained in a viva by two students (intermediate level). Code must therefore be simple, readable, and explainable.

## 2. Hard scope rule: stay inside the syllabus

### 2.1 Official syllabus (verbatim from the course)

**Unit 1:** Introduction to Web Application Development – Client-Side vs. Server-Side – Single Page Applications (SPA) – Introduction to TypeScript – Variables, Data Types, Functions – Classes and Interfaces

**Unit 2:** Introduction to Angular – Components and Templates – Data Binding – Directives – Services and Dependency Injection – Angular Forms (Template Driven and Reactive) – Routing and Navigation

**Unit 3:** Introduction to Node.js – Installation and NPM Packages – Modules and Events – Asynchronous Programming and Callbacks – Simple Server Creation using Node.js

**Unit 4:** Introduction to Express.js – Creating and Configuring Express Apps – Routing – Middleware – Handling Requests and Responses – Building Simple REST APIs

**Unit 5:** Introduction to NoSQL Databases – MongoDB Basics – Documents, Collections and Databases – Data Types and CRUD Operations – Querying and Filtering Documents

How to use this: the project is graded against these five units. Every topic above should be visibly used somewhere in the code, and anything outside these units should be avoided. When choosing between two ways of doing something, pick the one that matches a topic named above. If a feature you are about to build maps to no topic here, stop and ask.

### 2.2 How each unit shows up in this project

Syllabus units and what they must look like in this project:

| Unit | Must appear as |
|---|---|
| Client vs server side, SPA | Angular SPA; map never reloads the page |
| TypeScript | Interfaces `Block`, `Room`, `Faculty`, `User`; classes for services/components |
| Angular components, templates, data binding | Interpolation, property binding, event binding, two-way `[(ngModel)]` |
| Directives | `*ngFor`, `*ngIf`, `[ngClass]` (use these, not the newer `@for`/`@if` syntax) |
| Services and DI | `BlockService`, `FacultyService`, `AuthService` using injected `HttpClient` |
| Forms | Template-driven: login + search. Reactive: admin add/edit block (validators + `FormArray` for rooms) |
| Routing | Routes below + one route guard |
| Node.js | Modules (`require`/`module.exports`), npm packages, `EventEmitter`, callbacks and async/await, plus a small standalone `server/demo/simple-server.js` built with the core `http` module (no Express) to cover "Simple Server Creation using Node.js" |
| Express.js | Router files, custom middleware, request/response handling, REST API |
| MongoDB | Documents, collections, databases; CRUD; `$regex`, `$or`, `$in`, sort, limit, projection; seed data should use varied data types (string, number, boolean, date, array, embedded document, ObjectId) |

**Do NOT add** (outside syllabus, wastes time, hard to explain): WebSockets/Socket.IO, JWT, NgRx or any state library, RxJS-heavy patterns beyond basic `subscribe`, aggregation pipelines, GraphQL, Docker, map libraries (Leaflet, Google Maps), UI frameworks beyond optional Bootstrap, image uploads, email, payments.

## 3. Tech stack

- Frontend: Angular (current stable CLI) + TypeScript, plain CSS (Bootstrap optional)
- Map: inline SVG in an Angular template. Each block is a `<rect>` rendered with `*ngFor` from database data
- Backend: Node.js (LTS) + Express.js
- Database: MongoDB (local Community Server or Atlas free tier) + Mongoose
- Auth helper: `bcryptjs` for password hashing
- Other npm packages: `cors`, `dotenv`, `nodemon` (dev)
- Tools: VS Code, Postman, MongoDB Compass, Git

## 4. Architecture

```
Angular SPA (port 4200)  --HTTP/JSON-->  Express API (port 3000)  --Mongoose-->  MongoDB (campus_nav)
 components, services,                    routes, middleware,                    collections:
 routing, forms                           controllers, models                    users, blocks, faculty
```

## 5. Folder structure

```
campus-navigator/
  context.md
  BUILD_PLAN.md
  server/
    package.json
    .env                      (PORT, MONGO_URI)  -- never commit
    server.js                 (app setup, middleware, routes, listen)
    config/db.js              (mongoose connect)
    models/Block.js  Faculty.js  User.js
    routes/blocks.js  faculty.js  search.js  auth.js
    controllers/blockController.js  facultyController.js  searchController.js  authController.js
    middleware/logger.js  requireAdmin.js  errorHandler.js
    events/appEvents.js       (EventEmitter: blockCreated, blockUpdated, blockDeleted -> writes audit log)
    seed/seed.json  seed.js
  client/                     (Angular app)
    src/app/
      models/                 block.ts  room.ts  faculty.ts  user.ts
      services/               block.service.ts  faculty.service.ts  auth.service.ts
      guards/                 admin.guard.ts
      components/
        map/                  (SVG campus map)
        block-panel/          (details of selected block)
        search/               (template-driven search box + results)
        login/                (template-driven)
        admin/                (reactive form + block list with edit/delete)
```

## 6. Data model (MongoDB)

```js
// blocks  (rooms are EMBEDDED: always read with the block, cannot exist without it)
{
  _id, name: "Main Block", code: "MB", description: "...",
  svg: { x: 40, y: 60, w: 160, h: 90 },          // rectangle position on the SVG map
  rooms: [ { number: "G12", name: "Data Science Lab", type: "lab", floor: 0 } ]
  // room.type is one of: "lab" | "classroom" | "office" | "other"
}

// faculty
{ _id, name, department, email, cabin: { blockCode: "MB", roomNumber: "G12" } }

// users
{ _id, name, email (unique), passwordHash, role: "admin" | "visitor" }
```

Viva talking points to keep true in the code: rooms embedded vs faculty referenced by `blockCode`; map drawn from DB data; why MongoDB suits nested documents.

## 7. REST API

Public:
- `GET  /api/blocks` — all blocks
- `GET  /api/blocks/:code` — one block
- `GET  /api/faculty?department=&blockCode=` — filtered faculty
- `GET  /api/search?q=` — case-insensitive `$regex` over `rooms.name`, `rooms.number`, `faculty.name`; returns `{ blocks: [...], faculty: [...] }`. Escape regex special characters in `q`.
- `POST /api/auth/register` (always creates role `visitor`)
- `POST /api/auth/login` — returns `{ _id, name, role }`

Admin only (`requireAdmin` middleware):
- `POST /api/blocks`, `PUT /api/blocks/:code`, `DELETE /api/blocks/:code`
- `POST /api/blocks/:code/rooms`, `DELETE /api/blocks/:code/rooms/:number`
- `POST/PUT/DELETE /api/faculty`

Conventions: JSON only; correct status codes (200, 201, 400, 401, 403, 404, 500); errors returned as `{ message }`.

## 8. Angular routes

| Path | Component | Access |
|---|---|---|
| `/login` (default) | Login | public |
| `/register` | Sign up (creates a visitor account) | public |
| `/map` | Map + BlockPanel | `authGuard` (any logged-in user) |
| `/block/:code` | Map with that block selected | `authGuard` |
| `/search` | Search | `authGuard` |
| `/admin` | Admin | `adminGuard` |

Changed on request after Phase 8: the app opens at the login page, users sign up and log in first, and then see the map.

## 9. Auth approach (keep simple, state the limits honestly)

- Passwords hashed with `bcryptjs`. No JWT (not in syllabus).
- Login returns `{ _id, name, role }`; Angular stores it in `localStorage` via `AuthService`.
- Angular sends the user id in an `x-user-id` header on admin requests. `requireAdmin` looks the user up in MongoDB and checks `role === "admin"`.
- Limitation to mention in the viva: this is lab-level security, not production-grade. A real app would use signed tokens (JWT) or sessions.
- Create the first admin with the seed script, never through the register endpoint.

## 10. Middleware and events (Node/Express units)

- `logger`: logs method, URL, status, time for every request
- `requireAdmin`: described above
- `errorHandler`: last middleware, returns `{ message }` with a status code
- `appEvents` (`EventEmitter`): admin controllers emit `blockCreated` / `blockUpdated` / `blockDeleted`; a listener appends a line to `server/audit.log`

## 11. Seed data

`server/seed/seed.json` holds 6-8 blocks, 30-40 rooms, 15-20 faculty, and one admin user. Initial data is **placeholder**; the students will replace it with real college data. Mark placeholder values with `// TODO real data` style notes in the seed script, not inside the JSON. `node seed/seed.js` must wipe and reload the collections so it is safe to re-run.

## 12. Rules for Claude Code

1. Follow BUILD_PLAN.md phase by phase. Finish and verify a phase before starting the next. Do not build ahead.
2. At the start of each phase, state in 3-5 lines what you are about to build and why. At the end, state how to test it.
3. Keep code simple and commented in plain language. The students must be able to explain every line in a viva. No clever one-liners, no unnecessary abstractions.
4. When you use a syllabus concept for the first time (e.g. dependency injection, middleware, `FormArray`), add a short comment explaining what it is and why it is used there.
5. Give complete files, not fragments, when creating or substantially changing a file.
6. Test the API with curl or Postman-style requests before building the Angular code that uses it.
7. Never put secrets in code. Use `.env` and add it to `.gitignore`.
8. Commit after every finished phase with a clear message.
9. If a requirement conflicts with the syllabus rule in section 2, ask before adding it.
10. If something is ambiguous, ask one short question instead of guessing.

## 13. Definition of done

- All routes in sections 7 and 8 work end to end
- Clicking a block on the map shows its rooms and faculty
- Search finds a room or faculty member and highlights the block on the map
- Admin can log in, add a block (it appears on the map), edit it, and delete it
- Visitors cannot reach `/admin` or call admin endpoints
- Form validation shows clear error messages
- Empty states handled (no search results, no rooms in block)
- README with setup steps, and a one-page viva cheat sheet
