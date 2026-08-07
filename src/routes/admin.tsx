import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  return (
    <div className="min-h-screen bg-background grid-bg relative flex flex-col items-center justify-center p-4">
      {/* Subtle top glow overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl glass rounded-3xl p-8 md:p-12 shadow-elegant border border-slate-200/50 backdrop-blur-xl relative z-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Shield/Dashboard Icon block */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center mb-6 glow-edge">
          <LayoutDashboard className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
          Admin Dashboard
        </h1>

        <p className="text-muted-foreground text-sm md:text-base mb-8 max-w-md mx-auto leading-relaxed">
          Welcome to the Spatio Agri administration portal. This page is currently empty and ready for custom telemetry, prescription models, and drone management features.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
