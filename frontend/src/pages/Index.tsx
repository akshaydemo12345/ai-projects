import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TemplatesSection from "@/components/landing/TemplatesSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import LeadManagementSection from "@/components/landing/LeadManagementSection";
import PerformanceMarketingSection from "@/components/landing/PerformanceMarketingSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import FAQSection from "@/components/landing/FAQSection";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";
import AIFeaturesSection from "@/components/landing/AIFeaturesSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AIFeaturesSection />
      <PerformanceMarketingSection />
      <TemplatesSection />
      <LeadManagementSection />

      <ComparisonSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Index;
