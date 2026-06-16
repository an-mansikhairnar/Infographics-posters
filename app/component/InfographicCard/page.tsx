// // 'use client';
// // import Image from 'next/image';

// // interface InfographicItem {
// //   id: number;
// //   image: string;
// //   title: string;
// //   category: string;
// //   description: string;
// //   hits: number;
// // }

// // interface InfographicCardProps {
// //   item: InfographicItem;
// // }

// // import Link from 'next/link';
// // import { useState } from 'react';
// // export default function InfographicCard({ item }: InfographicCardProps) {
// //   const [showMore, setShowMore] = useState(false);

// //   return (
// //     <div className='w-[187px] bg-white border border-gray-300 rounded-sm overflow-hidden'>
// //       <div className='w-full h-[287px] overflow-hidden p-2 flex items-start justify-center'>
// //         <Image src={item.image} alt={item.title} width={300} height={500} className='max-w-full h-auto' />
// //       </div>

// //       {/* Content */}
// //       <div className='px-3 pb-3'>
// //         <h3 className='text-[18px] font-bold leading-7 text-black mb-4 mt-2'>{item.title}</h3>

// //         <p className='text-[11px] text-gray-500 mb-4'>Category: {item.category}</p>

// //         <p className='text-[12px] text-gray-800 line-clamp-3'>{item.description}</p>
// //       </div>

// //       {/* Footer */}
// //       <div className='flex items-center justify-between border-t border-gray-300 px-3 py-2'>
// //         <span className='text-[12px] text-gray-700'>Hits : {item.hits}</span>

// //         {/* <button className='text-[11px] border border-gray-300 text-gray-600 px-3 py-1 rounded hover:bg-gray-100'>More</button> */}
// //         <Link
// //           href={`/pages/infographics/${item.id}`}
// //           onClick={() => setShowMore(true)}
// //           className='text-[11px] border border-gray-300 text-gray-600 px-3 py-1 rounded hover:bg-gray-100'
// //         >
// //           More
// //         </Link>
// //       </div>
// //     </div>
// //   );
// // }

'use client';
import { InfographicCardProps } from '@/app/interfaces/infographics';
import Image from 'next/image';
import Link from 'next/link';

export default function InfographicCard({ item }: InfographicCardProps) {
  return (
    <div className='w-[187px] bg-white border border-gray-300 rounded-sm overflow-hidden'>
      <div className='w-full h-[287px] overflow-hidden p-2 flex items-start justify-center'>
        <Image src={item.image} alt={item.title} width={300} height={500} className='max-w-full h-auto' />
      </div>

      <div className='px-3 pb-3'>
        <h3 className='text-[18px] font-bold leading-7 text-black mb-4 mt-2 hover:text-cyan-500 cursor-pointer'>
           {item.hits > 2000 && <span className='text-[10px] bg-red-800 text-white px-3 py-1 rounded mr-2'>HOT</span>}
          {item.title}</h3>
        <p className='text-[11px] text-gray-500 mb-4'>Category: {item.category}</p>
        <p className='text-[12px] text-gray-800 line-clamp-3'>{item.description}</p>
      </div>

      <div className='flex items-center justify-between border-t border-gray-300 px-3 py-2'>
        <span className='text-[12px] text-gray-700'>Hits : {item.hits}</span>
        <Link
          href={`/pages/infographics/${item.id}`}
          className='text-[11px] border border-gray-300 text-gray-600 px-3 py-1 rounded hover:bg-cyan-500 hover:text-white'
        >
          More
        </Link>
      </div>
    </div>
  );
}
