const express = require("express");

const router = express.Router();

const attendanceController = require("../controllers/attendanceController");
const authMiddleware = require("../middleware/authMiddleware");


// Generate QR
router.get(
  "/generate/:eventId",
  authMiddleware,
  attendanceController.generateQR
);


// Mark attendance
router.post(
  "/mark",
  authMiddleware,
  attendanceController.markAttendance
);


// Get event attendance
router.get(
  "/event/:eventId",
  authMiddleware,
  attendanceController.getEventAttendance
);


module.exports = router;