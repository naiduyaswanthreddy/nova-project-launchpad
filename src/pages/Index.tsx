
import React from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import FeaturedProjectsSection from "@/components/landing/FeaturedProjectsSection";
import { WhyChooseUsSection } from "@/components/landing/WhyChooseUsSection";
import { JoinMovementSection } from "@/components/landing/JoinMovementSection";
import { FooterSection } from "@/components/landing/FooterSection";

export default function Index() {
  return (
    <div className="bg-background">
      <HeroSection />
      <HowItWorksSection />
      <FeaturedProjectsSection />
      <WhyChooseUsSection />
      <JoinMovementSection />
      <FooterSection />
    </div>
  );
}
