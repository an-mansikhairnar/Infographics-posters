'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Category } from '@/app/interfaces/category';

export default function SiteMapPage() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/infographics`);

                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }

                const data: Category[] = await response.json();

                setCategories(data.filter((item) => item.status === 1));
            } catch (error) {
                console.error(error);
            }
        };

        fetchCategories();
    }, []);
    return (
        <div className="flex-1 p-5 px-10">
            <div className="rounded-lg border border-gray-300 bg-white p-5">
                <ul className="list-disc pl-6 space-y-2 text-[12px]">
                    <li className="text-black">
                        <Link href="/" className="text-blue-500 hover:underline">
                            Home
                        </Link>
                    </li>

                    <li className="text-black">
                        <Link href="/submit-infographics" className="text-blue-500 hover:underline">
                            Submit Infographic
                        </Link>
                    </li>

                    <li className="text-black">
                        <Link href="/contact" className="text-blue-500 hover:underline">
                            Contact Us
                        </Link>
                    </li>

                    <li className="text-black">
                        <span className="font-semibold text-black">Category</span>

                        <ul className="mt-2 list-[circle] pl-8 space-y-2">
                            {categories.map((category) => (
                                <li key={category.catId} className="text-black">
                                    <Link
                                        href={`/?category=${encodeURIComponent(category.title)}`}
                                        className="text-blue-500 hover:underline"
                                    >
                                        {category.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    );
}
