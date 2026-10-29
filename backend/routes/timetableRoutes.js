const express = require("express");

const router = express.Router();

const timetableController = require("../controllers/timetableController");

const authMiddleware = require("../middleware/authMiddleware");


// ==========================================
// ADD TIMETABLE
// ==========================================

router.post(
  "/",
  authMiddleware,
  timetableController.addTimetable
);


// ==========================================
// GET TIMETABLE
// ==========================================

router.get(
  "/",
  authMiddleware,
  timetableController.getTimetable
);


// ==========================================
// DELETE TIMETABLE
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  timetableController.deleteTimetable
);


module.exports = router;