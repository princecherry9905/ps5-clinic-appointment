const mongoose = require("mongoose");

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIME_FORMAT = /^([01]\d|2[0-3]):[0-5]\d$/;

const doctorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        specialization: { type: String, required: true, trim: true },
        fee: { type: Number, required: true, min: 0 },
        availableDays: {
            type: [{ type: String, enum: DAYS }],
            required: true
        },
        startTime: { type: String, required: true, match: TIME_FORMAT },
        endTime: { type: String, required: true, match: TIME_FORMAT },
        slotDuration: { type: Number, required: true, min: 5, max: 240 }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
