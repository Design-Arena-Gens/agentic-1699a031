"use client";

import type { Contact } from "@/components/Chat";

export function Sidebar({
  appTitle,
  contacts,
  activeContactId,
  onSelectContact,
}: {
  appTitle: string;
  contacts: Contact[];
  activeContactId: string;
  onSelectContact: (id: string) => void;
}) {
  return (
    <aside className="hidden md:flex w-80 flex-col border-r border-zinc-200 dark:border-zinc-800">
      <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="text-lg font-semibold tracking-tight flex items-center gap-2">
          <Logo />
          {appTitle}
        </div>
        <div className="text-xs text-zinc-500">A simple WhatsApp-like chat</div>
      </div>
      <div className="p-2">
        <input
          placeholder="Search or start new chat"
          className="w-full rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {contacts.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectContact(c.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${
              c.id === activeContactId ? "bg-zinc-50 dark:bg-zinc-800/50" : ""
            }`}
          >
            <div className="grid h-10 w-10 place-items-center rounded-full text-white text-sm font-semibold select-none" style={{ backgroundColor: c.avatarColor }}>
              {c.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="font-medium truncate">{c.name}</div>
              <div className="text-xs text-zinc-500 truncate">{c.lastMessage ?? "No messages yet"}</div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}

function Logo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.02 2 10.98c0 2.15.88 4.13 2.35 5.7L4 22l5.5-1.86c.78.22 1.61.34 2.47.34 5.52 0 10-4.02 10-8.98C22 6.02 17.52 2 12 2z" fill="#25D366"/>
      <path d="M9.5 7.5h5a1 1 0 011 1v7l-2.5-1.5L10 15.5v-7a1 1 0 011-1z" fill="white"/>
    </svg>
  );
}
