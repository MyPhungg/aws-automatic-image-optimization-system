import "./SummaryCards.css";

import SummaryCard from "./SummaryCard";

function SummaryCards() {

    const cards = [

        {

            title: "Total Images",

            value: "126",

            subtitle: "+12 this month",

            icon: "📷",

        },

        {

            title: "Storage Saved",

            value: "2.4 GB",

            subtitle: "+340 MB this week",

            icon: "💾",

        },

        {

            title: "Avg Compression",

            value: "61%",

            subtitle: "Excellent",

            icon: "⚡",

        },

        {

            title: "Success Rate",

            value: "98%",

            subtitle: "Stable",

            icon: "✅",

        },

    ];

    return (

        <div className="summary-grid">

            {

                cards.map((card) => (

                    <SummaryCard

                        key={card.title}

                        title={card.title}

                        value={card.value}

                        subtitle={card.subtitle}

                        icon={card.icon}

                    />

                ))

            }

        </div>

    );

}

export default SummaryCards;