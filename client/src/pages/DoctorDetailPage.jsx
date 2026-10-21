import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getDoctor, getSlots } from "../api/doctorApi";
import { bookAppointment } from "../api/appointmentApi";
import Message from "../components/Message";

function getTodayString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
}

function DoctorDetailPage({ user }) {
    const { id } = useParams();

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [date, setDate] = useState("");
    const [slots, setSlots] = useState([]);
    const [slotMessage, setSlotMessage] = useState("");
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState("");

    const [bookingError, setBookingError] = useState("");
    const [bookingSuccess, setBookingSuccess] = useState("");
    const [booking, setBooking] = useState(false);

    const isPatient = user && user.role === "patient";

    useEffect(() => {
        async function loadDoctor() {
            setLoading(true);
            setError("");
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

    useEffect(() => {
        if (date && isPatient) {
            loadSlots();
        }
    }, [date]);

    async function loadSlots() {
        setSlotsLoading(true);
        setSlotMessage("");
        setSelectedSlot("");
        try {
            const data = await getSlots(id, date);
            setSlots(data.slots);
            setSlotMessage(data.message);
        } catch (err) {
            setSlots([]);
            setSlotMessage(err.message);
        }
        setSlotsLoading(false);
    }

    async function handleBook() {
        setBookingError("");
        setBookingSuccess("");
        setBooking(true);
        try {
            await bookAppointment(id, date, selectedSlot);
            setBookingSuccess("Appointment booked for " + date + " at " + selectedSlot + ".");
            loadSlots();
        } catch (err) {
            setBookingError(err.message);
        }
        setBooking(false);
    }

    function getSlotTitle(slot) {
        if (slot.isBooked) {
            return "Already booked";
        }
        if (slot.isPast) {
            return "Time passed";
        }
        return "Available";
    }

    function getBookButtonText() {
        if (booking) {
            return "Booking...";
        }
        if (selectedSlot) {
            return "Book " + selectedSlot;
        }
        return "Select a slot";
    }

    if (loading) {
        return <p className="muted">Loading doctor...</p>;
    }
    if (error) {
        return (
            <div className="card">
                <Message type="error" text={error} />
                <Link to="/doctors">Back to doctors</Link>
            </div>
        );
    }

    return (
        <div className="detail-layout">
            <div className="card">
                <h2>{doctor.name}</h2>
                <p className="muted">{doctor.specialization}</p>
                <p>
                    Consultation fee: <strong>₹{doctor.fee}</strong>
                </p>
                <p>Available days: {doctor.availableDays.join(", ")}</p>
                <p>
                    Timings: {doctor.startTime} – {doctor.endTime} ({doctor.slotDuration} min per patient)
                </p>
                <Link to="/doctors" className="small">
                    ← Back to doctors
                </Link>
            </div>

            <div className="card">
                <h3>Book an appointment</h3>

                {!user && (
                    <p>
                        Please <Link to="/login">login</Link> as a patient to book.
                    </p>
                )}

                {user && user.role === "admin" && (
                    <p className="muted">Admin accounts cannot book appointments. Log in as a patient to book.</p>
                )}

                {isPatient && (
                    <div>
                        <label className="field">
                            Choose a date
                            <input type="date" min={getTodayString()} value={date} onChange={(e) => setDate(e.target.value)} />
                        </label>

                        {slotsLoading && <p className="muted">Loading slots...</p>}

                        {!slotsLoading && slotMessage && <p className="message message-error">{slotMessage}</p>}

                        {!slotsLoading && date && slots.length > 0 && (
                            <div className="slot-grid">
                                {slots.map((slot) => (
                                    <button
                                        key={slot.time}
                                        type="button"
                                        className={selectedSlot === slot.time ? "slot slot-selected" : "slot"}
                                        disabled={slot.isBooked || slot.isPast}
                                        onClick={() => setSelectedSlot(slot.time)}
                                        title={getSlotTitle(slot)}
                                    >
                                        {slot.time}
                                    </button>
                                ))}
                            </div>
                        )}

                        <Message type="error" text={bookingError} />
                        <Message type="success" text={bookingSuccess} />

                        {bookingSuccess && (
                            <p className="small">
                                <Link to="/my-appointments">View my appointments →</Link>
                            </p>
                        )}

                        <button className="btn" onClick={handleBook} disabled={!selectedSlot || booking}>
                            {getBookButtonText()}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DoctorDetailPage;
