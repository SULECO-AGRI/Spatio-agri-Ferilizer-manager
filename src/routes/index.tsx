import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Nav,
  Hero,
  VideoSection,
  WorkflowView as Workflow,
  Partners,
  ClosingCta,
  Footer,
  ProblemSolution,
} from "@/features/landing";
import { AuthModalProvider } from "@/context/AuthModalContext";

const AuthModal = lazy(() => import("@/features/auth").then((m) => ({ default: m.AuthModal })));

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <AuthModalProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Nav />
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
