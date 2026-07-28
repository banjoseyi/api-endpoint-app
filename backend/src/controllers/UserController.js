const mongoose = require("mongoose");
const User = require("../model/User");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Optional manual validation (for missing keys completely)
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are important!" });
    }

    // Check if email exists already
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "User already exist!!" });
    }

    // Attempt to create user (This triggers Mongoose schema validation)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
    });

    return res.status(201).json({
      message: "User registered",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.log("🔴 ACTUAL ERROR:", error);
    // 1. Check if the error is a Mongoose Validation Error
    if (error.name === "ValidationError") {
      let errors = {};

      // 2. Loop through each field that failed validation
      Object.keys(error.errors).forEach((field) => {
        // Extract your custom fallback message defined in the schema
        errors[field] = error.errors[field].message;
      });

      // 3. Send the custom errors back to the client
      return res.status(400).json({
        success: false,
        message: "Validation failed based on input terms.",
        errors: errors, // Returns object mapping each field to its custom error message
      });
    }

    // Handle other types of errors (e.g., duplicate key errors like E11000)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate field value entered.",
      });
    }

    // Fallback for general server errors
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userValid = await User.findOne({ email: email.toLowerCase() });

    if (!userValid)
      return res.status(400).json({
        message: "Email not valid",
      });

    //compare passwords
    const isMatch = await userValid.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: userValid._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    await User.updateOne({ _id: userValid._id }, { loggedIn: true });

    res.status(200).json({
      message: "User Logged in",
      token,
      user: {
        id: userValid._id,
        email: userValid.email,
        name: userValid.name,
        loggedIn: true,
      },
    });
  } catch (err) {
    console.error("🔴 LOGIN ERROR:", err);
    res.status(500).json({ message: "User not loged in" });
  }
};

// Logout User
const logoutUser = async (req, res) => {
  try {
    // req.user comes from our protect middleware!
    await User.updateOne({ _id: req.user._id }, { loggedIn: false });

    res.status(200).json({
      message: "User logged out successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during logout" });
  }
};

module.exports = { registerUser, loginUser, logoutUser };
