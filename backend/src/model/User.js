const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        minLength: 2,
        maxLength: 30,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minLength: 3,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 50,
        lowercase: true,
        trim: true
    }
},
    {
        timestamps: true
    }
)


module.exports = mongoose.model("User", userSchema);