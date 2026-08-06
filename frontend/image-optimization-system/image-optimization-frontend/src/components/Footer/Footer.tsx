import './Footer.css'

function Footer() {
    return (
        <footer className="footer">
            {/* Projectname*/}
            <div className="footer-container">
                <div className="footer-title">
                    Automatic Image Optimization System
                </div>
                {/* Technology Stack */}
                <div className="footer-tech">
                    <span>AWS Lambda</span>
                    <span>Amazon S3</span>
                    <span>DynomoDB</span>
                    <span>React</span>
                </div>
                {/* Contact */}
                <div className="footer-contact">
                    <span>Contact: tanhoanglevo3110@aio.vn </span>
                </div>
                {/* Copyright */}
                <div className="footer-copy">
                    <span>Copyright © 2026 Automatic Image Optimization System</span>
                </div>
            </div>   
        </footer>
    )
}
export default Footer