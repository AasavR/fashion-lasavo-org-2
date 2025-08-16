import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import VideoAnalyzerGemini from "../components/VideoAnalyzerGemini";
import AIStylist from "../components/AIStylist";
import OrderFlow from "../components/OrderFlow";

export default function Page() {
  return (
    <div>
      <Navbar />
      <Hero />
      <VideoAnalyzerGemini />
      <AIStylist />
      <OrderFlow />
      <footer className="section py-10 text-white/60 text-sm border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Lasavo. Designer DNA™ demo — not for commercial tailoring guidance.</p>
          <a id="cta" href="#video" className="btn btn-gold">Analyze my wardrobe</a>
        </div>
      </footer>
    </div>
  );
}
