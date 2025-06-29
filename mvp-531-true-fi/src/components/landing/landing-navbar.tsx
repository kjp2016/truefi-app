"use client"; 
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../theme-toggle"; // Assuming this path is correct
import { siteConfig } from "@/config/site";
import { MobileSidebar } from "@/components/mobile-sidebar";

// Import Shadcn/UI Dropdown components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Import Icons from lucide-react
import { ChevronDown, Menu as MenuIcon } from "lucide-react";

const font = Montserrat({ weight: "600", subsets: ["latin"] });

export const LandingNavbar = () => {
  return (
    <nav className="p-4 bg-transparent flex items-center justify-between h-16 border-b dark:border-slate-700">
      {/* Logo and Site Name (Stays on the Left) */}
      <Link href="/" className="flex items-center">
        <div className="relative h-8 w-8 mr-2 sm:mr-4">
          <Image fill alt="TrueFi.AI Logo" src="/logo.png" />
        </div>
        <h1 className={cn("text-2xl font-bold text-primary", font.className)}>
          {siteConfig.name} {/* This is "TrueFi.AI" */}
        </h1>
      </Link>

      {/* Container for all items on the right side of the navbar */}
      <div className="flex items-center gap-x-2 sm:gap-x-3">
        {/* Mobile Sidebar Trigger - Placed first for mobile, but hidden on desktop */}
        <div className="md:hidden">
          {typeof MobileSidebar !== 'undefined' && <MobileSidebar />}
        </div>

        {/* Desktop: ThemeToggle, then Platform Dropdown, then Menu Dropdown */}
        {/* This group is hidden on mobile and shown on medium screens and up */}
        <div className="hidden md:flex items-center gap-x-1 lg:gap-x-2">
          {typeof ThemeToggle !== 'undefined' && <ThemeToggle />}

          <DropdownMenu> {/* Platform Dropdown */}
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm font-medium px-2 sm:px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                Platform
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
              <DropdownMenuLabel className="text-slate-600 dark:text-slate-400">Explore Platform</DropdownMenuLabel>
              <DropdownMenuSeparator className="border-slate-200 dark:border-slate-700" />
              <Link href="/chat" passHref legacyBehavior>
                <DropdownMenuItem className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800">
                  Chat with Penny
                </DropdownMenuItem>
              </Link>
              <Link href="/user" passHref legacyBehavior> 
                <DropdownMenuItem className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800">
                  My Finances Dashboard
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div> {/* End of desktop ThemeToggle + Platform group */}

        {/* Menu Dropdown - This is also part of the right-aligned group, but md:flex makes it appear on desktop */}
        {/* For mobile, it would be handled by MobileSidebar if it's not duplicated. */}
        {/* If MobileSidebar IS the menu for mobile, this can also be wrapped in "hidden md:flex" or similar */}
        <div className="flex items-center"> {/* Adjusted to always be flex, md:flex for control if needed */}
            <DropdownMenu> {/* Menu Dropdown */}
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open main menu" className="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                <MenuIcon className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                <Link href="/signup" passHref legacyBehavior> 
                    <DropdownMenuItem className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800">Sign Up / Log In</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator className="border-slate-200 dark:border-slate-700" />
                <Link href="/about" passHref legacyBehavior>
                    {/* Updated "About Us" link to an external site */}
            <DropdownMenuItem 
              className="cursor-pointer hover:bg-accent focus:bg-accent" 
              asChild // Allows the DropdownMenuItem to render its child (the <a> tag) directly
            >
              <a 
                href="https://truefi-about-us-gqf7u2t.gamma.site/" 
                target="_blank" // Opens the link in a new tab
                rel="noopener noreferrer" // Security measure for external links
              >
                About Us
              </a>
            </DropdownMenuItem>
                </Link>
                <Link href="/mission" passHref legacyBehavior> 
                    <DropdownMenuItem 
              className="cursor-pointer hover:bg-accent focus:bg-accent" 
              asChild // Allows the DropdownMenuItem to render its child (the <a> tag) directly
            >
              <a 
                href="https://truefi-mission-thkg4q8.gamma.site/" 
                target="_blank" // Opens the link in a new tab
                rel="noopener noreferrer" // Security measure for external links
              >
                Our Mission
              </a>
            </DropdownMenuItem>
                </Link>
                <Link href="/resources" passHref legacyBehavior>
                    <DropdownMenuItem 
              className="cursor-pointer hover:bg-accent focus:bg-accent" 
              asChild // Allows the DropdownMenuItem to render its child (the <a> tag) directly
            >
              <a 
                href="https://truefi-onboarding-26k6u91.gamma.site/" 
                target="_blank" // Opens the link in a new tab
                rel="noopener noreferrer" // Security measure for external links
              >
                How to Use TrueFi {/* You can adjust this text if you like */}
              </a>
            </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div> {/* End of the main right-aligned group */}
    </nav>
  );
};

export default LandingNavbar;