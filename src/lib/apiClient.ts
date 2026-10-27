import type { ApiErrorResponse } from "@/types/auth";
import { isTokenExpired } from "@/utils/tokenUtils";

export const API_BASE_URL = (
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  "https://spatio-agri-ferilizer-manager-backend-1.onrender.com"
).replace(/\/+$/, "");

export const AUTH_TOKEN_KEY = "spatioagri_auth_token";
export const AUTH_REFRESH_TOKEN_KEY = "spatioagri_refresh_token";
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
  _retry?: boolean;
}

// Queue mechanism for handling concurrent requests during token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  requestFn: () => Promise<unknown>;
}> = [];

function processQueue(error: Error | null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(promise.requestFn());
    }
  });
  failedQueue = [];
}

/**
 * Global session teardown handler registered by AuthProvider
 */
let sessionExpiredHandler: ((reason: "idle" | "expired" | "unauthorized") => void) | null = null;

export function setSessionExpiredHandler(
  handler: ((reason: "idle" | "expired" | "unauthorized") => void) | null,
) {
  sessionExpiredHandler = handler;
}

/**
 * Attempts a silent token refresh via POST /auth/refresh
 */
export async function refreshAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const refreshToken = localStorage.getItem(AUTH_REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const newAccessToken =
      data?.data?.token || data?.token || (data?.data && typeof data.data === "string" ? data.data : null);
    const newRefreshToken = data?.data?.refreshToken || data?.refreshToken;

    if (newAccessToken) {
      localStorage.setItem(AUTH_TOKEN_KEY, newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, newRefreshToken);
      }
      return newAccessToken;
    }
    return null;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, skipAuth, _retry = false, headers: customHeaders, ...customOptions } = options;

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

  // Pre-flight check: if token is already expired before making network call
  if (!skipAuth && typeof window !== "undefined") {
    let token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (token && isTokenExpired(token) && !_retry) {
      const refreshedToken = await refreshAuthToken();
      if (refreshedToken) {
        token = refreshedToken;
      } else {
        if (sessionExpiredHandler) sessionExpiredHandler("expired");
        throw new ApiError("Session has expired. Please log in again.", 401);
      }
    }

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

    // 401 Unauthorized Interceptor
    if (response.status === 401 && !skipAuth) {
      if (!_retry) {
        if (isRefreshing) {
          // Wait in queue while refresh completes
          return new Promise<T>((resolve, reject) => {
            failedQueue.push({
              resolve: resolve as (val: unknown) => void,
              reject,
              requestFn: () => apiRequest<T>(endpoint, { ...options, _retry: true }),
            });
          });
        }

        isRefreshing = true;
        try {
          const newAccessToken = await refreshAuthToken();
          if (newAccessToken) {
            processQueue(null);
            return apiRequest<T>(endpoint, { ...options, _retry: true });
          } else {
            throw new Error("Unable to refresh authentication session.");
          }
        } catch (refreshErr) {
          processQueue(refreshErr as Error);
          if (sessionExpiredHandler) sessionExpiredHandler("unauthorized");
          throw new ApiError("Session expired. Please log in again.", 401);
        } finally {
          isRefreshing = false;
        }
      } else {
        // Retry already failed -> terminate session
        if (sessionExpiredHandler) sessionExpiredHandler("unauthorized");
        throw new ApiError("Session expired. Please log in again.", 401);
      }
    }

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
