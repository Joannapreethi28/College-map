// controllers/blockController.js
// Controllers hold the actual logic for each route:
// read the request, talk to the database, send the response.

const Block = require('../models/Block');
const appEvents = require('../events/appEvents');

// ---------- Public ----------

// GET /api/blocks  -> all blocks, sorted by name (A to Z)
async function getAllBlocks(req, res, next) {
  try {
    // find({}) with an empty filter returns every document
    const blocks = await Block.find({}).sort({ name: 1 }); // 1 = ascending
    res.json(blocks); // status 200 is the default
  } catch (err) {
    next(err); // send the error to errorHandler
  }
}

// GET /api/blocks/:code  -> one block, e.g. /api/blocks/MB
async function getBlockByCode(req, res, next) {
  try {
    // req.params holds the values from the URL (":code" becomes req.params.code)
    const code = req.params.code.toUpperCase();
    const block = await Block.findOne({ code: code });

    if (!block) {
      return res.status(404).json({ message: `Block ${code} not found` });
    }

    res.json(block);
  } catch (err) {
    next(err);
  }
}

// ---------- Admin only (requireAdmin runs before these) ----------

// POST /api/blocks  -> create a new block from the JSON body
async function createBlock(req, res, next) {
  try {
    // Mongoose checks the schema rules (required, enum...) before saving.
    // If a rule fails it throws a ValidationError, which errorHandler turns into 400.
    const block = await Block.create(req.body);

    // Announce the change; the listener in appEvents.js writes it to audit.log
    appEvents.emit('blockCreated', { code: block.code, by: req.user.name });

    res.status(201).json(block); // 201 = Created
  } catch (err) {
    next(err);
  }
}

// PUT /api/blocks/:code  -> update an existing block
async function updateBlock(req, res, next) {
  try {
    const code = req.params.code.toUpperCase();
    const block = await Block.findOne({ code: code });

    if (!block) {
      return res.status(404).json({ message: `Block ${code} not found` });
    }

    // Copy the new values onto the block, then save (save() runs the schema rules again)
    block.set(req.body);
    await block.save();

    appEvents.emit('blockUpdated', { code: block.code, by: req.user.name });

    res.json(block);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/blocks/:code
async function deleteBlock(req, res, next) {
  try {
    const code = req.params.code.toUpperCase();
    const block = await Block.findOneAndDelete({ code: code });

    if (!block) {
      return res.status(404).json({ message: `Block ${code} not found` });
    }

    appEvents.emit('blockDeleted', { code: code, by: req.user.name });

    res.json({ message: `Block ${code} deleted` });
  } catch (err) {
    next(err);
  }
}

// POST /api/blocks/:code/rooms  -> add one room to a block
async function addRoom(req, res, next) {
  try {
    const code = req.params.code.toUpperCase();
    const block = await Block.findOne({ code: code });

    if (!block) {
      return res.status(404).json({ message: `Block ${code} not found` });
    }

    // Room numbers must be unique inside a block
    const alreadyThere = block.rooms.find((room) => room.number === req.body.number);
    if (alreadyThere) {
      return res.status(400).json({ message: `Room ${req.body.number} already exists in ${code}` });
    }

    // rooms is an array inside the document, so we just push and save
    block.rooms.push(req.body);
    await block.save();

    appEvents.emit('blockUpdated', { code: code, by: req.user.name });

    res.status(201).json(block);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/blocks/:code/rooms/:number  -> remove one room from a block
async function deleteRoom(req, res, next) {
  try {
    const code = req.params.code.toUpperCase();
    const number = req.params.number;
    const block = await Block.findOne({ code: code });

    if (!block) {
      return res.status(404).json({ message: `Block ${code} not found` });
    }

    const index = block.rooms.findIndex((room) => room.number === number);
    if (index === -1) {
      return res.status(404).json({ message: `Room ${number} not found in ${code}` });
    }

    block.rooms.splice(index, 1); // remove 1 item at that position
    await block.save();

    appEvents.emit('blockUpdated', { code: code, by: req.user.name });

    res.json(block);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllBlocks,
  getBlockByCode,
  createBlock,
  updateBlock,
  deleteBlock,
  addRoom,
  deleteRoom
};
