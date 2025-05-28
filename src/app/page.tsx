"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { PartnerLogosSection } from "@/components/home/PartnerLogosSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { EligibilitySection } from "@/components/home/EligibilitySection";
import { CountriesSection } from "@/components/home/CountriesSection";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection />

      {/* Partner Logos Section */}
      <PartnerLogosSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Eligibility Section */}
      <EligibilitySection />

      {/* Countries Section */}
      <CountriesSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}

