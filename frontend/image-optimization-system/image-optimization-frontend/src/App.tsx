
import { Routes, Route } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

import ProtectedRoute from "./routes/ProtectedRoute";

import LandingPage from "./pages/Landing/LandingPage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";

import Home from "./pages/home/Home";
import UploadPage from "./pages/upload/UploadPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";

// Sau này
import HistoryPage from "./pages/History/HistoryPage";
// import SettingsPage from "./pages/Settings/SettingsPage";

function App() {

    return (

        <Routes>

            {/* Authentication */}

            <Route element={<AuthLayout />}>

                <Route
                    path="/"
                    element={<LandingPage />}
                />

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

            </Route>

            {/* Main Layout */}

            <Route element={<MainLayout />}>

                <Route
                    path="/home"
                    element={<Home />}
                />

                <Route
                    path="/upload"
                    element={<UploadPage />}
                />

                {/* Protected Routes */}

                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/dashboard"
                        element={<DashboardPage />}
                    />

                    
                    <Route
                        path="/history"
                        element={<HistoryPage />}
                    />
{/*
                    <Route
                        path="/settings"
                        element={<SettingsPage />}
                    />
                    */}

                </Route>

            </Route>

        </Routes>

    );

}

export default App;
