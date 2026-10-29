const express = require("express");

const router = express.Router();

const eventController = require("../controllers/eventController");
const authMiddleware = require("../middleware/authMiddleware");


// Get all events
router.get("/", authMiddleware, eventController.getEvents);

// Get single event
router.get("/:id", authMiddleware, eventController.getEventById);

// Create event
router.post("/", authMiddleware, eventController.createEvent);

// Register for event
router.post("/:id/register", authMiddleware, eventController.registerForEvent);

// Update event
router.put("/:id", authMiddleware, eventController.updateEvent);

// Delete event
router.delete("/:id", authMiddleware, eventController.deleteEvent);


module.exports = router;