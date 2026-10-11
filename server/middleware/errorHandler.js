// middleware/errorHandler.js
// Error-handling middleware has FOUR parameters (err, req, res, next).
// Express knows it is an error handler because of the 4 parameters.
// When any controller calls next(err), Express skips straight to here.
// It must be registered LAST in server.js.

function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  // Use the error's status if it has one, otherwise 500 (server error)
  let status = err.status || 500;
  let message = err.message || 'Something went wrong';

  // Mongoose throws these when the client sends bad data, so they are 400 (Bad Request)
  if (err.name === 'ValidationError') {
    status = 400; // a schema rule failed, e.g. a required field is missing
  }
  if (err.name === 'CastError') {
    status = 400; // wrong type, e.g. "abc" used as an id
    message = `Invalid value for ${err.path}`;
  }
  if (err.code === 11000) {
    status = 400; // duplicate value in a "unique" field, e.g. block code
    message = 'That value already exists';
  }

  res.status(status).json({ message: message });
}

module.exports = errorHandler;
