const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const { getToday } = require("../utils/timeHelpers");

const dashboardController = {
    getDashboard: async (req, res) => {
        const today = getToday();

        const doctors = await Doctor.find().sort({ name: 1 });
        const appointments = await Appointment.find();

        const todayAppointments = await Appointment.find({ date: today })
            .populate("patient", "name phone")
            .populate("doctor", "name specialization")
            .sort({ slot: 1 });

        let totalAppointments = 0;
        let cancelledCount = 0;
        let completedCount = 0;
        let revenue = 0;

        for (const appointment of appointments) {
            totalAppointments = totalAppointments + 1;

            if (appointment.status === "Cancelled") {
                cancelledCount = cancelledCount + 1;
            }
            if (appointment.status === "Completed") {
                completedCount = completedCount + 1;
                revenue = revenue + appointment.fee;
            }
        }

        const doctorStats = [];
        for (const doctor of doctors) {
            let total = 0;
            let completed = 0;
            let cancelled = 0;
            let doctorRevenue = 0;

            for (const appointment of appointments) {
                if (appointment.doctor.toString() === doctor._id.toString()) {
                    total = total + 1;
                    if (appointment.status === "Completed") {
                        completed = completed + 1;
                        doctorRevenue = doctorRevenue + appointment.fee;
                    }
                    if (appointment.status === "Cancelled") {
                        cancelled = cancelled + 1;
                    }
                }
            }

            doctorStats.push({
                doctorId: doctor._id,
                name: doctor.name,
                specialization: doctor.specialization,
                total: total,
                completed: completed,
                cancelled: cancelled,
                revenue: doctorRevenue
            });
        }

        res.status(200).json({
            today: today,
            todayCount: todayAppointments.length,
            todayAppointments: todayAppointments,
            totalAppointments: totalAppointments,
            cancelledCount: cancelledCount,
            completedCount: completedCount,
            revenue: revenue,
            doctorStats: doctorStats
        });
    }
};

module.exports = dashboardController;
