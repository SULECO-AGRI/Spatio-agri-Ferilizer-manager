import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { type LoginRequest, type User, isAdminUser } from "@/types/auth";
import { ApiError, setSessionExpiredHandler, refreshAuthToken } from "@/lib/apiClient";
import { useIdleTimer } from "@/hooks/useIdleTimer";
import { SessionWarningModal } from "@/components/auth/SessionWarningModal";

export type LogoutReason = "idle" | "expired" | "unauthorized" | "manual";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<User>;
  logout: (reason?: LogoutReason) => void;
  clearError: () => void;
  refreshSession: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Synchronous initialization prevents flash of unauthenticated state
  const [token, setToken] = useState<string | null>(() => authService.getStoredToken());
  const [user, setUser] = useState<User | null>(() => authService.getStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Complete teardown: clear client storage, reset caches, abort intervals, and redirect cleanly
   */
  const logout = useCallback(
    (reason: LogoutReason = "manual") => {
      // 1. Invalidate backend session asynchronously (best-effort)
      authService.logoutBackend().catch(() => {});

      // 2. Clear credentials and storage keys
      authService.clearAuth();
      authService.broadcastLogout();

      // 3. Clear in-memory React state
      setToken(null);
      setUser(null);
      setError(null);

      // 4. Reset TanStack Query cache to avoid data leakage
      queryClient.clear();

      // 5. Clean redirect with reason parameter
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        if (reason !== "manual") {
          url.searchParams.set("reason", reason);
        } else {
          url.searchParams.delete("reason");
        }

        // If on admin or protected subpaths, route back to landing page
        if (url.pathname.startsWith("/admin")) {
          url.pathname = "/";
        }

        window.location.href = url.toString();
      }
    },
    [queryClient],
  );

  // Wire 401 response interceptor
  useEffect(() => {
    setSessionExpiredHandler((reason) => {
      logout(reason);
    });
    return () => {
      setSessionExpiredHandler(null);
    };
  }, [logout]);

  /**
   * Performs login and records tokens
   */
  const login = useCallback(async (credentials: LoginRequest): Promise<User> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      const { token: receivedToken, refreshToken: receivedRefreshToken, user: receivedUser } =
        response.data;

      authService.saveAuth(receivedToken, receivedUser, receivedRefreshToken);
      setToken(receivedToken);
      setUser(receivedUser);
      setIsLoading(false);

      return receivedUser;
    } catch (err: unknown) {
      setIsLoading(false);
      let message = "Authentication failed. Please check your credentials.";

      if (err instanceof ApiError) {
        message = err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
      throw err;
    }
  }, []);

  /**
   * Silent session refresh
   */
  const refreshSession = useCallback(async (): Promise<string | null> => {
    try {
      const newToken = await refreshAuthToken();
      if (newToken) {
        setToken(newToken);
        return newToken;
      }
    } catch (e) {
      console.warn("Silent session refresh failed:", e);
    }
    return null;
  }, []);

  const isAuthenticated = Boolean(token && user);
  const isAdmin = Boolean(isAuthenticated && isAdminUser(user));

  // Multi-tab aware Inactivity Tracker
  const { isWarningActive, remainingWarningSeconds, stayLoggedIn, isRefreshing } = useIdleTimer({
    enabled: isAuthenticated,
    timeoutMs: 30 * 60 * 1000, // 30 minutes of zero activity
    warningMs: 2 * 60 * 1000,  // 2 minutes warning dialog
    token,
    onIdleTimeout: () => logout("idle"),
    onTokenExpired: () => logout("expired"),
    onStayLoggedIn: async () => {
      await refreshSession();
    },
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated,
      isAdmin,
      isLoading,
      error,
      login,
      logout,
      clearError,
      refreshSession,
    }),
    [user, token, isAuthenticated, isAdmin, isLoading, error, login, logout, clearError, refreshSession],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {isAuthenticated && (
        <SessionWarningModal
          isOpen={isWarningActive}
          remainingSeconds={remainingWarningSeconds}
          onStayLoggedIn={stayLoggedIn}
          onLogoutNow={() => logout("manual")}
          isRefreshing={isRefreshing}
        />
      )}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
