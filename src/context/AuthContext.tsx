import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import { authService } from "@/services/authService";
import type { LoginRequest, User } from "@/types/auth";
import { ApiError } from "@/lib/apiClient";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<User>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Synchronous initialization prevents flash of unauthenticated state
  const [token, setToken] = useState<string | null>(() => authService.getStoredToken());
  const [user, setUser] = useState<User | null>(() => authService.getStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (credentials: LoginRequest): Promise<User> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      const { token: receivedToken, user: receivedUser } = response.data;

      authService.saveAuth(receivedToken, receivedUser);
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

  const logout = useCallback(() => {
    authService.clearAuth();
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      error,
      login,
      logout,
      clearError,
    }),
    [user, token, isLoading, error, login, logout, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
