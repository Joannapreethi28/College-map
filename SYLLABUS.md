# Syllabus map: where each topic is used

## Unit 1: Web app development, SPA, TypeScript

| Topic | Where |
|---|---|
| Client side vs server side | Angular runs in the browser (`client/`), Express + MongoDB run on the server (`server/`) |
| Single Page Application | `client/src/app/app.routes.ts` + `routerLink` in `navbar.component.html`: the page never reloads |
| TypeScript variables, data types | every component, e.g. `blocks: Block[] = []`, `editingCode: string \| null` in `admin.component.ts` |
| Functions | `floorLabel()` in `block-panel.component.ts`, `showError()` in `admin.component.ts` |
| Classes | every service and component, e.g. `class BlockService` |
| Interfaces | `client/src/app/models/` (`Block`, `Room`, `Faculty`, `User`, `SearchResult`), `implements OnInit` |
| Union type | `RoomType` in `models/room.ts` |

## Unit 2: Angular

| Topic | Where |
|---|---|
| Components and templates | `client/src/app/components/*` (`.ts` + `.html` + `.css`) |
| Interpolation `{{ }}` | everywhere, e.g. `{{ block.name }}` in `block-panel.component.html` |
| Property binding `[ ]` | `[attr.x]="b.svg.x"`, `[class.selected]` in `map.component.html`, `[disabled]` in `search.component.html` |
| Event binding `( )` | `(click)="selectBlock(b)"` in `map.component.html`, `(ngSubmit)` in forms |
| Two-way binding `[( )]` | `[(ngModel)]` in `search.component.html` and `login.component.html` |
| `@Input` (parent to child) | `[block]="selectedBlock"`: map passes the block to `block-panel` |
| Directives | `*ngFor` (map blocks, rooms, results), `*ngIf` (empty states, navbar), `[ngClass]` (room colours in `block-panel.component.html`) |
| Services and DI | `services/*.service.ts` with `@Injectable`, injected through constructors |
| Template-driven forms | `search.component.html`, `login.component.html` (`ngModel`, `required`, `minlength`, `email`) |
| Reactive forms | `admin.component.ts` (`FormGroup`, `FormControl`, `Validators`, nested group `svg`, `FormArray` for rooms) |
| Routing and navigation | `app.routes.ts`, route parameter `:code` read with `ActivatedRoute` in `map.component.ts`, `router.navigate()` |
| Route guard | `guards/admin.guard.ts` used on `/admin` |
| Lifecycle hooks | `ngOnInit` (map, admin), `ngOnChanges` (block-panel) |

## Unit 3: Node.js

| Topic | Where |
|---|---|
| Installation and npm packages | `server/package.json` (express, mongoose, cors, dotenv, bcryptjs, nodemon), npm scripts |
| Modules | `require` / `module.exports` in every server file |
| Core modules | `http`, `fs`, `path` in `demo/simple-server.js`; `events`, `fs` in `events/appEvents.js` |
| Events | `EventEmitter` in `events/appEvents.js` (`emit` in `blockController.js`, `on` listeners); `res.on('finish')` in `middleware/logger.js` |
| Asynchronous programming | `async` / `await` in every controller and `seed/seed.js` |
| Callbacks | `fs.appendFile(..., callback)` in `appEvents.js`; `fs.readFile(..., callback)` and `http.createServer(callback)` in `demo/simple-server.js` |
| Simple server with Node | `server/demo/simple-server.js` (`npm run demo`) |

## Unit 4: Express.js

| Topic | Where |
|---|---|
| Creating and configuring an app | `server/server.js` (`express()`, `app.use`, `app.listen`, `.env` with dotenv) |
| Routing | `server/routes/*.js` with `express.Router()`, route params `:code`, `:number`, `:id` |
| Middleware (built-in / npm) | `express.json()`, `cors()` in `server.js` |
| Middleware (custom) | `middleware/logger.js`, `middleware/requireAdmin.js` (route-level), `middleware/errorHandler.js` (4 parameters) |
| Requests and responses | `req.params`, `req.query`, `req.body`, `req.headers`; `res.json`, `res.status` in controllers |
| REST API | GET / POST / PUT / DELETE on `/api/blocks`, `/api/faculty`; status codes 200, 201, 400, 401, 403, 404, 500 |

## Unit 5: MongoDB

| Topic | Where |
|---|---|
| Database, collections, documents | database `campus_nav`; collections `blocks`, `faculties`, `users` |
| Schemas and data types | `server/models/*.js`: String, Number, Boolean (`hasLift`), Date (`timestamps`), Array (`rooms`), embedded documents (`svg`, `cabin`), ObjectId (`_id`), `enum` |
| Embedded vs referenced | rooms embedded in blocks; faculty reference blocks by `cabin.blockCode` |
| Create | `Block.create`, `insertMany` (seed), `User.create` (register) |
| Read | `find`, `findOne`, `findById`, `countDocuments` |
| Update | `block.set()` + `save()`, `rooms.push()` / `splice()` |
| Delete | `findOneAndDelete`, `findByIdAndDelete`, `deleteMany` (seed) |
| Querying and filtering | `$regex` + `$options: 'i'`, `$or` (search), `$in` (faculty departments), dot notation `cabin.blockCode`, `sort`, `limit`, projection (`searchController.js`) |
