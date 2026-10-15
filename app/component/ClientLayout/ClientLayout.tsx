'use client';

import { Suspense, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '../Navbar/Navbar';
import CategoriesSidebar from '../CategoriesSidebar/CategoriesSidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname?.startsWith('/infographic-maker');

  useEffect(() => {
    if (window.location.hash !== '#_=_') return;
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${window.location.search}`
    );
  }, []);

  return (
    <Suspense fallback={null}>
      <Navbar />

      <div className='flex'>
        {!hideSidebar && <CategoriesSidebar />}
        <div className='flex-1'>{children}</div>
      </div>
    </Suspense>
  );
}
