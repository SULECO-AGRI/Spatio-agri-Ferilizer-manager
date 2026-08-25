import type { ApiErrorResponse } from "@/types/auth";

export const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "http://localhost:5000";

export const AUTH_TOKEN_KEY = "spatioagri_auth_token";
export const AUTH_USER_KEY = "spatioagri_auth_user";

export class ApiError extends Error {
  public status: number;
  public apiResponse?: ApiErrorResponse;

  constructor(message: string, status: number, apiResponse?: ApiErrorResponse) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.apiResponse = apiResponse;
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  skipAuth?: boolean;
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, skipAuth, headers: customHeaders, ...customOptions } = options;

  let url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const headers = new Headers(customHeaders);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (
    customOptions.body &&
    !(customOptions.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (!skipAuth && typeof window !== "undefined") {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const config: RequestInit = {
    ...customOptions,
    headers,
  };

  try {
    const response = await fetch(url, config);

    let data: unknown = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = text ? { message: text } : null;
      }
    }

    const typedData = data as (ApiErrorResponse & { message?: string }) | null;

    if (
      !response.ok ||
      (typedData && (typedData.status === "fail" || typedData.status === "error"))
    ) {
      const errorMessage =
        (typedData && typeof typedData === "object" && typedData.message) ||
        `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, typedData || undefined);
    }

    return data as T;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }

    const err = error as Error | undefined;
    const networkMessage =
      err?.message === "Failed to fetch"
        ? "Unable to connect to the server. Please ensure the backend is running."
        : err?.message || "An unexpected error occurred.";

    throw new ApiError(networkMessage, 0);
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};
