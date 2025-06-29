"use client"; 
import Link from "next/link";

// Ensure these components are correctly imported if used
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle"; // Or from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu as MenuIcon } from "lucide-react";
// import { MobileSidebar } from "@/components/mobile-sidebar"; // Only if this specific navbar needs its own mobile trigger

export const AppNavbar = () => { 
  return (
    // Main nav container. It will take the available width.
    // `flex items-center justify-end` will push all direct children to the right.
    <nav className="p-4 bg-gray-100 dark:bg-gray-900 flex items-center justify-end h-16"> {/* Removed border-b to blend */}
      
      {/* Single container for ALL items that should be on the right */}
      <div className="flex items-center gap-x-1 sm:gap-x-2 lg:gap-x-3">
        
        {/* Mobile Sidebar Trigger (if needed for this navbar specifically on mobile) */}
        {/* If your main layout's sidebar handles mobile, you might not need this here */}
        {/* <div className="md:hidden">
          {typeof MobileSidebar !== 'undefined' && <MobileSidebar />}
        </div> */}

        {/* Desktop: ThemeToggle, then Platform Dropdown, then Menu Dropdown */}
        {/* This group will now be part of the items pushed to the right */}
        {/* The `hidden md:flex` was removed to make them always part of this group,
            adjust if you have a separate MobileSidebar component handling these for mobile.
            If MobileSidebar only handles navigation links and not these actions,
            you might want different visibility or a different mobile layout approach.
            For now, this groups them for desktop.
        */}
        {typeof ThemeToggle !== 'undefined' && <ThemeToggle />}

        <DropdownMenu> {/* Platform Dropdown */}
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-sm font-medium px-2 sm:px-3 py-2 text-foreground hover:bg-accent focus:outline-none focus:ring-0">
              Platform
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover border-border"> {/* align="end" is good for right-aligned triggers */}
            <DropdownMenuLabel className="text-muted-foreground">Explore Platform</DropdownMenuLabel>
            <DropdownMenuSeparator className="border-border" />
            <Link href="/chat" passHref legacyBehavior>
              <DropdownMenuItem className="cursor-pointer hover:bg-accent focus:bg-accent">
                Chat with Penny
              </DropdownMenuItem>
            </Link>
            <Link href="/user" passHref legacyBehavior> 
              <DropdownMenuItem className="cursor-pointer hover:bg-accent focus:bg-accent">
                My Finances Dashboard
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu> {/* Menu Dropdown */}
          <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open main menu" className="text-foreground hover:bg-accent focus:outline-none focus:ring-0">
              <MenuIcon className="h-5 w-5" />
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
              <Link href="/signup" passHref legacyBehavior> 
                  <DropdownMenuItem className="cursor-pointer hover:bg-accent focus:bg-accent">Sign Up / Log In</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator className="border-border" />
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
                  {/* Updated "Our Mission" link to an external site */}
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
      </div> {/* End of the main right-aligned group */}
    </nav>
  );
};

export default AppNavbar;