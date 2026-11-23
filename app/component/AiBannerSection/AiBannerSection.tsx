// 'use client';
// import { useState } from 'react';
// import Image from "next/image";
// import noteIcon from "@/public/assets/Frame.svg";
// import robot from "@/public/assets/robot.svg"
// import sparkle from "@/public/assets/sparkle.svg"

// /* ---------- Props ---------- */
// type AiBannerSectionProps = {
//   /** Called with the trimmed prompt when the user clicks Generate / presses Enter. */
//   onGenerate?: (prompt: string) => void;
//   /** Optional: your own robot artwork. When omitted, the built-in SVG placeholder is used. */
//   imageSrc?: string;
//   imageAlt?: string;
// };

// /* ---------- Decorative stars (static) ---------- */
// const STARS = [
//   { top: '2%', left: '12%', color: '#fff' },
//   { top: '6%', left: '26%', color: '#d9f04a' },
//   { top: '31%', left: '7%', color: '#d9f04a' },
//   { top: '70%', left: '4%', color: '#fff' },
//   { top: '55%', left: '94%', color: '#fff' },
//   { top: '92%', left: '88%', color: '#fff' },
//   { top: '8%', left: '96%', color: '#fff' },
// ];

// /* ---------- Icons (replace with your own if you like) ---------- */
// const WandIcon = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
//     <path d="M4 20l11-11" />
//     <path d="M13.5 5.5l5 5-2 2-5-5z" />
//     <path d="M19 3v2M18 4h2M5 4v2M4 5h2M20 14v2M19 15h2" />
//   </svg>
// );
// const SparkleIcon = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
//     <path d="M10 3l1.8 5.2L17 10l-5.2 1.8L10 17l-1.8-5.2L3 10l5.2-1.8z" />
//     <path d="M18 14l.9 2.6L21.5 17.5l-2.6.9L18 21l-.9-2.6-2.6-.9 2.6-.9z" />
//   </svg>
// );
// const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
//     <path d="M5 12h14M13 6l6 6-6 6" />
//   </svg>
// );

// /* ---------- Placeholder robot illustration ---------- */
// function RobotArt({ className = '' }: { className?: string }) {
//   const star = (x: number, y: number, s: number) => (
//     <path
//       key={`${x}-${y}`}
//       d={`M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z`}
//       fill="#e9d5ff"
//     />
//   );
//   return (
//     <svg viewBox="0 0 520 420" fill="none" className={className} role="img" aria-label="Friendly AI robot surrounded by charts">
//       <defs>
//         <radialGradient id="ai-glow" cx="50%" cy="55%" r="50%">
//           <stop offset="0" stopColor="#7c3aed" stopOpacity="0.45" />
//           <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
//         </radialGradient>
//         <linearGradient id="ai-orbit" x1="0" y1="0" x2="1" y2="0">
//           <stop offset="0" stopColor="#a78bfa" />
//           <stop offset="1" stopColor="#38bdf8" />
//         </linearGradient>
//         <linearGradient id="ai-badge" x1="0" y1="0" x2="1" y2="1">
//           <stop offset="0" stopColor="#8b5cf6" />
//           <stop offset="1" stopColor="#6366f1" />
//         </linearGradient>
//       </defs>

//       <ellipse cx="270" cy="250" rx="230" ry="150" fill="url(#ai-glow)" />
//       <ellipse cx="270" cy="255" rx="235" ry="85" transform="rotate(-14 270 255)" stroke="url(#ai-orbit)" strokeWidth="2" opacity="0.8" />
//       <ellipse cx="275" cy="385" rx="110" ry="9" fill="#8b5cf6" opacity="0.45" />

//       {/* donut card */}
//       <g transform="rotate(-6 235 70)">
//         <rect x="150" y="22" width="170" height="105" rx="10" fill="#e6e8f5" />
//         <circle cx="198" cy="75" r="26" stroke="#f59e0b" strokeWidth="14" />
//         <circle cx="198" cy="75" r="26" stroke="#8b5cf6" strokeWidth="14" strokeDasharray="60 200" />
//         <circle cx="198" cy="75" r="26" stroke="#22c55e" strokeWidth="14" strokeDasharray="30 200" strokeDashoffset="-70" />
//         <path d="M246 48h52M246 64h52M246 80h40M246 96h46" stroke="#9aa3d6" strokeWidth="5" strokeLinecap="round" />
//       </g>

