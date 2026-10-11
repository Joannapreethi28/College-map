// controllers/blockController.js
// Controllers hold the actual logic for each route:
// read the request, talk to the database, send the response.

const Block = require('../models/Block');

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

module.exports = { getAllBlocks, getBlockByCode };
