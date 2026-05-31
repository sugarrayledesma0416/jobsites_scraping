import { CopyDescriptionButton } from "@/components/CopyDescriptionButton";
import { ViewJobLink } from "@/components/Pagination";

interface JobRowActionsProps {
  jobId: string;
  jobTitle: string;
}

export function JobRowActions({ jobId, jobTitle }: JobRowActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CopyDescriptionButton jobId={jobId} jobTitle={jobTitle} />
      <ViewJobLink jobId={jobId} />
    </div>
  );
}
