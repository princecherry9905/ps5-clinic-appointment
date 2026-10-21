import { Navigate } from "react-router-dom";

function ProtectedRoute({ user, role, children }) {
    if (!user) {
        return <Navigate to="/login" />;
    }

    if (role && user.role !== role) {
        return (
            <div className="card">
                <h2>Access denied</h2>
                <p>You do not have permission to view this page.</p>
            </div>
        );
    }

    return children;
}

export default ProtectedRoute;
