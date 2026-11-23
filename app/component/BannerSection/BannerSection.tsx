'use client';
import ArrowRight from '@/public/assets/ArrowRight.svg';
import Image from 'next/image';
import Check from '@/public/assets/check.svg';
import Banner from '@/public/assets/banner.svg';
import { useRouter } from 'next/navigation';
const BADGES = ['Custom sizes', 'Ready-made templates', 'AI-powered'];

export default function HeroSection() {
  const router = useRouter();
  return (
    <section className="relative flex min-h-[520px] w-full items-center justify-center overflow-hidden bg-[#0f0f1a] px-4 py-20 font-sans sm:px-6 sm:py-24 lg:min-h-[600px] lg:px-8">
      <Image
        src={Banner}
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <h1 className="bg-gradient-to-r from-[#E38C14] via-[#16C4E5] to-[#17E78F] bg-clip-text inter-text text-4xl font-bold leading-[1.15] tracking-tight text-transparent sm:text-5xl lg:text-[75px]">
          Create beautiful Infographic with Artificial Intelligence
        </h1>

        <p className="mt-6 inter-text font-normal max-w-3xl text-[15px] leading-relaxed text-[#A9AEDE] sm:mt-8 sm:text-[20px]">
          Turn information into an infographic worth exploring. Start with a template, a blank canvas, or an AI prompt. Then make every
          detail your own.
        </p>

        {/* <button
          type="button"
          onClick={() => router.push("/infographic-maker/dashboard")}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0092B8] px-8 py-3 inter-text text-[18px] sm:text-[24px] font-semibold uppercase tracking-wide text-white transition hover:bg-[#0aa3c6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 sm:mt-10 sm:px-10 sm:py-3.5 sm:text-base">
          Get Started
          <Image src={ArrowRight} alt="" aria-hidden="true" className="h-[20px] w-[20px] sm:h-[24px] sm:w-[24px]" />
        </button> */}
        <button
          type="button"
          onClick={() => router.push('/infographic-maker/dashboard', { scroll: true })}
          className="group relative mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-[#0092B8] px-8 py-3 inter-text text-[18px] font-semibold uppercase tracking-wide text-white shadow-[0_4px_20px_rgba(0,146,184,0.25)] transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-[#00A6CC] hover:shadow-[0_10px_35px_rgba(0,146,184,0.4)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 sm:mt-10 sm:px-10 sm:py-3.5 sm:text-base">
          {/* Shine animation */}
          <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-[200%]" />
          </span>

          <span className="relative z-10">Get Started</span>

          <Image
            src={ArrowRight}
            alt=""
            aria-hidden="true"
            className="relative z-10 h-[20px] w-[20px] shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 sm:h-[24px] sm:w-[24px]"
          />
        </button>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:mt-7">
          {BADGES.map((label) => (
            <li
              key={label}
              className="rounded-full inter-text inline-flex items-center gap-1.5 bg-[#21334C] px-3 py-1.5 font-normal text-[14px] text-white">
              <Image src={Check} alt="" aria-hidden="true" className="h-[11px] w-[11px] sm:h-[12px] sm:w-[12px]" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
