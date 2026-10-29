const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================================
// REGISTER
// ==========================================

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      department,
      regId,
      semester
    } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // Create user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      department,
      regId,

      semester:
        role === "student"
          ? semester
          : undefined
    });

    await user.save();

    res.status(201).json({
      message: "Registration Successful"
    });

  } catch (err) {

    console.error("Registration error:", err);

    res.status(500).json({
      message: err.message
    });
  }
};


// ==========================================
// LOGIN
// ==========================================

exports.login = async (req, res) => {
  try {

    const {
      email,
      password
    } = req.body;

    const user = await User.findOne({
      email
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email or Password"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Email or Password"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d"
      }
    );

    res.json({
      message: "Login Successful",
      token,
      user
    });

  } catch (err) {

    console.error("Login error:", err);

    res.status(500).json({
      message: err.message
    });
  }
};


// ==========================================
// GET STUDENTS BY SEMESTER
// ==========================================

exports.getStudentsBySemester = async (req, res) => {

  try {

    const semester = Number(
      req.params.semester
    );

    const students = await User.find({
      role: "student",
      semester: semester
    })
      .select("-password")
      .sort({ name: 1 });

    res.json(students);

  } catch (error) {

    console.error(
      "Error fetching students:",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
};