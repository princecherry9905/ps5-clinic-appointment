import { request } from "./apiClient";

export function registerUser(formData) {
    return request("/auth/register", "POST", formData);
}

export function loginUser(email, password) {
    return request("/auth/login", "POST", { email: email, password: password });
}

export function getProfile() {
    return request("/auth/me", "GET");
}

export function updateProfile(formData) {
    return request("/auth/me", "PUT", formData);
}
