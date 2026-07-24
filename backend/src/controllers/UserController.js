const mongoose = require("mongoose");
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

        const userValid = await User.findOne({ email: email.toLowerCase() });

        if (!userValid) return res.status(400).json({
            message: "Email not valid"
        })


        //compare passwords
        const isMatch = await userValid.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });


        res.status(200).json({
            message: "User Logged in",
            user: {
                id: userValid._id,
                email: userValid.email,
                name: userValid.name
            }
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "User not loged in" })
    }
}

module.exports = { registerUser, loginUser };