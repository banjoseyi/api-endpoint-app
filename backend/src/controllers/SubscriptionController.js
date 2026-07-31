const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");

const calculateEndDate = (startDate, billingInterval) => {
    const endDate = new Date(startDate);

    if (billingInterval === "monthly") {
        endDate.setMonth(endDate.getMonth() + 1);
    } else if (billingInterval === "yearly") {
        endDate.setFullYear(endDate.getFullYear() + 1);
    }

    return endDate;
};

const subscribe = async (req, res) => {
    try {
        const { planId, autoRenew = false } = req.body;

        if (!planId) {
            return res.status(400).json({
                success: false,
                message: "Plan ID is required",
            });
        }

        if (typeof autoRenew !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "autoRenew must be true or false",
            });
        }

        const plan = await Plan.findOne({
            _id: planId,
            isActive: true,
        });

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Active plan not found",
            });
        }

        const existingSubscription = await Subscription.findOne({
            user: req.user._id,
            status: "active",
            endDate: { $gt: new Date() },
        });

        if (existingSubscription) {
            return res.status(409).json({
                success: false,
                message: "You already have an active subscription",
            });
        }

        const startDate = new Date();

        const endDate = calculateEndDate(
            startDate,
            plan.billingInterval
        );

        const subscription = await Subscription.create({
            user: req.user._id,
            plan: plan._id,
            status: "active",
            startDate,
            endDate,
            autoRenew,
            snapshot: {
                name: plan.name,
                amount: plan.price,
                billingInterval: plan.billingInterval,
                features: plan.features,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Subscription created successfully",
            data: subscription,
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid plan ID",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to create subscription",
            error: error.message,
        });
    }
};


const getCurrentSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            user: req.user._id,
            status: "active",
        })
            .populate("plan", "name description price billingInterval")
            .sort({ createdAt: -1 });

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "You do not have an active subscription",
            });
        }

        // Update an overdue subscription
        if (subscription.endDate <= new Date()) {
            subscription.status = "expired";
            subscription.autoRenew = false;

            await subscription.save();

            return res.status(404).json({
                success: false,
                message: "Your subscription has expired",
            });
        }

        return res.status(200).json({
            success: true,
            data: subscription,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve subscription",
            error: error.message,
        });
    }
};



const getSubscriptionHistory = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({
            user: req.user._id,
        })
            .populate("plan", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: subscriptions.length,
            data: subscriptions,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve subscription history",
            error: error.message,
        });
    }
};



const updateAutoRenew = async (req, res) => {
    try {
        const { autoRenew } = req.body;

        if (typeof autoRenew !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "autoRenew must be true or false",
            });
        }

        const subscription = await Subscription.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id,
                status: "active",
            },
            { autoRenew },
            {
                new: true,
                runValidators: true,
            },
        );

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Active subscription not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Auto-renew preference updated",
            data: subscription,
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid subscription ID",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to update auto-renew preference",
            error: error.message,
        });
    }
};

const cancelSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            _id: req.params.id,
            user: req.user._id,
            status: "active",
        });

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Active subscription not found",
            });
        }

        subscription.status = "cancelled";
        subscription.cancelledAt = new Date();
        subscription.autoRenew = false;

        await subscription.save();

        return res.status(200).json({
            success: true,
            message: "Subscription cancelled successfully",
            data: subscription,
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid subscription ID",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to cancel subscription",
            error: error.message,
        });

    }
};


module.exports = {
    subscribe,
    getCurrentSubscription,
    getSubscriptionHistory,
    cancelSubscription,
    updateAutoRenew
}