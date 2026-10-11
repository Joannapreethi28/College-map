// server.js
// The starting point of our backend. It creates the Express app,
// adds middleware, connects the routes, connects to MongoDB, and starts listening.

// dotenv reads the .env file and puts its values into process.env
// (so secrets like the database address are not written in the code)
require('dotenv').config();

// require() loads a module: either an npm package or one of our own files
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const blockRoutes = require('./routes/blocks');
const facultyRoutes = require('./routes/faculty');
const searchRoutes = require('./routes/search');
const authRoutes = require('./routes/auth');

const app = express();

// ---------- Middleware (runs on every request, in this order) ----------

// cors(): allows the Angular app (port 4200) to call this server (port 3000).
// Browsers block requests between different ports unless the server allows it.
app.use(cors());

// express.json(): reads the JSON body of a request and puts it in req.body
app.use(express.json());

// Our own middleware: prints method, URL, status and time for each request
app.use(logger);

// ---------- Routes ----------

// A simple test route to check the server is alive.
// req = the incoming request, res = the response we send back.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Every URL starting with /api/blocks goes to routes/blocks.js, and so on
app.use('/api/blocks', blockRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);

// If no route above matched, send a 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler must be the LAST middleware
app.use(errorHandler);

// ---------- Start ----------

// Connect to the database first, then start the server
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
