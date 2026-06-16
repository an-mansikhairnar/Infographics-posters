// import Image from 'next/image';
// import Link from 'next/link';
// import { FiSearch } from 'react-icons/fi';

// export default function Navbar() {
//   console.log('🚀 ~ page.tsx:1 ~ Navbar ~ Navbar:', Navbar);
//   return (
//     <nav className='bg-gray-800 h-[62px] w-full flex items-center text-white'>
//       <div className='flex items-center h-full'>
//         <Image src='/logo-infographics.png' alt='Infographics Hub Logo' width={180} height={62} className='h-[62px]' />
//       </div>

//       <div className='flex gap-6 ml-6 text-[15px] font-medium'>
//         <Link href='/' className='hover:text-cyan-400 transition-colors'>
//           Home
//         </Link>

//         <Link href='/submit-infographics' className='hover:text-cyan-400 transition-colors'>
//           Submit Infographics
//         </Link>

//         <Link href='/contact' className='hover:text-cyan-400 transition-colors'>
//           Contact Us
//         </Link>

//         <Link href='/site-map' className='hover:text-cyan-400 transition-colors'>
//           Site Map
//         </Link>
//       </div>

//       <div className='flex justify-items-end ml-auto mr-4'>
//         <button className='bg-cyan-500 text-white hover:bg-cyan-600 rounded-full px-12 py-2 mr-3 text-[14px]'>Design My Infographic</button>

//         <div className='relative'>
//           <FiSearch size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-white-500' />

//           <input
//             type='search'
//             placeholder='Search'
//             className='text-white placeholder:text-gray-400 border border-white-500 rounded-full pl-12 pr-4 py-2 text-[14px] bg-transparent focus:outline-none focus:ring-2 focus:ring-white-500'
//           />
//         </div>
//       </div>
//     </nav>
//   );
// }
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';
import { useSearch } from '@/app/utils/useSearch';
import { useSearchParams } from 'next/navigation';

export default function Navbar() {
  const { query, setQuery, handleSearch, handleKeyDown } = useSearch();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') ?? '';
  return (
    <nav className='bg-gray-800 h-[62px] w-full flex items-center text-white'>
      <div className='flex items-center h-full'>
        <Image src='/logo-infographics.png' alt='Infographics Hub Logo' width={180} height={62} className='h-[62px]' />
      </div>

      <div className='flex gap-6 ml-6 text-[15px] font-medium'>
        <Link href='/' className='hover:text-cyan-400 transition-colors'>
          Home
        </Link>
        <Link href='/submit-infographics' className='hover:text-cyan-400 transition-colors'>
          Submit Infographics
        </Link>
        <Link href='/contact' className='hover:text-cyan-400 transition-colors'>
          Contact Us
        </Link>
        <Link href='/site-map' className='hover:text-cyan-400 transition-colors'>
          Site Map
        </Link>
      </div>

      <div className='flex items-center ml-auto mr-4 gap-3'>
        <button className='bg-cyan-500 text-white hover:bg-cyan-600 rounded-full px-12 py-2 text-[14px]'>Design My Infographic</button>

        {initialSearch && (
          <div className='relative'>
            <FiSearch size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer' onClick={handleSearch} />

            <input
              type='search'
              placeholder='Search'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className='text-white placeholder:text-gray-400 border border-gray-500 rounded-full pl-12 pr-4 py-2 text-[14px] bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-400'
            />
          </div>
        )}
      </div>
    </nav>
  );
}
