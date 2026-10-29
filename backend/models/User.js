const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["student", "faculty", "admin"],
      default: "student"
    },

    department: {
      type: String
    },

    regId: {
      type: String,
      required: true
    },

    semester: {
      type: Number,
      required: function () {
        return this.role === "student";
      },
      min: 1,
      max: 8
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);