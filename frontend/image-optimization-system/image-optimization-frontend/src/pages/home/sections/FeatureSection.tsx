import "./FeatureSection.css"

const features = [
    {
        title: "Resize",
        description: "Resize images to any dimension while maintaining aspect ratio.",
    },
    {
        title: "Compress",
        description: "Reduce image file size without compromising quality.",
    },
    {
        title: "Thumbnail",
        description: "Generate thumbnails for quick previews and galleries.",
    },
    {
        title: "Multiple Formats",
        description: "Support for various image formats including JPEG, PNG, and WebP.",
    }
];

function FeatureSection(){
    return (
        <section className ="feature">
            <div className="feature-header">
                <h2>
                    Core Features
                </h2>
                <p>
                    Our image optimization service offers a range of features to enhance your images for web and mobile applications. From resizing and compressing to generating thumbnails and supporting multiple formats, we provide the tools you need to optimize your images efficiently.
                </p>
            </div> 
            <div className="feature-grid">
                {features.map((item, index) => (
                    <div key={index} className="feature-card">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                    </div>
                ))}
            </div>
        </section>
    )

}
export default FeatureSection