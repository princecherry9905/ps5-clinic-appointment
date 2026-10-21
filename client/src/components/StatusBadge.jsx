function StatusBadge({ status }) {
    let className = "badge";

    if (status === "Booked") {
        className = "badge badge-booked";
    } else if (status === "Checked-In") {
        className = "badge badge-checked";
    } else if (status === "Completed") {
        className = "badge badge-completed";
    } else if (status === "Cancelled") {
        className = "badge badge-cancelled";
    }

    return <span className={className}>{status}</span>;
}

export default StatusBadge;
