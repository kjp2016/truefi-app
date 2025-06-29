// src/components/chat/user-message.tsx
"use client";
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// import remarkMath from 'remark-math'; // if user can type math
// import rehypeKatex from 'rehype-katex'; // if user can type math

interface UserMessageProps {
  content: string;
}

export default function UserMessage({ content }: UserMessageProps) {
  return (
    // This div IS Alex's styled bubble
    <div className={`
      p-3 rounded-xl shadow-sm max-w-none break-words {/* Basic bubble structure & spacing */}
      bg-sky-100 text-black dark:bg-sky-800 dark:text-sky-100 {/* Colors */}
      prose prose-sm dark:prose-invert {/* Base markdown styling */}
      text-primary-black font-medium text-xs sm:text-sm {/* YOUR SPECIFIC FONT STYLES - ensure text-primary-black is defined */}
    `}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm/*, remarkMath*/]} 
        // rehypePlugins={[rehypeKatex]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
