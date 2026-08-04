import "./StatisticsSection.css"

const statistics = [
    {
        value: "12,500 +",
        title: "Images Optimized"
    },
    {
        value: "73%",
        title: "Average Compression"
    },
    {
        value: "1.5 sec",
        title: "Average Processing Time"
    },
    {
        value: "JPEG - PNG - WEBP",
        title: "Supported Formats"
    }
];

function StasticsticsSection(){
    return (
        <section className="statistics">
            <div className="statistics-header">
                <h2> System Statistics</h2>
                <p>Performance overview of the Automatic Image Optimization System.</p>
            </div>
            <div className="statistics-grid">
                {
                    statistics.map((item, index) => (
                        <div className="statistics-card" key={index}>
                            <h3>{item.value}</h3>
                            <p>{item.title}</p>
                        </div>
                    ))
                }
            </div>
        </section>
    )

}
export default StasticsticsSection