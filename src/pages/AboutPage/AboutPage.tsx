import { Helmet } from "react-helmet-async";
import { SEO, SEO_CONFIG } from "@/components/seo";
import { useLanguage } from "@/hooks";
import {
  HeroSection,
  MissionSection,
  FeaturesSection,
  ValuesSection,
  StatsSection,
  VisionSection,
  CTASection,
} from "@/components/pages/about-components";

const AboutPage: React.FC = () => {
  const { language } = useLanguage();
  const seoConfig = SEO_CONFIG.about[language as "en" | "ar"];

  return (
    <>
      <SEO {...seoConfig} />
      <Helmet>
        <html lang={language} />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSection />

        {/* Mission Section */}
        <MissionSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Values Section */}
        <ValuesSection />

        {/* Stats Section */}
        <StatsSection />

        {/* Vision Section */}
        <VisionSection />

        {/* Call to Action */}
        <CTASection />
      </div>
    </>
  );
};

export default AboutPage;
