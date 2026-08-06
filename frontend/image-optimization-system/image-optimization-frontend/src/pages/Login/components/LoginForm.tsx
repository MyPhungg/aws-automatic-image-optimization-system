import "./LoginForm.css";
import { Link } from "react-router-dom";
import AuthCard from "../../../components/Auth/AuthCard";
import GoogleLoginButton from "../../../components/Auth/GoogleLoginButton";

function LoginForm() {

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