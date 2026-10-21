import StatusBadge from "./StatusBadge";

function AppointmentCard({ appointment, onCancel, cancelling }) {
    let doctorName = "Doctor removed";
    let specialization = "";
    if (appointment.doctor) {
        doctorName = appointment.doctor.name;
        specialization = appointment.doctor.specialization;
    }

    return (
        <div className="card appointment-card">
            <div className="appointment-top">
                <div>
                    <h3>{doctorName}</h3>
                    <p className="muted">{specialization}</p>
                </div>
                <StatusBadge status={appointment.status} />
            </div>

            <p>
                {appointment.date} at <strong>{appointment.slot}</strong> · Fee ₹{appointment.fee}
            </p>

            {appointment.diagnosis && (
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

            {appointment.status === "Booked" && (
                <button className="btn btn-small btn-danger" onClick={() => onCancel(appointment)} disabled={cancelling}>
                    {cancelling ? "Cancelling..." : "Cancel appointment"}
                </button>
            )}
        </div>
    );
}

export default AppointmentCard;
