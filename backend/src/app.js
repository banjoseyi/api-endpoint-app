const express = require("express");
require("dotenv").config();
const connectDB = require("./config/database");
const UserRoutes = require("./routes/UserRoutes");
const SubscriptionRoutes = require("./routes/SubscriptionRoutes");
const PlanRoutes = require("./routes/PlanRoutes");

const PORT = process.env.PORT || 5000;



const app = express();
app.use(express.json());


const startServer = async () => {
    try {
        await connectDB()

        const server = app.listen(PORT, () => {
            console.log(`App listening at http://localhost:${PORT}`);
        });

        server.on("error", (error) => {
            console.error("Server error:", error);
        });
        
    } catch (err) {
        console.error(err)
    }
}

//sends User req to UserRoutes
app.use("/api/users", UserRoutes);

//sends Plans req to PlanRoutes
app.use("/api/plans", PlanRoutes);

//sends Subscription req to SubscriptionRoutes
app.use("/api/subscribe", SubscriptionRoutes);



startServer();