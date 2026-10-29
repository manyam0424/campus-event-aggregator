const Timetable = require("../models/Timetable");

// ==========================================
// ADD TIMETABLE
// ==========================================

exports.addTimetable = async (req, res) => {
  try {
    const {
      department,
      semester,
      day,
      subject,
      startTime,
      endTime,
      room
    } = req.body;

    const timetable = new Timetable({
      department,
      semester,
      day,
      subject,
      startTime,
      endTime,
      room,
      faculty: req.user.id
    });

    await timetable.save();

    res.status(201).json({
      message: "Timetable added successfully",
      timetable
    });

  } catch (error) {

    console.error(
      "Error adding timetable:",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
};


// ==========================================
// GET TIMETABLE
// ==========================================

exports.getTimetable = async (req, res) => {
  try {

    const {
      department,
      semester
    } = req.query;

    const filter = {};

    if (department) {
      filter.department = department;
    }

    if (semester) {
      filter.semester = Number(semester);
    }

    const timetable = await Timetable.find(filter)
      .populate("faculty", "name email")
      .sort({
        semester: 1,
        day: 1,
        startTime: 1
      });

    res.json(timetable);

  } catch (error) {

    console.error(
      "Error fetching timetable:",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
};


// ==========================================
// DELETE TIMETABLE
// ==========================================

exports.deleteTimetable = async (req, res) => {
  try {

    const timetable =
      await Timetable.findByIdAndDelete(
        req.params.id
      );

    if (!timetable) {

      return res.status(404).json({
        message: "Timetable entry not found"
      });

    }

    res.json({
      message: "Timetable deleted successfully"
    });

  } catch (error) {

    console.error(
      "Error deleting timetable:",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
};