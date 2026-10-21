import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyAppointments, cancelAppointment } from "../api/appointmentApi";
import AppointmentCard from "../components/AppointmentCard";
import Message from "../components/Message";

function MyAppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [cancellingId, setCancellingId] = useState("");

    useEffect(() => {
        async function loadAppointments() {
            setLoading(true);
            setError("");
            try {
                const data = await getMyAppointments();
                setAppointments(data);
            } catch (err) {
                setError(err.message);
            }
            setLoading(false);
        }
        loadAppointments();
    }, []);

    async function handleCancel(appointment) {
        const sure = window.confirm("Cancel your appointment on " + appointment.date + " at " + appointment.slot + "?");
        if (!sure) {
            return;
        }

        setError("");
        setSuccess("");
        setCancellingId(appointment._id);
        try {
            const updated = await cancelAppointment(appointment._id);
            const newList = appointments.map((item) => {
                if (item._id === updated._id) {
                    return { ...item, status: updated.status };
                }
                return item;
            });
            setAppointments(newList);
            setSuccess("Appointment cancelled.");
        } catch (err) {
            setError(err.message);
        }
        setCancellingId("");
    }

    let visibleAppointments = appointments;
    if (statusFilter) {
        visibleAppointments = appointments.filter((item) => item.status === statusFilter);
    }

    let listContent;
    if (loading) {
        listContent = <p className="muted">Loading your appointments...</p>;
    } else if (error && appointments.length === 0) {
        listContent = null;
    } else if (appointments.length === 0) {
        listContent = (
            <p className="empty">
                You have no appointments yet. <Link to="/doctors">Book one now</Link>.
            </p>
        );
    } else if (visibleAppointments.length === 0) {
        listContent = <p className="empty">No {statusFilter} appointments.</p>;
    } else {
        listContent = (
            <div className="list">
                {visibleAppointments.map((appointment) => (
                    <AppointmentCard
                        key={appointment._id}
                        appointment={appointment}
                        onCancel={handleCancel}
                        cancelling={cancellingId === appointment._id}
                    />
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h2>My appointments & visit history</h2>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">All</option>
                    <option value="Booked">Booked</option>
                    <option value="Checked-In">Checked-In</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            <Message type="success" text={success} />
            <Message type="error" text={error} />

            {listContent}
        </div>
    );
}

export default MyAppointmentsPage;
