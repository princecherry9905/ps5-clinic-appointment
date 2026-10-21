import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import Message from "../components/Message";

function LoginPage({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await loginUser(email, password);
            onLogin(data);

            if (data.user.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/doctors");
            }
        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    }

    return (
        <div className="card form-card">
            <h2>Login</h2>
            <p className="muted">Patients and admin/receptionist log in here.</p>

            <form className="form" onSubmit={handleSubmit}>
                <label>
                    Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    Password
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>

                <Message type="error" text={error} />

                <button className="btn" type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p className="small">
                New patient? <Link to="/register">Create an account</Link>
            </p>
        </div>
    );
}

export default LoginPage;
