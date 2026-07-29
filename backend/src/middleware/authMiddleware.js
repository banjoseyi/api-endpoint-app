const jwt = require("jsonwebtoken");
const User = require("../model/User");

const protect = async (req, res, next) => {
    try {
        let token;

        // Check if the request has an authorization header starting with Bearer
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            // Find user by id from the token and attach to req.user (exclude password)
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({
                    message: "The user associated with this token no longer exists",
                });
            }

            next(); // Move on to the actual controller
        } else {
            return res.status(401).json({ message: "Not authorized, no token provided" });
        }
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};

module.exports = { protect };