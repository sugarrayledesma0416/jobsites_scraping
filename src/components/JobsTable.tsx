import { JobRowActions } from "@/components/JobRowActions";
import { formatRelativeTime, truncateLink } from "@/lib/jobs";
import type { Job } from "@/lib/types";

interface JobsTableProps {
  jobs: Job[];
  startIndex: number;
}

export function JobsTable({ jobs, startIndex }: JobsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/50">
      <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
            <th className="px-4 py-3 font-medium">No</th>
            <th className="px-4 py-3 font-medium">Link</th>
            <th className="px-4 py-3 font-medium">Source</th>
            <th className="px-4 py-3 font-medium">Taxonomies</th>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Company</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium">Reported</th>
            <th className="px-4 py-3 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length === 0 ? (
            <tr>
              <td
                colSpan={9}
                className="px-4 py-12 text-center text-zinc-500"
              >
                No jobs found.
              </td>
            </tr>
          ) : (
            jobs.map((job, index) => (
              <tr
                key={job.id}
                className="border-b border-zinc-800/80 transition-colors hover:bg-zinc-900/50"
              >
                <td className="px-4 py-3 text-zinc-400">
                  {startIndex + index + 1}
                </td>
                <td className="max-w-[220px] truncate px-4 py-3">
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:text-sky-300 hover:underline"
                    title={job.link}
                  >
                    {truncateLink(job.link)}
                  </a>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-md bg-emerald-900/50 px-2 py-0.5 text-xs font-medium text-emerald-300">
                    {job.source}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex max-w-[220px] flex-wrap gap-1">
                    {job.taxonomies.map((taxonomy) => (
                      <span
                        key={taxonomy}
                        className="inline-flex rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300"
                      >
                        {taxonomy}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="max-w-[280px] px-4 py-3 font-medium text-white">
                  {job.title}
                </td>
                <td className="px-4 py-3 text-zinc-300">{job.company}</td>
                <td className="px-4 py-3 font-medium text-emerald-400">
                  {formatRelativeTime(job.createdAt)}
                </td>
                <td className="px-4 py-3">
                  {job.reported ? (
                    <span className="inline-flex rounded-md bg-amber-900/40 px-2 py-0.5 text-xs font-medium text-amber-300">
                      Reported
                    </span>
                  ) : (
                    <span className="text-zinc-500">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <JobRowActions jobId={job.id} jobTitle={job.title} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
