const mongoose = requier("mongoose");

const subscriptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        plan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plan",
            required: true
        },
        status: {
            type: String,
            enmu: ["active", "canceled", "past_due"],
            default: "active"
        },
        priceSnapshot: {
            amount: {
                type: Number,
                required: true
            }
        },
        currentPeriodEnd: {
            type: Date,
            required: true
        }
    }, { timestamps: true } 
)

module.exports = mongoose.model("Subscription", subscriptionSchema);