"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const features = [
  {
    id: "feature-ai",
    name: "TrueFi’s Chat Assistant Penny",
    description:
      "Introducing Penny by TrueFi: Your dedicated financial co-pilot. More than just a chat assistant, Penny seamlessly integrates with your unique financial profile, understanding your ambitions and leveraging advanced AI to deliver personalized insights and actionable strategies. From planning major milestones to optimizing your daily budget, Penny empowers you to make smarter decisions, track your progress effortlessly, and build your financial future with confidence. Your goals, illuminated.",
    video: "/videos/Chat-with-Penny-Video.mp4",
    image: "/feature-1-img.png",
    cta: "Chat with Penny",
    href: "/chat",
    reverse: false,
  },
  {
    id: "feature-ai-2",
    name: "Financial Guidance",
    description:
      "Your Financial Command Center. Effortlessly Stay on Course: TrueFi’s Financial Guidance dashboard delivers a holistic, real-time command center for your money. Seamlessly monitor your financial health, track your ambitious goals, and gain an intuitive understanding of your spending patterns. Everything is personalized, making it simple to stay informed, in control, and confidently on your path to financial success.",
    video: "/videos/User-Dashboard-Video.mp4",
    image: "/feature-2-img.png",
    cta: "My Finances",
    href: "/user",
    reverse: true,
  },

];

const FeatureSections = () => {
  const [hoveredFeatureId, setHoveredFeatureId] = useState(null);
  return (
    <>
      {features.map((feature) => (
        <section id={feature.id} key={feature.id}>
          <div className="mx-auto px-6 py-6 sm:py-20">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-16 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-5">
              <div
                className={cn("m-auto lg:col-span-3", {
                  "lg:order-last": feature.reverse,
                })}
              >
                <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {feature.name}
                </p>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                  {feature.description}
                </p>
                <Link
                  className={cn(
                    buttonVariants({
                      variant: "default",
                      size: "lg",
                    }),
                    "mt-8"
                  )}
                  href={feature.href}
                >
                  {feature.cta}
                </Link>
              </div>
              <div
                className="border m-auto lg:col-span-2 shadow-2xl"
                onMouseEnter={() => setHoveredFeatureId(feature.id)}
                onMouseLeave={() => setHoveredFeatureId(null)}
              >
                {hoveredFeatureId === feature.id ? (
                  <video
                    src={feature.video}
                    loop
                    muted
                    controls
                    autoPlay
                    className="h-[300px] w-[300px] sm:h-[400px] sm:w-[400px]"
                  />
                ) : (
                  <Image
                    className="h-[300px] w-[300px] sm:h-[400px] sm:w-[400px]"
                    width={400}
                    height={400}
                    src={feature.image}
                    alt={feature.name}
                  ></Image>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
};

export default FeatureSections;
