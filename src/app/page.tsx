import { Suspense } from 'react';
import { AboutSection } from "@/components/landing/AboutSection";
import { Footer } from "@/components/landing/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { TrajectorySection } from "@/components/landing/TrajectorySection";
import { PhilosophySection } from "@/components/landing/PhilosophySection";
import { ContactSection } from "@/components/landing/ContactSection";

export default function Home() {
  return (
    <main style={{ backgroundColor: '#000', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <Suspense fallback={<div style={{ height: '100vh', background: '#000' }} />}>
        <HeroSection />
      </Suspense>
      <AboutSection />
      <TrajectorySection />
      <PhilosophySection />
      <ServicesSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
