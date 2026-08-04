import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import UploadPage from "./pages/upload/UploadPage";

function App() {

    return (

        <Routes>

            <Route

                path="/"

                element={<Home />}

            />

            <Route

                path="/upload"

                element={<UploadPage />}

            />

        </Routes>

    );

}

export default App;