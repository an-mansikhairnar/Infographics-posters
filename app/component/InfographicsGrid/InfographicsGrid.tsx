// 'use client';

// import { useSearchParams } from 'next/navigation';
// import { infographics } from '../../constants/infographics';
// import InfographicCard from '../InfographicCard/InfographicCard';
// import SearchFilters from '../SearchFilters/SearchFilters';

// export default function InfographicsGrid() {
//   const searchParams = useSearchParams();

//   const category = searchParams.get('category')?.toLowerCase() ?? '';
//   const search = searchParams.get('search')?.toLowerCase() ?? '';

//   const filtered = infographics.filter((item) => {
//     const matchesCategory =
//       !category || item.category.toLowerCase() === category;

//     const matchesSearch =
//       !search || item.title.toLowerCase().includes(search);

//     return matchesCategory && matchesSearch;
//   });

//   return (
//     <section className='flex-1 p-5'>
//       {/* Show only when searched from navbar */}
//       {search && <SearchFilters />}

//       <div className='flex flex-wrap'>
//         {filtered.length > 0 ? (
//           filtered.map((item) => (
//             <div key={item.id} className='mr-3 mb-3'>
//               <InfographicCard item={item} />
//             </div>
//           ))
//         ) : (
//           <p className='text-gray-500'>
//             No results found
//           </p>
//         )}
//       </div>

//       {/* Show message only for search */}
//       {search && filtered.length < 6 && (
//         <div className='bg-[#333] text-white text-center rounded-md p-4 text-[13px] mx-auto w-[30%] mb-[2%]'>
//           No more infographics to show
//         </div>
//       )}
//     </section>
//   );
// }

'use client';

import { useSearchParams } from 'next/navigation';
import InfographicCard from '../InfographicCard/InfographicCard';
import SearchFilters from '../SearchFilters/SearchFilters';
import { useEffect, useState } from 'react';
import { Article } from '@/app/interfaces/infographics';
import { LoadingSpinner, useLoading } from '@/app/context/loader';
import { getCategories } from '@/app/lib/categories';
import { motion } from 'framer-motion';
import { useInfiniteScroll } from '@/app/hooks/infinite-scroll';
export default function InfographicsGrid() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [matchedCategoryId, setMatchedCategoryId] = useState<number>();
  const searchParams = useSearchParams();

  const category = searchParams.get('category')?.toLowerCase() ?? '';
  const search = searchParams.get('search')?.toLowerCase() ?? '';

  const filteredArticles = articles.filter((item) => {
    const matchesCategory = !category || item.catId === matchedCategoryId;
    const matchesSearch = !search || item.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const ordering = searchParams.get('ordering') ?? 'newest';

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (ordering) {
      case 'newest':
        return new Date(b.created).getTime() - new Date(a.created).getTime();

      case 'alphabetical':
        return a.title.localeCompare(b.title);

      case 'oldest':
        return new Date(a.created).getTime() - new Date(b.created).getTime();

      case 'popular':
      default:
        // HOT cards first
        const aHot = a.hits > 2000;
        const bHot = b.hits > 2000;

        // HOT cards first
        if (aHot !== bHot) {
          return Number(bHot) - Number(aHot);
        }

        return 0;
    }
  });

  const displayArticles = search ? sortedArticles : filteredArticles;

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categories = await getCategories();
        const matched = categories.find((item) => item.title.toLowerCase() === category);
        setMatchedCategoryId(matched?.catId);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategory();
  }, [category]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchArticles();
  }, []);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollTop = window.scrollY;
  //     const windowHeight = window.innerHeight;
  //     const documentHeight = document.documentElement.scrollHeight;

  //     if (scrollTop + windowHeight >= documentHeight - 200 && !loading && visibleCount < filteredArticles.length) {
  //       setLoading(true);
  //       setTimeout(() => {
  //         setVisibleCount((prev) => Math.min(prev + 20, articles.length));
  //         setLoading(false);
  //       }, 500);
  //     }
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, [articles.length, visibleCount, filteredArticles.length, loading, setLoading]);
  const { visibleCount } = useInfiniteScroll(filteredArticles.length, `${category}|${search}`);

  return (
    <section className='flex-1 p-5'>
      {search && <SearchFilters />}

      <div className={search ? 'grid grid-cols-7 gap-1 xl:w-[90%]' : 'columns-[187px] gap-2 xl:w-[90%]'}>
        {displayArticles.slice(0, visibleCount).map((item) => (
          <div key={item.articleId} className='break-inside-avoid mb-3'>
            <motion.div layout transition={{ duration: 0.5 }}>
              <InfographicCard item={item} />
            </motion.div>
          </div>
        ))}
      </div>

      {/* <div className={ordering === 'popular' ? 'grid grid-cols-7 gap-1 xl:w-[90%]' : 'columns-[187px] gap-2 xl:w-[90%]'}>
        {sortedArticles.slice(0, visibleCount).map((item) => (
          <div key={item.articleId} className={ordering === 'popular' ? '' : 'break-inside-avoid mb-3'}>
            <motion.div layout transition={{ duration: 0.5 }}>
              <InfographicCard item={item} />
            </motion.div>
          </div>
        ))}
      </div> */}

      {/* <div className="grid grid-cols-7 gap-2 xl:w-[90%]">
  {sortedArticles.slice(0, visibleCount).map((item) => (
    <motion.div key={item.articleId} layout transition={{ duration: 0.5 }}>
      <InfographicCard item={item} />
    </motion.div>
  ))}
</div> */}

      <LoadingSpinner />

      {search && filteredArticles.length < 6 && (
        <div className='bg-[#333] text-white text-center rounded-md p-4 text-[13px] mx-auto w-[30%] mb-[2%] mt-3'>
          No more infographics to show
        </div>
      )}
    </section>
  );
}

