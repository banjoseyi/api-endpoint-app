const express = require("express");
require("dotenv").config();
const connectDB = require("./config/database");
const UserRoutes = require("./routes/UserRoutes")
const PORT = process.env.PORT || 5000;



const app = express();
app.use(express.json());


const startServer = async () => {
    try {
        await connectDB()

        app.on("error", (error) => {
            console.log("ERROR", error);
            throw error
        });

        app.listen(PORT, () => {
            console.log(`app listening on port http://localhost:5000`);
        })
    } catch (err) {
        console.error(err)   
    }
}

app.use("/api/users", UserRoutes);


startServer();