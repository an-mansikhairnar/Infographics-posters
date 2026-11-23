// import Image from 'next/image';
// import ArrowSquiggle from '@/public/assets/Vector.svg';
// import RulerPencilIcon from '@/public/assets/RulerPencilIcon.svg';
// import RobotIcon from '@/public/assets/RobotIcon.svg';
// import PencilFrameIcon from '@/public/assets/PencilFrameIcon.svg';
// import boxPattern from "@/public/assets/boxPattern.svg"
// /* ---------- Background grid (checks / squares) ---------- */
// const gridStyle = (size = 28, alpha = 0.05) => ({
//   backgroundImage: `linear-gradient(to right, rgba(255,255,255,${alpha}) 1px, transparent 1px),
//                     linear-gradient(to bottom, rgba(255,255,255,${alpha}) 1px, transparent 1px)`,
//   backgroundSize: `${size}px ${size}px`,
// });

// /* ---------- Content ---------- */
// const CARDS = [
//   {
//     title: 'Start with the right canvas',
//     text: 'Choose a predefined size or enter your own width and height. From a square visual to a long-form poster, set the dimensions for your idea.',
//     Icon: RulerPencilIcon,
//     href: '/infographic-maker/dashboard',
//   },
//   {
//     title: 'Let a prompt spark your design',
//     text: 'Describe your topic, audience, and style. Generate an infographic with AI, then take it into the editor to refine the result.',
//     Icon: RobotIcon,
//     href: '/infographic-maker/dashboard',
//   },
//   {
//     title: 'Make every detail feel like you',
//     text: 'Adjust text, colors, and layout in the editor. Whether you start from a template or AI, you stay in control of your design.',
//     Icon: PencilFrameIcon,
//     href: '/infographic-maker/dashboard',
//   },
// ];

// /* ---------- Card ---------- */
// function FeatureCard({ title, text, Icon, href }: any) {
//   return (
//     <article
//       className="group relative flex flex-col overflow-hidden rounded-xl border border-[#222C3A] bg-[#161616] p-5 sm:p-6"
//       style={gridStyle(22, 0.035)}>
//       <h3 className="text-[52px] inter-text font-bold leading-snug text-white sm:text-xl">{title}</h3>

//       <p className="mt-3 inter-text text-base leading-relaxed text-[#DCE3EE]">{text}</p>

//       <a
//         href={href}
//         className="group mt-6 inter-text inline-flex w-fit max-w-full items-center gap-2 rounded text-sm font-semibold text-[#0CC4F4] transition-colors duration-300 hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 sm:text-base">
//         <span>Get Started</span>

//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2.5"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           aria-hidden="true"
//           className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 sm:h-4 sm:w-4">
//           <path d="M3 12h18" />
//           <path d="m14 5 7 7-7 7" />
//         </svg>
//       </a>

//       {/* mt-auto keeps the icon row aligned across cards of equal height */}
//       <div className="mt-auto flex items-end justify-between pt-8">
//         <Image src={ArrowSquiggle} alt="" aria-hidden="true" className="h-9 w-16 sm:h-11 sm:w-[72px]" />
//         <Image src={Icon} alt="" aria-hidden="true" className="h-12 w-12 sm:h-14 sm:w-14" />
//       </div>
//     </article>
//   );
// }

// /* ---------- Section ---------- */
// export default function FlexibleStartSection() {
//   return (
//     <section className="relative w-full overflow-hidden bg-[#1E1E1E] px-4 py-16 font-sans sm:px-6 sm:py-20 lg:px-8 lg:py-24">
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0"
//         style={{
//           background: '#161616',
//         }}
//       />

//       <div className="relative mx-auto max-w-6xl">
//          <header className="mx-auto w-full text-center">
//           <p
//             className="inter-text text-[clamp(11px,1.3vw,16px)] font-medium uppercase tracking-normal"
//             style={{
//               background: 'linear-gradient(90deg, #696BF9 0%, #1AB7F4 100%)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               backgroundClip: 'text',
//               color: 'transparent',
//               display: 'inline-block',
//             }}>
//             Your ideas, your way
//           </p>

//           <h2 className="mt-3 whitespace-nowrap inter-text text-[clamp(18px,4.2vw,52px)] font-bold leading-tight tracking-tight text-[#F5F8FC]">
//             A flexible start. A personal finish.
//           </h2>

//           <p className="mx-auto mt-4 w-full whitespace-nowrap inter-text text-[clamp(9px,1.3vw,16px)] font-normal text-[#AAB8CC]">
//             Choose your canvas, find your starting point, and shape a design that tells your story.
//           </p>
//         </header>

//         <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
//           {CARDS.map((card) => (
//             <FeatureCard key={card.title} {...card} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
import Image from 'next/image';
import ArrowSquiggle from '@/public/assets/Vector.svg';
import RulerPencilIcon from '@/public/assets/RulerPencilIcon.svg';
import RobotIcon from '@/public/assets/RobotIcon.svg';
import PencilFrameIcon from '@/public/assets/PencilFrameIcon.svg';
import boxPattern from '@/public/assets/boxPattern.svg';

