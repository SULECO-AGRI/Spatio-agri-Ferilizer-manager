import {
  apiClient,
  AUTH_TOKEN_KEY,
  AUTH_REFRESH_TOKEN_KEY,
  AUTH_USER_KEY,
  refreshAuthToken,
} from "@/lib/apiClient";
import type { LoginRequest, LoginResponse, RefreshResponse, User } from "@/types/auth";
import { STORAGE_KEY_LAST_ACTIVITY, STORAGE_KEY_LOGOUT_EVENT } from "@/hooks/useIdleTimer";

export const authService = {
  /**
   * Performs administrator login via POST /auth/login
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/login", credentials, {
      skipAuth: true,
    });
    return response;
  },

  /**
   * Performs silent token refresh via POST /auth/refresh
   */
  async refreshToken(): Promise<string | null> {
    return refreshAuthToken();
  },

  /**
   * Performs backend session invalidation via POST /auth/logout (optional best-effort)
   */
  async logoutBackend(): Promise<void> {
    try {
      const refreshToken = this.getStoredRefreshToken();
      await apiClient.post("/auth/logout", { refreshToken }, { skipAuth: true });
    } catch {
      // Best-effort logout: ignore network failures during teardown
    }
  },

  /**
   * Retrieves the stored JWT access token from localStorage
   */
  getStoredToken(): string | null {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Retrieves the stored refresh token from localStorage
   */
  getStoredRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(AUTH_REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Retrieves the stored User object from localStorage
   */
  getStoredUser(): User | null {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  },

  /**
   * Persists JWT access token, user details, and optional refresh token to localStorage
   */
  saveAuth(token: string, user: User, refreshToken?: string): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      if (refreshToken) {
        localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refreshToken);
      }
      // Record initial activity timestamp on successful authentication
      localStorage.setItem(STORAGE_KEY_LAST_ACTIVITY, String(Date.now()));
    } catch (e) {
      console.error("Failed to save auth to localStorage:", e);
    }
  },

  /**
   * Clears all stored authentication and session activity data
   */
  clearAuth(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(STORAGE_KEY_LAST_ACTIVITY);
    } catch (e) {
      console.error("Failed to clear auth from localStorage:", e);
    }
  },

  /**
   * Broadcasts logout across all open browser tabs
   */
  broadcastLogout(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY_LOGOUT_EVENT, String(Date.now()));
    } catch {
      // Safe fallback
    }
  },
};
