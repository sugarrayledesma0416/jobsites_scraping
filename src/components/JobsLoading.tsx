import { Spinner } from "@/components/Spinner";

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/50">
      <div className="border-b border-zinc-800 px-4 py-3">
        <div className="h-3 w-full max-w-3xl animate-pulse rounded bg-zinc-800" />
      </div>
      <div className="divide-y divide-zinc-800/80">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 px-4 py-4"
          >
            <div className="h-3 w-6 shrink-0 animate-pulse rounded bg-zinc-800" />
            <div className="h-3 flex-1 animate-pulse rounded bg-zinc-800/80" />
            <div className="hidden h-3 w-20 animate-pulse rounded bg-zinc-800 sm:block" />
            <div className="hidden h-3 w-32 animate-pulse rounded bg-zinc-800 sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

interface JobsLoadingProps {
  message?: string;
  showSkeleton?: boolean;
}

export function JobsLoading({
  message = "Loading jobs…",
  showSkeleton = true,
}: JobsLoadingProps) {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-live="polite">
      <div className="flex items-center justify-center gap-3 py-4">
        <Spinner size="lg" />
        <span className="text-sm font-medium text-zinc-400">{message}</span>
      </div>
      {showSkeleton && <TableSkeleton />}
    </div>
  );
}

export function JobDetailLoading() {
  return (
    <div
      className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-8"
      aria-busy="true"
      aria-live="polite"
    >
      <Spinner size="lg" />
      <span className="text-sm font-medium text-zinc-400">Loading job details…</span>
      <div className="mt-4 w-full max-w-md space-y-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-800" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-800" />
        <div className="h-20 w-full animate-pulse rounded bg-zinc-800/60" />
      </div>
    </div>
  );
}
