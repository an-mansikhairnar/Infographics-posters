'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useSearch } from '@/app/utils/useSearch';
import { usePathname, useSearchParams } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import type { ReactNode } from 'react';
import UserAvatar from '@/app/component/UserAvatar/UserAvatar';


export default function Navbar() {
  const { query, setQuery, handleSearch, handleKeyDown } = useSearch('', true);
  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const pathname = usePathname();
  const category = searchParams.get('category');
  const isInfographicPage = pathname.startsWith('/infographics/');
  const { data: session, status } = useSession();
  const user = session?.user;
  const accountEmail = user?.email;
  const accountTitle =
    accountEmail || (user?.instagramUsername ? `@${user.instagramUsername}` : user?.name || 'My account');
  const accountAriaLabel = accountEmail ? `My account, ${accountEmail}` : 'My account';

  let accountControl: ReactNode;
  if (status === 'loading') {
    accountControl = <div className="h-9 w-20 animate-pulse rounded-full bg-white/10" />;
  } else if (user) {
    accountControl = (
      <>
        <Link
          href="/account"
          className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          title={accountTitle}
          aria-label={accountAriaLabel}
        >
          <UserAvatar
            name={user.name}
            image={user.image}
            fallbackName={user.instagramUsername || user.email?.split('@')[0]}
          />
        </Link>

        <button
          type="button"
          onClick={() => void signOut({ callbackUrl: '/' })}
          className="rounded-full border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
        >
          Sign out
        </button>
      </>
    );
  } else {
    accountControl = (
      <Link
        href="/login"
        className="rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold hover:bg-cyan-500"
      >
        Sign in
      </Link>
    );
  }

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

      <div className='ml-auto mr-3 flex shrink-0 items-center gap-2'>
        <div className='flex items-center gap-2'>
          <Link
            className='inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-full bg-cyan-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-cyan-500 xl:px-4 xl:text-sm'
            href='/infographic-maker'
            title='Infographic Maker'
          >
            <span>Create Infographic</span>
          </Link>
          {/* <Link
            className='inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-full border border-cyan-400/60 px-3 text-xs font-semibold text-cyan-100 transition-colors hover:border-cyan-300 hover:bg-white/10 xl:px-4 xl:text-sm'
            href='/ai-infographic-generator'
            title='AI Infographic Generator'
          >
            <Sparkles size={15} aria-hidden='true' />
            <span>AI Studio</span>
          </Link> */}

          {accountControl}
        </div>

        <div className='mx-1 h-7 border-l border-white/15' aria-hidden='true' />
           {/* <Link className='bg-cyan-500 text-white hover:bg-cyan-600 rounded-full px-12 py-2 text-[14px]' href='/design-my-infographic'>
          Design My Infographic
        </Link> */}

        {!search && (
          <div className='relative ml-1'>
            <button
              type='button'
              aria-label='Search'
              onClick={handleSearch}
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 transition-colors hover:text-white'
            >
              <Search size={16} aria-hidden='true' />
            </button>

            <input
              type='search'
              placeholder='Search'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className='h-9 w-32 rounded-full border border-white/20 bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-gray-400 transition-colors focus:border-cyan-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 xl:w-36'
            />
          </div>
        )}
      </div>
    </nav>
  );
}
