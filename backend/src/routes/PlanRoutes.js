const express = require("express");
const PlanController = require("../controllers/PlanController");
const router = express.Router();
const { protect, adminOnly, } = require("../middleware/authMiddleware");


router.get("/", protect, adminOnly, PlanController.getAllPlan);
router.get("/:id", protect, adminOnly, PlanController.getPlanById);
router.post("/", protect, adminOnly, PlanController.createPlan);
router.patch("/:id", protect, adminOnly, PlanController.updatePlan);
router.delete("/:id", protect, adminOnly, PlanController.deactivatePlan);



module.exports = router;