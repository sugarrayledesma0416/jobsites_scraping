"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useJobModal } from "@/components/JobModalProvider";

export function JobsUrlJobOpener() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openJob } = useJobModal();
  const openedRef = useRef<string | null>(null);

  useEffect(() => {
    const jobId = searchParams.get("job");
    if (!jobId || openedRef.current === jobId) return;

    openedRef.current = jobId;
    openJob(jobId);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("job");
    const query = params.toString();
    router.replace(query ? `/?${query}` : "/", { scroll: false });
  }, [searchParams, openJob, router]);

  return null;
}
