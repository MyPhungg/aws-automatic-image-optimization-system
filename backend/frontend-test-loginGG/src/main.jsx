import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
    <GoogleOAuthProvider clientId="573866862200-tnnauggmuu4biaor6nqqp5t1185es3rk.apps.googleusercontent.com">
        <App />
    </GoogleOAuthProvider>
);