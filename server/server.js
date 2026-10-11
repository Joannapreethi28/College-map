// server.js
// The starting point of our backend. It creates the Express app,
// adds middleware, connects to MongoDB, and starts listening for requests.

// dotenv reads the .env file and puts its values into process.env
// (so secrets like the database address are not written in the code)
require('dotenv').config();

// require() loads a module: either an npm package or one of our own files
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware = a function that runs on every request before our routes.
// cors(): allows the Angular app (port 4200) to call this server (port 3000).
// Browsers block requests between different ports unless the server allows it.
app.use(cors());

// express.json(): reads the JSON body of a request and puts it in req.body
app.use(express.json());

// A simple test route to check the server is alive.
// req = the incoming request, res = the response we send back.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Connect to the database first, then start the server
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
