import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { VideoSection } from "@/components/landing/VideoSection";
import { Workflow } from "@/components/landing/Workflow";
import { BentoTech } from "@/components/landing/BentoTech";
import { Partners } from "@/components/landing/Partners";
import { ClosingCta } from "@/components/landing/ClosingCta";
import { Footer } from "@/components/landing/Footer";
import { ProblemSolution } from "@/components/landing/ProblemSolution";
import { VerticalNav } from "@/components/landing/VerticalNav";
import { AuthModalProvider } from "@/context/AuthModalContext";
import AuthModal from "@/components/auth/AuthModal";

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
          <BentoTech />
          <ClosingCta />
        </main>
        <Footer />
        <AuthModal />
      </div>
    </AuthModalProvider>
  );
}
