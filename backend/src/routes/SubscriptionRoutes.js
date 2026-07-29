const express = require("express");
const subscriptionController = require("../controllers/SubscriptionController");
const router = express.Router();


router.get("/", subscriptionController.subscribeUser);

module.exports = router;