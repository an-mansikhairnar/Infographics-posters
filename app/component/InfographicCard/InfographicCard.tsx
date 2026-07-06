'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { InfographicCardProps } from '@/app/interfaces/infographics';
import { Category } from '@/app/interfaces/category';
import { getCategories } from '@/app/lib/categories';

export default function InfographicCard({ item }: InfographicCardProps) {
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleMoreClick = async () => {
    setLoading(true);

    try {
      await fetch(`/api/articles/${item.articleId}`, { method: 'POST' });
    } catch (error) {
      console.error('Failed to update hits:', error);
    }

    router.push(`/infographics/${item.alias}.html/${item.articleId}`);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();

        const matchedCategory = response.find((category: Category) => category.catId === item.catId);

        console.log(matchedCategory?.title);
        setCategoryName(matchedCategory?.title || '');
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const imageUrl =
    item.imgPrefix && item.thumbImageUrl ? `${item.imgPrefix.replace(/\/$/, '')}/${item.thumbImageUrl.replace(/^\//, '')}` : null;
  return (
    <>
      {loading && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-white/80'>
          <div className='h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent' />
        </div>
      )}

      <div className='w-[187px] sm:w-[200px] md:w-[220px] lg:w-[200px] bg-white border border-gray-300 rounded-sm overflow-hidden'>
        <div className='w-full overflow-hidden flex justify-center p-2'>
          {imageUrl ? (
            <Image src={imageUrl} alt={item.title} width={300} height={500} className='max-w-full h-auto object-contain max-h-[287px]' />
          ) : (
            <div className='w-[300px] h-[287px] bg-gray-100 flex items-center justify-center text-gray-400 text-xs'>No image available</div>
          )}
        </div>

        <div className='px-3 pb-3'>
          {item.hits > 2000 && (
            <span className='bg-red-800 text-white font-medium text-[10px] px-3 mr-2 rounded float-left mt-1.5'>HOT</span>
          )}
          <h5 className='text-[18px] font-bold leading-tight hover:text-cyan-600'>{item.title}</h5>
        </div>

        <div className='px-3 pb-3 text-gray-500'>
          <h6 className='text-[10px] '>Category: {categoryName}</h6>
        </div>

        <div className='px-3 pb-3'>
          <h3 className='text-[12px] leading-[20px] line-clamp-3 '>{item.introDescription}</h3>
        </div>

        <div className='flex items-center justify-between border-t border-gray-300 bg-gray-50 px-3 py-2'>
          <span className='text-[12px] text-gray-700'>Hits : {item.hits}</span>

          <button
            onClick={handleMoreClick}
            className='text-[9px] rounded border border-gray-300 text-gray-600 px-1 py-1 hover:bg-cyan-500 hover:text-white'
          >
            More
          </button>
        </div>
      </div>
    </>
  );
}
