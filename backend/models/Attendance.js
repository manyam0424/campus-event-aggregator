const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },

    qrToken: {
      type: String,
      required: true
    },

    checkedInAt: {
      type: Date,
      default: Date.now
    },

    status: {
      type: String,
      enum: ["present", "invalid"],
      default: "present"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Attendance", attendanceSchema);