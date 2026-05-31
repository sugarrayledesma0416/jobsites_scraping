import { NextResponse } from "next/server";
import { fetchJobById } from "@/lib/api";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const job = await fetchJobById(id);

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: job.id,
      title: job.title,
      company: job.company,
      link: job.link,
      description: job.description,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load job description";

    return NextResponse.json({ message }, { status: 500 });
  }
}
