"use client"
import Image from "next/image"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { siteConfig } from "@/config/site"
import { Icons } from "./icons"
import { useState } from "react"
import { Tool } from "@/types/tool"
import Link from "next/link"


const defaultRoutes: Tool[] = [
  {
    label: "Chat with Penny",
    icon: "messageSquare",
    href: "/chat",
  },
  {
    label: "My Dashboard",
    icon: "layoutDashboard",
    href: "/user",
  },
  // commented out advisor dashboard for now. Uncomment the following lines if you want to include the Advisor Dashboard in the future
 // {
 //   label: "Advisor Dashboard",
//    icon: "candlestickChartIcon",
 //   href: "/advisor",
//  },
  {
    label: "Settings",
    icon: "settings",
    href: "",
  },
]

export const Sidebar = () => {
  const pathname = usePathname()

  const [routes] = useState(defaultRoutes)

  return (
    <div className="space-y-4 py-4 flex flex-col h-full text-black dark:text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <div className="relative h-8 w-8 mr-4">
            <Image fill alt="Logo" src="/logo.png" />
          </div>
          <h1 className={cn("text-2xl font-bold")}>
            {siteConfig.name}
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => {
            const Icon = Icons[route.icon as keyof typeof Icons]
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group text-black flex p-3 w-full justify-start font-medium cursor-pointer hover:text-[#00BAC7] rounded-lg transition dark:text-white dark:hover:text-[#00BAC7]",
                  {"bg-[#00bac71a]" : pathname === route.href}
                )}
              >
                <div className="flex items-center flex-1">
                  <Icon className={cn("h-5 w-5 mr-3")} />
                  {route.label}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