//       {/* bar card */}
//       <g transform="rotate(7 85 170)">
//         <rect x="20" y="118" width="135" height="105" rx="10" fill="#e6e8f5" />
//         <rect x="42" y="172" width="14" height="30" rx="3" fill="#6366f1" />
//         <rect x="64" y="156" width="14" height="46" rx="3" fill="#6366f1" />
//         <rect x="86" y="140" width="14" height="62" rx="3" fill="#7c3aed" />
//         <rect x="108" y="128" width="14" height="74" rx="3" fill="#8b5cf6" />
//         <path d="M42 132h40" stroke="#b4bbe3" strokeWidth="4" strokeLinecap="round" />
//       </g>

//       {/* flow card */}
//       <g transform="rotate(7 425 130)">
//         <rect x="372" y="72" width="112" height="125" rx="10" fill="#e6e8f5" />
//         <rect x="408" y="86" width="36" height="14" rx="4" fill="#3b82f6" />
//         <path d="M426 100v12M390 112h72M390 112v12M462 112v12" stroke="#7c86c8" strokeWidth="2" />
//         <rect x="380" y="124" width="26" height="12" rx="4" fill="#60a5fa" />
//         <rect x="450" y="124" width="26" height="12" rx="4" fill="#f59e0b" />
//         <path d="M393 136v14M463 136v14M393 150h70" stroke="#7c86c8" strokeWidth="2" />
//         <rect x="410" y="158" width="34" height="14" rx="4" fill="#fbbf24" />
//         <rect x="410" y="178" width="34" height="12" rx="4" fill="#22c55e" />
//       </g>

//       {/* robot: arm + body */}
//       <ellipse cx="285" cy="305" rx="62" ry="62" fill="#dfe3fa" />
//       <path d="M338 285c26-4 46-14 62-26 6-5 14 1 9 8-10 14-30 30-58 38z" fill="#e8eaff" />
//       <path d="M396 246l16 8-6 16-18-6z" fill="#e8eaff" />

//       {/* head */}
//       <circle cx="300" cy="86" r="8" fill="#38bdf8" />
//       <path d="M282 114l12-26" stroke="#c4b5fd" strokeWidth="4" strokeLinecap="round" />
//       <circle cx="196" cy="180" r="16" fill="#2563eb" />
//       <circle cx="354" cy="180" r="16" fill="#2563eb" />
//       <rect x="196" y="116" width="162" height="130" rx="62" fill="#f1f3ff" />
//       <rect x="212" y="132" width="130" height="98" rx="44" fill="#0b0b18" />
//       <path d="M240 182q12-14 24 0M290 182q12-14 24 0" stroke="#22d3ee" strokeWidth="6" strokeLinecap="round" />
//       <path d="M262 204q15 12 30 0" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" />

//       {/* AI badge */}
//       <rect x="188" y="262" width="84" height="84" rx="20" fill="url(#ai-badge)" stroke="#c4b5fd" strokeWidth="3" />
//       <text x="230" y="318" textAnchor="middle" fontSize="40" fontWeight="800" fill="#fff" fontFamily="Inter, system-ui, sans-serif">
//         AI
//       </text>
//       <ellipse cx="230" cy="352" rx="34" ry="9" fill="#f1f3ff" />

//       {star(138, 150, 10)}
//       {star(118, 255, 6)}
//       {star(190, 215, 5)}
//       {star(330, 55, 7)}
//       {star(405, 300, 8)}
//     </svg>
//   );
// }

// /* ---------- Section ---------- */
// export default function AiBannerSection({ onGenerate, imageSrc, imageAlt = 'AI assistant creating an infographic' }: AiBannerSectionProps) {
//   const [prompt, setPrompt] = useState('');
//   const canSubmit = prompt.trim().length > 0;

//   const submit = () => {
//     if (!canSubmit) return;
//     onGenerate?.(prompt.trim());
//   };

//   return (
//     <section className="relative w-full overflow-hidden bg-[#0a0a0a] px-4 py-12 font-sans sm:px-6 sm:py-16 lg:px-8 lg:py-20">
//       {/* stars */}
//       <div aria-hidden="true" className="pointer-events-none absolute inset-0">
//         {STARS.map((s, i) => (
//           <span key={i} className="absolute h-[3px] w-[3px] rounded-full" style={{ top: s.top, left: s.left, backgroundColor: s.color }} />
//         ))}
//       </div>

