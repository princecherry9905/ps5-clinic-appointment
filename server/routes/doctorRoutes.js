const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", doctorController.getDoctors);
router.get("/specializations", doctorController.getSpecializations);
router.get("/:id", doctorController.getDoctorById);
router.get("/:id/slots", protect, doctorController.getSlots);

router.post("/", protect, adminOnly, doctorController.createDoctor);
router.put("/:id", protect, adminOnly, doctorController.updateDoctor);
router.delete("/:id", protect, adminOnly, doctorController.deleteDoctor);

module.exports = router;
