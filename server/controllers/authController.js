// controllers/authController.js

const bcrypt = require('bcryptjs');
const User = require('../models/User');

// POST /api/auth/register
// Body: { name, email, password }
// Always creates a "visitor". Admins are only created by the seed script.
async function register(req, res, next) {
  try {
    // req.body is filled by express.json() from the JSON the client sent
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Never store the real password, only its hash
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name,
      email: email,
      passwordHash: passwordHash,
      role: 'visitor' // forced, even if someone sends role: "admin"
    });

    // 201 = Created. Send back only safe fields (never the hash).
    res.status(201).json({ _id: user._id, name: user.name, role: user.role });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
// Body: { email, password }
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // bcrypt.compare hashes the typed password and checks it against the stored hash
    const passwordOk = user && (await bcrypt.compare(password, user.passwordHash));

    // Same message for "no such email" and "wrong password",
    // so nobody can find out which emails are registered
    if (!passwordOk) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({ _id: user._id, name: user.name, role: user.role });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
