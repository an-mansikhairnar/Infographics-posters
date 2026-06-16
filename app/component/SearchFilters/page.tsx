'use client';

import { useSearchParams } from 'next/navigation';
import { useSearch } from '@/app/utils/useSearch';
import { FiX } from 'react-icons/fi';

export default function SearchFilters() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') ?? '';
  const { query, setQuery, handleKeyDown, clearSearch } = useSearch(initialSearch);

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
            {query && (
              <button
                onClick={clearSearch}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition'
                title='Clear search'
              >
                <FiX size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Ordering */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Ordering:</label>

          <select className='h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'>
            <option>Newest First</option>
            <option>Oldest First</option>
            <option>A-Z</option>
            <option>Z-A</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Category:</label>

          <select className='h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'>
            <option>All</option>
            <option>React</option>
            <option>Next.js</option>
            <option>Tailwind CSS</option>
            <option>JavaScript</option>
          </select>
        </div>
      </div>
    </div>
  );
}
