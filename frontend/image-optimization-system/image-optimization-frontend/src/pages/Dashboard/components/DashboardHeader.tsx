import "./DashboardHeader.css";

import { useAuth } from "../../../context/AuthContext";

function DashboardHeader() {

    const { user } = useAuth();

    const today = new Date();

    const currentDate = today.toLocaleDateString("en-US", {

        weekday: "long",

        year: "numeric",

        month: "long",

        day: "numeric",

    });

    return (

        <div className="dashboard-header">

            <div className="dashboard-header-left">

                <h1>

                    Dashboard

                </h1>

                <h2>

                    Welcome back,

                    <span>

                        {" "}

                        {user?.fullName ?? "Guest"}

                    </span>

                    👋

                </h2>

                <p>

                    Manage your image optimization tasks and monitor processing.

                </p>

            </div>

            <div className="dashboard-header-right">

                <div className="dashboard-date">

                    {currentDate}

                </div>

            </div>

        </div>

    );

}

export default DashboardHeader;