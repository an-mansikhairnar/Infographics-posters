'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { InfographicCardProps } from '@/app/interfaces/infographics';
import { Category } from '@/app/interfaces/category';
import { buildAbsoluteImageUrl } from '@/app/utils/imageUrl';

export default function InfographicCard({ item }: InfographicCardProps) {
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleMoreClick = async () => {
        setLoading(true);

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${item.articleId}`, { method: 'POST' });
        } catch (error) {
            console.error('Failed to update hits:', error);
        }

        router.push(`/infographics/${item.alias}.html/${item.articleId}`);
    };

    const getLabel = () => {
        const today = new Date();

        // Convert to valid ISO format
        const created = new Date(item.created.replace(' ', 'T').split('.')[0]);

        const diff = Math.abs(created.getTime() - today.getTime());

        const diffDays = Math.ceil(diff / (1000 * 3600 * 24));

        if (diffDays > 0 && diffDays < 7) return 'NEW';
        if (item.hits > 2000) return 'HOT';

        return '';
    };
    const label = getLabel();
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/infographics`);

                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }

                const data: Category[] = await response.json();

                const matchedCategory = data.find((category: Category) => category.catId === item.catId);

                setCategoryName(matchedCategory?.title || '');
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, [item.catId]);

    const imageUrl = buildAbsoluteImageUrl(item.thumbImageUrl || item.fullImageUrl, item.imgPrefix || undefined);
    return (
        <>
            {/* {loading && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-white/80'>
          <div className='h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent' />
        </div>
      )} */}
            <div className="w-[187px] sm:w-[200px] md:w-[220px] lg:w-[200px] bg-white border border-gray-300 rounded-l cursor-pointer transition-shadow duration-300 hover:shadow-xl">
                <div className="w-full overflow-hidden flex justify-center p-2">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={item.title}
                            width={300}
                            height={500}
                            className="max-w-full h-auto object-contain max-h-[287px]"
                        />
                    ) : (
                        <div className="w-[300px] h-[287px] bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                            No image available
                        </div>
                    )}
                </div>

                <div className="px-3 pb-3">
                    {label && (
                        <span
                            className={`text-white font-medium text-[10px] px-3 mr-2 rounded float-left mt-1.5 ${
                                label === 'NEW' ? 'bg-green-500' : 'bg-red-800'
                            }`}
                        >
                            {label}
                        </span>
                    )}

                    <h5 className="text-[18px] font-bold leading-tight hover:text-cyan-600">{item.title}</h5>
                </div>

                <div className="px-3 pb-3 text-gray-500">
                    <h6 className="text-[10px] ">Category: {categoryName}</h6>
                </div>

                <div className="px-3 pb-3">
                    <h3 className="text-[12px] leading-[20px] line-clamp-3 ">{item.introDescription}</h3>
                </div>

                <div className="flex items-center justify-between border-t border-gray-300 bg-gray-50 px-3 py-2">
                    <span className="text-[12px] text-gray-700">Hits : {item.hits}</span>

                    <button
                        onClick={handleMoreClick}
                        className="text-[9px] rounded border border-gray-300 text-gray-600 px-1 py-1 hover:bg-cyan-500 hover:text-white cursor-pointer"
                    >
                        More
                    </button>
                </div>
            </div>
        </>
    );
}
