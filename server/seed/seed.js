// seed/seed.js
// Fills the database with starting data from seed.json.
// It DELETES everything first and then inserts fresh data,
// so it is safe to run again and again without making duplicates.
//
// Run it from the server folder:   npm run seed

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Block = require('../models/Block');
const Faculty = require('../models/Faculty');
const User = require('../models/User');

// require() can also load a JSON file and turn it into a JS object
const data = require('./seed.json');

// TODO real data: blocks, rooms and svg positions in seed.json are placeholders.
// Replace them with our college's real blocks and adjust x/y/w/h to match the campus.
// TODO real data: faculty names, departments and cabins are placeholders.
// TODO real data: change the admin email and password before the demo.

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. Wipe the old data (deleteMany with an empty filter {} deletes all documents)
    await Block.deleteMany({});
    await Faculty.deleteMany({});
    await User.deleteMany({});
    console.log('Old data removed');

    // 2. Insert blocks (with their embedded rooms) and faculty
    await Block.insertMany(data.blocks);
    await Faculty.insertMany(data.faculty);

    // 3. Create the admin user with a hashed password.
    // bcrypt.hash scrambles the password; 10 is how many rounds of scrambling.
    const passwordHash = await bcrypt.hash(data.admin.password, 10);
    await User.create({
      name: data.admin.name,
      email: data.admin.email,
      passwordHash: passwordHash,
      role: 'admin'
    });

    // 4. Print counts so we can check everything went in
    const blockCount = await Block.countDocuments();
    const facultyCount = await Faculty.countDocuments();
    const userCount = await User.countDocuments();

    let roomCount = 0;
    data.blocks.forEach((block) => {
      roomCount = roomCount + block.rooms.length;
    });

    console.log(`Inserted ${blockCount} blocks, ${roomCount} rooms, ${facultyCount} faculty, ${userCount} user`);
  } catch (err) {
    console.error('Seeding failed:', err.message);
  } finally {
    // "finally" always runs, so we always close the connection
    await mongoose.disconnect();
  }
}

seed();
