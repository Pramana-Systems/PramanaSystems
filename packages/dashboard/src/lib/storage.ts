const K = {
  BASE_URL: "pramana:baseUrl",
  API_KEY:  "pramana:apiKey",
} as const;

export function getBaseUrl(): string {
  return localStorage.getItem(K.BASE_URL) ?? "http://localhost:3000";
}
export function setBaseUrl(v: string): void {
  localStorage.setItem(K.BASE_URL, v.replace(/\/$/, ""));
}
export function getApiKey(): string {
  return localStorage.getItem(K.API_KEY) ?? "";
}
export function setApiKey(v: string): void {
  if (v) localStorage.setItem(K.API_KEY, v);
  else    localStorage.removeItem(K.API_KEY);
}
