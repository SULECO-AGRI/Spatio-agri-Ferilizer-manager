import { apiClient, AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/lib/apiClient";
import type { LoginRequest, LoginResponse, User } from "@/types/auth";

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
   * Retrieves the stored JWT token from localStorage
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
   * Persists JWT token and User details to localStorage
   */
  saveAuth(token: string, user: User): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error("Failed to save auth to localStorage:", e);
    }
  },

  /**
   * Clears all stored authentication data
   */
  clearAuth(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    } catch (e) {
      console.error("Failed to clear auth from localStorage:", e);
    }
  },
};
