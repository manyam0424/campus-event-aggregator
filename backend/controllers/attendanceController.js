const crypto = require("crypto");

const Attendance = require("../models/Attendance");
const Event = require("../models/Event");


// Generate QR Token
exports.generateQR = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    const qrToken = crypto.randomBytes(32).toString("hex");

    res.json({
      message: "QR token generated",
      qrToken
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Mark Attendance
exports.markAttendance = async (req, res) => {
  try {
    const { eventId, qrToken } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    // Check whether student is registered
    if (!event.registeredStudents.includes(req.user.id)) {
      return res.status(400).json({
        message: "Student is not registered for this event"
      });
    }

    // Check duplicate attendance
    const existingAttendance = await Attendance.findOne({
      student: req.user.id,
      event: eventId
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: "Attendance already marked"
      });
    }

    const attendance = new Attendance({
      student: req.user.id,
      event: eventId,
      qrToken
    });

    await attendance.save();

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Get Event Attendance
exports.getEventAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      event: req.params.eventId
    })
      .populate("student", "name email regID")
      .populate("event", "title date");

    res.json(attendance);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};