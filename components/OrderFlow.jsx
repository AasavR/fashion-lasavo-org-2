export default function OrderFlow() {
  const steps = [
    { title: "Record & Upload", desc: "Shoot a quick wardrobe video and share your preferences." },
    { title: "Pickup", desc: "Our agent collects selected garments same/next day." },
    { title: "Couture Upgrade", desc: "Bespoke tailoring guided by Designer DNA™." },
    { title: "7‑Day Return", desc: "Your upgraded pieces arrive in premium packaging." }
  ];
  return (
    <section id="order" className="section py-14">
      <h2 className="text-3xl font-extrabold mb-6">How It Works</h2>
      <div className="grid md:grid-cols-4 gap-6">
        {steps.map((s,i)=>(
          <div key={i} className="card p-6">
            <div className="text-couture-gold font-extrabold text-3xl mb-2">{String(i+1).padStart(2,'0')}</div>
            <h4 className="text-xl font-bold mb-2">{s.title}</h4>
            <p className="text-white/70">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
