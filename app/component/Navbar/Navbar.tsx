'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';
import { useSearch } from '@/app/utils/useSearch';
import { useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { query, setQuery, handleSearch, handleKeyDown } = useSearch('', true);
  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const pathname = usePathname();
  const category = searchParams.get('category');
  const isInfographicPage = pathname.startsWith('/infographics/');

  const navLinkClass = (path: string) => {
    let isActive = pathname === path;

    //Keep activ
    if (path === '/' && isInfographicPage) {
      isActive = true;
    }
    // When a category is selected from the Site Map,
    // keep Site Map active instead of Home.
    if (path === '/site-map' && category) {
      isActive = true;
    }

    // Don't highlight Home when a category query is present.
    if (path === '/' && category) {
      isActive = false;
    }

    return `h-full flex items-center px-4 border-b-4 transition-colors ${
      isActive ? 'border-cyan-500 text-cyan-500' : 'border-transparent hover:text-cyan-400'
    }`;
  };

  return (
    <nav className='bg-gray-800 h-[62px] w-full flex items-center text-white'>
      <div className='flex items-center h-full'>
        <Image src='/logo-infographics.png' alt='Infographics Hub Logo' width={180} height={62} className='h-[62px]' />
      </div>

      <div className='flex text-[15px] font-medium h-full'>
        <Link href='/' className={navLinkClass('/')}>
          Home
        </Link>

        <Link href='/submit-infographics' className={navLinkClass('/submit-infographics')}>
          Submit-Infographics
        </Link>

        <Link href='/contact' className={navLinkClass('/contact')}>
          Contact Us
        </Link>

        <Link href='/site-map' className={navLinkClass('/site-map')}>
          Site Map
        </Link>
      </div>

      <div className='flex items-center ml-auto mr-4 gap-3'>
        <Link className='bg-cyan-500 text-white hover:bg-cyan-600 rounded-full px-12 py-2 text-[14px]' href='/design-my-infographic'>
          Design My Infographic
        </Link>
        {!search && (
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
