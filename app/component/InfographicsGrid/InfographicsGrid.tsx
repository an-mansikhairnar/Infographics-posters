'use client';

import { useSearchParams } from 'next/navigation';
import InfographicCard from '../InfographicCard/InfographicCard';
import SearchFilters from '../SearchFilters/SearchFilters';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Article } from '@/app/interfaces/infographics';
import { LoadingSpinner, useLoading } from '@/app/context/loader';
import { motion } from 'framer-motion';
import { useInfiniteScroll } from '@/app/hooks/infinite-scroll';
import GoogleAds from '../GoogleAds/GoogleAds';
import { Category } from '@/app/interfaces/category';

type OrderedItem =
    | { type: 'article'; data: Article; key: string }
    | { type: 'ad'; key: string };

const CARD_WIDTH = 187;
const GAP = 28;

export default function InfographicsGrid() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [matchedCategoryId, setMatchedCategoryId] = useState<number>();
    const [columnCount, setColumnCount] = useState(1);
    const observerRef = useRef<ResizeObserver | null>(null);
    const searchParams = useSearchParams();
    const category = searchParams.get('category')?.toLowerCase() ?? '';
    const search = searchParams.get('search')?.toLowerCase() ?? '';
    const { loading, setLoading } = useLoading();
    const AD_INTERVAL = 20;

    const gridRef = useCallback((node: HTMLDivElement | null) => {
        observerRef.current?.disconnect();
        if (!node) return;

        const update = () =>
            setColumnCount(
                Math.max(1, Math.floor((node.clientWidth + GAP) / (CARD_WIDTH + GAP)))
            );

        update();
        observerRef.current = new ResizeObserver(update);
        observerRef.current.observe(node);
    }, []);

    // Filter articles by the selected category and search query.
    const filteredArticles = articles.filter((item) => {
        const matchesCategory = !category || item.catId === matchedCategoryId;
        const matchesSearch = !search || item.title.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const ordering = searchParams.get('ordering') ?? 'newest';

    // Sort the filtered results by the chosen ordering option.
    const sortedArticles = [...filteredArticles].sort((a, b) => {
        switch (ordering) {
            case 'newest':
                return new Date(b.created).getTime() - new Date(a.created).getTime();

            case 'alphabetical':
                return a.title.localeCompare(b.title);

            case 'oldest':
                return new Date(a.created).getTime() - new Date(a.created).getTime();

            case 'popular':
            default:
                const aHot = a.hits > 2000;
                const bHot = b.hits > 2000;

                if (aHot !== bHot) {
                    return Number(bHot) - Number(aHot);
                }

                return 0;
        }
    });

    const displayArticles = sortedArticles;

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/infographics`);

                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }

                const categories: Category[] = await response.json();
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
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`);
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

    const { visibleCount } = useInfiniteScroll(displayArticles.length, `${category}|${search}|${ordering}`);
    const visibleArticles = displayArticles.slice(0, visibleCount);

    const orderedItems: OrderedItem[] = [];

    visibleArticles.forEach((item, index) => {
        orderedItems.push({
            type: 'article',
            data: item,
            key: `article-${item.articleId}`,
        });

        const shouldInsertAd = (index + 1) % AD_INTERVAL === 0 && index < visibleArticles.length - 1;
        if (shouldInsertAd) {
            orderedItems.push({
                type: 'ad',
                key: `ad-after-${item.articleId}`,
            });
        }
    });

    const columns: OrderedItem[][] = Array.from({ length: columnCount }, () => []);
    orderedItems.forEach((item, i) => columns[i % columnCount].push(item));

    if (loading && articles.length === 0) {
        return (
            <section className="flex-1">
                <div className="flex min-h-[70vh] items-start justify-center pt-8">
                    <LoadingSpinner />
                </div>
            </section>
        );
    }

    return (
        <section className="flex-1 p-5">
            {search && <SearchFilters />}

            <div
                ref={gridRef}
                className="flex w-full items-start xl:w-[90%]"
                style={{ columnGap: GAP }}
            >
                {columns.map((columnItems, colIndex) => (
                    <div key={colIndex} className="flex w-[187px] flex-col">
                        {columnItems.map((item) => {
                            /*
                             * Google AdSense vertical ad
                             */
                            if (item.type === 'ad') {
                                return (
                                    <div key={item.key} className="mb-5 w-[187px]">
                                        <div className="w-[187px] overflow-hidden">
                                            <GoogleAds
                                                adSlot="8991134354"
                                                style={{
                                                    display: 'block',
                                                    width: '187px',
                                                    height: '600px',
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            }

                            /*
                             * Infographic card
                             */
                            return (
                                <div key={item.key} className="mb-5 w-[187px]">
                                    <motion.div
                                        layout
                                        transition={{ duration: 0.5 }}
                                        className="w-[187px]"
                                    >
                                        <InfographicCard item={item.data} />
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Loading indicator */}
            {visibleCount < displayArticles.length && (
                <LoadingSpinner />
            )}

            {/* No category results */}
            {category && displayArticles.length === 0 && (
                <div
                    className="
                        mx-auto
                        mt-3
                        mb-[2%]
                        w-fit
                        rounded-md
                        bg-[#333]
                        px-6
                        py-4
                        text-center
                        text-[13px]
                        text-white
                    "
                >
                    No more infographics to show
                </div>
            )}

            {/* No search results */}
            {search && displayArticles.length < 20 && (
                <div
                    className="
                        mx-auto
                        mt-3
                        mb-[2%]
                        w-fit
                        rounded-md
                        bg-[#333]
                        px-6
                        py-4
                        text-center
                        text-[13px]
                        text-white
                    "
                >
                    No more infographics to show
                </div>
            )}
        </section>
    );
}