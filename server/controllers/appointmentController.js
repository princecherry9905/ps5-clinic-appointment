const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const { generateSlots, isValidDate, getDayName, getToday, isInFuture } = require("../utils/timeHelpers");

const appointmentController = {
    bookAppointment: async (req, res) => {
        const { doctorId, date, slot } = req.body;

        if (!doctorId || !date || !slot) {
            return res.status(400).json({ message: "Doctor, date and slot are required." });
        }
        if (!isValidDate(date)) {
            return res.status(400).json({ message: "Please choose a valid date." });
        }

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found." });
        }

        if (date < getToday()) {
            return res.status(400).json({ message: "You cannot book an appointment on a past date." });
        }

        const dayName = getDayName(date);
        if (!doctor.availableDays.includes(dayName)) {
            return res.status(400).json({ message: "Doctor is not available on " + dayName + "." });
        }

        const allSlots = generateSlots(doctor.startTime, doctor.endTime, doctor.slotDuration);
        if (!allSlots.includes(slot)) {
            return res.status(400).json({ message: "This is not a valid time slot for this doctor." });
        }

        if (!isInFuture(date, slot)) {
            return res.status(400).json({ message: "This time slot has already passed." });
        }

        const slotTaken = await Appointment.findOne({
            doctor: doctor._id,
            date: date,
            slot: slot,
            status: { $ne: "Cancelled" }
        });
        if (slotTaken) {
            return res.status(409).json({ message: "This slot is already booked. Please choose another slot." });
        }

        const patientBusy = await Appointment.findOne({
            patient: req.user._id,
            date: date,
            slot: slot,
            status: { $ne: "Cancelled" }
        });
        if (patientBusy) {
            return res.status(409).json({ message: "You already have an appointment at this date and time." });
        }

        const appointment = await Appointment.create({
            patient: req.user._id,
            doctor: doctor._id,
            date: date,
            slot: slot,
            fee: doctor.fee
        });

        res.status(201).json(appointment);
    },

    getMyAppointments: async (req, res) => {
        const appointments = await Appointment.find({ patient: req.user._id })
            .populate("doctor", "name specialization")
            .sort({ date: -1, slot: -1 });

        res.status(200).json(appointments);
    },

    getAllAppointments: async (req, res) => {
        const filter = {};

        if (req.query.date) {
            filter.date = req.query.date;
        }
        if (req.query.status) {
            filter.status = req.query.status;
        }
        if (req.query.doctor) {
            filter.doctor = req.query.doctor;
        }

        const appointments = await Appointment.find(filter)
            .populate("patient", "name email phone age gender")
            .populate("doctor", "name specialization")
            .sort({ date: -1, slot: 1 });

        res.status(200).json(appointments);
    },

    cancelAppointment: async (req, res) => {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        const isAdmin = req.user.role === "admin";
        const isOwner = appointment.patient.toString() === req.user._id.toString();

        if (!isAdmin && !isOwner) {
            return res.status(403).json({ message: "You can cancel only your own appointments." });
        }
        if (appointment.status !== "Booked") {
            return res.status(400).json({
                message: "Only booked appointments can be cancelled. This one is " + appointment.status + "."
            });
        }
        if (!isInFuture(appointment.date, appointment.slot)) {
            return res.status(400).json({ message: "You cannot cancel after the appointment time." });
        }

        appointment.status = "Cancelled";
        await appointment.save();

        res.status(200).json(appointment);
    },

    updateStatus: async (req, res) => {
        const newStatus = req.body.status;

        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        const oldStatus = appointment.status;
        let allowed = false;

        if (oldStatus === "Booked" && newStatus === "Checked-In") {
            allowed = true;
        } else if (oldStatus === "Checked-In" && newStatus === "Completed") {
            allowed = true;
        } else if (oldStatus === "Booked" && newStatus === "Cancelled") {
            allowed = true;
        }

        if (!allowed) {
            return res.status(400).json({
                message: "Cannot change status from " + oldStatus + " to " + newStatus + "."
            });
        }

        appointment.status = newStatus;
        await appointment.save();

        res.status(200).json(appointment);
    },

    addNotes: async (req, res) => {
        const { diagnosis, prescription } = req.body;

        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found." });
        }
        if (appointment.status !== "Completed") {
            return res.status(400).json({ message: "Notes can be added only to completed appointments." });
        }
        if (!diagnosis || diagnosis.trim() === "") {
            return res.status(400).json({ message: "Diagnosis is required." });
        }

        appointment.diagnosis = diagnosis;
        appointment.prescription = prescription || "";
        await appointment.save();

        res.status(200).json(appointment);
    }
};

module.exports = appointmentController;
