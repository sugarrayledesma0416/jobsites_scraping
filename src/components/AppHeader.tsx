import Link from "next/link";

interface AppHeaderProps {
  active: "jobs" | "admin";
}

export function AppHeader({ active }: AppHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Latest Jobs
        </h1>
        <p className="mt-1 text-sm text-zinc-400">Fetched from Globlinkr API</p>
      </div>

      <nav className="flex gap-2">
        <Link
          href="/"
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            active === "jobs"
              ? "border-zinc-600 bg-zinc-800 text-white"
              : "border-zinc-700 bg-transparent text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/60"
          }`}
        >
          Jobs
        </Link>
        <Link
          href="/admin"
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            active === "admin"
              ? "border-zinc-600 bg-zinc-800 text-white"
              : "border-zinc-700 bg-transparent text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/60"
          }`}
        >
          Admin
        </Link>
      </nav>
    </header>
  );
}
