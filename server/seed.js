require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Doctor = require("./models/Doctor");

const sampleDoctors = [
    {
        name: "Dr. Anjali Sharma",
        specialization: "General Physician",
        fee: 400,
        availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        startTime: "09:00",
        endTime: "13:00",
        slotDuration: 20
    },
    {
        name: "Dr. Rohan Verma",
        specialization: "Cardiologist",
        fee: 800,
        availableDays: ["Mon", "Wed", "Fri"],
        startTime: "10:00",
        endTime: "14:00",
        slotDuration: 30
    },
    {
        name: "Dr. Priya Nair",
        specialization: "Dermatologist",
        fee: 600,
        availableDays: ["Tue", "Thu", "Sat"],
        startTime: "16:00",
        endTime: "19:00",
        slotDuration: 30
    },
    {
        name: "Dr. Arjun Mehta",
        specialization: "Pediatrician",
        fee: 500,
        availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        startTime: "11:00",
        endTime: "15:00",
        slotDuration: 15
    }
];

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const adminEmail = (process.env.ADMIN_EMAIL || "admin@clinic.com").toLowerCase();
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
        console.log("Admin already exists: " + adminEmail);
    } else {
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10);
        await User.create({
            name: process.env.ADMIN_NAME || "Clinic Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "admin"
        });
        console.log("Admin created: " + adminEmail);
    }

    const doctorCount = await Doctor.countDocuments();
    if (doctorCount > 0) {
        console.log("Doctors already exist (" + doctorCount + "), sample doctors not added.");
    } else {
        await Doctor.insertMany(sampleDoctors);
        console.log("Added " + sampleDoctors.length + " sample doctors.");
    }

    await mongoose.disconnect();
}

seed().catch((error) => {
    console.log("Seed failed:", error.message);
    process.exit(1);
});