/*
  Breakpoint note
  ---------------
  3 cards x 480px + 2 gaps x 20px = 1480px (+ section padding).
  Tailwind's `2xl` (1536px) is too small to fit that with padding, so the
  "full size" layout (480x399 card, 80px icons, 107x61 arrow) kicks in at
  min-[1560px]. Below that, everything scales fluidly.
*/

/* ---------- Content ---------- */
const CARDS = [
  {
    title: 'Start with the right canvas',
    text: 'Choose a predefined size or enter your own width and height. From a square visual to a long-form poster, set the dimensions for your idea.',
    Icon: RulerPencilIcon,
    href: '/infographic-maker/dashboard',
  },
  {
    title: 'Let a prompt spark your design',
    text: 'Describe your topic, audience, and style. Generate an infographic with AI, then take it into the editor to refine the result.',
    Icon: RobotIcon,
    href: '/infographic-maker/dashboard',
  },
  {
    title: 'Make every detail feel like you',
    text: 'Adjust text, colors, and layout in the editor. Whether you start from a template or AI, you stay in control of your design.',
    Icon: PencilFrameIcon,
    href: '/infographic-maker/dashboard',
  },
];

/* ---------- Card ---------- */
function FeatureCard({ title, text, Icon, href }: any) {
  return (
    <article
      className="
        group relative isolate flex w-full max-w-[480px] flex-col overflow-hidden
        justify-self-center rounded-xl border border-[#222C3A] bg-[#161616]
        p-5 sm:p-6
        min-h-[340px] sm:min-h-[360px]
        min-[1560px]:h-[399px] min-[1560px]:w-[480px] min-[1560px]:min-h-0 min-[1560px]:p-8
      ">
      {/* Box pattern background — fills the card and scales with it */}
      <Image
        src={boxPattern}
        alt=""
        aria-hidden="true"
        fill
        sizes="(min-width: 1560px) 480px, (min-width: 768px) 50vw, 100vw"
        className="pointer-events-none -z-10 select-none object-cover object-center"
      />

      <h3 className="inter-text text-lg font-bold leading-snug text-white sm:text-[27px] min-[1560px]:text-2xl">
        {title}
      </h3>

      <p className="mt-3 inter-text text-sm leading-relaxed text-[#DCE3EE] sm:text-[16px]">{text}</p>

      <a
        href={href}
        className="group mt-5 inter-text inline-flex w-fit max-w-full items-center gap-2 rounded text-sm font-semibold text-[#0CC4F4] transition-colors duration-300 hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 sm:mt-6 sm:text-[16px]">
        <span>Get Started</span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1">
          <path d="M3 12h18" />
          <path d="m14 5 7 7-7 7" />
        </svg>
      </a>

      {/* mt-auto pins the icon row to the bottom so it lines up across cards */}
      <div className="mt-auto flex items-end justify-between gap-4 pt-6 sm:pt-8">
        {/* Arrow: 107 x 61 on large screens (aspect ratio preserved when scaling down) */}
        <Image
          src={ArrowSquiggle}
          alt=""
          aria-hidden="true"
          className="h-auto w-[72px] object-contain sm:w-[88px] min-[1560px]:h-[61px] min-[1560px]:w-[107px]"
        />
        {/* Icon: 80 x 80 on large screens */}
        <Image
          src={Icon}
          alt=""
          aria-hidden="true"
          className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16 min-[1560px]:h-20 min-[1560px]:w-20"
        />
      </div>
    </article>
  );
}

/* ---------- Section ---------- */
export default function FlexibleStartSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#161616] px-4 py-16 font-sans sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="relative mx-auto max-w-[1480px]">
        <header className="mx-auto w-full text-center">
          <p
            className="inter-text text-[clamp(11px,1.3vw,16px)] font-medium uppercase tracking-normal"
            style={{
              background: 'linear-gradient(90deg, #696BF9 0%, #1AB7F4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              display: 'inline-block',
            }}>
            Your ideas, your way
          </p>

          <h2 className="mt-3 whitespace-nowrap inter-text text-[clamp(18px,4.2vw,52px)] font-bold leading-tight tracking-tight text-[#F5F8FC]">
            A flexible start. A personal finish.
          </h2>

          <p className="mx-auto mt-4 w-full whitespace-nowrap inter-text text-[clamp(9px,1.3vw,16px)] font-normal text-[#AAB8CC]">
            Choose your canvas, find your starting point, and shape a design that tells your story.
          </p>
        </header>

        {/* 1 col (mobile) -> 2 cols (md) -> 3 cols (xl). Cards are fluid up to 480px wide. */}
        <div className="mt-10 grid grid-cols-1 justify-items-center gap-4 sm:mt-14 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
          {CARDS.map((card) => (
            <FeatureCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}