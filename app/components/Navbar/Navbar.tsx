'use client';
import { useState } from 'react';
import { BiUserCircle, BiLogOut } from 'react-icons/bi';
import { useRouter, usePathname } from 'next/navigation';

const tabs = [
  { label: 'Article', path: '/articles' },
  { label: 'Category', path: '/category' },
  { label: 'Design Infographics', path: '/design-infographics' },
  { label: 'Client Infographics', path: '/client-infographics' },
];

export default function Navbar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);


  // useEffect(() => {
  const handleLogout = () => {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('auth:updated'));

      // await fetch('/api/auth/logout', {
      //   method: 'POST',
      // });

      router.push('/login');
    }

    // handleLogout();
  // }, [router]);

  return (
    <div className='h-screen flex flex-col'>
      <header className='h-16 bg-[#3f51b5] flex items-center justify-between shadow-md border-b border-white'>
        <div className='flex items-center'>
          <h1
            className={`text-white font-bold text-2xl whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out mr-6
              ${sidebarOpen ? 'opacity-100 max-w-xs ml-2' : 'opacity-0 max-w-0 ml-0'}`}
          >
            Infographics-Poster
          </h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className='text-white text-3xl ml-3'>
            ☰
          </button>
        </div>

        <div className='flex items-end text-white bg-[#3f51b5]'>
          <BiUserCircle className='mr-3' size={40} />
          <BiLogOut className='mr-3' size={40} onClick={handleLogout} />
        </div>
      </header>
      <div className='flex flex-1 overflow-hidden'>
        <aside
          className={`bg-[#3f51b5] transition-all duration-300 ease-in-out overflow-hidden
            ${sidebarOpen ? 'w-64' : 'w-0'}`}
        >
          <div className='w-64 min-h-screen bg-[#3f51b5] p-4'>
            <div className='flex flex-col gap-6'>
              {tabs.map((tab) => (
                <button
                  key={tab.path}
                  onClick={() => router.push(tab.path)}
                  className={`w-full rounded-xl border py-4 ${pathname === tab.path ? 'bg-white text-[#3f51b5]' : 'text-white'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </aside>
        <main className='flex-1 overflow-auto bg-gray-100 p-5'>{children}</main>
        {/* <main className='flex-1 overflow-auto transition-all duration-300 ease-in-out bg-gray-100 p-5'>{children ?? <ArticlePage />}</main> */}
      </div>
    </div>
  );
}
