// middleware/errorHandler.js
// Error-handling middleware has FOUR parameters (err, req, res, next).
// Express knows it is an error handler because of the 4 parameters.
// When any controller calls next(err), Express skips straight to here.
// It must be registered LAST in server.js.

function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  // Use the error's status if it has one, otherwise 500 (server error)
  const status = err.status || 500;

  res.status(status).json({ message: err.message || 'Something went wrong' });
}

module.exports = errorHandler;
