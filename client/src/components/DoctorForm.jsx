import { useState } from "react";

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function DoctorForm({ initialData, onSubmit, saving, submitText }) {
    const [name, setName] = useState(initialData ? initialData.name : "");
    const [specialization, setSpecialization] = useState(initialData ? initialData.specialization : "");
    const [fee, setFee] = useState(initialData ? initialData.fee : "");
    const [availableDays, setAvailableDays] = useState(initialData ? initialData.availableDays : []);
    const [startTime, setStartTime] = useState(initialData ? initialData.startTime : "10:00");
    const [endTime, setEndTime] = useState(initialData ? initialData.endTime : "13:00");
    const [slotDuration, setSlotDuration] = useState(initialData ? initialData.slotDuration : 30);
    const [formError, setFormError] = useState("");

    function toggleDay(day) {
        if (availableDays.includes(day)) {
            setAvailableDays(availableDays.filter((d) => d !== day));
        } else {
            setAvailableDays(ALL_DAYS.filter((d) => d === day || availableDays.includes(d)));
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        setFormError("");

        if (availableDays.length === 0) {
            setFormError("Select at least one available day.");
            return;
        }
        if (startTime >= endTime) {
            setFormError("End time must be after start time.");
            return;
        }

        onSubmit({
            name: name,
            specialization: specialization,
            fee: Number(fee),
            availableDays: availableDays,
            startTime: startTime,
            endTime: endTime,
            slotDuration: Number(slotDuration)
        });
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            <label>
                Doctor name
                <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>

            <label>
                Specialization
                <input
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Cardiologist"
                    required
                />
            </label>

            <label>
                Consultation fee (₹)
                <input type="number" min="0" value={fee} onChange={(e) => setFee(e.target.value)} required />
            </label>

            <div className="field">
                <span>Available days</span>
                <div className="day-picker">
                    {ALL_DAYS.map((day) => (
                        <label key={day} className="day-option">
                            <input
                                type="checkbox"
                                checked={availableDays.includes(day)}
                                onChange={() => toggleDay(day)}
                            />
                            {day}
                        </label>
                    ))}
                </div>
            </div>

            <div className="form-row">
                <label>
                    Start time
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                </label>
                <label>
                    End time
                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                </label>
                <label>
                    Slot (minutes)
                    <input
                        type="number"
                        min="5"
                        max="240"
                        value={slotDuration}
                        onChange={(e) => setSlotDuration(e.target.value)}
                        required
                    />
                </label>
            </div>

            {formError && <p className="message message-error">{formError}</p>}

            <button className="btn" type="submit" disabled={saving}>
                {saving ? "Saving..." : submitText}
            </button>
        </form>
    );
}

export default DoctorForm;
