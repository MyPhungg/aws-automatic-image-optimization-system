import "./DashboardPage.css";

import DashboardHeader from "./components/DashboardHeader";
import SummaryCards from "./components/SummaryCards";
import RecentProcessing from "./components/RecentProcessing";
import QuickActions from "./components/QuickAction";
function DashboardPage() {

    return (

        <div className="dashboard-page">

            <DashboardHeader />
            <SummaryCards />
            <RecentProcessing />
            <QuickActions />
        </div>

    );

}

export default DashboardPage;