"use client";

import { useEffect, useRef, useState } from "react";

export function MessageInput({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const send = () => {
    const value = text.trim();
    if (!value) return;
    onSend(value);
    setText("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === "Return") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        send();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [text]);

  return (
    <div className="border-t border-zinc-200 dark:border-zinc-800 p-3">
      <div className="max-w-2xl mx-auto flex items-end gap-2">
        <button
          title="Emoji"
          className="h-10 w-10 grid place-items-center rounded-full text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          onClick={() => inputRef.current?.focus()}
        >
          ??
        </button>
        <textarea
          ref={inputRef}
          placeholder="Type a message"
          className="flex-1 resize-none rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 leading-relaxed outline-none focus:ring-2 focus:ring-emerald-500/30"
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <button
          onClick={send}
          className="h-10 px-4 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 active:bg-emerald-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
