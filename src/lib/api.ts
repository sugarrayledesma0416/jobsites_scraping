import { isJobReported } from "./jobs";
import type {
  Job,
  JobDetail,
  JobDetailApiResponse,
  JobsApiItem,
  JobsApiResponse,
} from "./types";

const API_BASE_URL =
  process.env.JOBS_API_BASE_URL ?? "http://38.96.255.79:8080";
const AUTH_TOKEN = process.env.SCRAPPER_AUTH_TOKEN ?? "";
const PAGE_LIMIT = "20";

function readEnv(...keys: string[]): string {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return "";
}

function getTaxonomyQueryConfig(): {
  taxonomyIds: string | null;
  taxonomyLogic: string | null;
} {
  const taxonomyIds = readEnv("TAXONOMY_IDS", "taxonomy_ids");
  const taxonomyLogic = readEnv("TAXONOMY_LOGIC", "taxonomy_logic");

  return {
    taxonomyIds: taxonomyIds || null,
    taxonomyLogic: taxonomyLogic || null,
  };
}

function buildJobsSearchParams(apiPage: number): URLSearchParams {
  const params = new URLSearchParams({
    page: String(apiPage),
    limit: PAGE_LIMIT,
  });

  const { taxonomyIds, taxonomyLogic } = getTaxonomyQueryConfig();

  if (taxonomyIds) {
    params.set("taxonomy_ids", taxonomyIds);
  }
  if (taxonomyLogic) {
    params.set("taxonomy_logic", taxonomyLogic);
  }

  return params;
}

function getAuthHeaders(): HeadersInit {
  return {
    Cookie: `scrapper_auth_token=${AUTH_TOKEN}`,
  };
}

function mapJobItem(item: JobsApiItem): Job {
  return {
    id: item.id,
    link: item.apply_link,
    source: item.source_platform.name,
    taxonomies: item.job_taxonomies.map(({ taxonomy }) => taxonomy.slug),
    title: item.job_title,
    company: item.company.company_name,
    createdAt: item.reposted_at || item.created_at,
    reported: isJobReported(item.created_at, item.updated_at),
  };
}

function mapJobDetail(item: JobDetailApiResponse): JobDetail {
  return {
    id: item.job_id,
    link: item.apply_link,
    source: item.source_platform.name,
    taxonomies: item.job_taxonomies.map(({ taxonomy }) => taxonomy.slug),
    title: item.job_title,
    company: item.company.company_name,
    createdAt: item.reposted_at || item.created_at,
    reported: isJobReported(item.created_at, item.updated_at),
    description: item.job_description,
    techStack: item.tech_stack ?? [],
    workModel: item.work_model,
    seniorityLevel: item.seniority_level,
  };
}

async function parseApiError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message ?? `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

function logRequestStart(method: string, url: string, meta?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  console.log(`[API] ${timestamp} → ${method} ${url}`, meta ?? "");
}

function logRequestSuccess(
  method: string,
  url: string,
  status: number,
  durationMs: number,
  meta?: Record<string, unknown>,
) {
  console.log(
    `[API] ← ${method} ${url} ${status} (${durationMs}ms)`,
    meta ?? "",
  );
}

function logRequestError(
  method: string,
  url: string,
  durationMs: number,
  error: unknown,
) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[API] ✗ ${method} ${url} (${durationMs}ms)`, message);
}

async function apiFetch(
  path: string,
  meta?: Record<string, unknown>,
): Promise<Response> {
  const url = `${API_BASE_URL}${path}`;
  const startedAt = Date.now();

  logRequestStart("GET", url, meta);

  try {
    const response = await fetch(url, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });

    logRequestSuccess("GET", url, response.status, Date.now() - startedAt, meta);
    return response;
  } catch (error) {
    logRequestError("GET", url, Date.now() - startedAt, error);
    throw error;
  }
}

/** Map UI page (0-based) to API page. API treats page=0 and page=1 as the same first page. */
export function toApiPage(uiPage: number): number {
  if (uiPage <= 0) return 0;
  return uiPage + 1;
}

export async function fetchJobs(page: number): Promise<{
  jobs: Job[];
  hasMore: boolean;
}> {
  const apiPage = toApiPage(page);
  const query = buildJobsSearchParams(apiPage);
  const { taxonomyIds, taxonomyLogic } = getTaxonomyQueryConfig();

  const response = await apiFetch(`/api/jobs?${query.toString()}`, {
    uiPage: page,
    apiPage,
    taxonomyIds,
    taxonomyLogic,
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const data = (await response.json()) as JobsApiResponse;

  console.log("[API] jobs result", {
    uiPage: page,
    apiPage,
    taxonomyIds,
    taxonomyLogic,
    itemCount: data.items.length,
    responsePage: data.page,
    limit: data.limit,
    hasMore: data.items.length === data.limit,
  });

  return {
    jobs: data.items.map(mapJobItem),
    hasMore: data.items.length === data.limit,
  };
}

export async function fetchJobById(id: string): Promise<JobDetail | null> {
  const response = await apiFetch(`/api/jobs/${id}`, { jobId: id });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const data = (await response.json()) as JobDetailApiResponse;
  return mapJobDetail(data);
}
