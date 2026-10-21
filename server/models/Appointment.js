const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
        date: { type: String, required: true },
        slot: { type: String, required: true },
        status: {
            type: String,
            enum: ["Booked", "Checked-In", "Completed", "Cancelled"],
            default: "Booked"
        },
        fee: { type: Number, required: true },
        diagnosis: { type: String, default: "" },
        prescription: { type: String, default: "" }
    },
    { timestamps: true }
);

appointmentSchema.index(
    { doctor: 1, date: 1, slot: 1 },
    { unique: true, partialFilterExpression: { status: "Booked" } }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
