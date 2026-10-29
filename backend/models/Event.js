const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    department: {
      type: String,
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    venue: {
      type: String,
      required: true
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    registrationDeadline: {
      type: Date
    },

    // Maximum number of students allowed in ONE team
    maxParticipants: {
      type: Number,
      required: true
    },

    registeredStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    // Team registration details
    teamRegistrations: [
      {
        teamLeader: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },

        teamSize: {
          type: Number,
          required: true
        },

        teamMembers: [
          {
            type: String
          }
        ]
      }
    ],

    points: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Event", eventSchema);