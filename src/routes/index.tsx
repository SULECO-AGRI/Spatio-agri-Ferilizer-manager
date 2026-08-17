import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/pages/landing/Nav";
import { Hero } from "@/pages/landing/Hero";
import { VideoSection } from "@/pages/landing/VideoSection";
import { Workflow } from "@/pages/landing/Workflow";
import { Partners } from "@/pages/landing/Partners";
import { ClosingCta } from "@/pages/landing/ClosingCta";
import { Footer } from "@/pages/landing/Footer";
import { ProblemSolution } from "@/pages/landing/ProblemSolution";
import { VerticalNav } from "@/pages/landing/VerticalNav";
import { AuthModalProvider } from "@/context/AuthModalContext";
import { AuthModal } from "@/pages/auth/AuthModal";

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
        <AuthModal />
      </div>
    </AuthModalProvider>
  );
}
