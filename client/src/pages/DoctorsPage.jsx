import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDoctors, getSpecializations, deleteDoctor } from "../api/doctorApi";
import DoctorCard from "../components/DoctorCard";
import Message from "../components/Message";

function DoctorsPage({ user }) {
    const [doctors, setDoctors] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [search, setSearch] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const isAdmin = user && user.role === "admin";

    useEffect(() => {
        getSpecializations()
            .then((list) => setSpecializations(list))
            .catch(() => setSpecializations([]));
    }, []);

    useEffect(() => {
        loadDoctors();
    }, [search, specialization]);

    async function loadDoctors() {
        setLoading(true);
        setError("");
        try {
            const data = await getDoctors(search, specialization);
            setDoctors(data);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    }

    async function handleDelete(doctor) {
        const sure = window.confirm("Delete " + doctor.name + "?");
        if (!sure) {
            return;
        }
        setError("");
        setSuccess("");
        try {
            await deleteDoctor(doctor._id);
            setDoctors(doctors.filter((d) => d._id !== doctor._id));
            setSuccess(doctor.name + " deleted.");
        } catch (err) {
            setError(err.message);
        }
    }

    let listContent;
    if (loading) {
        listContent = <p className="muted">Loading doctors...</p>;
    } else if (error) {
        listContent = null;
    } else if (doctors.length === 0) {
        listContent = <p className="empty">No doctors found.</p>;
    } else {
        listContent = (
            <div className="grid">
                {doctors.map((doctor) => (
                    <DoctorCard key={doctor._id} doctor={doctor} isAdmin={isAdmin} onDelete={handleDelete} />
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h2>Doctors</h2>
                {isAdmin && (
                    <Link to="/admin/doctors/new" className="btn">
                        + Add doctor
                    </Link>
                )}
            </div>

            <div className="filters">
                <input
                    placeholder="Search by name or specialization"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
                    <option value="">All specializations</option>
                    {specializations.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>

            <Message type="success" text={success} />
            <Message type="error" text={error} />

            {listContent}
        </div>
    );
}

export default DoctorsPage;
