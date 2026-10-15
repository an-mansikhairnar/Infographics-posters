// import { z } from "zod";

// export const ICONS = ["chart","users","clock","star","shield","zap","globe","heart","check","dollar"] as const;
// const Icon = z.enum(ICONS).catch("star"); // unknown icon from the LLM -> "star" instead of failing
// const h = { heading: z.string().optional() };

// export const SectionSchema = z.discriminatedUnion("type", [
//   z.object({ ...h, type: z.literal("stats"),
//     items: z.array(z.object({ value: z.string(), label: z.string(), note: z.string().optional(), icon: Icon })).min(2) }),
//   z.object({ ...h, type: z.literal("steps"),
//     items: z.array(z.object({ title: z.string(), desc: z.string() })).min(3) }),
//   z.object({ ...h, type: z.literal("timeline"),
//     items: z.array(z.object({ date: z.string(), title: z.string() })).min(3) }),
//   z.object({ ...h, type: z.literal("comparison"),
//     left: z.object({ title: z.string(), points: z.array(z.string()).min(1) }),
//     right: z.object({ title: z.string(), points: z.array(z.string()).min(1) }) }),
//   z.object({ ...h, type: z.literal("bar_chart"),
//     unit: z.string().optional(),
//     data: z.array(z.object({ label: z.string(), value: z.number() })).min(2) }),
//   z.object({ ...h, type: z.literal("list"),
//     items: z.array(z.object({ title: z.string(), desc: z.string(), icon: Icon })).min(3) }),
//   z.object({ ...h, type: z.literal("quote"), text: z.string(), author: z.string().optional() }),
// ]);

// export const InfographicSchema = z.object({
//   title: z.string(),
//   subtitle: z.string().optional(),
//   intro: z.string().optional(),
//   takeaway: z.string().optional(),
//   sections: z.array(SectionSchema).min(2),
// });

// export type Section = z.infer<typeof SectionSchema>;
// export type SectionType = Section["type"];
// export type SectionOf<T extends SectionType> = Extract<Section, { type: T }>;
// export type IconName = (typeof ICONS)[number];
// export type Infographic = z.infer<typeof InfographicSchema>;

// const MAX = 6;
// /** Clamp list sizes so a chatty model can't break the layouts. */
// export function clamp(d: Infographic): Infographic {
//   const sections = d.sections.slice(0, 6).map((s): Section => {
//     switch (s.type) {
//       case "stats": return { ...s, items: s.items.slice(0, 4) };
//       case "steps": case "timeline": case "list": return { ...s, items: s.items.slice(0, MAX) } as Section;
//       case "bar_chart": return { ...s, data: s.data.slice(0, 8) };
//       case "comparison": return { ...s, left: { ...s.left, points: s.left.points.slice(0, 5) }, right: { ...s.right, points: s.right.points.slice(0, 5) } };
//       default: return s;
//     }
//   });
//   return { ...d, sections };
// }

import { z } from "zod";

export const ICONS = ["chart","users","clock","star","shield","zap","globe","heart","check","dollar"] as const;
const Icon = z.enum(ICONS).catch("star"); // unknown icon from the LLM -> "star" instead of failing
const h = {
  heading: z.string().optional(),
  styleVariant: z.enum(["default", "dark_band", "accent_card", "minimal"]).optional(),
};

export const GRAPHICS = [
  "video", "player", "newspaper", "clock", "globe", "laptop", "cart",
  "camera", "palette", "person", "pictogram", "chart", "shield", "growth"
] as const;
const Graphic = z.string().catch("video");

