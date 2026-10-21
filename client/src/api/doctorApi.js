import { request } from "./apiClient";

export function getDoctors(search, specialization) {
    const params = new URLSearchParams();
    if (search) {
        params.append("search", search);
    }
    if (specialization) {
        params.append("specialization", specialization);
    }
    return request("/doctors?" + params.toString(), "GET");
}

export function getSpecializations() {
    return request("/doctors/specializations", "GET");
}

export function getDoctor(id) {
    return request("/doctors/" + id, "GET");
}

export function getSlots(doctorId, date) {
    return request("/doctors/" + doctorId + "/slots?date=" + date, "GET");
}

export function createDoctor(doctorData) {
    return request("/doctors", "POST", doctorData);
}

export function updateDoctor(id, doctorData) {
    return request("/doctors/" + id, "PUT", doctorData);
}

export function deleteDoctor(id) {
    return request("/doctors/" + id, "DELETE");
}
