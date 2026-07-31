const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        plan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plan",
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "cancelled", "past_due", "expired"],
            default: "active",
        },
        startDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
        endDate: {
            type: Date,
            required: true,
        },
        autoRenew: {
            type: Boolean,
            default: false,
        },
        cancelledAt: {
            type: Date,
            default: null,
        },
        snapshot: {
            name: {
                type: String,
                required: true,
            },
            amount: {
                type: Number,
                required: true,
                min: 0,
            },
            billingInterval: {
                type: String,
                enum: ["monthly", "yearly"],
                required: true,
            },
            features: {
                type: [String],
                default: [],
            },
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Subscription", subscriptionSchema);