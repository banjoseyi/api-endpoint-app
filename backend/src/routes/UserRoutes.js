const express = require('express');
const userController = require("../controllers/UserController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");



router.post("/register", userController.registerUser)
router.post("/login", userController.loginUser)
router.post("/logout", protect, userController.logoutUser);

module.exports = router;


