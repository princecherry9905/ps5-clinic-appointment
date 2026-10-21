const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { protect, adminOnly, patientOnly } = require("../middleware/authMiddleware");

router.post("/", protect, patientOnly, appointmentController.bookAppointment);
router.get("/my", protect, patientOnly, appointmentController.getMyAppointments);

router.patch("/:id/cancel", protect, appointmentController.cancelAppointment);

router.get("/", protect, adminOnly, appointmentController.getAllAppointments);
router.patch("/:id/status", protect, adminOnly, appointmentController.updateStatus);
router.patch("/:id/notes", protect, adminOnly, appointmentController.addNotes);

module.exports = router;
