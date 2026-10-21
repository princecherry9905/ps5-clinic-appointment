const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Please log in first." });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ message: "Session expired. Please log in again." });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
        return res.status(401).json({ message: "User not found. Please log in again." });
    }

    req.user = user;
    next();
};

const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Only admin/receptionist can do this." });
    }
    next();
};

const patientOnly = (req, res, next) => {
    if (req.user.role !== "patient") {
        return res.status(403).json({ message: "Only patients can do this." });
    }
    next();
};

module.exports = { protect, adminOnly, patientOnly };
