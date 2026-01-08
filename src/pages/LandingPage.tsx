import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { AnalyticsShowcase } from '@/components/landing/AnalyticsShowcase';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { WhyChooseUs } from '@/components/landing/WhyChooseUs';
import { TargetAudience } from '@/components/landing/TargetAudience';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AnalyticsShowcase />
      <FeaturesSection />
      <WhyChooseUs />
      <TargetAudience />
      <CTASection />
      <Footer />
    </div>
  );
}
