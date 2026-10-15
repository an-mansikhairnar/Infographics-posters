// import type { Infographic } from "./schema";

// /** No-LLM fallback so users always get something. */
// export function fallbackInfographic(text: string): Infographic {
//   const sentences = text.replace(/\s+/g, " ").match(/[^.!?]+[.!?]?/g)?.map((s) => s.trim()).filter((s) => s.length > 15) ?? [];
//   const short = (s: string, n = 90) => (s.length > n ? s.slice(0, n).replace(/\s\S*$/, "") + "…" : s);
//   const picks = sentences.slice(0, 6);
//   const icons = ["star", "check", "zap", "globe", "chart", "heart"] as const;
//   return {
//     title: short(sentences[0] ?? "Summary", 60),
//     subtitle: "Key points",
//     sections: [
//       { type: "list", heading: "Highlights", items: picks.slice(0, 5).map((s, i) => ({ title: short(s.split(/[,:;]/)[0], 40), desc: short(s), icon: icons[i % icons.length] })) },
//       { type: "quote", text: short(sentences[sentences.length - 1] ?? sentences[0] ?? "", 140) },
//     ].filter((s) => s.type !== "list" || (s as any).items.length >= 3) as Infographic["sections"],
//   };
// }
import type { Infographic } from "./schema";

/** No-LLM fallback so users always get something. */
export function fallbackInfographic(text: string): Infographic {
  const sentences = text.replace(/\s+/g, " ").match(/[^.!?]+[.!?]?/g)?.map((s) => s.trim()).filter((s) => s.length > 15) ?? [];
  const short = (s: string, n = 90) => (s.length > n ? s.slice(0, n).replace(/\s\S*$/, "") + "…" : s);
  const picks = sentences.slice(0, 6);
  const icons = ["star", "check", "zap", "globe", "chart", "heart"] as const;
  return {
    title: short(sentences[0] ?? "Summary", 60),
    subtitle: "Key points at a glance",
    theme: "editorialGold",
    source: "Source: Editorial Research Overview",
    footerText: "Infographic Guide | 2026 Edition",
    takeaway: "Clear design and structured data drive better understanding and retention.",
    sections: [
      { type: "stats", heading: "Key Metrics", items: [{ value: "85%", label: "Key indicator", icon: "star" }, { value: "3x", label: "Impact score", icon: "zap" }] },
      { type: "list", heading: "Highlights", items: picks.slice(0, 5).map((s, i) => ({ title: short(s.split(/[,:;]/)[0], 40), desc: short(s), icon: icons[i % icons.length] })) },
      { type: "quote", text: short(sentences[sentences.length - 1] ?? sentences[0] ?? "Clear design drives clear insight.", 140) },
    ].filter((s) => s.type !== "list" || (s as any).items.length >= 3) as Infographic["sections"],
  };
}
