import { useState, useEffect } from "react";
import { getAllAppointments, updateAppointmentStatus, addAppointmentNotes } from "../api/appointmentApi";
import AdminAppointmentRow from "../components/AdminAppointmentRow";
import Message from "../components/Message";

function getTodayString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
}

function AdminAppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [date, setDate] = useState(getTodayString());
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        async function loadAppointments() {
            setLoading(true);
            setError("");
            try {
                const data = await getAllAppointments(date, status);
                setAppointments(data);
            } catch (err) {
                setError(err.message);
            }
            setLoading(false);
        }
        loadAppointments();
    }, [date, status]);

    function replaceInList(id, changes) {
        const newList = appointments.map((item) => {
            if (item._id === id) {
                return { ...item, ...changes };
            }
            return item;
        });
        setAppointments(newList);
    }

    async function handleStatusChange(appointment, newStatus) {
        if (newStatus === "Cancelled") {
            const sure = window.confirm("Cancel this appointment?");
            if (!sure) {
                return;
            }
        }
        setError("");
        setSuccess("");
        try {
            const updated = await updateAppointmentStatus(appointment._id, newStatus);
            replaceInList(appointment._id, { status: updated.status });
            setSuccess("Status changed to " + updated.status + ".");
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleSaveNotes(appointment, diagnosis, prescription) {
        setError("");
        setSuccess("");
        try {
            const updated = await addAppointmentNotes(appointment._id, diagnosis, prescription);
            replaceInList(appointment._id, {
                diagnosis: updated.diagnosis,
                prescription: updated.prescription
            });
            setSuccess("Notes saved.");
        } catch (err) {
            setError(err.message);
        }
    }

    let listContent;
    if (loading) {
        listContent = <p className="muted">Loading appointments...</p>;
    } else if (error && appointments.length === 0) {
        listContent = null;
    } else if (appointments.length === 0) {
        listContent = <p className="empty">No appointments found for these filters.</p>;
    } else {
        listContent = (
            <div className="list">
                {appointments.map((appointment) => (
                    <AdminAppointmentRow
                        key={appointment._id}
                        appointment={appointment}
                        onStatusChange={handleStatusChange}
                        onSaveNotes={handleSaveNotes}
                    />
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h2>Appointments</h2>
            </div>

            <div className="filters">
                <label>
                    Date
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </label>
                <label>
                    Status
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="">All</option>
                        <option value="Booked">Booked</option>
                        <option value="Checked-In">Checked-In</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </label>
                <button className="btn btn-light" onClick={() => setDate("")}>
                    Show all dates
                </button>
            </div>

            <Message type="success" text={success} />
            <Message type="error" text={error} />

            {listContent}
        </div>
    );
}

export default AdminAppointmentsPage;
