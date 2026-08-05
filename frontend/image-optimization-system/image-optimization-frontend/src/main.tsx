import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")!).render(

    // <React.StrictMode>
    <GoogleOAuthProvider clientId="573866862200-tnnauggmuu4biaor6nqqp5t1185es3rk.apps.googleusercontent.com">
        <BrowserRouter>
            <AuthProvider>

                <App />

            </AuthProvider>
        </BrowserRouter>
    </GoogleOAuthProvider>
    // </React.StrictMode>

);