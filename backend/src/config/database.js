const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const ConnectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`\n MongoDB connected!!! ${ConnectionInstance.connection.host}`)
    } catch (err) {
        console.error("MongoDB Connection failed", err);
        process.exit(1);
    }
}


module.exports = connectDB;