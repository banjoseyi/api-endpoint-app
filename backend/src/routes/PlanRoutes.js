const express = require("express");
const PlanController = require("../controllers/PlanController");
const router = express.Router();
const { protect, adminOnly, } = require("../middleware/authMiddleware");


router.get("/", protect, adminOnly, PlanController.getAllPlan);
router.post("/", protect, adminOnly, PlanController.createPlan);



module.exports = router;