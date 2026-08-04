import "./RecentProcessing.css";

import { dashboardHistory } from "../../../data/dashboardHistory";

import RecentItem from "./RecentItem";

function RecentProcessing() {

    return (

        <section className="recent-processing">

            <div className="recent-header">

                <h2>

                    Recent Processing

                </h2>

                <button>

                    View All

                </button>

            </div>

            <div className="recent-list">

                {

                    dashboardHistory.map((item) => (

                        <RecentItem

                            key={item.id}

                            item={item}

                        />

                    ))

                }

            </div>

        </section>

    );

}

export default RecentProcessing;