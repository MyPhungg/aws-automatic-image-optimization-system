import "./LoginForm.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import AuthCard from "../../../components/Auth/AuthCard";
import AuthInput from "../../../components/Auth/AuthInput";
import AuthButton from "../../../components/Auth/AuthButton";
import AuthDivider from "../../../components/Auth/AuthDivider";
import GoogleLoginButton from "../../../components/Auth/GoogleLoginButton";
import { authService } from "../../../services/authService";
function LoginForm() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [remember, setRemember] = useState(false);

    const [loading, setLoading] = useState(false);

    const [emailError, setEmailError] = useState("");

    const [passwordError, setPasswordError] = useState("");

    const { login } = useAuth();  

    function validate() {

        let valid = true;

        setEmailError("");
        setPasswordError("");

        if (!email.trim()) {

            setEmailError("Email is required.");

            valid = false;

        }
        else {

            const regex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!regex.test(email)) {

                setEmailError("Invalid email address.");

                valid = false;

            }

        }

        if (!password.trim()) {

            setPasswordError("Password is required.");

            valid = false;

        }

        return valid;

    }
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

                <h1>

                    Welcome Back

                </h1>

                <p>

                    Sign in to continue.

                </p>

            </div>

            <AuthInput

                label="Email Address"

                value={email}

                placeholder="example@email.com"

                onChange={setEmail}

                error={emailError}

            />

            <AuthInput

                label="Password"

                type="password"

                value={password}

                placeholder="Enter your password"

                onChange={setPassword}

                error={passwordError}

            />

            <div className="login-options">

                <label className="remember">

                    <input

                        type="checkbox"

                        checked={remember}

                        onChange={(e) =>

                            setRemember(e.target.checked)

                        }

                    />

                    Remember me

                </label>

                <Link

                    to="/forgot-password"

                    className="forgot"

                >

                    Forgot Password?

                </Link>

            </div>

            <AuthButton

                text="Login"

                loading={loading}

                onClick={handleLogin}

            />

            <AuthDivider />
            <GoogleLoginButton />
            <div className="bottom-links">

                <p>

                    Don't have an account?

                </p>

                <Link to="/register">

                    Create Account

                </Link>

            </div>

            <Link

                to="/upload"

                className="guest-link"

            >

                Continue as Guest

            </Link>

        </AuthCard>

    );

}

export default LoginForm;