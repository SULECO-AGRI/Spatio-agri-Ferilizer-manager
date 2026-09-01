import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/apiClient";

interface SignInFormProps {
  onSuccess?: () => void;
}

export function SignInForm({ onSuccess }: SignInFormProps) {
  const navigate = useNavigate();
  const { login, isLoading: isAuthLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isLoading = isSubmitting || isAuthLoading;

  const validate = (): string | null => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail))
      return "Please enter a valid email address.";
    if (!password) return "Please enter your password.";
    if (password.length < 8) return "Password must be at least 8 characters long.";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      if (onSuccess) onSuccess();
      await navigate({ to: "/admin" });
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Sign in failed. Please verify your credentials and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60";

  return (
    <div className="w-full font-sans">
      {/* ── Heading ── */}
      <div className="mb-6 text-center">
        <h2 className="text-[1.6rem] font-bold text-slate-900 tracking-tight leading-snug">
          Welcome back
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">Sign in to your administrator account</p>
      </div>

      {/* ── Error Banner ── */}
      {errorMsg && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700 flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="auth-email" className="block text-sm font-semibold text-slate-800">
            Email address
          </label>
          <input
            id="auth-email"
            type="email"
            required
            autoComplete="email"
            disabled={isLoading}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            className={inputClass}
            placeholder="Enter your email address"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="auth-password" className="block text-sm font-semibold text-slate-800">
              Password
            </label>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                alert("Password reset instructions will be sent to your email.");
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="auth-password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              disabled={isLoading}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              className={`${inputClass} pr-11`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              disabled={isLoading}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ── Sign In Button ── */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none text-white font-semibold text-sm py-3.5 transition-all duration-200 shadow-sm cursor-pointer mt-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign in</span>
          )}
        </button>

        {/* ── Google Sign-In ── */}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => alert("Google sign-in is not yet configured.")}
          className="w-full flex items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none text-slate-800 font-medium text-sm py-3 transition-all duration-200 cursor-pointer shadow-sm"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M17.64 9.2a10.3 10.3 0 0 0-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91A8.77 8.77 0 0 0 17.64 9.2Z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26a5.52 5.52 0 0 1-3.05.86 5.5 5.5 0 0 1-5.18-3.8H.77v2.33A9 9 0 0 0 9 18Z"
            />
            <path
              fill="#FBBC05"
              d="M3.82 10.62A5.4 5.4 0 0 1 3.53 9c0-.57.1-1.12.29-1.62V5.05H.77A9 9 0 0 0 0 9c0 1.45.35 2.82.77 4.05l3.05-2.43Z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58a4.86 4.86 0 0 1 3.44 1.35L15.52 1.9A8.65 8.65 0 0 0 9 0a9 9 0 0 0-8.23 5.05l3.05 2.33A5.5 5.5 0 0 1 9 3.58Z"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>
      </form>
    </div>
  );
}
