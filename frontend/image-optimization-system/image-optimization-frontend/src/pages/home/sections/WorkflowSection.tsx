import "./WorkflowSection.css";

const workflow = [
    {
        number: "01",
        title: "Upload Image",
        description: "Upload your image to our platform using the upload button. You can upload images in various formats such as JPEG, PNG, and GIF."
    },
    {
        number: "02",
        title: "AWS Lambda Trigger",
        description: "An S3 upload event automatically invokes an AWS LAmbda function"
    },
    {
        number: "03",
        title: "Optimized Image",
        description: "Resize, compress, and generate thumbnails using the Pillow library"
    },
    {
        number: "04",
        title: "Download Results",
        description: "The optimized image is stored in the output bucket and ready for download."
    }
]

function WorkflowSection(){
    return (
        <section className="workflow">
            <div className="workflow-header">
                <h2>
                    How It Works
                </h2>
                <p>
                    Automatic image optimization workflow powered bay AWS.
                </p>
            </div>

            <div className = "workflow-container">
                {
                    workflow.map((step, index) => (
                        <div className="workflow-card" key={index}>
                            <div className="step-number">
                                {step.number}
                            </div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </div>
                    ))
                }
            </div>
        </section>
    )
}
export default WorkflowSection