// models/Faculty.js
// Faculty are stored in their OWN collection, not inside blocks.
// Each faculty member REFERENCES a block using its code (cabin.blockCode).
// This way we can search faculty on their own, e.g. "all CSE faculty".

const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    department: { type: String, required: true },
    email: { type: String, required: true },

    // Embedded object telling us where their cabin is
    cabin: {
      blockCode: { type: String, required: true, uppercase: true }, // matches Block.code
      roomNumber: { type: String, required: true }
    }
  },
  { timestamps: true }
);

// Collection name in MongoDB will be "faculties"
module.exports = mongoose.model('Faculty', facultySchema);
