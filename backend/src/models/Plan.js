const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Plan name is required"],
            trim: true,
            unique: true,
        },
        description: {
            type: String,
            required: [true, "Plan description is required"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Plan price is required"],
            min: [0, "Price cannot be negative"],
        },
        billingInterval: {
            type: String,
            enum: ["monthly", "yearly"],
            default: "monthly",
        },
        features: {
            type: [String],
            default: [],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Plan", planSchema);