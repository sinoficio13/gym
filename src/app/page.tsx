import { AboutSection } from "@/components/landing/AboutSection";
import { Footer } from "@/components/landing/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { ServicesSection } from "@/components/landing/ServicesSection";

export default function Home() {
  return (
    <main style={{ backgroundColor: '#000', minHeight: '100vh' }}>
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <Footer />
    </main>
  );
}
