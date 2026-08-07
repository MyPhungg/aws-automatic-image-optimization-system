import "./SummaryCard.css";

interface SummaryCardProps {
    title: string;
    value: string;
    subtitle: string;
}

function SummaryCard({
    title,
    value,
    subtitle,
}: SummaryCardProps) {
    return (
        <div className="summary-card">
            <div className="summary-title">
                {title}
            </div>

            <div className="summary-value">
                {value}
            </div>

            <div className="summary-subtitle">
                {subtitle}
            </div>
        </div>
    );
}

export default SummaryCard;