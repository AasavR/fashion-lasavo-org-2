export default function Navbar() {
  return (
    <nav className="w-full sticky top-0 z-40 bg-black/40 backdrop-blur border-b border-white/10">
      <div className="section flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full" style={{background:'linear-gradient(135deg,#e8d39d,#c8a75f)'}} />
          <span className="text-lg font-extrabold tracking-wide">LASAVO</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-sm text-white/80">
          <a href="#video">Video</a>
          <a href="#ai">AI Stylist</a>
          <a href="#order">How it works</a>
        </div>
        <a href="#video" className="btn btn-gold">Start</a>
      </div>
    </nav>
  );
}