export const SectionSchema = z.discriminatedUnion("type", [
  z.object({ ...h, type: z.literal("split_hero"),
    leftHeading: z.string().default("WHAT'S WORKING"),
    rightHeading: z.string().default("WHAT'S NOT"),
    leftItems: z.array(z.object({ value: z.string(), label: z.string(), graphic: Graphic.optional(), fraction: z.array(z.number()).optional() })).min(1),
    rightItems: z.array(z.object({ value: z.string(), label: z.string(), graphic: Graphic.optional(), fraction: z.array(z.number()).optional() })).min(1),
  }),
  z.object({ ...h, type: z.literal("dark_grid"),
    items: z.array(z.object({ value: z.string(), label: z.string(), note: z.string().optional(), graphic: Graphic.optional() })).min(2),
  }),
  z.object({ ...h, type: z.literal("zigzag_story"),
    items: z.array(z.object({ value: z.string(), label: z.string(), desc: z.string().optional(), graphic: Graphic.optional() })).min(2),
  }),
  z.object({ ...h, type: z.literal("stats"),
    items: z.array(z.object({ value: z.string(), label: z.string(), note: z.string().optional(), icon: Icon, graphic: Graphic.optional(), fraction: z.array(z.number()).optional() })).min(2) }),
  z.object({ ...h, type: z.literal("steps"),
    items: z.array(z.object({ title: z.string(), desc: z.string(), graphic: Graphic.optional() })).min(3) }),
  z.object({ ...h, type: z.literal("timeline"),
    items: z.array(z.object({ date: z.string(), title: z.string(), graphic: Graphic.optional() })).min(3) }),
  z.object({ ...h, type: z.literal("comparison"),
    left: z.object({ title: z.string(), points: z.array(z.string()).min(1) }),
    right: z.object({ title: z.string(), points: z.array(z.string()).min(1) }) }),
  z.object({ ...h, type: z.literal("bar_chart"),
    unit: z.string().optional(),
    data: z.array(z.object({ label: z.string(), value: z.number() })).min(2) }),
  z.object({ ...h, type: z.literal("list"),
    items: z.array(z.object({ title: z.string(), desc: z.string(), icon: Icon, graphic: Graphic.optional() })).min(3) }),
  z.object({ ...h, type: z.literal("quote"), text: z.string(), author: z.string().optional() }),
]);

export const THEMES_LIST = ["editorialGold", "modernBlue", "emeraldGrowth", "sunsetCoral", "midnightDark"] as const;
export const ThemeEnum = z.enum(THEMES_LIST).catch("editorialGold");

export const InfographicSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  intro: z.string().optional(),
  takeaway: z.string().optional(),
  /** Zone 4: Authority — source citation or credible quote appearing before the footer */
  source: z.string().optional(),
  /** Zone 5: Footer sign-off metadata text (e.g. "Editorial Report | 2026 Edition") */
  footerText: z.string().optional(),
  theme: ThemeEnum.default("editorialGold"),
  sections: z.array(SectionSchema).min(3),
});

export type Section = z.infer<typeof SectionSchema>;
export type SectionType = Section["type"];
export type SectionOf<T extends SectionType> = Extract<Section, { type: T }>;
export type IconName = (typeof ICONS)[number];
export type Infographic = z.infer<typeof InfographicSchema>;

const MAX = 6;
/** Clamp list sizes so a chatty model can't break the layouts. */
export function clamp(d: Infographic): Infographic {
  const sections = d.sections.slice(0, 7).map((s): Section => {
    switch (s.type) {
      case "split_hero": return { ...s, leftItems: s.leftItems.slice(0, 2), rightItems: s.rightItems.slice(0, 2) };
      case "dark_grid": return { ...s, items: s.items.slice(0, 4) };
      case "zigzag_story": return { ...s, items: s.items.slice(0, 4) };
      case "stats": return { ...s, items: s.items.slice(0, 4) };
      case "steps": case "timeline": case "list": return { ...s, items: s.items.slice(0, MAX) } as Section;
      case "bar_chart": return { ...s, data: s.data.slice(0, 8) };
      case "comparison": return { ...s, left: { ...s.left, points: s.left.points.slice(0, 5) }, right: { ...s.right, points: s.right.points.slice(0, 5) } };
      default: return s;
    }
  });
  return { ...d, sections };
}
