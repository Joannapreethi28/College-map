// routes/faculty.js

const express = require('express');
const router = express.Router();
const { getFaculty } = require('../controllers/facultyController');

router.get('/', getFaculty);   // GET /api/faculty?department=&blockCode=

module.exports = router;
