// routes/faculty.js

const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/requireAdmin');
const {
  getFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty
} = require('../controllers/facultyController');

// Public
router.get('/', getFaculty);   // GET /api/faculty?department=&blockCode=

// Admin only
router.post('/', requireAdmin, createFaculty);         // POST   /api/faculty
router.put('/:id', requireAdmin, updateFaculty);       // PUT    /api/faculty/<id>
router.delete('/:id', requireAdmin, deleteFaculty);    // DELETE /api/faculty/<id>

module.exports = router;
