import MainLayout from "../../layouts/MainLayout";

import HeroSection from "./sections/HeroSection";
import FeatureSection from "./sections/FeatureSection";
import StasticsticsSection from "./sections/StasticsticsSection";
import WorkflowSection from "./sections/WorkflowSection";
import CTASection from "./sections/CTASection";
import BenefitSection from "./sections/BenefitSection";

function Home() {
    return (
        <MainLayout>
            <HeroSection />
            <FeatureSection />
            <WorkflowSection />
            <StasticsticsSection />
            <BenefitSection />
            <CTASection /> 
        </MainLayout>
    )
}
export default Home