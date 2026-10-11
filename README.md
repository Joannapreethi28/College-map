# Campus Navigator

An interactive campus map built with the MEAN stack (MongoDB, Express, Angular, Node.js).
Click a block on the map to see its rooms, labs and faculty, search for a room or a person,
and log in as admin to add, edit or delete blocks.

Full Stack Web Development lab mini project.

## Prerequisites

Install these first:

| Tool | Version used | Check with |
|---|---|---|
| Node.js (LTS) | 24 | `node -v` |
| Angular CLI | 22 | `ng version` (install: `npm install -g @angular/cli`) |
| MongoDB Community Server | 8 | runs as a Windows service on port 27017 |
| MongoDB Compass (optional) | any | to look at the data |

## Setup

```bash
# 1. Get the code
git clone https://github.com/Joannapreethi28/College-map.git
cd College-map

# 2. Server: install packages
cd server
npm install

# 3. Create server/.env with these two lines:
#    PORT=3000
#    MONGO_URI=mongodb://127.0.0.1:27017/campus_nav

# 4. Load the starting data (safe to run again; it wipes and reloads)
npm run seed

# 5. Client: install packages
cd ../client
npm install
```

## Run

Use two terminals:

```bash
# Terminal 1: the API on http://localhost:3000
cd server
npm run dev

# Terminal 2: the Angular app on http://localhost:4200
cd client
ng serve
```

Open **http://localhost:4200**.

## Default admin login

| Email | Password |
|---|---|
| admin@college.edu | admin123 |

The admin is created by `npm run seed`. New users from the register API are always visitors.

## Useful commands (in `server/`)

| Command | What it does |
|---|---|
| `npm run dev` | start the API with nodemon (restarts on file save) |
| `npm start` | start the API with plain node |
| `npm run seed` | wipe and reload blocks, faculty and the admin |
| `npm run demo` | start the plain Node.js demo server on port 4000 (`demo/simple-server.js`) |

Admin changes to blocks are written to `server/audit.log`.

## API

Public:

- `GET /api/blocks`, `GET /api/blocks/:code`
- `GET /api/faculty?department=CSE,ECE&blockCode=CS`
- `GET /api/search?q=lab`
- `POST /api/auth/register`, `POST /api/auth/login`

Admin only (send header `x-user-id: <admin _id>`):

- `POST /api/blocks`, `PUT /api/blocks/:code`, `DELETE /api/blocks/:code`
- `POST /api/blocks/:code/rooms`, `DELETE /api/blocks/:code/rooms/:number`
- `POST /api/faculty`, `PUT /api/faculty/:id`, `DELETE /api/faculty/:id`

## Folder structure

```
server/
  server.js            app setup, middleware, routes
  config/db.js         MongoDB connection
  models/              Block, Faculty, User (Mongoose schemas)
  routes/              URL -> controller function
  controllers/         the logic for each route
  middleware/          logger, requireAdmin, errorHandler
  events/appEvents.js  EventEmitter -> audit.log
  seed/                seed.json + seed.js
  demo/                simple-server.js (plain Node, no Express)
client/src/app/
  models/              TypeScript interfaces
  services/            BlockService, FacultyService, AuthService
  guards/              adminGuard
  components/          navbar, map, block-panel, search, login, admin
```

## Known limits

- Login is lab-level security: the browser sends the user id in a header. A real app would use signed tokens (JWT) or sessions.
- The seed data is placeholder data, not the real college layout yet.