//       <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b14]">
//         {/* background glows */}
//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute inset-0"
//           style={{
//             background:
//               'radial-gradient(60% 80% at 0% 0%, rgba(79,70,229,0.18) 0%, transparent 60%), radial-gradient(45% 70% at 85% 90%, rgba(124,58,237,0.28) 0%, transparent 70%)',
//           }}
//         />

//         <div className="relative grid bg-[#0C0D14] border border-[#222C3A] items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:p-14">
//           {/* ---- Text + input ---- */}
//           <div>
//             <h2 className="text-3xl inter-text font-extrabold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[60px]">
//               Let AI Create Your
//               <span className="block bg-gradient-to-r from-[#9378FF] via-[#6366F1] to-[#38BDF8] inter-text text-3xl sm:text-4xl lg:text-[70px] bg-clip-text text-transparent">Infographic</span>
//             </h2>

//             <p className="mt-5 max-w-md inter-text text-sm leading-relaxed text-[#9CA3AF] sm:text-base lg:text-[32px]">
//               Just describe what you need, and our AI will turn your ideas into stunning infographics.
//             </p>

//             <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center">
//               <label className="relative flex h-14 min-w-0 flex-1 items-center rounded-full border border-white/10 bg-[#111522] pl-5 pr-4 transition focus-within:border-violet-400/60 focus-within:ring-2 focus-within:ring-violet-500/20">
//                 {/* <WandIcon className="h-5 w-5 shrink-0 text-sky-400" /> */}
//                   <Image
//               src={noteIcon}
//               alt=""
//               // width={16}
//               // height={14}
//             />
//                 <span className="sr-only">Describe your infographic</span>
//                 <span className="min-w-0 bg-transparent text-sm text-white placeholder-zinc-500">e.g. “Sales growth tips for small business</span>
//               </label>

//               <button
//                 type="button"
//                 onClick={submit}
//                 // disabled={!canSubmit}
//                 className="inline-flex h-14 shrink-0 items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-violet-600 to-sky-500 px-8 text-base font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:brightness-100">
//                 <Image src={sparkle} alt="sparkle icon" />
//                 Generate
//                 <ArrowRightIcon className="h-4 w-4" />
//               </button>
//             </div>
//           </div>

//           {/* ---- Illustration ---- */}
//           <div className="mx-auto w-full max-w-[340px] sm:max-w-[420px] lg:max-w-none">
//             {/* {imageSrc ? (
//               // eslint-disable-next-line @next/next/no-img-element
//               <img src={imageSrc} alt={imageAlt} className="h-auto w-full object-contain" loading="lazy" />
//             ) : (
//               <RobotArt className="h-auto w-full" />
//             )} */}
//             <Image src={robot} alt="robot image" />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

'use client';
import { useState } from 'react';
import Image from 'next/image';
import noteIcon from '@/public/assets/Frame.svg';
import robot from '@/public/assets/robot.svg';
import sparkle from '@/public/assets/sparkle.svg';
import PricingSection from '../PricingSection/PricingSection';
import { useRouter } from 'next/navigation';

/* ---------- Props ---------- */
type AiBannerSectionProps = {
  /** Called with the trimmed prompt when the user clicks Generate / presses Enter. */
  onGenerate?: (prompt: string) => void;
};

/* ---------- Decorative stars (static) ---------- */
const STARS = [
  { top: '2%', left: '12%', color: '#fff' },
  { top: '6%', left: '26%', color: '#d9f04a' },
  { top: '31%', left: '7%', color: '#d9f04a' },
  { top: '70%', left: '4%', color: '#fff' },
  { top: '55%', left: '94%', color: '#fff' },
  { top: '92%', left: '88%', color: '#fff' },
  { top: '8%', left: '96%', color: '#fff' },
];

