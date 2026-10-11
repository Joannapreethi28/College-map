// routes/search.js

const express = require('express');
const router = express.Router();
const { search } = require('../controllers/searchController');

router.get('/', search);   // GET /api/search?q=lab

module.exports = router;
