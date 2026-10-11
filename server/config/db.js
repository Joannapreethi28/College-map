// config/db.js
// Connects our app to MongoDB using Mongoose.
// Mongoose is an npm package that lets us talk to MongoDB with simple
// JavaScript functions instead of raw database commands.

const mongoose = require('mongoose');

// "async" means this function does slow work (talking to the database)
// without freezing the rest of the program. "await" waits for that work.
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); // stop the server: it is useless without a database
  }
}

// module.exports makes this function available to other files via require()
module.exports = connectDB;
