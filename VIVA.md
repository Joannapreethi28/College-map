# Viva cheat sheet: Campus Navigator

**One line:** an Angular SPA that draws the campus map from MongoDB data. Express serves a REST API, and admins can add or edit blocks without changing code.

```
Angular (4200) --HTTP/JSON--> Express (3000) --Mongoose--> MongoDB (campus_nav)
```

**SPA vs server-side:** the browser loads the app once; Angular swaps components when the URL changes (`routerLink`), and only JSON data travels after that. With server-side rendering, every click would fetch a whole new HTML page.

**Why MongoDB:** a block and its rooms are naturally one nested document, fields can be flexible, and we read a block with its rooms in one query (no joins).

**Embedded vs referenced:** rooms are *embedded* in blocks (they never exist alone, and we always show them together). Faculty are *referenced* by `cabin.blockCode` (we also search faculty on their own, e.g. by department). The trade-off: embedding is fast to read but the document grows; referencing keeps documents separate but needs a second query.

**Angular to Express:** a component calls a service, the service uses `HttpClient.get/post/put/delete` and returns an Observable, and `.subscribe()` sends the request and receives the JSON. **CORS:** the browser blocks calls between ports 4200 and 3000 unless the server allows it, which `cors()` does.

**Dependency injection:** components ask for services in their constructor (`constructor(private blockService: BlockService)`) and Angular hands over one shared copy (`providedIn: 'root'`). `HttpClient` is injected into the services the same way. The guard uses `inject()`.

**Template-driven vs reactive forms:** *template-driven* (search, login) puts the rules in the HTML with `ngModel`, `required` and `minlength`, which is simple and good for small forms. *Reactive* (admin) builds the form in TypeScript with `FormGroup`, `FormControl` and `Validators`, which is better for big or dynamic forms; `FormArray` lets the admin add or remove room rows.

**Middleware:** a function `(req, res, next)` that runs before the route; `next()` passes the request on.
- `logger` prints method, URL, status and time.
- `requireAdmin` returns 401 (unknown user) or 403 (not an admin), or calls `next()`.
- `errorHandler` has 4 parameters, is registered last, and turns errors into `{ message }`.

**EventEmitter:** Node's built-in publish/subscribe. The controller `emit('blockCreated')`, and a listener appends a line to `audit.log` with `fs.appendFile` (a callback). The controller doesn't need to know about the log. It is Node-specific because it comes from Node's core `events` module.

**Route guard and auth limits:** `adminGuard` runs before `/admin` opens; it allows admins and redirects everyone else to `/login`. Passwords are hashed with bcrypt. The **honest limit:** the browser sends the user id in `x-user-id`, so anyone who knows the admin's id could pretend to be the admin. A real app would use JWT or sessions. The guard only hides the page; the server's `requireAdmin` is the real check.

**Regex search:** `$regex` means "contains this pattern" and `$options: 'i'` ignores case, so "lab" finds "Data Science Lab". We escape special characters (`. * ( ) +`) so input like `c++(` is treated as plain text and can't break the query.

**Express vs plain Node** (`demo/simple-server.js`): plain Node needs manual `if (req.url ...)` routing, `writeHead` and `JSON.stringify`, and has no middleware. Express gives `app.get`, `res.json`, `app.use` and Routers.

**Angular 22 note:** components default to OnPush and the app is zoneless. We added zone.js and `ChangeDetectionStrategy.Eager` so the screen updates automatically when data changes, the classic behaviour.

---

## 3-minute demo script

1. **Map** (`/map`): "Every rectangle comes from MongoDB." Click **CSE Block**: it highlights, the URL becomes `/block/CS`, and the panel shows rooms (coloured by type) and faculty.
2. **Search**: type `data science lab` and click the result. The map opens with **Main Block** highlighted.
3. **Login** as `admin@college.edu` / `admin123`. The navbar shows **Admin** and **Hi, Admin**.
4. **Admin**: add a block (name, code `TB`, x 630, y 280, w 135, h 90; this is the empty spot next to the Auditorium) with one room numbered `TB-G01`, then click **Map** to show it appearing. Go back, **Edit** it, then **Delete** it.
5. Open `server/audit.log` to show the created, updated and deleted lines.
6. (If asked) **Logout**, then type `/admin` in the URL: you are redirected to `/login`.

**Before the demo:** MongoDB service running → `npm run seed` → `npm run dev` (server) → `ng serve` (client).
