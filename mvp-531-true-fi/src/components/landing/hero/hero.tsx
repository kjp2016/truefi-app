"use client";
import TypewriterComponent from "typewriter-effect";
import ShimmerButton from "@/components/magicui/shimmer-button"; // Assuming this path is correct
import { ChevronRight } from "lucide-react";
import {
  MAIN_COLOR,
  RADIAN_BACKGROUND,
  SHIMMER_BACKGROUND,
  SHIMMER_HOVER,
} from "@/config/constants"; // Assuming this path is correct
import { cn } from "@/lib/utils"; // Assuming this path is correct
import { useRouter } from "next/navigation";

export const Hero = () => {
  const router = useRouter();

  return (
    // Using a React Fragment to group the banner and the main hero content
    <>
      {/* "Coming Soon" Banner Section - Updated Text & Neutral Tones */}
      <div className="w-full bg-cyan-100 dark:bg-cyan-800 border-b-2 border-cyan-300 dark:border-cyan-700 text-center py-3 px-4">
        <p className="text-sm sm:text-base text-cyan-800 dark:text-cyan-100">
          <strong>TrueFi.ai is Coming Soon!</strong>
          <span className="hidden sm:inline"> In the meantime, explore the demo using a sample profile named Alex – </span>
          <button
            onClick={() => router.push("/chat")} // Assuming router is defined in your Hero component
            className="font-semibold underline hover:text-slate-900 dark:hover:text-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded px-1" // Added a little padding for the button
          >
            TrueFi.ai Demo
          </button>
          !
        </p>
      </div>

      {/* Original Hero Content - slightly adjusted top padding */}
      <div className="text-primary font-bold py-20 sm:py-28 text-center space-y-5"> {/* Reduced top padding a bit */}
        <div className="text-2xl sm:text-5xl space-y-5 font-extrabold">
          <h1 className={cn(MAIN_COLOR)}>AI-Driven Finance</h1>
          <div className={cn("text-transparent bg-clip-text", RADIAN_BACKGROUND)}>
            <TypewriterComponent
              options={{
                strings: ["Guidance and Real Results Personalized to You."],
                autoStart: true,
                loop: true,
              }}
            />
          </div>
        </div>
        <div className="text-sm md:text-xl font-light text-muted-foreground">
          Effortlessly Manage Your Finances
        </div>
        <div className="grid md:grid-cols-1 place-items-center pt-4"> {/* Added a little top padding to the button area */}
          <ShimmerButton
            className={cn(
              "flex items-center justify-center shadow-2xl", // Kept existing shadow
              SHIMMER_HOVER
            )}
            background={SHIMMER_BACKGROUND}
            onClick={() => {
              router.push("/chat");
            }}
          >
            <span className="whitespace-pre bg-gradient-to-b from-black from-30% to-gray-300/80 bg-clip-text text-center text-sm lg:text-2xl font-semibold leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 z-10">
              Chat with Penny
            </span>
            {/* Ensure ChevronRight is correctly imported and available */}
            <ChevronRight className="ml-1 h-6 w-6 duration-150 ease-in-out transform group-hover:translate-x-1 text-white dark:text-slate-300 z-10" />
          </ShimmerButton>
        </div>
      </div>
    </>
  );
};
