const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["patient", "admin"], default: "patient" },
        age: { type: Number, min: 0, max: 120 },
        gender: { type: String, enum: ["Male", "Female", "Other", ""], default: "" },
        phone: { type: String, trim: true, default: "" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
