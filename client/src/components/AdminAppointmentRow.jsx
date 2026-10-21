import { useState } from "react";
import StatusBadge from "./StatusBadge";

function AdminAppointmentRow({ appointment, onStatusChange, onSaveNotes }) {
    const [diagnosis, setDiagnosis] = useState(appointment.diagnosis);
    const [prescription, setPrescription] = useState(appointment.prescription);
    const [showNotesForm, setShowNotesForm] = useState(false);

    let patientName = "Unknown patient";
    let patientPhone = "";
    if (appointment.patient) {
        patientName = appointment.patient.name;
        patientPhone = appointment.patient.phone;
    }

    let doctorName = "Doctor removed";
    if (appointment.doctor) {
        doctorName = appointment.doctor.name;
    }

    function handleNotesSubmit(event) {
        event.preventDefault();
        onSaveNotes(appointment, diagnosis, prescription);
        setShowNotesForm(false);
    }

    return (
        <div className="card">
            <div className="appointment-top">
                <div>
                    <h3>
                        {appointment.slot} · {patientName}
                    </h3>
                    <p className="muted">
                        {appointment.date} · {doctorName} {patientPhone && "· " + patientPhone}
                    </p>
                </div>
                <StatusBadge status={appointment.status} />
            </div>

            {appointment.diagnosis && !showNotesForm && (
                <div className="notes">
                    <p>
                        <strong>Diagnosis:</strong> {appointment.diagnosis}
                    </p>
                    {appointment.prescription && (
                        <p>
                            <strong>Prescription:</strong> {appointment.prescription}
                        </p>
                    )}
                </div>
            )}

            <div className="card-actions">
                {appointment.status === "Booked" && (
                    <>
                        <button className="btn btn-small" onClick={() => onStatusChange(appointment, "Checked-In")}>
                            Check in
                        </button>
                        <button
                            className="btn btn-small btn-danger"
                            onClick={() => onStatusChange(appointment, "Cancelled")}
                        >
                            Cancel
                        </button>
                    </>
                )}

                {appointment.status === "Checked-In" && (
                    <button className="btn btn-small" onClick={() => onStatusChange(appointment, "Completed")}>
                        Mark completed
                    </button>
                )}

                {appointment.status === "Completed" && !showNotesForm && (
                    <button className="btn btn-small btn-light" onClick={() => setShowNotesForm(true)}>
                        {appointment.diagnosis ? "Edit notes" : "Add notes"}
                    </button>
                )}
            </div>

            {showNotesForm && (
                <form className="form notes-form" onSubmit={handleNotesSubmit}>
                    <label>
                        Diagnosis
                        <textarea value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} required />
                    </label>
                    <label>
                        Prescription
                        <textarea value={prescription} onChange={(e) => setPrescription(e.target.value)} />
                    </label>
                    <div className="card-actions">
                        <button className="btn btn-small" type="submit">
                            Save notes
                        </button>
                        <button className="btn btn-small btn-light" type="button" onClick={() => setShowNotesForm(false)}>
                            Close
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default AdminAppointmentRow;
