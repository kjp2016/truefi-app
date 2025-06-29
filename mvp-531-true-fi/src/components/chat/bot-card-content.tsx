// src/components/chat/bot-card-content.tsx
"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 

export default function BotCardContent({
  children, 
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-end gap-x-2 max-w-[85%]"> 
      <Avatar className="h-6 w-6 flex-shrink-0"> 
        <AvatarFallback>P</AvatarFallback>
        <AvatarImage src="/logo.png" alt="Penny Bot Avatar" />
      </Avatar>
      <div 
        className={`
          flex-1 min-w-0 p-3 rounded-xl shadow-sm 
          bg-slate-100 text-slate-800 
          dark:bg-slate-700 dark:text-slate-100 
          prose prose-sm dark:prose-invert max-w-none 
          text-primary-black font-medium text-xs sm:text-sm 
          dark:text-slate-100 
          leading-[1.75] {/* <<< ADDED FOR 1.75 LINE SPACING */}
        `}
      >
        {children}
      </div>
    </div>
  );
}