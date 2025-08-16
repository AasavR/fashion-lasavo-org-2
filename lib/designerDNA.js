/**
 * Designer DNA™ — heuristic demo engine
 * Length-aware, couture-detail suggestions with sustainability lens.
 */
export function designerDNA(items = []) {
  return items.map((it, idx) => {
    const colors = (it.colors && it.colors.length) ? it.colors : ["black","ivory"];
    const fabric = it.fabric || "mixed";
    const style = it.style || "contemporary";
    const length = it.estimatedLengthMeters ?? 1.2;

    let recommendedForm;
    if (length < 0.5) recommendedForm = "Designer handkerchief / scarf with metallic edging";
    else if (length < 0.9) recommendedForm = "Cropped top with structured shoulders";
    else if (length < 1.4) recommendedForm = "Asymmetric drape dress with pleated panel";
    else recommendedForm = "Full gown silhouette with structured corsetry";

    const detailing = [];
    if (colors.includes("gold") || colors.includes("ivory")) detailing.push("embellished zardozi accents");
    if (fabric.toLowerCase().includes("silk")) detailing.push("bias-cut fluidity");
    if (fabric.toLowerCase().includes("cotton")) detailing.push("matte finish with hand-stitch topstitching");
    if (style.includes("traditional")) detailing.push("heritage motif placement");
    detailing.push("zero-waste cutting plan");

    return {
      id: idx+1,
      baseItem: it.item || "garment",
      palette: colors,
      fabric,
      style,
      recommendedForm,
      detailing,
      turnaroundDays: 7,
      notes: "Indicative recommendations; final pattern during tailoring intake."
    };
  });
}
