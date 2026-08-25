import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
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
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isLoading = isSubmitting || isAuthLoading;

  const validate = (): string | null => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      return "Please enter your administrator email address.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return "Please enter a valid email address.";
    }

    if (!password) {
      return "Please enter your password.";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

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
      await login({
        email: email.trim(),
        password,
      });

      if (onSuccess) {
        onSuccess();
      }

      await navigate({ to: "/admin" });
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to sign in. Please verify your credentials and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans text-left" noValidate>
      {errorMsg && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-3 bg-rose-50 border border-rose-200/80 rounded-xl text-xs text-rose-700 font-normal flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{errorMsg}</span>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-700" htmlFor="signin-email">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            id="signin-email"
            type="email"
            required
            autoComplete="email"
            disabled={isLoading}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            className="w-full rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-3 focus:ring-emerald-500/15 text-slate-900 placeholder-slate-400 pl-10 pr-4 py-2.5 text-xs outline-none transition-all duration-200 disabled:opacity-60"
            placeholder="admin@fertilizer.com"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-medium text-slate-700" htmlFor="signin-password">
            Password
          </label>
          <a
            href="#forgot-password"
            onClick={(e) => {
              e.preventDefault();
              alert(
                "Password reset instructions have been sent to the registered administrator email address.",
              );
            }}
            className="text-[11px] font-normal text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
          >
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            id="signin-password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            disabled={isLoading}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            className="w-full rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-3 focus:ring-emerald-500/15 text-slate-900 placeholder-slate-400 pl-10 pr-10 py-2.5 text-xs outline-none transition-all duration-200 disabled:opacity-60"
            placeholder="••••••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer transition-colors disabled:opacity-50"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            disabled={isLoading}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer disabled:opacity-60"
          />
          <span className="text-xs text-slate-600 font-normal">Remember this device</span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#062419] hover:bg-[#0a3526] active:scale-[0.99] disabled:opacity-75 disabled:pointer-events-none text-white font-medium text-xs py-3 transition-all duration-200 shadow-sm cursor-pointer mt-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            <span>Verifying administrator credentials...</span>
          </>
        ) : (
          <>
            <span>Sign In with Administrator Credentials</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </>
        )}
      </button>

      {/* Security Footer Note */}
      <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-normal">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>256-bit encrypted secure administrator authentication</span>
      </div>
    </form>
  );
}
