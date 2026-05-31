import Link from "next/link";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { fetchJobById } from "@/lib/api";
import { formatRelativeTime } from "@/lib/jobs";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;

  let job;
  try {
    job = await fetchJobById(id);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load job.";

    return (
      <main className="mx-auto min-h-full w-full max-w-[900px] flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <AppHeader active="jobs" />
        <div className="rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-6 text-sm text-red-300">
          {message}
        </div>
      </main>
    );
  }

  if (!job) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-full w-full max-w-[900px] flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <AppHeader active="jobs" />

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-md bg-emerald-900/50 px-2 py-0.5 text-xs font-medium text-emerald-300">
            {job.source}
          </span>
          {job.taxonomies.map((taxonomy) => (
            <span
              key={taxonomy}
              className="inline-flex rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300"
            >
              {taxonomy}
            </span>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-white">{job.title}</h2>
        <p className="mt-2 text-lg text-zinc-300">{job.company}</p>
        <p className="mt-1 text-sm text-emerald-400">
          Posted {formatRelativeTime(job.createdAt)}
        </p>

        {(job.seniorityLevel || job.workModel) && (
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-400">
            {job.seniorityLevel && <span>Seniority: {job.seniorityLevel}</span>}
            {job.workModel && <span>Work model: {job.workModel}</span>}
          </div>
        )}

        {job.techStack.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-zinc-500">
              Tech stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {job.description && (
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-zinc-500">
              Description
            </h3>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-zinc-300">
              {job.description}
            </pre>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-500"
          >
            Open job link
          </a>
          <Link
            href="/"
            className="inline-flex rounded-lg border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800"
          >
            Back to list
          </Link>
        </div>
      </div>
    </main>
  );
}
