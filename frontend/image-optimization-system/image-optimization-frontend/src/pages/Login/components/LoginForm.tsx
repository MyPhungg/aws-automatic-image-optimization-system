import "./LoginForm.css";

import { useState } from "react";
import { Link } from "react-router-dom";
import AuthCard from "../../../components/Auth/AuthCard";
import AuthInput from "../../../components/Auth/AuthInput";
import AuthButton from "../../../components/Auth/AuthButton";
import AuthDivider from "../../../components/Auth/AuthDivider";
import GoogleLoginButton from "../../../components/Auth/GoogleLoginButton";
function LoginForm() {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [remember, setRemember] = useState(false);

    const [loading] = useState(false);

    const [emailError] = useState("");

    const [passwordError] = useState("");

    function handleLogin() {

    alert("Email login is not available yet. Please use Google Sign-In.");

}

//     async function handleLogin() {

//     try {

//         setLoading(true);

//         const result = await authService.login({

//             email,

//             password

//         });

//         login(

//             result.token,

//             {

//                 name: result.name,

//                 email: result.email,

//                 avatarUrl: result.avatarUrl

//             }

//         );

//         navigate("/dashboard");

//     }

//     catch (error) {

//         console.error(error);

//         alert("Email hoặc mật khẩu không đúng.");

//     }

//     finally {

//         setLoading(false);

//     }

// }

    return (
        <AuthCard>
            <div className="login-header">
                <h1>Welcome Back</h1>
                <p>Sign in to continue.</p>
            </div>

            <GoogleLoginButton />
            
            <div className="bottom-links" style={{ marginTop: '20px' }}>
                <p>Don't have an account?</p>
                <Link to="/register">Create Account</Link>
            </div>

            <Link to="/upload" className="guest-link">
                Continue as Guest
            </Link>
        </AuthCard>
    );

}

export default LoginForm;