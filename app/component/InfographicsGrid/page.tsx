// import { infographics } from '../../constants/infographics';
// import InfographicCard from '../InfographicCard/page';

// export default function InfographicsGrid() {
//   return (
//     <section className='flex-1 p-5'>
//       <div className='flex flex-wrap'>
//         {infographics.map((item) => (
//           <div key={item.id} className='mr-3 mb-3'>
//             <InfographicCard item={item} />
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
'use client';
import { useSearchParams } from 'next/navigation';
import { infographics } from '../../constants/infographics';
import InfographicCard from '../InfographicCard/page';
import SearchFilters from '../SearchFilters/page';

export default function InfographicsGrid() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search')?.toLowerCase() ?? '';

  const filtered = search ? infographics.filter((item) => item.title.toLowerCase().includes(search)) : infographics;

  return (
    <section className='flex-1 p-5'>
      {search && (
        <SearchFilters />
        // <p className='text-sm text-gray-500 mb-3'>
        //   {filtered.length} result{filtered.length !== 1 ? 's' : ''} for
        // </p>
      )}
      <div className='flex flex-wrap'>
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div key={item.id} className='mr-3 mb-3'>
              <InfographicCard item={item} />
            </div>
          ))
        ) : (
          <p className='text-gray-500'>No results found for {search} </p>
        )}
      </div>

      {filtered.length < 6 && searchParams.get('search') && (
        <div className='bg-[#333] text-white text-center rounded-md p-4 text-[13px] mx-auto w-[30%] mb-[2%]'>
          No more infographics to show
        </div>
      )}
    </section>
  );
}
