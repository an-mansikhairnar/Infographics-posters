'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/app/interfaces/category';
import { getCategories } from '@/app/lib/categories';

export default function CategoriesSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const activeCategory = searchParams.get('category');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.filter((item) => item.status === 1));
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category: string) => {
    router.push(`/?category=${encodeURIComponent(category)}`);
  };
  return (
    <aside className='w-[180px] border-b border-l bg-white'>
      <div className='flex items-center gap-2 bg-gray-100 border-b border-gray-300 px-4 py-2 text-gray-800 uppercase text-sm font-medium'>
        <span className='w-2 h-2 bg-black'></span>
        <span className='border-b-black'>Categories</span>
      </div>

      <div className='flex flex-col'>
        {categories.map((category) => {
          const isActive = activeCategory === category.title;

          return (
            <button
              key={category.catId}
              onClick={() => handleCategoryClick(category.title)}
              className={`w-[177px] h-[30px] flex items-center text-left px-4 border-b border-gray-200 transition-colors text-[12px] border-l-2 border-r-2 font-medium text-gray-700 hover:text-cyan-500 hover:border-l-cyan-500 hover:border-r-cyan-500 ${
                isActive ? 'text-cyan-500 border-l-cyan-500 border-r-cyan-500' : 'text-gray-500 border-l-transparent border-r-transparent'
              }`}
            >
              {category.title}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
