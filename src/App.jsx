import NavBar from "./components/NavBar.jsx";
import Hero from "./components/Hero.jsx";
import ProblemSolution from "./components/ProblemSolution.jsx";
import Workflow from "./components/Workflow.jsx";
import VideoSection from "./components/VideoSection.jsx";
import Partners from "./components/Partners.jsx";
import FeatureGrid from "./components/FeatureGrid.jsx";
import Pricing from "./components/Pricing.jsx";
import CTA from "./components/CTA.jsx";
import Footer from "./components/Footer.jsx";
import { AuthModalProvider } from "./context/AuthModalContext";
import AuthModal from "./components/auth/AuthModal";

export default function App() {
  return (
    <AuthModalProvider>
      <div className="min-h-screen bg-surface font-body text-on-surface antialiased">
        <NavBar />
        <main>
          <Hero />
          <ProblemSolution />
          <Workflow />
          <VideoSection />
          <Partners />
          <FeatureGrid />
          <Pricing />
          <CTA />
        </main>
        <Footer />
        <AuthModal />
      </div>
    </AuthModalProvider>
  );
}
