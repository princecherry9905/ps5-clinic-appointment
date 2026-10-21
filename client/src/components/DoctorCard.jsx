import { Link } from "react-router-dom";

function DoctorCard({ doctor, isAdmin, onDelete }) {
    return (
        <div className="card doctor-card">
            <h3>{doctor.name}</h3>
            <p className="muted">{doctor.specialization}</p>
            <p>
                Fee: <strong>₹{doctor.fee}</strong>
            </p>
            <p className="small">
                {doctor.availableDays.join(", ")} · {doctor.startTime} – {doctor.endTime}
            </p>

            <div className="card-actions">
                <Link to={"/doctors/" + doctor._id} className="btn btn-small">
                    View
                </Link>

                {isAdmin && (
                    <>
                        <Link to={"/admin/doctors/" + doctor._id + "/edit"} className="btn btn-small btn-light">
                            Edit
                        </Link>
                        <button className="btn btn-small btn-danger" onClick={() => onDelete(doctor)}>
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default DoctorCard;
