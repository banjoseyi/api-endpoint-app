const express = require("express");
require("dotenv").config();
const connectDB = require("./config/database");


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
            console.log(`app listening on port http://localhost:3000`);
        })
    } catch (error) {
        console.error(err)
    }
}

startServer();