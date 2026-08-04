import "./BenefitSection.css"

const benefits =[
    {
        title: "Save Strorage Space",
        description: "Reduce storage costs by compressing images while maintaining excellent quality."
    },
    {
        title: "Faster Website Loading",
        description: "Optimized images improve website performance and user experience."
    },
    {
        title: "Automatic Processing",
        description: "Imagesare automatically resozed and compressed after upload."
    },
    {
        title: "Secure Cloud Storage",
        description: "Processed images aer securely stored in Amazon S3."
    }
]
function BenefitSection(){
    return (
        <section className="benefit">
            <div className="benefit-header">
                <h2> Why you should choose our System?</h2>
                <p>Optimize your workflow with AWS cloud services</p>
            </div>
            <div className="benefit-list">
                {
                   benefits.map((item,index) => (
                    <div className="benefit-card" key={index}>
                        <div className="benefit-check">
                            ✓
                        </div>
                        <div>
                            <h3>
                                {item.title}
                            </h3>
                            <p>{item.description}</p>
                        </div>
                    </div>
                   )) 
                }
            </div>
        </section>
    );
}
export default BenefitSection