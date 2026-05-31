import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";

export default function AdminPage() {
  return (
    <main className="mx-auto min-h-full w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <AppHeader active="admin" />
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-8">
        <h2 className="text-xl font-semibold text-white">Admin</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Admin tools will be added here.{" "}
          <Link href="/" className="text-sky-400 hover:underline">
            Back to jobs
          </Link>
        </p>
      </div>
    </main>
  );
}
