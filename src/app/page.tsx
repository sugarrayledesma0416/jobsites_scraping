import { Suspense } from "react";
import { AppHeader } from "@/components/AppHeader";
import { JobsLoading } from "@/components/JobsLoading";
import { JobsTable } from "@/components/JobsTable";
import { Pagination } from "@/components/Pagination";
import { fetchJobs } from "@/lib/api";

const PAGE_SIZE = 20;

interface HomePageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

function parsePage(value: string | undefined): number {
  const page = Number(value);
  if (!Number.isFinite(page) || page < 0) return 0;
  return Math.floor(page);
}

async function JobsPageContent({
  searchParams,
}: {
  searchParams: Awaited<HomePageProps["searchParams"]>;
}) {
  const page = parsePage(searchParams.page);

  try {
    const { jobs, hasMore } = await fetchJobs(page);
    const startIndex = page * PAGE_SIZE;

    return (
      <>
        <Pagination page={page} hasMore={hasMore} />
        <JobsTable jobs={jobs} startIndex={startIndex} />
        <Pagination page={page} hasMore={hasMore} />
      </>
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load jobs.";

    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-6 text-sm text-red-300">
        {message}
      </div>
    );
  }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const pageKey = params.page ?? "0";

  return (
    <main className="mx-auto min-h-full w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <AppHeader active="jobs" />
      <Suspense key={pageKey} fallback={<JobsLoading />}>
        <JobsPageContent searchParams={params} />
      </Suspense>
    </main>
  );
}
