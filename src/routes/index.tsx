import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/pages/landing/Nav";
import { Hero } from "@/pages/landing/Hero";
import { VideoSection } from "@/pages/landing/VideoSection";
import { WorkflowView as Workflow } from "@/features/landing";
import { Partners } from "@/pages/landing/Partners";
import { ClosingCta } from "@/pages/landing/ClosingCta";
import { Footer } from "@/pages/landing/Footer";
import { ProblemSolution } from "@/pages/landing/ProblemSolution";
import { VerticalNav } from "@/pages/landing/VerticalNav";
import { AuthModalProvider } from "@/context/AuthModalContext";

const AuthModal = lazy(() => import("@/pages/auth/AuthModal"));

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <AuthModalProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Nav />
        <VerticalNav />
        <main>
          <Hero />
          <ProblemSolution />
          <Workflow />
          <VideoSection />
          <Partners />
          <ClosingCta />
        </main>
        <Footer />
        <Suspense fallback={null}>
          <AuthModal />
        </Suspense>
      </div>
    </AuthModalProvider>
  );
}
