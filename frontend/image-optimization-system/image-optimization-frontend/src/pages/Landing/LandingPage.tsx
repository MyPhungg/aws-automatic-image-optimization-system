import { Link } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {

    return (

        <div className="landing-container">

            <div className="landing-card">

                <h1>
                    Automatic Image Optimization
                </h1>

                <p>

                    Optimize, compress and manage images
                    using AWS cloud services.

                </p>

                <div className="landing-buttons">

                    <Link
                        to="/upload"
                        className="guest-btn"
                    >
                        Continue as Guest
                    </Link>

                    <Link
                        to="/login"
                        className="login-btn"
                    >
                        Login
                    </Link>

                </div>

            </div>

        </div>

    );

}

export default LandingPage;