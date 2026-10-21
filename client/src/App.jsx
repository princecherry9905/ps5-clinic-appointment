import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { getSavedUser, saveUser, removeSavedUser } from "./api/apiClient";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DoctorsPage from "./pages/DoctorsPage";
import DoctorDetailPage from "./pages/DoctorDetailPage";
import ProfilePage from "./pages/ProfilePage";
import MyAppointmentsPage from "./pages/MyAppointmentsPage";
import DoctorFormPage from "./pages/DoctorFormPage";
import AdminAppointmentsPage from "./pages/AdminAppointmentsPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
    const [user, setUser] = useState(getSavedUser());

    function handleLogin(data) {
        const loggedInUser = {
            _id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            token: data.token
        };
        setUser(loggedInUser);
        saveUser(loggedInUser);
    }

    function handleLogout() {
        setUser(null);
        removeSavedUser();
    }

    function handleNameChange(newName) {
        const updatedUser = {
            _id: user._id,
            name: newName,
            email: user.email,
            role: user.role,
            token: user.token
        };
        setUser(updatedUser);
        saveUser(updatedUser);
    }

    return (
        <div className="app">
            <Navbar user={user} onLogout={handleLogout} />

            <main className="container">
                <Routes>
                    <Route path="/" element={<HomePage user={user} />} />
                    <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                    <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
                    <Route path="/doctors" element={<DoctorsPage user={user} />} />
                    <Route path="/doctors/:id" element={<DoctorDetailPage user={user} />} />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute user={user}>
                                <ProfilePage onNameChange={handleNameChange} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/my-appointments"
                        element={
                            <ProtectedRoute user={user} role="patient">
                                <MyAppointmentsPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/doctors/new"
                        element={
                            <ProtectedRoute user={user} role="admin">
                                <DoctorFormPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/doctors/:id/edit"
                        element={
                            <ProtectedRoute user={user} role="admin">
                                <DoctorFormPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/appointments"
                        element={
                            <ProtectedRoute user={user} role="admin">
                                <AdminAppointmentsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute user={user} role="admin">
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
