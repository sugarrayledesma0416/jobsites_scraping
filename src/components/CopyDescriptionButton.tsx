"use client";

import { useState } from "react";
import { Spinner } from "@/components/Spinner";

interface CopyDescriptionButtonProps {
  jobId: string;
  jobTitle: string;
}

type CopyState = "idle" | "loading" | "copied" | "error";

export function CopyDescriptionButton({
  jobId,
  jobTitle,
}: CopyDescriptionButtonProps) {
  const [state, setState] = useState<CopyState>("idle");

  const handleCopy = async () => {
    setState("loading");

    try {
      const response = await fetch(`/api/jobs/${jobId}`);
      const data = (await response.json()) as {
        description?: string;
        title?: string;
        company?: string;
        link?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to load description");
      }

      const text =
        data.description?.trim() ||
        [data.title, data.company, data.link].filter(Boolean).join("\n");

      if (!text) {
        throw new Error("No description available for this job");
      }

      await navigator.clipboard.writeText(text);
      setState("copied");
      window.setTimeout(() => setState("idle"), 2000);
    } catch (error) {
      console.error(`Copy description failed for ${jobId}:`, error);
      setState("error");
      window.setTimeout(() => setState("idle"), 2500);
    }
  };

  const label =
    state === "loading"
      ? "Copying…"
      : state === "copied"
        ? "Copied!"
        : state === "error"
          ? "Failed"
          : "Copy";

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={state === "loading"}
      title={`Copy description for ${jobTitle}`}
      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-600 bg-zinc-800/80 px-3 py-1 text-xs font-medium text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-700 disabled:cursor-wait disabled:opacity-70"
    >
      {state === "loading" && <Spinner size="sm" />}
      {label}
    </button>
  );
}
