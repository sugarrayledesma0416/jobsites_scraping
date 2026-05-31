import { AppHeader } from "@/components/AppHeader";
import { JobsLoading } from "@/components/JobsLoading";

export default function Loading() {
  return (
    <main className="mx-auto min-h-full w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <AppHeader active="jobs" />
      <JobsLoading />
    </main>
  );
}
