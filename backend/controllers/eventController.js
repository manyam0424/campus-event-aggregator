const Event = require("../models/Event");

// ==========================================
// CREATE EVENT
// ==========================================
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      department,
      date,
      venue,
      registrationDeadline,
      maxParticipants,
      points
    } = req.body;

    const event = new Event({
      title,
      description,
      category,
      department,
      date,
      venue,
      registrationDeadline,
      maxParticipants,
      points,
      organizer: req.user.id
    });

    await event.save();

    res.status(201).json({
      message: "Event created successfully",
      event
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ==========================================
// GET ALL EVENTS
// ==========================================
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organizer", "name email")
      .populate("registeredStudents", "name email regId")
      .sort({ date: 1 });

    res.json(events);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ==========================================
// GET SINGLE EVENT
// ==========================================
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name email")
      .populate("registeredStudents", "name email regId");

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.json(event);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ==========================================
// REGISTER STUDENT TEAM FOR EVENT
// ==========================================
exports.registerForEvent = async (req, res) => {
  try {
    const { teamSize, teamMembers } = req.body;

    const event = await Event.findById(req.params.id);

    // Event doesn't exist
    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }


    // ==========================================
    // CHECK TEAM SIZE
    // ==========================================
    if (!teamSize || teamSize < 1) {
      return res.status(400).json({
        message: "Please select a valid team size"
      });
    }


    // ==========================================
    // CHECK MAXIMUM PARTICIPANTS
    // ==========================================
    if (
      event.maxParticipants &&
      teamSize > event.maxParticipants
    ) {
      return res.status(400).json({
        message: `Team cannot have more than ${event.maxParticipants} students`
      });
    }


    // ==========================================
    // CHECK IF STUDENT ALREADY REGISTERED
    // ==========================================
    const alreadyRegistered =
      event.teamRegistrations &&
      event.teamRegistrations.some(
        (team) =>
          team.teamLeader &&
          team.teamLeader.toString() === req.user.id
      );

    if (alreadyRegistered) {
      return res.status(400).json({
        message: "You are already registered for this event"
      });
    }


    // ==========================================
    // CHECK TEAM MEMBER COUNT
    // ==========================================
    if (
      !Array.isArray(teamMembers) ||
      teamMembers.length !== teamSize - 1
    ) {
      return res.status(400).json({
        message: "Please provide all team member names"
      });
    }


    // ==========================================
    // CHECK EMPTY MEMBER NAMES
    // ==========================================
    if (
      teamMembers.some(
        (member) =>
          typeof member !== "string" ||
          !member.trim()
      )
    ) {
      return res.status(400).json({
        message: "Team member names cannot be empty"
      });
    }


    // ==========================================
    // ADD TEAM REGISTRATION
    // ==========================================
    event.teamRegistrations.push({
      teamLeader: req.user.id,
      teamSize,
      teamMembers
    });


    // ==========================================
    // ADD TEAM LEADER TO REGISTERED STUDENTS
    // ==========================================
    if (!event.registeredStudents.includes(req.user.id)) {
      event.registeredStudents.push(req.user.id);
    }


    // ==========================================
    // SAVE EVENT
    // ==========================================
    await event.save();


    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================
    res.status(201).json({
      message: "Team registered successfully",
      teamSize,
      teamMembers
    });

  } catch (error) {

    console.error(
      "Team registration error:",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
};


// ==========================================
// UPDATE EVENT
// ==========================================
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    Object.assign(event, req.body);

    await event.save();

    res.json({
      message: "Event updated successfully",
      event
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ==========================================
// DELETE EVENT
// ==========================================
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(
      req.params.id
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.json({
      message: "Event deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};