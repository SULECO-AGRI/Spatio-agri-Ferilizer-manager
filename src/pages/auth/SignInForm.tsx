import { useState } from "react";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with auth backend
    console.log("Sign In", { email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="signin-email">
          Email
        </label>
        <input
          id="signin-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-gray-900 placeholder-gray-400 px-3 py-2.5 text-sm outline-none transition"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="signin-password">
          Password
        </label>
        <input
          id="signin-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-gray-900 placeholder-gray-400 px-3 py-2.5 text-sm outline-none transition"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-semibold py-2.5 transition-all shadow-sm cursor-pointer"
      >
        Sign In
      </button>
    </form>
  );
}
