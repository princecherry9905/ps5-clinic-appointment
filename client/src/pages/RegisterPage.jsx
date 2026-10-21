import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import Message from "../components/Message";

function RegisterPage({ onLogin }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            const data = await registerUser({
                name: name,
                email: email,
                password: password,
                age: age === "" ? undefined : Number(age),
                gender: gender,
                phone: phone
            });
            onLogin(data);
            navigate("/doctors");
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    }

    return (
        <div className="card form-card">
            <h2>Patient registration</h2>

            <form className="form" onSubmit={handleSubmit}>
                <label>
                    Full name
                    <input value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
                <label>
                    Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    Password (min 6 characters)
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>

                <div className="form-row">
                    <label>
                        Age
                        <input type="number" min="0" max="120" value={age} onChange={(e) => setAge(e.target.value)} />
                    </label>
                    <label>
                        Gender
                        <select value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </label>
                </div>

                <label>
                    Phone
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </label>

                <Message type="error" text={error} />

                <button className="btn" type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Register"}
                </button>
            </form>

            <p className="small">
                Already registered? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

export default RegisterPage;
