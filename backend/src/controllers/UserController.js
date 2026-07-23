const mongoose = require("mongoose");
const UserRoutes = require("../routes/UserRoutes");
const User = require("../model/User");


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are important!" });
        }

        //if email exist already
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ message: "User already exist!!" });
        }

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password
        });

        res.status(201).json({
            message: "User registered",
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });


    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Could not register user" })
    }
}

const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        //validate
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are important!" });
        }

        const userData = await User.findOne({ email: email.toLowerCase(), password: password });

        if (!userData) {
            return res.status(400).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "Loged in Sucessfully",
            userData: {
                id: userData._id,
                email: userData.email,
                name: userData.name,
                loggedIn: true
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "User not loged in" })
    }
}

module.exports = { registerUser, loginUser };