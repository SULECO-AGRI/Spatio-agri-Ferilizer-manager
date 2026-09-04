export interface UserProfile {
  userId: number;
  department?: string;
  accessLevel?: string;
  createdAt?: string;
}

export interface User {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  mobile?: string;
  role: string;
  isAdmin?: boolean;
  profile?: UserProfile;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Checks if a user has administrative privileges based on isAdmin flag or role.
 */
export function isAdminUser(user: User | null | undefined): boolean {
  if (!user) return false;
  if (user.isAdmin === true) return true;
  if (typeof user.role === "string") {
    const roleNormalized = user.role.trim().toUpperCase();
    return (
      roleNormalized === "ADMIN" ||
      roleNormalized === "ADMINISTRATOR" ||
      roleNormalized === "SUPERADMIN" ||
      roleNormalized === "SUPER_ADMIN"
    );
  }
  return false;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: "success";
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ApiErrorResponse {
  status: "fail" | "error";
  message: string;
  stack?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