const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* ---------- Section ---------- */
export default function AiBannerSection({ onGenerate }: AiBannerSectionProps) {
   const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const canSubmit = prompt.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    onGenerate?.(prompt.trim());
  };

  return (
    <>
    <section className="relative w-full overflow-hidden bg-[#0a0a0a] px-4 py-12 font-sans sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      {/* stars */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {STARS.map((s, i) => (
          <span key={i} className="absolute h-[3px] w-[3px] rounded-full" style={{ top: s.top, left: s.left, backgroundColor: s.color }} />
        ))}
      </div>

      {/* Card: 1500 × 615 on large screens, fluid below */}
      <div className="relative mx-auto w-full max-w-[1500px] overflow-hidden rounded-[28px] border border-[#222C3A] bg-[#0C0D14] 2xl:h-[615px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-28 -top-28 h-[360px] w-[360px] rounded-full bg-[#4F46E5]/10 blur-[100px] sm:h-[460px] sm:w-[460px]"
        />

        <div className="relative z-10 flex h-full flex-col items-stretch gap-8 p-6 sm:px-10 sm:py-5 lg:flex-row lg:items-center lg:gap-4 lg:px-10 xl:px-12">
          {/* ---- Text + input ---- */}
          <div className="min-w-0 flex-1 text-left">
            <h2 className="inter-text font-extrabold leading-[1.12] tracking-tight text-white">
              {/* -ml pulls the first line left so it lines up with "Infographic" and the paragraph; tweak the value if needed */}
              <span className="-ml-[0.1em] block text-[28px] sm:text-5xl 2xl:text-[70px] pl=2">Let AI Create Your</span>
              <span className="block bg-gradient-to-r from-[#9378FF] via-[#6366F1] to-[#38BDF8] bg-clip-text text-[34px] text-transparent sm:text-[52px] 2xl:text-[80px]">
                Infographic
              </span>
            </h2>

            <p className="inter-text mt-4 max-w-[560px] text-sm leading-snug text-[#9CA3AF] sm:mt-6 sm:text-lg xl:text-xl 2xl:max-w-none 2xl:text-[32px]">
              Just describe what you need, and our AI will turn your ideas into stunning infographics.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-4">
              {/* Input: 550 × 82 on 2xl */}
              {/* <label className="flex h-16 min-w-0 flex-1 items-center gap-3 rounded-full border border-white/10 bg-[#111522] pl-5 pr-4 transition focus-within:border-violet-400/60 focus-within:ring-2 focus-within:ring-violet-500/20 sm:gap-4 sm:pl-7 xl:h-[72px] 2xl:h-[82px] 2xl:w-[550px] 2xl:flex-none">
                <Image src={noteIcon} alt="" className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
                <span className="sr-only">Describe your infographic</span>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      submit();
                    }
                  }}
                  placeholder="e.g. “Sales growth tips for small business”"
                  className="min-w-0 flex-1 truncate bg-transparent text-sm text-white placeholder-zinc-500 outline-none sm:text-base 2xl:text-lg"
                />
              </label> */}

              <div className="flex h-16 min-w-0 flex-1 items-center gap-3 rounded-full border border-[#222C3A] bg-[#141522] pl-5 pr-4 sm:gap-4 sm:pl-7 xl:h-[72px] 2xl:h-[82px] 2xl:w-[550px] 2xl:flex-none">
                <Image src={noteIcon} alt="" className="h-5 w-5 shrink-0 sm:h-8 sm:w-8" />
                <span className="min-w-0 truncate text-sm inter-text text-[#9CA3AF] sm:text-base 2xl:text-[20px]">
                  e.g. “Sales growth tips for small business”
                </span>
              </div>

              {/* Button: 250 × 82 on 2xl */}
              <button
                type="button"
                onClick={() => router.push("/infographic-maker/dashboard", { scroll: true })}
                className="inline-flex h-16 shrink-0 items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#6366F1] to-[#3B82F6] px-8 text-base inter-text font-semibold text-white shadow-lg shadow-[#7C3AED]/25 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/70 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:brightness-100 xl:h-[72px] 2xl:h-[82px] 2xl:w-[250px] 2xl:text-[24px]">
                <Image src={sparkle} alt="" className="h-5 w-5 2xl:h-8 2xl:w-8" />
                Generate
                <ArrowRightIcon className="h-4 w-4 2xl:h-7 2xl:w-7" />
              </button>
            </div>
          </div>

          {/* ---- Illustration: 542 × 457 on 2xl ---- */}
          <div className="mx-auto w-full max-w-[340px] shrink-0 sm:max-w-[420px] lg:mx-0 lg:w-[380px] lg:max-w-none xl:w-[542px] 2xl:w-[542px]">
            <Image src={robot} alt="AI robot holding an AI badge next to charts" priority className="h-auto w-full object-contain" />
          </div>
        </div>
      </div>
    </section>
    <PricingSection />
    </>
  );
}
