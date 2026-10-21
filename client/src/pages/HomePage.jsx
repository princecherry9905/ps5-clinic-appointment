import { Link } from "react-router-dom";

function HomePage({ user }) {
    return (
        <div className="home">
            <section className="hero">
                <h1>Book a doctor's appointment in minutes</h1>
                <p>
                    Find a doctor by specialization, pick a free time slot and keep all your visit notes in one
                    place.
                </p>

                <div className="card-actions">
                    <Link to="/doctors" className="btn">
                        Find a doctor
                    </Link>

                    {!user && (
                        <Link to="/register" className="btn btn-light">
                            Create patient account
                        </Link>
                    )}

                    {user && user.role === "patient" && (
                        <Link to="/my-appointments" className="btn btn-light">
                            My appointments
                        </Link>
                    )}

                    {user && user.role === "admin" && (
                        <Link to="/admin/dashboard" className="btn btn-light">
                            Open dashboard
                        </Link>
                    )}
                </div>
            </section>

            <section className="feature-grid">
                <div className="card">
                    <h3>1. Choose a doctor</h3>
                    <p className="muted">Search by name or filter by specialization.</p>
                </div>
                <div className="card">
                    <h3>2. Pick a slot</h3>
                    <p className="muted">Only free slots on the doctor's working days can be booked.</p>
                </div>
                <div className="card">
                    <h3>3. Visit and get notes</h3>
                    <p className="muted">Diagnosis and prescription appear in your visit history.</p>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
