// demo/simple-server.js
// A tiny web server using ONLY Node's built-in "http" and "fs" modules (no Express, no npm packages).
// It is NOT used by the app. It shows "Simple Server Creation using Node.js" and "Callbacks".
//
// Run it from the server folder:   node demo/simple-server.js
// Then open:  http://localhost:4000/          -> JSON message
//             http://localhost:4000/blocks    -> block names read from seed.json
//
// ---------------------------------------------------------------------------
// How this is different from Express (see server.js):
//   1. ROUTING: here we check req.url and req.method ourselves with if/else.
//      Express gives us app.get('/path', fn) and express.Router().
//   2. JSON: here we set the Content-Type header and call JSON.stringify ourselves.
//      Express does both with res.json().
//   3. STATUS CODES: here we use res.writeHead(404, ...). Express: res.status(404).
//   4. MIDDLEWARE: plain Node has no middleware chain (no app.use, no next()).
//      For a logger or error handler we would have to call them by hand in every route.
//   5. REQUEST BODY: plain Node gives the body in pieces (chunks) that we must join;
//      Express does it with express.json().
// So Express doesn't do anything Node can't do; it just saves us a lot of repeated code.
// ---------------------------------------------------------------------------

const http = require('http');   // core module: create a web server
const fs = require('fs');       // core module: read/write files
const path = require('path');   // core module: build file paths that work on any OS

const PORT = 4000;

// Small helper to send JSON (Express gives us res.json() for this)
function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// createServer takes a CALLBACK. Node calls it for EVERY request that comes in.
const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Route 1: GET /  -> a simple JSON response
  if (req.method === 'GET' && req.url === '/') {
    sendJson(res, 200, { message: 'Hello from a plain Node.js server!' });
    return;
  }

  // Route 2: GET /blocks  -> read a file with a CALLBACK, then answer
  if (req.method === 'GET' && req.url === '/blocks') {
    const file = path.join(__dirname, '..', 'seed', 'seed.json');

    // fs.readFile is ASYNCHRONOUS: Node starts reading and moves on.
    // When the file is ready, Node calls our callback with (err, text).
    // Callbacks in Node use the "error-first" style: the first argument is the error.
    fs.readFile(file, 'utf8', (err, text) => {
      if (err) {
        sendJson(res, 500, { message: 'Could not read the file' });
        return;
      }
      const data = JSON.parse(text);
      const names = data.blocks.map((b) => b.name);
      sendJson(res, 200, { count: names.length, blocks: names });
    });

    // This line runs BEFORE the file has been read. That proves readFile does not block.
    console.log('  (reading seed.json in the background...)');
    return;
  }

  // Anything else -> 404
  sendJson(res, 404, { message: 'Route not found' });
});

// listen also takes a callback: it runs once the server is ready
server.listen(PORT, () => {
  console.log(`Plain Node server running on http://localhost:${PORT}`);
});
