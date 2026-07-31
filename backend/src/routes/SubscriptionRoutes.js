const express = require("express");
const subscriptionController = require("../controllers/SubscriptionController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");


router.post("/", protect, subscriptionController.subscribe);
router.get("/current", protect, subscriptionController.getCurrentSubscription);
router.get("/history", protect, subscriptionController.getSubscriptionHistory);
router.patch("/:id/cancel", protect, subscriptionController.cancelSubscription);
router.patch("/:id/auto-renew", protect, subscriptionController.updateAutoRenew);



module.exports = router;