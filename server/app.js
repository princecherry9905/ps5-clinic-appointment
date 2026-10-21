require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

connectDB();

let allowedOrigins = true;
if (process.env.CLIENT_URL) {
    allowedOrigins = process.env.CLIENT_URL.split(",");
}
app.use(cors({ origin: allowedOrigins }));

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Clinic API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
