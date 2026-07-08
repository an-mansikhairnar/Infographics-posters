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
// import GoogleAds from '../GoogleAds/GoogleAds';
export default function InfographicsGrid() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [matchedCategoryId, setMatchedCategoryId] = useState<number>();
  const searchParams = useSearchParams();
  const category = searchParams.get('category')?.toLowerCase() ?? '';
  const search = searchParams.get('search')?.toLowerCase() ?? '';
  const { loading, setLoading } = useLoading();
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
      setLoading(true);

      try {
        const response = await fetch('/api/articles');
        const data = await response.json();

        setArticles(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const { visibleCount } = useInfiniteScroll(filteredArticles.length, `${category}|${search}`);

  if (loading && articles.length === 0) {
    return (
      <section className='flex-1'>
        <div className='flex min-h-[70vh] items-start justify-center pt-8'>
          <LoadingSpinner />
        </div>
      </section>
    );
  }
  return (
    <section className='flex-1 p-5'>
      {search && <SearchFilters />}

      {/* <GoogleAds adSlot='9872515270' /> */}
      <div className={search ? 'grid grid-cols-7 gap-1 xl:w-[90%]' : 'columns-[187px] gap-2 xl:w-[90%]'}>
        {displayArticles.slice(0, visibleCount).map((item) => (
          <div key={item.articleId} className='break-inside-avoid mb-3'>
            <motion.div layout transition={{ duration: 0.5 }}>
              <InfographicCard item={item} />
            </motion.div>
          </div>
        ))}
      </div>

      <LoadingSpinner />

      {search && filteredArticles.length < 6 && (
        <div className='bg-[#333] text-white text-center rounded-md p-4 text-[13px] mx-auto w-[30%] mb-[2%] mt-3'>
          No more infographics to show
        </div>
      )}
    </section>
  );
}
