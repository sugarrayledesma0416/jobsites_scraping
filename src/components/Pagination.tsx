"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Spinner } from "@/components/Spinner";

interface PaginationProps {
  page: number;
  hasMore: boolean;
}

export function Pagination({ page, hasMore }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const goToPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextPage <= 0) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }

    const query = params.toString();
    const href = query ? `/?${query}` : "/";

    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <div className="mb-4 flex items-center justify-end gap-3">
      {isPending && (
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Spinner size="sm" />
          <span>Loading…</span>
        </div>
      )}
      <div
        className={`flex items-center gap-2 transition-opacity ${isPending ? "pointer-events-none opacity-50" : ""}`}
      >
        <button
          type="button"
          onClick={() => goToPage(page - 1)}
          disabled={page <= 0 || isPending}
          className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="px-2 text-sm text-zinc-400">Page {page + 1}</span>
        <button
          type="button"
          onClick={() => goToPage(page + 1)}
          disabled={!hasMore || isPending}
          className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export function ViewJobLink({ jobId }: { jobId: string }) {
  return (
    <Link
      href={`/jobs/${jobId}`}
      className="inline-flex rounded-lg border border-zinc-600 bg-zinc-800/80 px-3 py-1 text-xs font-medium text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-700"
    >
      View
    </Link>
  );
}
