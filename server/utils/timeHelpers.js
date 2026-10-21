const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TIME_ZONE = process.env.CLINIC_TIMEZONE || "Asia/Kolkata";

function timeToMinutes(time) {
    const parts = time.split(":");
    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);
    return hours * 60 + minutes;
}

function minutesToTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0");
}

function generateSlots(startTime, endTime, duration) {
    const slots = [];
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);

    let current = start;
    while (current + duration <= end) {
        slots.push(minutesToTime(current));
        current = current + duration;
    }

    return slots;
}

function isValidDate(dateString) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return false;
    }
    const date = new Date(dateString + "T00:00:00Z");
    if (isNaN(date.getTime())) {
        return false;
    }
    return date.toISOString().slice(0, 10) === dateString;
}

function getDayName(dateString) {
    const date = new Date(dateString + "T00:00:00Z");
    return DAYS[date.getUTCDay()];
}

function getToday() {
    return new Date().toLocaleDateString("en-CA", { timeZone: TIME_ZONE });
}

function getCurrentTime() {
    return new Date().toLocaleTimeString("en-GB", {
        timeZone: TIME_ZONE,
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
    });
}

function isInFuture(dateString, slot) {
    const today = getToday();

    if (dateString > today) {
        return true;
    }
    if (dateString < today) {
        return false;
    }
    return slot > getCurrentTime();
}

module.exports = {
    DAYS,
    timeToMinutes,
    minutesToTime,
    generateSlots,
    isValidDate,
    getDayName,
    getToday,
    getCurrentTime,
    isInFuture
};
