'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar/Navbar';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return <Navbar>{children}</Navbar>;
}