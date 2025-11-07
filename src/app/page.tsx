import { Chat } from "@/components/Chat";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-emerald-100/40 to-emerald-50/20 dark:from-zinc-950 dark:to-zinc-900 p-4 sm:p-6 flex items-center justify-center">
      <Chat />
    </div>
  );
}
