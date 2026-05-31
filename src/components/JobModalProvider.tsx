"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { JobDetailPanel } from "@/components/JobDetailPanel";
import { Spinner } from "@/components/Spinner";
import type { JobDetail } from "@/lib/types";

interface JobModalContextValue {
  openJob: (jobId: string) => void;
  closeJob: () => void;
}

const JobModalContext = createContext<JobModalContextValue | null>(null);

export function useJobModal() {
  const context = useContext(JobModalContext);
  if (!context) {
    throw new Error("useJobModal must be used within JobModalProvider");
  }
  return context;
}

export function JobModalProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeJob = useCallback(() => {
    setJobId(null);
    setJob(null);
    setError(null);
    setLoading(false);
  }, []);

  const openJob = useCallback((id: string) => {
    setJobId(id);
    setJob(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (!jobId) return;

    const controller = new AbortController();

    async function loadJob() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/jobs/${jobId}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as JobDetail & { message?: string };

        if (!response.ok) {
          throw new Error(data.message ?? "Failed to load job");
        }

        setJob(data);
      } catch (err) {
        if (controller.signal.aborted) return;
        const message =
          err instanceof Error ? err.message : "Failed to load job";
        setError(message);
        setJob(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadJob();

    return () => controller.abort();
  }, [jobId]);

  useEffect(() => {
    if (!jobId) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeJob();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [jobId, closeJob]);

  const modal =
    mounted &&
    jobId &&
    createPortal(
      <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="job-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeJob}
            aria-label="Close job details"
          />

          <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <h2
                id="job-modal-title"
                className="text-lg font-semibold text-white"
              >
                Job details
              </h2>
              <button
                type="button"
                onClick={closeJob}
                className="rounded-lg border border-zinc-600 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
              >
                Close
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-6 sm:px-6">
              {loading && (
                <div className="flex flex-col items-center justify-center gap-3 py-12">
                  <Spinner size="lg" />
                  <span className="text-sm text-zinc-400">Loading job…</span>
                </div>
              )}

              {!loading && error && (
                <div className="rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-6 text-sm text-red-300">
                  {error}
                </div>
              )}

              {!loading && !error && job && <JobDetailPanel job={job} />}
            </div>
          </div>
        </div>,
      document.body,
    );

  return (
    <JobModalContext.Provider value={{ openJob, closeJob }}>
      {children}
      {modal}
    </JobModalContext.Provider>
  );
}
