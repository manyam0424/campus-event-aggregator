const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    },

    day: {
      type: String,
      required: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ]
    },

    subject: {
      type: String,
      required: true
    },

    startTime: {
      type: String,
      required: true
    },

    endTime: {
      type: String,
      required: true
    },

    room: {
      type: String,
      required: true
    },

    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Timetable",
  timetableSchema
);