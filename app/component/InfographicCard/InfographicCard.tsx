'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { InfographicCardProps } from '@/app/interfaces/infographics';
import { Category } from '@/app/interfaces/category';
import { buildAbsoluteImageUrl } from '@/app/utils/imageUrl';

const createArticleSlug = (value: string) =>
    value
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/['’]/g, '')
        .replace(/[^a-zA-Z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

export default function InfographicCard({
    item,
}: InfographicCardProps) {
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(false);
    const [navigating, setNavigating] = useState(false);

    const router = useRouter();

    const detailsUrl = `/infographics/${createArticleSlug(
        item.alias
    )}.html`;

    const handleCardClick = () => {
        if (loading || navigating) return;

        setNavigating(true);
        setLoading(true);

        fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/articles/${item.articleId}`,
            {
                method: 'POST',
            }
        ).catch((error) => {
            console.error('Failed to update hits:', error);
        });

        router.push(detailsUrl);
    };

    const getLabel = () => {
        const today = new Date();

        const created = new Date(
            item.created.replace(' ', 'T').split('.')[0]
        );

        const diff = Math.abs(
            created.getTime() - today.getTime()
        );

        const diffDays = Math.ceil(
            diff / (1000 * 3600 * 24)
        );

        if (diffDays > 0 && diffDays < 7) {
            return 'NEW';
        }

        if (item.hits > 2000) {
            return 'HOT';
        }

        return '';
    };

    const label = getLabel();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/infographics`
                );

                if (!response.ok) {
                    throw new Error(
                        'Failed to fetch categories'
                    );
                }

                const data: Category[] =
                    await response.json();

                const matchedCategory = data.find(
                    (category: Category) =>
                        category.catId === item.catId
                );

                setCategoryName(
                    matchedCategory?.title || ''
                );
            } catch (error) {
                console.error(
                    'Failed to fetch categories:',
                    error
                );
            }
        };

        fetchCategories();
    }, [item.catId]);

    const imageUrl = buildAbsoluteImageUrl(
        item.thumbImageUrl || item.fullImageUrl,
        item.imgPrefix || undefined
    );

    const isNavigating = navigating || loading;

    return (
        <div
            onClick={handleCardClick}
            aria-busy={isNavigating}
            aria-label={`Open ${item.title}`}
            className={`
                group
                relative
                w-[187px]
                sm:w-[200px]
                md:w-[220px]
                lg:w-[200px]
                overflow-hidden
                rounded-md
                border
                border-gray-300
                bg-white
                text-gray-900
                shadow-sm
                cursor-pointer
                select-none
                transition-all
                duration-200
                ease-out

                dark:border-white/10
                dark:bg-[#181818]
                dark:text-white

                ${
                    isNavigating
                        ? `
                            scale-[0.98]
                            shadow-lg
                        `
                        : `
                            hover:-translate-y-0.5
                            hover:border-gray-400
                            hover:shadow-lg

                            dark:hover:border-white/20
                            dark:hover:shadow-lg
                        `
                }
            `}
        >
            {/* Navigation overlay */}
            {isNavigating && (
                <div
                    className="
                        absolute
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        bg-black/45
                        backdrop-blur-[2px]
                        dark:bg-black/55
                    "
                >
                    <div
                        className="
                            flex
                            flex-col
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-white/10
                            bg-black/70
                            px-5
                            py-4
                            text-white
                            shadow-xl
                        "
                    >
                        <div
                            className="
                                h-7
                                w-7
                                animate-spin
                                rounded-full
                                border-2
                                border-white/20
                                border-t-white
                            "
                        />

                        <span
                            className="
                                text-xs
                                font-medium
                                tracking-wide
                            "
                        >
                            Opening...
                        </span>
                    </div>
                </div>
            )}

            {/* Image */}
            <div
                className="
                    flex
                    w-full
                    justify-center
                    overflow-hidden
                    bg-gray-50
                    p-2

                    dark:bg-[#202020]
                "
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={item.title}
                        width={300}
                        height={500}
                        className="
                            max-h-[287px]
                            max-w-full
                            object-contain
                        "
                    />
                ) : (
                    <div
                        className="
                            flex
                            h-[287px]
                            w-full
                            items-center
                            justify-center
                            bg-gray-100
                            text-xs
                            text-gray-400

                            dark:bg-[#242424]
                            dark:text-gray-500
                        "
                    >
                        No image available
                    </div>
                )}
            </div>

            {/* Title + badge */}
            <div className="px-3 pt-3 pb-2">
                <div className="flex items-start gap-2">
                    {label && (
                        <span
                            className={`
                                mt-1
                                shrink-0
                                rounded
                                px-2
                                py-[2px]
                                text-[9px]
                                font-semibold
                                leading-[14px]
                                text-white

                                ${
                                    label === 'NEW'
                                        ? 'bg-emerald-600/90'
                                        : 'bg-red-700/90'
                                }
                            `}
                        >
                            {label}
                        </span>
                    )}

                    <h5
                        className="
                            min-w-0
                            flex-1
                            text-[18px]
                            font-bold
                            leading-[21px]
                            text-gray-900
                            transition-colors
                            duration-200

                            dark:text-gray-100
                            dark:group-hover:text-cyan-400
                        "
                    >
                        {item.title}
                    </h5>
                </div>
            </div>

            {/* Category */}
            <div className="px-3 pb-2">
                <h6
                    className="
                        text-[10px]
                        text-gray-500
                        dark:text-gray-500
                    "
                >
                    Category: {categoryName}
                </h6>
            </div>

            {/* Description */}
            <div className="px-3 pb-3">
                <p
                    className="
                        line-clamp-3
                        text-[12px]
                        leading-[19px]
                        text-gray-700
                        dark:text-gray-300
                    "
                >
                    {item.introDescription}
                </p>
            </div>

            {/* Footer */}
            <div
                className="
                    flex
                    items-center
                    justify-between
                    border-t
                    border-gray-300
                    bg-gray-50
                    px-3
                    py-2

                    dark:border-white/10
                    dark:bg-black/10
                "
            >
                <span
                    className="
                        text-[11px]
                        text-gray-600
                        dark:text-gray-500
                    "
                >
                    Hits : {item.hits}
                </span>

                {/* More */}
                <span
                    className="
                        rounded
                        border
                        border-gray-300
                        bg-gray-100
                        px-2
                        py-1
                        text-[9px]
                        font-medium
                        text-gray-500
                        transition-all
                        duration-200

                        dark:border-white/10
                        dark:bg-white/[0.03]
                        dark:text-gray-400
                    "
                >
                    More
                </span>
            </div>
        </div>
    );
}