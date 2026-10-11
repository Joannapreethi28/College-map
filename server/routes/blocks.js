// routes/blocks.js
// express.Router() is a mini app that holds a group of related routes.
// server.js mounts it at /api/blocks, so "/" here means "/api/blocks".

const express = require('express');
const router = express.Router();
const { getAllBlocks, getBlockByCode } = require('../controllers/blockController');

router.get('/', getAllBlocks);          // GET /api/blocks
router.get('/:code', getBlockByCode);   // GET /api/blocks/MB

module.exports = router;
