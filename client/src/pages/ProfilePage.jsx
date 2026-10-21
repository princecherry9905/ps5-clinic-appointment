import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../api/authApi";
import Message from "../components/Message";

function ProfilePage({ onNameChange }) {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await getProfile();
                setEmail(data.email);
                setRole(data.role);
                setName(data.name);
                setAge(data.age === undefined || data.age === null ? "" : data.age);
                setGender(data.gender || "");
                setPhone(data.phone || "");
            } catch (err) {
                setError(err.message);
            }
            setLoading(false);
        }
        loadProfile();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");
        setSaving(true);
        try {
            const data = await updateProfile({
                name: name,
                age: age === "" ? undefined : Number(age),
                gender: gender,
                phone: phone
            });
            onNameChange(data.name);
            setSuccess("Profile saved.");
        } catch (err) {
            setError(err.message);
        }
        setSaving(false);
    }

    if (loading) {
        return <p className="muted">Loading profile...</p>;
    }

    return (
        <div className="card form-card">
            <h2>My profile</h2>
            <p className="muted">
                {email} · {role === "admin" ? "Admin / Receptionist" : "Patient"}
            </p>

            <form className="form" onSubmit={handleSubmit}>
                <label>
                    Full name
                    <input value={name} onChange={(e) => setName(e.target.value)} required />
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
                <Message type="success" text={success} />

                <button className="btn" type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save profile"}
                </button>
            </form>
        </div>
    );
}

export default ProfilePage;
