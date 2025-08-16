export default function Hero() {
  return (
    <section className="section pt-14 pb-8">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight">
            AI Couture <span className="text-couture-gold">Designer DNA™</span>
          </h1>
          <p className="text-white/80 text-lg">
            Record your wardrobe. We transform it with couture‑inspired upgrades and deliver in 7 days.
          </p>
          <div className="flex gap-4">
            <a href="#video" className="btn btn-gold">Analyze Video</a>
            <a href="#ai" className="btn border border-white/20">Try AI Stylist</a>
          </div>
          <div className="flex items-center gap-6 pt-2 text-white/70 text-sm">
            <span>India Couture Week aesthetics</span>
            <span>7‑day turnaround</span>
            <span>Sustainable</span>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-couture">
            <div className="absolute inset-0" style={{background:'linear-gradient(135deg,#e8d39d33,#c8a75f33)'}} />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-sm text-white/80">Upload your lookbook video for analysis</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
