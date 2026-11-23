'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

const priceFont = { fontFamily: "'Playfair Display', Georgia, serif" };

/* ---------- Icons ---------- */
const CheckIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path d="M4 12.5l5 5L20 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- Content ---------- */
const PLANS = [
  {
    name: 'Design it yourself',
    price: '$19.99',
    description: 'Build on a ready-made template or bring your own idea to a blank canvas.',
    features: [
      'Blank canvas or ready-made template',
      '12+ Templates',
      'Preset or custom canvas dimensions',
      'Advance Editor Tool',
      'Edit text, colors, and layout',
    ],
  },
  {
    name: 'Create with AI',
    price: '$49.99',
    description: 'Start with a prompt, then refine your generated infographic in the editor.',
    features: [
      'AI prompt-based generation',
      'Edit the generated design',
      'Preset or custom canvas dimensions',
      'Advance Editor Tool',
      'Edit text, colors, and layout',
    ],
  },
  {
    name: 'Full Access',
    price: '$99.99',
    description: 'Start with a prompt, then refine your generated infographic in the editor.',
    features: [
      'AI prompt-based generation',
      'Edit the generated design',
      'Preset or custom canvas dimensions',
      'Advance Editor Tool',
      'Edit text, colors, and layout',
    ],
  },
];

/* ---------- Card ---------- */
function PlanCard({ name, price, description, features }: any) {
  const router = useRouter();
  return (
    <article className="flex border border-[#212121] h-full flex-col rounded-xl bg-[#20242A] p-2.5 sm:p-3">
      <div className="flex flex-1 flex-col items-center px-3 pb-6 pt-7 text-center sm:px-4">
        <h3 className="bg-gradient-to-r from-[#696BF9] to-[#1AB7F4] bg-clip-text text-[18px] inter-text font-semibold text-transparent sm:text-base">
          {name}
        </h3>

        <p className="mt-6 font-bold italic text-2xl playfair-text text-white sm:text-3xl" style={priceFont}>
          {price}
          <span className="text-lg sm:text-xl">/</span> <span className="text-base sm:text-lg">per month</span>
        </p>

        <p className="mt-5 max-w-[260px] inter-text text-[14px] font-normal leading-relaxed text-[#FFFFFF]">{description}</p>

        {/* gradient-outline pill button */}

        <button
          type="button"
          onClick={() => router.push('/infographic-maker/dashboard', { scroll: true })}
          className="mt-8 rounded-full bg-gradient-to-r from-[#696BF9] to-[#1AB7F4] p-px transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60">
          <span className="group inline-flex w-fit max-w-full items-center justify-center rounded-full bg-[#1f2229] px-5 py-2.5 inter-text text-sm font-semibold sm:px-7 sm:py-3 sm:text-base lg:px-8 lg:py-3.5">
            <span className="inline-flex items-center gap-2 whitespace-nowrap bg-gradient-to-r from-[#696BF9] to-[#1AB7F4] bg-clip-text text-transparent">
              Get Started Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="h-2 w-2 shrink-0 transition-transform duration-300 group-hover:translate-x-1 sm:h-3 sm:w-3 lg:h-4 lg:w-4">
                <defs>
                  <linearGradient id="arrowGradient" x1="0" y1="0" x2="24" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#696BF9" />
                    <stop offset="100%" stopColor="#1AB7F4" />
                  </linearGradient>
                </defs>

                <path d="M3 12H21" stroke="url(#arrowGradient)" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M14 5L21 12L14 19" stroke="url(#arrowGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </span>
        </button>
      </div>

      <ul className="space-y-3.5 rounded-lg border border-[#262A31] bg-[#0C0F14] px-5 py-6 sm:px-8">
        {features.map((feature: any) => (
          <li key={feature} className="flex items-center gap-3 text-[14px] inter-text font-normal text-white">
            <CheckIcon className="h-[16px] w-[22px] shrink-0 text-blue-400" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

/* ---------- Section ---------- */
export default function PricingSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0a0a0a] px-4 py-11 font-sans sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      {/* starfield */}
      {/* <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              backgroundColor: s.color,
            }}
          />
        ))}
      </div> */}
      {/* <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 bg-[url('/assets/starfield.svg')] bg-repeat"
    style={{
      backgroundSize: "100% auto",
    }}
  /> */}

      <div className="relative mx-auto max-w-5xl">
        <header className="text-center">
          {/* <p
            className="text-[16px] inter-text font-medium uppercase tracking-wide"
            style={{
              background: 'linear-gradient(90deg, #696BF9 0%, #1AB7F4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              display: 'inline-block',
            }}>
            Pricing, at a glance
          </p>
          <h2 className="mt-3 inter-text text-[52px] font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">Pricing Package</h2>
          <p className="mx-auto inter-text font-normal mt-4 max-w-xl text-[16px] text-[#AAB8CC] sm:text-sm">
            Compare your starting points below. Per-infographic prices are awaiting confirmation.
          </p> */}
          <p
  className="inter-text text-[clamp(11px,1.5vw,16px)] font-medium uppercase tracking-wide"
  style={{
    background: 'linear-gradient(90deg, #696BF9 0%, #1AB7F4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent',
    display: 'inline-block',
  }}
>
  Pricing, at a glance
</p>

<h2 className="mt-3 inter-text text-[clamp(26px,4.2vw,52px)] font-bold leading-tight tracking-tight text-white">
  Pricing Package
</h2>

<p className="mx-auto mt-4 max-w-xl inter-text text-[clamp(12px,1.3vw,16px)] font-normal leading-relaxed text-[#AAB8CC]">
  Compare your starting points below. Per-infographic prices are awaiting confirmation.
</p>
        </header>

        <div className="mx-auto mt-10 grid max-w-sm grid-cols-1 gap-5 sm:mt-14 md:max-w-none md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              /* with 3 plans on a 2-col grid, center the last card */
              className={i === 2 ? 'md:col-span-2 md:mx-auto md:w-1/2 md:max-w-sm lg:col-span-1 lg:mx-0 lg:w-auto lg:max-w-none' : ''}>
              <PlanCard {...plan} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
