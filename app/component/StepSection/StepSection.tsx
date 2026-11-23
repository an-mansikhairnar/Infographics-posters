import React from 'react';
import DimensionsIcon from '@/public/assets/DimensionsIcon.svg';
import LayoutIcon from '@/public/assets/LayoutIcon.svg';
import SlidersIcon from '@/public/assets/SlidersIcon.svg';
import CheckCircleIcon from '@/public/assets/CheckCircleIcon.svg';
import Image from 'next/image';

/* ---------- Content ---------- */
const STEPS = [
  {
    number: '01',
    title: 'Set your dimensions',
    text: 'Select a preset canvas or enter a custom width and height.',
    Icon: DimensionsIcon,
  },
  {
    number: '02',
    title: 'Choose your starting point',
    text: 'Open a template, start from scratch, or describe an idea to AI.',
    Icon: LayoutIcon,
  },
  {
    number: '03',
    title: 'Edit and refine',
    text: 'Add your content. Adjust the text, colors, and layout to fit your story.',
    Icon: SlidersIcon,
  },
  {
    number: '04',
    title: 'Review your infographic',
    text: 'Check the details and give your finished design a final look.',
    Icon: CheckCircleIcon,
  },
];

/* ---------- Section ---------- */
export default function StepsSection() {
  return (
    <section className="w-full bg-[#1A1B1C] px-4 py-16 font-sans sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <header className="w-full text-center">
          <p
            className="inter-text text-[clamp(11px,1.5vw,16px)] font-medium uppercase tracking-wide"
            style={{
              background: 'linear-gradient(90deg, #696BF9 0%, #1AB7F4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              display: 'inline-block',
            }}>
            From information to infographic
          </p>

          <h2 className="mt-3 whitespace-nowrap inter-text text-[clamp(18px,4.2vw,52px)] font-bold leading-tight tracking-tight text-white">
            A clear path from start to finish.
          </h2>
        </header>

        {/* <ol className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-5">
          {STEPS.map(({ number, title, text, Icon }) => (
            <li key={number}>
              <div className="flex items-center justify-between border-b border-[#314056] pb-3">
                <span className="inter-text text-[clamp(22px,2.5vw,32px)] font-medium text-[#637FA7]">{number}</span>

                <Image src={Icon} alt="" aria-hidden="true" width={20} height={20} className="h-5 w-5 shrink-0" />
              </div>

              <h3 className="mt-5 inter-text text-[clamp(17px,1.8vw,22px)] font-semibold leading-snug text-[#F5F8FC]">{title}</h3>

              <p className="mt-2 inter-text max-w-xs text-[clamp(12px,1.1vw,14px)] font-normal leading-relaxed text-[#BFCEE3]">{text}</p>
            </li>
          ))}
        </ol> */}
        <ol className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:mt-10 sm:grid-cols-2 sm:gap-y-8 lg:mt-14 lg:grid-cols-4 lg:gap-x-5">
  {STEPS.map(({ number, title, text, Icon }) => (
    <li key={number} className="min-w-0">
      <div className="flex items-center justify-between border-b border-[#314056] pb-2 sm:pb-3">
        <span className="inter-text text-[clamp(20px,2.5vw,32px)] font-medium text-[#637FA7]">
          {number}
        </span>

        <Image
          src={Icon}
          alt=""
          aria-hidden="true"
          width={20}
          height={20}
          className="h-5 w-5 shrink-0"
        />
      </div>

      <h3 className="mt-3 inter-text text-[clamp(16px,1.8vw,22px)] font-semibold leading-snug text-[#F5F8FC] sm:mt-5">
        {title}
      </h3>

      <p className="mt-1.5 inter-text text-[clamp(12px,1.1vw,14px)] font-normal leading-relaxed text-[#BFCEE3] sm:mt-2">
        {text}
      </p>
    </li>
  ))}
</ol>
      </div>
    </section>
  );
}
