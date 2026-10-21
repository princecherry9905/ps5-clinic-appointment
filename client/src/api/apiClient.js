const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050/api";

const STORAGE_KEY = "clinicUser";

export function getSavedUser() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
        return null;
    }
    try {
        return JSON.parse(saved);
    } catch (error) {
        return null;
    }
}

export function saveUser(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function removeSavedUser() {
    localStorage.removeItem(STORAGE_KEY);
}

export async function request(path, method, body) {
    const headers = { "Content-Type": "application/json" };

    const savedUser = getSavedUser();
    if (savedUser && savedUser.token) {
        headers.Authorization = "Bearer " + savedUser.token;
    }

    const options = { method: method || "GET", headers: headers };
    if (body) {
        options.body = JSON.stringify(body);
    }

    let response;
    try {
        response = await fetch(API_URL + path, options);
    } catch (error) {
        throw new Error("Cannot reach the server. Is the backend running?");
    }

    let data = null;
    try {
        data = await response.json();
    } catch (error) {
        data = null;
    }

    if (!response.ok) {
        let message = "Something went wrong.";
        if (data && data.message) {
            message = data.message;
        }
        throw new Error(message);
    }

    return data;
}
