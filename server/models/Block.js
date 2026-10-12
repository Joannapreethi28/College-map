// models/Block.js
// A "schema" describes the shape of a document: which fields it has,
// their data types, and rules like "required".
// A "model" is built from the schema and is what we use to read/write
// the "blocks" collection in MongoDB.

const mongoose = require('mongoose');

// Rooms are EMBEDDED inside a block (stored inside the block document).
// A room cannot exist without its block, and we always show them together,
// so there is no need for a separate rooms collection.
const roomSchema = new mongoose.Schema(
  {
    // Unique across the whole campus: block code + floor letter + number, e.g. "MB-G12"
    // (G = ground, F = first, S = second). The controller checks it is not used elsewhere.
    number: { type: String, required: true, uppercase: true, trim: true },
    name: { type: String, required: true },     // e.g. "Data Science Lab"
    type: {
      type: String,
      enum: ['lab', 'classroom', 'office', 'other'], // only these values are allowed
      default: 'other'
    },
    floor: { type: Number, default: 0 }         // 0 = ground floor
  },
  { _id: false } // rooms are found by their number, so they don't need their own _id
);

const blockSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true, uppercase: true }, // e.g. "MB"
    description: { type: String, default: '' },
    hasLift: { type: Boolean, default: false },

    // Position and size of this block's rectangle on the SVG map.
    // Keeping it in the database means admins can add blocks without code changes.
    svg: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      w: { type: Number, required: true },
      h: { type: Number, required: true }
    },

    rooms: [roomSchema] // an array of embedded room documents
  },
  { timestamps: true } // adds createdAt and updatedAt (Date) automatically
);

// mongoose.model('Block', ...) uses the collection "blocks" (lowercase + plural)
module.exports = mongoose.model('Block', blockSchema);
