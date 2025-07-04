"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { PartnerLogosSection } from "@/components/home/PartnerLogosSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { ClimateAdaptationNeedsSection } from "@/components/home/ClimateAdaptationNeedsSection";
import { EligibilitySection } from "@/components/home/EligibilitySection";
import { FAQSection } from "@/components/home/FAQSection";
import { ApplicationPrepGuideSection } from "@/components/home/ApplicationPrepGuideSection";

export default function Home() {
  return (
    <div className="relative">
      <HeroSection />

      <ClimateAdaptationNeedsSection />

      <FeaturesSection />


      <EligibilitySection />

      <ApplicationPrepGuideSection />

      <PartnerLogosSection />

      <FAQSection />

    </div>
  );
}

