// 'use client';

// import Image from 'next/image';
// import Link from 'next/link';
// import { Search } from 'lucide-react';
// import { useSearch } from '@/app/utils/useSearch';
// import { usePathname, useSearchParams } from 'next/navigation';
// import { signOut, useSession } from 'next-auth/react';
// import type { ReactNode } from 'react';
// import UserAvatar from '@/app/component/UserAvatar/UserAvatar';


// export default function Navbar() {
//   const { query, setQuery, handleSearch, handleKeyDown } = useSearch('', true);
//   const searchParams = useSearchParams();
//   const search = searchParams.get('search');
//   const pathname = usePathname();
//   const category = searchParams.get('category');
//   const isInfographicPage = pathname.startsWith('/infographics/');
//   const { data: session, status } = useSession();
//   const user = session?.user;
//   const accountEmail = user?.email;
//   const accountTitle =
//     accountEmail || (user?.instagramUsername ? `@${user.instagramUsername}` : user?.name || 'My account');
//   const accountAriaLabel = accountEmail ? `My account, ${accountEmail}` : 'My account';

//   let accountControl: ReactNode;
//   if (status === 'loading') {
//     accountControl = <div className="h-9 w-20 animate-pulse rounded-full bg-white/10" />;
//   } else if (user) {
//     accountControl = (
//       <>
//         <Link
//           href="/account"
//           className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
//           title={accountTitle}
//           aria-label={accountAriaLabel}
//         >
//           <UserAvatar
//             name={user.name}
//             image={user.image}
//             fallbackName={user.instagramUsername || user.email?.split('@')[0]}
//           />
//         </Link>

//         <button
//           type="button"
//           onClick={() => void signOut({ callbackUrl: '/' })}
//           className="rounded-full border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
//         >
//           Sign out
//         </button>
//       </>
//     );
//   } else {
//     accountControl = (
//       <Link
//         href="/login"
//         className="rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold hover:bg-cyan-500"
//       >
//         Sign in
//       </Link>
//     );
//   }

//   const navLinkClass = (path: string) => {
//     let isActive = pathname === path;

//     //Keep activ
//     if (path === '/' && isInfographicPage) {
//       isActive = true;
//     }
//     // When a category is selected from the Site Map,
//     // keep Site Map active instead of Home.
//     if (path === '/site-map' && category) {
//       isActive = true;
//     }

//     // Don't highlight Home when a category query is present.
//     if (path === '/' && category) {
//       isActive = false;
//     }

//     return `h-full flex items-center px-4 border-b-4 transition-colors ${
//       isActive ? 'border-cyan-500 text-cyan-500' : 'border-transparent hover:text-cyan-400'
//     }`;
//   };

//   return (
//     <nav className='bg-gray-800 h-[62px] w-full flex items-center text-white'>
//       <div className='flex items-center h-full'>
//         <Image src='/logo-infographics.png' alt='Infographics Hub Logo' width={180} height={62} className='h-[62px]' />
//       </div>

//       <div className='flex text-[15px] font-medium h-full'>
//         <Link href='/' className={navLinkClass('/')}>
//           Home
//         </Link>

//         <Link href='/submit-infographics' className={navLinkClass('/submit-infographics')}>
//           Submit-Infographics
//         </Link>

//         <Link href='/contact' className={navLinkClass('/contact')}>
//           Contact Us
//         </Link>

//         <Link href='/site-map' className={navLinkClass('/site-map')}>
//           Site Map
//         </Link>
//       </div>

//       <div className='ml-auto mr-3 flex shrink-0 items-center gap-2'>
//         <div className='flex items-center gap-2'>
//           <Link
//             className='inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-full bg-cyan-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-cyan-500 xl:px-4 xl:text-sm'
//             href='/infographic-maker'
//             title='Infographic Maker'
//           >
//             <span>Create Infographic</span>
//           </Link>


//           {accountControl}
//         </div>

//         <div className='mx-1 h-7 border-l border-white/15' aria-hidden='true' />
//            {/* <Link className='bg-cyan-500 text-white hover:bg-cyan-600 rounded-full px-12 py-2 text-[14px]' href='/design-my-infographic'>
//           Design My Infographic
//         </Link> */}

//         {!search && (
//           <div className='relative ml-1'>
//             <button
//               type='button'
//               aria-label='Search'
//               onClick={handleSearch}
//               className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 transition-colors hover:text-white'
//             >
//               <Search size={16} aria-hidden='true' />
//             </button>

//             <input
//               type='search'
//               placeholder='Search'
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               onKeyDown={handleKeyDown}
//               className='h-9 w-32 rounded-full border border-white/20 bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-gray-400 transition-colors focus:border-cyan-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 xl:w-36'
//             />
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { useSearch } from '@/app/utils/useSearch';
import { usePathname, useSearchParams } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState, type ReactNode } from 'react';
import UserAvatar from '@/app/component/UserAvatar/UserAvatar';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { query, setQuery, handleSearch, handleKeyDown } = useSearch('', true);
  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const pathname = usePathname();
  const category = searchParams.get('category');

  const isInfographicPage = pathname.startsWith('/infographics/');
  const { data: session, status } = useSession();
