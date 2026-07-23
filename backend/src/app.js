const express = require("express");
require("dotenv").config();
const connectDB = require("./config/database");
const UserRoutes = require("./routes/UserRoutes")



const app = express();
app.use(express.json());


const startServer = async () => {
    try {
        await connectDB()

        app.on("error", (error) => {
            console.log("ERROR", error);
            throw error
        });

        app.listen(5000, () => {
            console.log(`app listening on port http://localhost:5000`);
        })
    } catch (error) {
        console.error(err)
    }
}

app.use("/api/users", UserRoutes);


startServer();