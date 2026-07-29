const mongoose = require("mongoose");
const { modelName } = require("./User");

const planSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        interval: {
            type: String,
            enum: ["monthly", yearly],
            default: "monthly"
        }
    }, { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);