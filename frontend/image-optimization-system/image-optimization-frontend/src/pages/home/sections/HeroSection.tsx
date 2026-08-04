// ==========================================================
// Hero Section
// Home Page Banner
// ==========================================================

import "./HeroSection.css";

function HeroSection() {
    return (
        <section className="hero">

            <div className="hero-container">

                {/* Left */}

                <div className="hero-content">

                    <span className="hero-tag">
                        AWS Powered Image Optimization
                    </span>

                    <h1 className="hero-title">
                        Optimize Images
                        <br />
                        Faster with AWS Lambda
                    </h1>

                    <p className="hero-description">
                        Resize, compress and generate thumbnails
                        automatically using AWS Lambda, Amazon S3
                        and DynamoDB.
                    </p>

                    <div className="hero-features">

                        <span>✔ Resize</span>

                        <span>✔ Compress</span>

                        <span>✔ Thumbnail</span>

                        <span>✔ Multiple Formats</span>

                    </div>

                    <div className="hero-buttons">

                        <button className="primary-btn">
                            Upload Image
                        </button>

                        <button className="secondary-btn">
                            Learn More
                        </button>

                    </div>

                </div>

                {/* Right */}

                <div className="hero-image">

                    <div className="image-placeholder">

                        IMAGE

                    </div>

                </div>

            </div>

        </section>
    );
}

export default HeroSection;