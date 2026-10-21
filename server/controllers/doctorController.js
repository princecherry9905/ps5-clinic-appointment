const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const {
    generateSlots,
    isValidDate,
    getDayName,
    getToday,
    isInFuture,
    timeToMinutes
} = require("../utils/timeHelpers");

function escapeForSearch(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function checkDoctorTimes(body) {
    if (!body.availableDays || body.availableDays.length === 0) {
        return "Select at least one available day.";
    }
    if (body.startTime && body.endTime) {
        if (timeToMinutes(body.startTime) >= timeToMinutes(body.endTime)) {
            return "End time must be after start time.";
        }
        const workingMinutes = timeToMinutes(body.endTime) - timeToMinutes(body.startTime);
        if (Number(body.slotDuration) > workingMinutes) {
            return "Slot duration is longer than the working hours.";
        }
    }
    return null;
}

const doctorController = {
    getDoctors: async (req, res) => {
        const filter = {};

        if (req.query.specialization) {
            filter.specialization = req.query.specialization;
        }
        if (req.query.search) {
            const pattern = escapeForSearch(req.query.search.trim());
            filter.$or = [
                { name: { $regex: pattern, $options: "i" } },
                { specialization: { $regex: pattern, $options: "i" } }
            ];
        }

        const doctors = await Doctor.find(filter).sort({ name: 1 });
        res.status(200).json(doctors);
    },

    getSpecializations: async (req, res) => {
        const list = await Doctor.distinct("specialization");
        list.sort();
        res.status(200).json(list);
    },

    getDoctorById: async (req, res) => {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found." });
        }
        res.status(200).json(doctor);
    },

    createDoctor: async (req, res) => {
        const problem = checkDoctorTimes(req.body);
        if (problem) {
            return res.status(400).json({ message: problem });
        }

        const doctor = await Doctor.create({
            name: req.body.name,
            specialization: req.body.specialization,
            fee: req.body.fee,
            availableDays: req.body.availableDays,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            slotDuration: req.body.slotDuration
        });

        res.status(201).json(doctor);
    },

    updateDoctor: async (req, res) => {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found." });
        }

        const problem = checkDoctorTimes(req.body);
        if (problem) {
            return res.status(400).json({ message: problem });
        }

        doctor.name = req.body.name;
        doctor.specialization = req.body.specialization;
        doctor.fee = req.body.fee;
        doctor.availableDays = req.body.availableDays;
        doctor.startTime = req.body.startTime;
        doctor.endTime = req.body.endTime;
        doctor.slotDuration = req.body.slotDuration;

        await doctor.save();
        res.status(200).json(doctor);
    },

    deleteDoctor: async (req, res) => {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found." });
        }

        const activeCount = await Appointment.countDocuments({
            doctor: doctor._id,
            status: { $in: ["Booked", "Checked-In"] }
        });
        if (activeCount > 0) {
            return res.status(400).json({
                message: "This doctor has " + activeCount + " active appointment(s). Cancel or complete them first."
            });
        }

        await Doctor.findByIdAndDelete(doctor._id);
        res.status(200).json({ message: "Doctor deleted." });
    },

    getSlots: async (req, res) => {
        const date = req.query.date;

        if (!date || !isValidDate(date)) {
            return res.status(400).json({ message: "Please choose a valid date." });
        }

        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found." });
        }

        const dayName = getDayName(date);

        if (date < getToday()) {
            return res.status(200).json({ date: date, day: dayName, slots: [], message: "You cannot book a past date." });
        }
        if (!doctor.availableDays.includes(dayName)) {
            return res.status(200).json({
                date: date,
                day: dayName,
                slots: [],
                message: "Doctor is not available on " + dayName + ". Available days: " + doctor.availableDays.join(", ")
            });
        }

        const takenAppointments = await Appointment.find({
            doctor: doctor._id,
            date: date,
            status: { $ne: "Cancelled" }
        });
        const takenSlots = [];
        for (const appointment of takenAppointments) {
            takenSlots.push(appointment.slot);
        }

        const allSlots = generateSlots(doctor.startTime, doctor.endTime, doctor.slotDuration);
        const slots = [];
        for (const time of allSlots) {
            slots.push({
                time: time,
                isBooked: takenSlots.includes(time),
                isPast: !isInFuture(date, time)
            });
        }

        res.status(200).json({ date: date, day: dayName, slots: slots, message: "" });
    }
};

module.exports = doctorController;
