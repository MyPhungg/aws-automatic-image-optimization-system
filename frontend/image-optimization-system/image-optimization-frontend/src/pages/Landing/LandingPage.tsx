import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./LandingPage.css";
import { useAuth } from "../../context/AuthContext";

function LandingPage() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="landing-container">
            <div className="landing-hero">
                <div className="landing-badge">☁️ Powered by AWS Lambda</div>

                <h1 className="landing-title">
                    Automatic Image<br />
                    <span className="landing-title-highlight">Optimization</span>
                </h1>

                <p className="landing-subtitle">
                    Compress, resize and convert images in seconds using the power of 
                    AWS Cloud. Upload once — get optimized results instantly.
                </p>

                <div className="landing-buttons">
                    <Link to="/upload" className="guest-btn">
                        Try as Guest →
                    </Link>
                    <Link to="/login" className="login-btn">
                        Sign In
                    </Link>
                </div>

                <div className="landing-stats">
                    <div className="landing-stat">
                        <span className="landing-stat-value">98%</span>
                        <span className="landing-stat-label">Success Rate</span>
                    </div>
                    <div className="landing-stat-divider" />
                    <div className="landing-stat">
                        <span className="landing-stat-value">60%</span>
                        <span className="landing-stat-label">Avg. Compression</span>
                    </div>
                    <div className="landing-stat-divider" />
                    <div className="landing-stat">
                        <span className="landing-stat-value">3 Modes</span>
                        <span className="landing-stat-label">Optimization Presets</span>
                    </div>
                </div>
            </div>

            <div className="landing-features">
                <div className="feature-card">
                    <span className="feature-icon">⚡</span>
                    <h3>Lightning Fast</h3>
                    <p>Images processed in seconds via AWS Lambda serverless architecture.</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon">🎯</span>
                    <h3>Smart Compression</h3>
                    <p>Choose Balanced, High Quality or Save Space — we handle the rest.</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon">📦</span>
                    <h3>Batch Upload</h3>
                    <p>Upload multiple images at once and track each one in real-time.</p>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;