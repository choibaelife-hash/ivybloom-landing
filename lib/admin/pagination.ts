export function paginationState(total: number, requested: string | null, pageSize = 6) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(pages, Math.max(1, Math.floor(Number(requested) || 1)));
  return { page, pages, start: (page - 1) * pageSize, end: page * pageSize };
}
export function adminListUrl(page: number, query = "") {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (query.trim()) params.set("q", query.trim());
  return `/admin${params.size ? `?${params}` : ""}`;
}
export function returnListUrl(value: string | null) {
  return value && /^\/admin(?:\?|$)/.test(value) ? value : "/admin";
}
