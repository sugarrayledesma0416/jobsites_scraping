export interface Job {
  id: string;
  link: string;
  source: string;
  taxonomies: string[];
  title: string;
  company: string;
  createdAt: string;
  reported: boolean;
}

export interface JobDetail extends Job {
  description: string;
  techStack: string[];
  workModel: string | null;
  seniorityLevel: string | null;
}

export interface JobsApiItem {
  id: string;
  created_at: string;
  updated_at: string;
  reposted_at: string;
  job_title: string;
  apply_link: string;
  reported_counts: string | null;
  company: {
    company_name: string;
  };
  source_platform: {
    name: string;
  };
  job_taxonomies: Array<{
    taxonomy: {
      slug: string;
    };
  }>;
}

export interface JobsApiResponse {
  items: JobsApiItem[];
  page: number;
  limit: number;
  total: number;
}

export interface JobDetailApiResponse {
  job_id: string;
  created_at: string;
  updated_at: string;
  reposted_at: string;
  job_title: string;
  job_description: string;
  apply_link: string;
  reported_counts: string | null;
  tech_stack: string[];
  work_model: string | null;
  seniority_level: string | null;
  company: {
    company_name: string;
  };
  source_platform: {
    name: string;
  };
  job_taxonomies: Array<{
    taxonomy: {
      slug: string;
    };
  }>;
}
