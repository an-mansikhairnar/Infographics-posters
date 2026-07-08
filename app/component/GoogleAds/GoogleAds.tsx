// 'use client';

// import { useEffect } from 'react';

// declare global {
//   interface Window {
//     adsbygoogle: unknown[];
//   }
// }

// export default function AdBlock() {
//   useEffect(() => {
//     try {
//       (window.adsbygoogle = window.adsbygoogle || []).push({});
//     } catch (e) {
//       console.log(e);
//     }
//   }, []);

//   return (
//     <ins
//       className="adsbygoogle"
//       style={{ display: 'block', minHeight: 320 }}
//       data-ad-client="ca-pub-0040821316451996"
//       data-ad-slot="9872515270"
//       data-ad-format="auto"
//       data-full-width-responsive="true"
//     />
//   );
// }

// 'use client';

// interface AdBannerProps {
//   adSlot: string;
// }

// export default function GoogleAds({ adSlot }: AdBannerProps) {
//   return (
//     <div className='mb-4 rounded border border-dashed border-gray-300 bg-gray-50 p-3 text-center text-sm text-gray-600'>
//       Ad placeholder
//       <div className='mt-1 text-xs text-gray-400'>Slot: {adSlot}</div>
//     </div>
//   );
// }