// export default function InfographicsGrid() {
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [visibleCount, setVisibleCount] = useState(20);
//   const [matchedCategoryId, setMatchedCategoryId] = useState<number>();
//   const searchParams = useSearchParams();

//   const category = searchParams.get('category')?.toLowerCase() ?? '';
//   const search = searchParams.get('search')?.toLowerCase() ?? '';
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch('/api/infographics');
//         const data: Category[] = await response.json();
//         // Find the category whose title matches the URL param
//         const matched = data.find((item) => item.title.toLowerCase() === category);
//         setMatchedCategoryId(matched?.catId);
//       } catch (error) {
//         console.error('Failed to fetch categories:', error);
//       }
//     };
//     fetchCategories();
//   }, [category]);

//   const filteredArticles = articles.filter((item) => {
//     // If no category in URL, show all. Otherwise match by id.
//     const matchesCategory = !category || item.catId === matchedCategoryId;

//     const matchesSearch = !search || item.title.toLowerCase().includes(search.toLowerCase());

//     return matchesCategory && matchesSearch;
//   });
//   useEffect(() => {
//     const fetchArticles = async () => {
//       try {
//         const response = await fetch('/api/articles');
//         const data = await response.json();
//         setArticles(data);
//         console.log('data', data);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchArticles();
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop = window.scrollY;
//       const windowHeight = window.innerHeight;
//       const documentHeight = document.documentElement.scrollHeight;

//       if (scrollTop + windowHeight >= documentHeight - 200) {
//         setVisibleCount((prev) => Math.min(prev + 20, articles.length));
//       }
//     };

//     window.addEventListener('scroll', handleScroll);

//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [articles.length]);

//   return (
//     <section className='flex-1 p-5'>
//       {/* Show only when searched from navbar */}
//       {search && <SearchFilters />}

//       {/* <div className='flex flex-wrap'>
//         {articles.length > 0 ? (
//           filteredArticles.slice(0, visibleCount).map((item) => (
//             <div key={item.articleId} className='mr-3 mb-3'>
//               <InfographicCard item={item} />
//             </div>
//           ))
//         ) : (
//           <p className='text-gray-500'>No results found</p>
//         )}
//       </div> */}

//       <div className='columns-[187px] gap-2 xl:w-[90%]'>
//         {filteredArticles.slice(0, visibleCount).map((item) => (
//           <div key={item.articleId} className='break-inside-avoid mb-3'>
//             <InfographicCard item={item} />
//           </div>
//         ))}
//       </div>
//       {/* Show message only for search */}
//       {search && filteredArticles.length < 6 && (
//         <div className='bg-[#333] text-white text-center rounded-md p-4 text-[13px] mx-auto w-[30%] mb-[2%]'>
//           No more infographics to show
//         </div>
//       )}
//     </section>
//   );
// }
