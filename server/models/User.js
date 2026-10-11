// models/User.js
// Login accounts. We never store the real password, only a hash
// (a scrambled version made by bcryptjs that cannot be turned back).

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'visitor'], // only these two roles exist
      default: 'visitor'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
