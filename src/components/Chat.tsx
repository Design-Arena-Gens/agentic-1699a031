"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageInput } from "@/components/MessageInput";
import { MessageList } from "@/components/MessageList";
import { Sidebar } from "@/components/Sidebar";

export type ChatMessage = {
  id: string;
  text: string;
  timestamp: number;
  sender: "me" | "them";
};

export type Contact = {
  id: string;
  name: string;
  lastMessage?: string;
  avatarColor: string;
};

const DEFAULT_CONTACTS: Contact[] = [
  { id: "mustafizur", name: "Mustafizur", avatarColor: "#25D366" },
  { id: "alice", name: "Alice", avatarColor: "#34B7F1" },
  { id: "bob", name: "Bob", avatarColor: "#FFB020" },
  { id: "support", name: "Support", avatarColor: "#FF5A5F" },
];

function getStorageKey(contactId: string) {
  return `mustafizur-chat/messages/${contactId}`;
}

function loadMessages(contactId: string): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getStorageKey(contactId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMessages(contactId: string, messages: ChatMessage[]) {
  try {
    localStorage.setItem(getStorageKey(contactId), JSON.stringify(messages));
  } catch {
    // ignore storage errors
  }
}

export function Chat() {
  const [contacts, setContacts] = useState<Contact[]>(DEFAULT_CONTACTS);
  const [activeContactId, setActiveContactId] = useState<string>(contacts[0]?.id ?? "mustafizur");
  const [messagesByContact, setMessagesByContact] = useState<Record<string, ChatMessage[]>>({});

  const activeMessages = useMemo(() => messagesByContact[activeContactId] ?? [], [messagesByContact, activeContactId]);
  const activeContact = useMemo(() => contacts.find(c => c.id === activeContactId)!, [contacts, activeContactId]);

  useEffect(() => {
    // load messages for all default contacts on mount
    setMessagesByContact(prev => {
      const next: Record<string, ChatMessage[]> = { ...prev };
      for (const c of contacts) {
        if (!next[c.id]) next[c.id] = loadMessages(c.id);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    // keep last message preview updated
    setContacts(prev =>
      prev.map(c => {
        const msgs = messagesByContact[c.id] ?? [];
        return { ...c, lastMessage: msgs.length ? msgs[msgs.length - 1].text : undefined };
      }),
    );
  }, [messagesByContact]);

  useEffect(() => {
    // persist active contact message changes
    const msgs = messagesByContact[activeContactId];
    if (msgs) saveMessages(activeContactId, msgs);
  }, [messagesByContact, activeContactId]);

  const handleSend = (text: string) => {
    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      text,
      timestamp: Date.now(),
      sender: "me",
    };
    setMessagesByContact(prev => {
      const current = prev[activeContactId] ?? [];
      return { ...prev, [activeContactId]: [...current, newMsg] };
    });

    // Simulate a reply
    window.setTimeout(() => {
      const reply: ChatMessage = {
        id: crypto.randomUUID(),
        text: generateAutoReply(text, activeContact.name),
        timestamp: Date.now(),
        sender: "them",
      };
      setMessagesByContact(prev => {
        const current = prev[activeContactId] ?? [];
        return { ...prev, [activeContactId]: [...current, reply] };
      });
    }, 600 + Math.random() * 1000);
  };

  // renameContact could be added later if editing contacts is needed

  return (
    <div className="flex h-[calc(100dvh-2rem)] w-full max-w-6xl rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm bg-white dark:bg-zinc-900">
      <Sidebar
        appTitle="mustafizur chat"
        contacts={contacts}
        activeContactId={activeContactId}
        onSelectContact={setActiveContactId}
      />
      <main className="flex flex-1 flex-col">
        <header className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <Avatar name={activeContact.name} color={activeContact.avatarColor} />
          <div>
            <div className="font-semibold leading-tight">{activeContact.name}</div>
            <div className="text-xs text-zinc-500">Online</div>
          </div>
        </header>
        <MessageList messages={activeMessages} />
        <MessageInput onSend={handleSend} />
      </main>
    </div>
  );
}

function Avatar({ name, color }: { name: string; color: string }) {
  const initials = useMemo(() => name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(), [name]);
  return (
    <div
      className="grid h-10 w-10 place-items-center rounded-full text-white text-sm font-semibold select-none"
      style={{ backgroundColor: color }}
      aria-label={`${name} avatar`}
    >
      {initials}
    </div>
  );
}

function generateAutoReply(userText: string, contactName: string): string {
  const canned = [
    `Got it!`,
    `Sounds good.`,
    `Let me check and get back to you.`,
    `Thanks for the update!`,
    `Interesting? tell me more.`,
    `??`,
  ];
  const idx = Math.abs(hashCode(userText + contactName)) % canned.length;
  return canned[idx];
}

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h | 0;
}
