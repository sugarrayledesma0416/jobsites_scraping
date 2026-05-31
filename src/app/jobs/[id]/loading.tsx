import { AppHeader } from "@/components/AppHeader";
import { JobDetailLoading } from "@/components/JobsLoading";

export default function JobDetailPageLoading() {
  return (
    <main className="mx-auto min-h-full w-full max-w-[900px] flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <AppHeader active="jobs" />
      <JobDetailLoading />
    </main>
  );
}
