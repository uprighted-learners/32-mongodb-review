const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST - /api/register - register a new user
exports.registerNewUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashedPassword
        });
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}

// POST - /api/login - login a user
exports.loginUser = async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        console.log("User not found"); // Logging for debug
        return res.status(401).json({ message: "Invalid credentials" });
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: "Login successful", token: accessToken });
        } else {
            console.log("Password does not match"); // Logging for debug
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Error during login", error); // More detailed error logging
        res.status(500).json({ message: "Server error during login" });
    }
}