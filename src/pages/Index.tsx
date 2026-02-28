import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
