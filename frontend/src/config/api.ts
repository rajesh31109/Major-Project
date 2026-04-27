export const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_SUPABASE_URL ?? "";
};

let cachedApiUrl: string | null = null;

export const getAPIBaseURL = (): string => {
  if (!cachedApiUrl) {
    cachedApiUrl = getApiBaseUrl();
  }
  return cachedApiUrl;
};
