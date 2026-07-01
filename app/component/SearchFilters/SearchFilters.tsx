// 'use client';

// import { useSearchParams } from 'next/navigation';
// import { useSearch } from '@/app/utils/useSearch';
// import { FiX } from 'react-icons/fi';
// import { categories } from '@/app/constants/categories';

// export default function SearchFilters() {
//   const searchParams = useSearchParams();
//   const initialSearch = searchParams.get('search') ?? '';
//   const { query, setQuery, handleKeyDown, clearSearch } = useSearch(initialSearch);

//   return (
//     <div className='w-full rounded-l border border-gray-200 p-7 mb-3'>
//       <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
//         {/* Search */}
//         <div>
//           <label className='mb-2 block text-sm font-medium text-gray-700'>Search:</label>

//           <div className='relative'>
//             <input
//               type='text'
//               placeholder='Search shortcuts...'
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               onKeyDown={handleKeyDown}
//               className='h-12 w-full rounded-lg border border-gray-300 bg-white pl-5 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
//             />
//             {query && (
//               <button
//                 onClick={clearSearch}
//                 className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition'
//                 title='Clear search'
//               >
//                 <FiX size={18} />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Ordering */}
//         <div>
//           <label className='mb-2 block text-sm font-medium text-gray-700'>Ordering:</label>

//           <select className='h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'>
//             <option>Newest First</option>
//             <option>Oldest First</option>
//             <option>A-Z</option>
//             <option>Z-A</option>
//           </select>
//         </div>

//         {/* Category */}
//         <div>
//           <label className='mb-2 block text-sm font-medium text-gray-700'>Category:</label>

//           <select className='h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'>
//             {categories.map((category) => (
//               <option key={category} value={category}>
//                 {category}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type ChangeEvent } from 'react';
import { useSearch } from '@/app/utils/useSearch';
import { categories } from '@/app/constants/categories';

export default function SearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') ?? 'All';
  const initialSearch = searchParams.get('search') ?? '';
  const { query, setQuery, handleKeyDown } = useSearch(initialSearch);

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    console.log('🚀 ~ SearchFilters.tsx:18 ~ handleCategoryChange ~ params:', params);
    const nextCategory = e.target.value;
    console.log('🚀 ~ SearchFilters.tsx:19 ~ handleCategoryChange ~ nextCategory:', nextCategory);

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
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Ordering:</label>

          {/* <select className='h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'>
            <option>Newest First</option>
            <option>Oldest First</option>
            <option>Most Popular</option>
            <option>Alphabetical</option>
          </select> */}

          <select className='h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ' value={selectedOrdering} onChange={handleOrderingChange}>
            <option value='newest'>Newest First</option>
            <option value='oldest'>Oldest First</option>
            <option value='popular'>Most Popular</option>
            <option value='alphabetical'>Alphabetical</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Category:</label>

          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className='h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
          >
            <option value='All'>All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
