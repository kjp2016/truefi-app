import { LandingNavbar } from "@/components/landing/landing-navbar";
import { Hero } from "@/components/landing/hero/hero";
import TestimonialHighlight from "@/components/landing/testimonials/testimonial-highlight";
import FeatureSections from "@/components/landing/features/feature-sections";

export default function Home() {
  return (
    <div className="h-full ">
      <LandingNavbar />
      <Hero />
      <FeatureSections />
      <TestimonialHighlight />
    </div>
  );
}
