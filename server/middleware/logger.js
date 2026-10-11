// middleware/logger.js
// Middleware = a function that runs for every request, before our routes.
// It gets (req, res, next). Calling next() passes the request on to the
// next middleware or route. If we forget next(), the request gets stuck.

function logger(req, res, next) {
  const start = Date.now();

  // 'finish' is an EVENT that the response fires once it has been sent.
  // We wait for it so we know the final status code and how long it took.
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`);
  });

  next();
}

module.exports = logger;
