"use client";
import React, { useState, useRef, useEffect, FormEvent } from "react";

// UI component imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toggle } from "@/components/ui/toggle";

// Markdown and Math rendering
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
// Ensure KaTeX CSS is imported globally, e.g., in your src/app/layout.tsx or globals.css
// import 'katex/dist/katex.min.css';

// Your custom components
import LoadingDots from "./loading-dots";
import BotMessageWithImage from "./bot-message-with-image";
import BotCardContent from "./bot-card-content";
import UserMessage from "./user-message";
import { Icons } from "../icons";
import TableComponent from "./TableComponent";

// --- INTERFACE DEFINITIONS ---
interface RichContentData {
  type: "table" | "bar_chart" | "line_chart" | "pie_chart" | string;
  data: any;
  title?: string;
}

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  images?: string[];
  richContent?: RichContentData;
}

interface PennyApiResponse {
  reply: string;
  session_id: string;
  rich_content?: RichContentData;
}

const INITIAL_MESSAGE: Message = {
  id: "initial-penny-greeting-" + crypto.randomUUID(),
  content: "Hi Alex! I'm Penny, your AI Financial Copilot. How can I help you today?",
  role: "assistant",
};

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const lastMessageRef = useRef<HTMLDivElement>(null);
  const finishConversation = useRef(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    let storedSessionId = localStorage.getItem("pennyChatSessionId");
    if (!storedSessionId) {
      storedSessionId = crypto.randomUUID();
      localStorage.setItem("pennyChatSessionId", storedSessionId);
    }
    setSessionId(storedSessionId);
    console.log(`Chat session ID initialized: ${storedSessionId}`);
  }, []);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const createNewUserMessage = (content: string): Message => {
    return { id: crypto.randomUUID(), content, role: "user" };
  };

  const getBotResponse = async (currentMessage: string, currentSessionId: string) => {
    if (!currentMessage.trim() || !currentSessionId) {
      console.warn("Empty message or session ID.");
      return;
    }
    setIsTyping(true);
    setError(null);
    const PENNY_API_URL = process.env.NEXT_PUBLIC_PENNY_API_URL || "/api/chat"; // Use proxy route
    try {
      const response = await fetch(PENNY_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: currentSessionId,
          message: currentMessage,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Server error" }));
        throw new Error(errorData.detail || errorData.error || `API Error: ${response.status}`);
      }
      const data: PennyApiResponse = await response.json();
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), content: data.reply, role: "assistant", richContent: data.rich_content },
      ]);
    } catch (err: any) {
      console.error("Error fetching Penny response:", err);
      const errMsg = err.message || "Failed to connect to the AI assistant.";
      setError(errMsg);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), content: `Sorry, an issue occurred: ${errMsg}`, role: "assistant" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !sessionId || isTyping) return;
    const newUserMsg = createNewUserMessage(chatInput);
    setMessages((prev) => [...prev, newUserMsg]);
    if (sessionId) {
      await getBotResponse(chatInput, sessionId);
    }
    setChatInput("");
  };

  const renderBotMessage = (message: Message) => {
    const markdownContent = message.content && typeof message.content === "string" ? (
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
        {message.content}
      </ReactMarkdown>
    ) : null;

    if (message.images && message.images.length > 0 && typeof BotMessageWithImage !== "undefined") {
      return <BotMessageWithImage key={message.id} message={message.content} images={message.images} />;
    }

    if (message.richContent) {
      const { type, data, title } = message.richContent;
      let richElement = null;
      if (type === "table" && typeof TableComponent !== "undefined") {
        richElement = <TableComponent data={data} title={title} />;
      }
      if (richElement) {
        if (typeof BotCardContent !== "undefined") {
          return (
            <BotCardContent key={message.id}>
              {markdownContent && <div className="mb-2">{markdownContent}</div>}
              {richElement}
            </BotCardContent>
          );
        }
        return (
          <div key={message.id} className="w-full my-1">
            {markdownContent && <div className="mb-2">{markdownContent}</div>}
            {title && !data.title && <h4 className="font-semibold my-1 text-sm">{title}</h4>}
            {richElement}
          </div>
        );
      }
    }

    if (typeof BotCardContent !== "undefined") {
      return <BotCardContent key={message.id}>{markdownContent}</BotCardContent>;
    }

    return (
      <div
        className="prose prose-sm dark:prose-invert max-w-none p-3 bg-slate-100 dark:bg-slate-700 rounded-xl shadow-sm"
        key={message.id}
      >
        {markdownContent}
      </div>
    );
  };

  return (
    <section className="self-center w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Penny</CardTitle>
          <CardDescription>Ask Questions and Learn</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-380px)] w-full pr-4 mt-2">
            {messages.map((message, index) => (
              <div
                key={message.id}
                ref={index === messages.length - 1 ? lastMessageRef : null}
                className={`flex mb-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" ? (
                  renderBotMessage(message)
                ) : typeof UserMessage !== "undefined" ? (
                  <UserMessage content={message.content} />
                ) : (
                  <div className="max-w-[85%] p-3 rounded-xl break-words bg-sky-100 text-sky-900 dark:bg-sky-800 dark:text-sky-100 shadow-sm">
                    {message.content}
                  </div>
                )}
              </div>
            ))}
            {isTyping && typeof LoadingDots !== "undefined" && <LoadingDots />}
            {error && !isTyping && (
              <div className="p-2 my-2 text-sm text-red-700 bg-red-100 rounded-md text-center">
                {error}
              </div>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmit} className="w-full flex gap-2 items-center">
            {typeof Toggle !== "undefined" &&
            typeof Icons !== "undefined" &&
            Icons.messageSquareShare &&
            Icons.monitorOff && (
              <Toggle
                variant="outline"
                size="default"
                onClick={() => setIsSharing(!isSharing)}
                aria-label="Toggle sharing mode"
              >
                {isSharing ? (
                  <Icons.monitorOff className="h-[1.5rem] w-[1.3rem]" />
                ) : (
                  <Icons.messageSquareShare className="h-[1.5rem] w-[1.3rem]" />
                )}
              </Toggle>
            )}
            <div className="w-full flex-grow">
              <Input
                placeholder="How can I help you?"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isTyping || !sessionId}
                className="w-full"
              />
              <div className="text-xs sm:text-sm text-muted-foreground pl-2 pt-1 italic">
                {isSharing ? "Incognito Mode" : "Memory Mode"}
              </div>
            </div>
            {typeof Icons !== "undefined" && Icons.microphone && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Use Microphone"
              >
                <Icons.microphone className="h-[1.5rem] w-[1.3rem]" />
              </Button>
            )}
            {typeof Icons !== "undefined" && Icons.send && (
              <Button
                disabled={isTyping || !chatInput.trim() || finishConversation.current || !sessionId}
                type="submit"
                size="icon"
                aria-label="Send message"
              >
                <Icons.send className="h-[1.5rem] w-[1.5rem]" />
              </Button>
            )}
          </form>
        </CardFooter>
      </Card>
    </section>
  );
};