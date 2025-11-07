"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/components/Chat";

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto bg-[url('/chat-bg-light.svg')] dark:bg-[url('/chat-bg-dark.svg')] bg-repeat p-4">
      <div className="max-w-2xl mx-auto space-y-2">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />)
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isMe = message.sender === "me";
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={
          `relative max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm ` +
          (isMe
            ? "bg-[#D9FDD3] text-zinc-900 rounded-tr-none"
            : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none")
        }
      >
        <span className="whitespace-pre-wrap break-words">{message.text}</span>
        <span className="ml-2 text-[10px] text-zinc-500 align-bottom select-none">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
}

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
