'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type ChangeEvent } from 'react';
import { useSearch } from '@/app/utils/useSearch';
import { categories } from '@/app/constants/categories';
import { FaChevronDown } from 'react-icons/fa';

export default function SearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') ?? 'All';
  const initialSearch = searchParams.get('search') ?? '';
  const { query, setQuery, handleKeyDown } = useSearch(initialSearch, false);
  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const nextCategory = e.target.value;

    if (nextCategory === 'All') {
      params.delete('category');
    } else {
      params.set('category', nextCategory);
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const selectedOrdering = searchParams.get('ordering') ?? 'newest';

  const handleOrderingChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('ordering', e.target.value);

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return (
    <div className='w-full rounded-l border border-gray-200 p-7 mb-3'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {/* Search */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Search:</label>

          <div className='relative'>
            <input
              type='text'
              placeholder='Search shortcuts...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className='h-12 w-full rounded-lg border border-gray-300 bg-white pl-5 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            />
          </div>
        </div>

        {/* Ordering */}

        <div className='relative group'>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Ordering:</label>

          <select
            value={selectedOrdering}
            onChange={handleOrderingChange}
            className='h-12 w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
          >
            <option value='newest'>Newest First</option>
            <option value='oldest'>Oldest First</option>
            <option value='popular'>Most Popular</option>
            <option value='alphabetical'>Alphabetical</option>
          </select>

          <FaChevronDown className='pointer-events-none absolute right-4 top-[52px] -translate-y-1/2 text-xs text-gray-500 group-focus-within:opacity-0' />
        </div>
        {/* Category */}
        <div className='relative group'>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Category:</label>

          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className='h-12 w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
          >
            <option value='All'>All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <FaChevronDown className='pointer-events-none absolute right-4 top-[52px] -translate-y-1/2 text-xs text-gray-500 group-focus-within:opacity-0' />
        </div>
      </div>
    </div>
  );
}
