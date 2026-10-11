// controllers/facultyController.js

const Faculty = require('../models/Faculty');

// ---------- Public ----------

// GET /api/faculty
// Optional filters in the query string (the part after "?"):
//   /api/faculty?blockCode=CS
//   /api/faculty?department=CSE
//   /api/faculty?department=CSE,ECE   (more than one department)
async function getFaculty(req, res, next) {
  try {
    // req.query holds the values after "?" in the URL
    const { department, blockCode } = req.query;

    // Build the filter step by step. An empty filter {} means "everyone".
    const filter = {};

    if (department) {
      // "CSE,ECE" -> ["CSE", "ECE"]
      const departments = department.split(',').map((d) => d.trim());
      // $in matches if the field equals ANY value in the array
      filter.department = { $in: departments };
    }

    if (blockCode) {
      // Dot notation lets us filter on a field inside an embedded object
      filter['cabin.blockCode'] = blockCode.toUpperCase();
    }

    const faculty = await Faculty.find(filter).sort({ name: 1 });
    res.json(faculty);
  } catch (err) {
    next(err);
  }
}

// ---------- Admin only ----------

// POST /api/faculty
async function createFaculty(req, res, next) {
  try {
    const faculty = await Faculty.create(req.body);
    res.status(201).json(faculty);
  } catch (err) {
    next(err);
  }
}

// PUT /api/faculty/:id
async function updateFaculty(req, res, next) {
  try {
    const faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    faculty.set(req.body);
    await faculty.save();
    res.json(faculty);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/faculty/:id
async function deleteFaculty(req, res, next) {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.json({ message: 'Faculty deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getFaculty, createFaculty, updateFaculty, deleteFaculty };
