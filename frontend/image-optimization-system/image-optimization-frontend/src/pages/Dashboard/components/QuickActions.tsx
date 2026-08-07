import "./QuickAction.css";

import QuickActionCard from "./QuickActionCard";

function QuickActions(){

    return(

        <section className="quick-actions">

            <h2>

                Quick Actions

            </h2>

            <div className="quick-list">

                <QuickActionCard

                    title="Upload Images"

                    description="Upload images for optimization."

                    icon="⬆"

                    path="/upload"

                />

                <QuickActionCard

                    title="History"

                    description="View processed images."

                    icon="🕓"

                    path="/history"

                />

            </div>

        </section>

    );

}

export default QuickActions;