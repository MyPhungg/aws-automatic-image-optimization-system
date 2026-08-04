import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import UploadPage from "./pages/upload/UploadPage";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {

    return (

        <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/upload" element={<UploadPage />} />

            {/* Admin Dashboard – truy cập tại /admin */}
            <Route path="/admin" element={<AdminDashboard />} />

        </Routes>

    );

}

export default App;