// Hide navbar on infographic editor pages
if (pathname.startsWith('/infographic-maker/editor/')) {
  return null;
}
  const currentUrl = searchParams.size
  ? `${pathname}?${searchParams.toString()}`
  : pathname;
  const user = session?.user;
  const accountEmail = user?.email;

  const accountTitle =
    accountEmail ||
    (user?.instagramUsername
      ? `@${user.instagramUsername}`
      : user?.name || 'My account');

  const accountAriaLabel = accountEmail
    ? `My account, ${accountEmail}`
    : 'My account';

  const closeMenu = () => setIsMenuOpen(false);

  let accountControl: ReactNode;

  if (status === 'loading') {
    accountControl = (
      <div className="h-9 w-20 animate-pulse rounded-full bg-white/10" />
    );
  } else if (user) {
    accountControl = (
      <>
        <Link
          href="/account"
          onClick={closeMenu}
          className="shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
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
          onClick={() => {
            closeMenu();
            void signOut({ callbackUrl: '/' });
          }}
          className="shrink-0 whitespace-nowrap rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
        >
          Sign out
        </button>
      </>
    );
  } else {
    accountControl = (
      // <Link
      //   href="/login"
      //   onClick={closeMenu}
      //   className="shrink-0 whitespace-nowrap rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold hover:bg-cyan-500"
      // >
      //   Sign in
      // </Link>
      <Link
  href={`/login?callbackUrl=${encodeURIComponent(currentUrl)}`}
  onClick={closeMenu}
 className="shrink-0 whitespace-nowrap rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold hover:bg-cyan-500"
>
  Sign in
</Link>
    );
  }

  const navLinkClass = (path: string) => {
    let isActive = pathname === path;

    if (path === '/' && isInfographicPage) {
      isActive = true;
    }

    if (path === '/site-map' && category) {
      isActive = true;
    }

    if (path === '/' && category) {
      isActive = false;
    }

    return `flex items-center whitespace-nowrap px-4 py-3 xl:h-full xl:py-0 border-l-4 xl:border-l-0 xl:border-b-4 transition-colors ${
      isActive
        ? 'border-cyan-500 text-cyan-400 bg-white/5 xl:bg-transparent'
        : 'border-transparent hover:text-cyan-400 hover:bg-white/5 xl:hover:bg-transparent'
    }`;
  };

  const navigationLinks = (
    <>
      <Link href="/" onClick={closeMenu} className={navLinkClass('/')}>
        Home
      </Link>

      <Link
        href="/submit-infographics"
        onClick={closeMenu}
        className={navLinkClass('/submit-infographics')}
      >
        Submit Infographics
      </Link>

      <Link
        href="/contact"
        onClick={closeMenu}
        className={navLinkClass('/contact')}
      >
        Contact Us
      </Link>

      <Link
        href="/site-map"
        onClick={closeMenu}
        className={navLinkClass('/site-map')}
      >
        Site Map
      </Link>
    </>
  );

  const searchControl = !search && (
    <div className="relative w-full sm:w-auto">
      <button
        type="button"
        aria-label="Search"
        onClick={handleSearch}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
      >
        <Search size={16} aria-hidden="true" />
      </button>

      <input
        type="search"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          handleKeyDown(e);
          if (e.key === 'Enter') closeMenu();
        }}
        className="h-10 w-full sm:w-36 rounded-full border border-white/20 bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
      />
    </div>
  );

  return (
    <nav className="relative z-50 w-full bg-gray-800 text-white">
      {/* Main Navbar */}
      <div className="flex h-[62px] items-center justify-between px-3 sm:px-5">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/logo-infographics.png"
            alt="Infographics Hub Logo"
            width={180}
            height={62}
            priority
            className="h-[55px] w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation (xl and up) */}
        <div className="hidden h-full items-center xl:flex">
          <div className="flex h-full text-[15px] font-medium">
            {navigationLinks}
          </div>
        </div>

        {/* Desktop Right Controls (xl and up) */}
        <div className="ml-auto hidden items-center gap-3 xl:flex">
          <Link
            href="/infographic-maker"
            title="Infographic Maker"
            className="inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-full bg-cyan-600 px-4 text-sm font-semibold hover:bg-cyan-500"
          >
            Create Infographic
          </Link>

          {accountControl}

          <div className="h-7 border-l border-white/15" />

          {searchControl}
        </div>

        {/* Hamburger (below xl) */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 transition-colors hover:bg-white/10 xl:hidden"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile / Tablet / Small-laptop Dropdown Menu (below xl) */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="absolute left-0 top-full w-full border-t border-white/10 bg-gray-800 shadow-xl xl:hidden"
        >
          <div className="flex max-h-[calc(100dvh-62px)] flex-col overflow-y-auto px-4 py-4">
            {/* Navigation Links */}
            <div className="flex flex-col border-b border-white/10 pb-3">
              {navigationLinks}
            </div>

            {/* Create Infographic */}
            <div className="border-b border-white/10 py-4">
              <Link
                href="/infographic-maker"
                onClick={closeMenu}
                className="flex w-full items-center justify-center rounded-full bg-cyan-600 px-4 py-3 text-sm font-semibold transition-colors hover:bg-cyan-500"
              >
                Create Infographic
              </Link>
            </div>

            {/* Account Controls */}
            <div className="flex items-center gap-4 border-b border-white/10 py-4">
              {accountControl}
            </div>

            {/* Search */}
            {!search && <div className="py-4">{searchControl}</div>}
          </div>
        </div>
      )}
    </nav>
  );
}