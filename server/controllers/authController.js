const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function createToken(user) {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
}

function userData(user) {
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        gender: user.gender,
        phone: user.phone
    };
}

const authController = {
    register: async (req, res) => {
        const { name, email, password, age, gender, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required." });
        }
        if (!email.includes("@")) {
            return res.status(400).json({ message: "Please enter a valid email." });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters." });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ message: "This email is already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
            age: age,
            gender: gender,
            phone: phone
        });

        res.status(201).json({ user: userData(user), token: createToken(user) });
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        res.status(200).json({ user: userData(user), token: createToken(user) });
    },

    getProfile: async (req, res) => {
        res.status(200).json(userData(req.user));
    },

    updateProfile: async (req, res) => {
        const { name, age, gender, phone } = req.body;

        const user = await User.findById(req.user._id);

        if (name !== undefined) {
            if (name.trim() === "") {
                return res.status(400).json({ message: "Name cannot be empty." });
            }
            user.name = name;
        }
        if (age !== undefined && age !== "") {
            user.age = age;
        }
        if (gender !== undefined) {
            user.gender = gender;
        }
        if (phone !== undefined) {
            user.phone = phone;
        }

        await user.save();

        res.status(200).json(userData(user));
    }
};

module.exports = authController;
