// routes/blocks.js
// express.Router() is a mini app that holds a group of related routes.
// server.js mounts it at /api/blocks, so "/" here means "/api/blocks".

const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/requireAdmin');
const {
  getAllBlocks,
  getBlockByCode,
  createBlock,
  updateBlock,
  deleteBlock,
  addRoom,
  deleteRoom
} = require('../controllers/blockController');

// Public
router.get('/', getAllBlocks);          // GET /api/blocks
router.get('/:code', getBlockByCode);   // GET /api/blocks/MB

// Admin only: requireAdmin runs first, and only calls the controller if the user is an admin
router.post('/', requireAdmin, createBlock);                          // POST   /api/blocks
router.put('/:code', requireAdmin, updateBlock);                      // PUT    /api/blocks/MB
router.delete('/:code', requireAdmin, deleteBlock);                   // DELETE /api/blocks/MB
router.post('/:code/rooms', requireAdmin, addRoom);                   // POST   /api/blocks/MB/rooms
router.delete('/:code/rooms/:number', requireAdmin, deleteRoom);      // DELETE /api/blocks/MB/rooms/G12

module.exports = router;
