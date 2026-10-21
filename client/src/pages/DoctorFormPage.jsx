import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDoctor, createDoctor, updateDoctor } from "../api/doctorApi";
import DoctorForm from "../components/DoctorForm";
import Message from "../components/Message";

function DoctorFormPage() {
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (!isEditMode) {
            return;
        }
        async function loadDoctor() {
            try {
                const data = await getDoctor(id);
                setDoctor(data);
            } catch (err) {
                setError(err.message);
            }
            setLoading(false);
        }
        loadDoctor();
    }, [id]);

    async function handleSave(formData) {
        setError("");
        setSaving(true);
        try {
            if (isEditMode) {
                await updateDoctor(id, formData);
            } else {
                await createDoctor(formData);
            }
            navigate("/doctors");
        } catch (err) {
            setError(err.message);
            setSaving(false);
        }
    }

    if (loading) {
        return <p className="muted">Loading doctor...</p>;
    }

    return (
        <div className="card form-card wide">
            <h2>{isEditMode ? "Edit doctor" : "Add doctor"}</h2>

            <Message type="error" text={error} />

            {(!isEditMode || doctor) && (
                <DoctorForm
                    initialData={doctor}
                    onSubmit={handleSave}
                    saving={saving}
                    submitText={isEditMode ? "Save changes" : "Add doctor"}
                />
            )}
        </div>
    );
}

export default DoctorFormPage;
