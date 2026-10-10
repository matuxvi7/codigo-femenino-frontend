// Cliente de la API de Código Femenino (codigo-femenino-backend).
// La URL base se configura mediante VITE_API_URL en el entorno.
const API_URL = import.meta.env["VITE_API_URL"]?.replace(/\/+$/, "");

export type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at?: string;
};

export type ApiArticleSummary = {
  id: number;
  title: string;
  slug: string;
  category_id: number;
  category_name: string;
  category_slug: string;
  excerpt: string;
  author: string;
  read_time_minutes: number;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ApiArticleSection = {
  id?: number;
  position?: number;
  heading: string | null;
  content: string;
};

export type ApiArticleDetail = ApiArticleSummary & {
  sections: ApiArticleSection[];
};

export type Pagination = {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) {
    throw new Error("Falta configurar VITE_API_URL para conectar con la API.");
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    // Content-Type solo cuando hay body: evita preflight CORS en los GET.
    headers: { ...(init?.body ? { "Content-Type": "application/json" } : {}), ...init?.headers },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new ApiError(res.status, body?.message ?? `Error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function listCategories(): Promise<ApiCategory[]> {
  const res = await apiFetch<{ success: boolean; data: ApiCategory[] }>("/api/categories");
  return res.data;
}

export async function getCategory(slug: string): Promise<ApiCategory> {
  const res = await apiFetch<{ success: boolean; data: ApiCategory }>(`/api/categories/${slug}`);
  return res.data;
}

export async function listArticles(opts: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{ articles: ApiArticleSummary[]; pagination: Pagination }> {
  const params = new URLSearchParams();
  if (opts.category) params.set("category", opts.category);
  if (opts.search) params.set("search", opts.search);
  params.set("page", String(opts.page ?? 1));
  params.set("limit", String(opts.limit ?? 10));
  const res = await apiFetch<{
    success: boolean;
    data: ApiArticleSummary[];
    pagination: Pagination;
  }>(`/api/articles?${params}`);
  return { articles: res.data, pagination: res.pagination };
}

export async function getArticle(slug: string): Promise<ApiArticleDetail> {
  const res = await apiFetch<{ success: boolean; data: ApiArticleDetail }>(`/api/articles/${slug}`);
  return res.data;
}

export async function subscribeNewsletter(email: string, fullName?: string): Promise<string> {
  const res = await apiFetch<{ success: boolean; message: string }>("/api/newsletter", {
    method: "POST",
    body: JSON.stringify({ email, full_name: fullName || undefined }),
  });
  return res.message;
}

export async function requestGuiaGratuita(email: string, fullName?: string): Promise<string> {
  const res = await apiFetch<{ success: boolean; message: string }>("/api/guia-gratuita", {
    method: "POST",
    body: JSON.stringify({ email, full_name: fullName || undefined }),
  });
  return res.message;
}
