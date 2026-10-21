import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDashboard } from "../api/appointmentApi";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import Message from "../components/Message";

function DashboardPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDashboard() {
            try {
                const result = await getDashboard();
                setData(result);
            } catch (err) {
                setError(err.message);
            }
            setLoading(false);
        }
        loadDashboard();
    }, []);

    if (loading) {
        return <p className="muted">Loading dashboard...</p>;
    }
    if (error) {
        return <Message type="error" text={error} />;
    }

    return (
        <div>
            <div className="page-header">
                <h2>Dashboard</h2>
                <Link to="/admin/appointments" className="btn btn-light">
                    Manage appointments
                </Link>
            </div>

            <div className="stat-grid">
                <StatCard label={"Today (" + data.today + ")"} value={data.todayCount} />
                <StatCard label="Total appointments" value={data.totalAppointments} />
                <StatCard label="Completed" value={data.completedCount} />
                <StatCard label="Cancellations" value={data.cancelledCount} />
                <StatCard label="Consultation revenue" value={"₹" + data.revenue} />
            </div>

            <h3>Today's appointments</h3>
            {data.todayAppointments.length === 0 ? (
                <p className="empty">No appointments today.</p>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.todayAppointments.map((appointment) => (
                            <tr key={appointment._id}>
                                <td>{appointment.slot}</td>
                                <td>{appointment.patient ? appointment.patient.name : "Unknown"}</td>
                                <td>{appointment.doctor ? appointment.doctor.name : "Doctor removed"}</td>
                                <td>
                                    <StatusBadge status={appointment.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <h3>Doctor-wise appointments</h3>
            {data.doctorStats.length === 0 ? (
                <p className="empty">No doctors added yet.</p>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Doctor</th>
                            <th>Specialization</th>
                            <th>Total</th>
                            <th>Completed</th>
                            <th>Cancelled</th>
                            <th>Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.doctorStats.map((row) => (
                            <tr key={row.doctorId}>
                                <td>{row.name}</td>
                                <td>{row.specialization}</td>
                                <td>{row.total}</td>
                                <td>{row.completed}</td>
                                <td>{row.cancelled}</td>
                                <td>₹{row.revenue}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default DashboardPage;
