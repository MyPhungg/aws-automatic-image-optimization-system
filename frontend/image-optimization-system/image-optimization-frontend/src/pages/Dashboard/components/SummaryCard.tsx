import "./SummaryCard.css";

interface SummaryCardProps {

    title: string;

    value: string;

    subtitle: string;

    icon: string;

}

function SummaryCard({

    title,

    value,

    subtitle,

    icon,

}: SummaryCardProps) {

    return (

        <div className="summary-card">

            <div className="summary-top">

                <div className="summary-icon">

                    {icon}

                </div>

                <span>

                    {title}

                </span>

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