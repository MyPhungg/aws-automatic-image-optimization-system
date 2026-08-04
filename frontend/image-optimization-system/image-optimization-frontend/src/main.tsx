import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")!).render(

    // <React.StrictMode>
        <GoogleOAuthProvider clientId="935890020281-qfeuspd95ec24ss8v07t0aqkk4fsk89s.apps.googleusercontent.com"> 
            <BrowserRouter>
                <AuthProvider> 
                    
                        <App /> 
                    
                </AuthProvider>
            </BrowserRouter>
        </GoogleOAuthProvider>
    // </React.StrictMode>

);