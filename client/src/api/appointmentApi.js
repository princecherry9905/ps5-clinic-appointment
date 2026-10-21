import { request } from "./apiClient";

export function bookAppointment(doctorId, date, slot) {
    return request("/appointments", "POST", { doctorId: doctorId, date: date, slot: slot });
}

export function getMyAppointments() {
    return request("/appointments/my", "GET");
}

export function getAllAppointments(date, status) {
    const params = new URLSearchParams();
    if (date) {
        params.append("date", date);
    }
    if (status) {
        params.append("status", status);
    }
    return request("/appointments?" + params.toString(), "GET");
}

export function cancelAppointment(id) {
    return request("/appointments/" + id + "/cancel", "PATCH");
}

export function updateAppointmentStatus(id, status) {
    return request("/appointments/" + id + "/status", "PATCH", { status: status });
}

export function addAppointmentNotes(id, diagnosis, prescription) {
    return request("/appointments/" + id + "/notes", "PATCH", {
        diagnosis: diagnosis,
        prescription: prescription
    });
}

export function getDashboard() {
    return request("/dashboard", "GET");
}
