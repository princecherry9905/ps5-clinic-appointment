import { NavLink, useNavigate } from "react-router-dom";

function Navbar({ user, onLogout }) {
    const navigate = useNavigate();

    function handleLogoutClick() {
        onLogout();
        navigate("/login");
    }

    return (
        <header className="navbar">
            <NavLink to="/" className="brand">
                CityCare Clinic
            </NavLink>

            <nav className="nav-links">
                <NavLink to="/doctors">Doctors</NavLink>

                {user && user.role === "patient" && (
                    <NavLink to="/my-appointments">My Appointments</NavLink>
                )}

                {user && user.role === "admin" && (
                    <>
                        <NavLink to="/admin/dashboard">Dashboard</NavLink>
                        <NavLink to="/admin/appointments">Appointments</NavLink>
                    </>
                )}

                {user ? (
                    <>
                        <NavLink to="/profile">{user.name}</NavLink>
                        <button className="btn btn-small btn-light" onClick={handleLogoutClick}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/register">Register</NavLink>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Navbar;
