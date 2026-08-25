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
  profile?: UserProfile;
  createdAt?: string;
  updatedAt?: string;
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
