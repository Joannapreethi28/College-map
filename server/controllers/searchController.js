// controllers/searchController.js

const Block = require('../models/Block');
const Faculty = require('../models/Faculty');

// Characters like . * ( ) have special meanings in a regex.
// If a user types "c++" or "(", the regex would break or match the wrong things.
// This puts a backslash before each special character so it is treated as plain text.
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// GET /api/search?q=lab
// Searches room names, room numbers and faculty names.
// Returns { blocks: [...], faculty: [...] }
async function search(req, res, next) {
  try {
    const q = (req.query.q || '').trim();

    // Empty search -> empty results (no need to touch the database)
    if (q === '') {
      return res.json({ blocks: [], faculty: [] });
    }

    // $regex = pattern match ("contains"), $options: 'i' = ignore upper/lower case
    const pattern = { $regex: escapeRegex(q), $options: 'i' };

    // $or = match if ANY of these conditions is true
    const blocks = await Block.find(
      { $or: [{ 'rooms.name': pattern }, { 'rooms.number': pattern }] },
      { name: 1, code: 1, rooms: 1 } // projection: only return these fields
    ).limit(20);

    // A matched block still contains ALL its rooms.
    // Keep only the rooms that actually match, so the results are clear.
    const regex = new RegExp(escapeRegex(q), 'i');
    const matchedBlocks = blocks.map((block) => {
      const rooms = block.rooms.filter((room) => {
        return regex.test(room.name) || regex.test(room.number);
      });
      return { _id: block._id, name: block.name, code: block.code, rooms: rooms };
    });

    const faculty = await Faculty.find(
      { name: pattern },
      { name: 1, department: 1, cabin: 1 } // projection: skip email etc.
    )
      .sort({ name: 1 })
      .limit(20);

    res.json({ blocks: matchedBlocks, faculty: faculty });
  } catch (err) {
    next(err);
  }
}

module.exports = { search };
