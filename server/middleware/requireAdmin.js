// middleware/requireAdmin.js
// Protects admin routes. It works like a bouncer at the door:
//   no user id in the header   -> 401 Unauthorized (we don't know who you are)
//   user id not found          -> 401 Unauthorized
//   user found but not admin   -> 403 Forbidden (we know you, but you're not allowed)
//   admin                      -> next() lets the request through
//
// NOTE for viva: this is lab-level security. Anyone who knows the admin's id
// could send it. A real app would use signed tokens (JWT) or sessions.

const mongoose = require('mongoose');
const User = require('../models/User');

async function requireAdmin(req, res, next) {
  try {
    // Angular sends the logged-in user's id in a custom header called x-user-id
    const userId = req.headers['x-user-id'];

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({ message: 'Please log in first' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: 'Please log in first' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admins only' });
    }

    // Save the user on the request so controllers can use it (e.g. for the audit log)
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = requireAdmin;
