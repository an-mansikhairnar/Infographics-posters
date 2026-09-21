'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Article } from '@/app/interfaces/infographics';
import { Category } from '@/app/interfaces/category';
import { LoadingSpinner } from '@/app/context/loader';
import GoogleAds from '../GoogleAds/GoogleAds';
import { buildAbsoluteImageUrl, getPublicOrigin } from '@/app/utils/imageUrl';

const createArticleSlug = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\'’]/g, '')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

export default function DetailPage() {
  const params = useParams<{ slug?: string; id?: string }>();
  const id = params.id as string | undefined;
  const slug = params.slug as string | undefined;
  const [article, setArticle] = useState<Article | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);

      try {
        let articleId = id;

        if (!articleId && slug) {
          const normalizedSlug = slug.replace(/\.html$/i, '');
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`);

          if (!response.ok) {
            throw new Error('Failed to fetch articles');
          }

          const articles: Article[] = await response.json();
          const matchedArticle = articles.find((item) => {
            const alias = createArticleSlug(item.alias || '');
            const normalizedAlias = createArticleSlug(normalizedSlug);

            return alias === normalizedAlias || item.alias === normalizedSlug || `${item.alias}.html` === slug;
          });

          if (!matchedArticle) {
            throw new Error('Article not found');
          }

          articleId = String(matchedArticle.articleId);
        }

        if (!articleId) {
          setArticle(null);
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${articleId}`);

        if (!res.ok) {
          throw new Error('Failed to fetch article');
        }

        const data: Article = await res.json();

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setArticle(data);
      } catch (error) {
        console.error('Failed to fetch article:', error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, slug]);

  useEffect(() => {
    if (!article) return;

    const fetchCategory = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/infographics`);

        if (!res.ok) {
          throw new Error('Failed to fetch categories');
        }

        const categories: Category[] = await res.json();

        const matchedCategory = categories.find((category) => category.catId === article.catId);

        setCategoryName(matchedCategory?.title ?? '');
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategory();
  }, [article]);

  const categorySlug = categoryName.toLowerCase();

  const fullImage = article?.fullImageUrl ? buildAbsoluteImageUrl(article.fullImageUrl, article.imgPrefix || undefined) : '';

  const siteUrl = getPublicOrigin();

  const articleDetailUrl = article ? `${siteUrl}/infographics/${createArticleSlug(article.alias)}.html` : '';

  const embedCode = article
    ? `<a href="${articleDetailUrl}">
         <img src="${fullImage}" style="max-width:100%" alt="${article.title}" />
       </a>
       <p>Filed at Infographicsposters.com in
         <a href="${siteUrl}/${categorySlug}">${categoryName} Infographics</a>
       </p>`
    : '';
  const imageUrl = buildAbsoluteImageUrl(article?.fullImageUrl || article?.thumbImageUrl, article?.imgPrefix || undefined);

  const handleCopy = async () => {
    try {
      // Use the modern browser Clipboard API
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);

      // Reset the status message after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  if (loading) {
    return (
      <div className='flex justify-center items-center py-20'>
        <LoadingSpinner />
      </div>
    );
  }

  if (!article) {
    return <div className='p-5'>Article not found.</div>;
  }


  return (
    <div className='container mx-5 my-6 rounded border border-gray-300 bg-white p-6'>

      {/* Horizontal Ad Unit (InfographicsHorizontalAd) */}
    <div className="w-full my-4 flex justify-center overflow-x-auto">
      <GoogleAds
        adSlot="8300554865"
        style={{ display: 'inline-block', width: '728px', height: '90px' }}
      />
    </div>

    <h1 className='mb-4 mt-15 text-3xl font-bold text-cyan-600'>{article.title}</h1>
      <div className='mb-4 flex gap-8 text-sm'>
        <p className='text-[12px]'>
          <strong>Category:</strong> {categoryName}
        </p>

        <p className='text-[12px]'>
          <strong>Hits:</strong> {article.hits}
        </p>
      </div>

      <div className='mb-6 flex flex-wrap gap-2'>
        <Image src='/assets/pinterest.svg' alt='Pinterest' width={50} height={32} />
        <Image src='/assets/Facebook.svg' alt='Facebook' width={50} height={32} />
        <Image src='/assets/twitter.svg' alt='Twitter' width={50} height={32} />
        <Image src='/assets/linkedin.svg' alt='LinkedIn' width={50} height={32} />
      </div>

      <p className='text-[12px]' dangerouslySetInnerHTML={{ __html: article.fullDescription }} />

      <div className='flex flex-col flex-1 px-4 py-3 text-gray-700'>
        <div className='py-6 text-center'>
          <a href={imageUrl}>
            <img
              src={imageUrl}
              alt={article.imageAltText || article.title}
              width={633}
              height={900}
              className='max-w-full h-auto object-contain rounded mx-auto'
            />
          </a>
        </div>
      </div>

      <div className='mt-8 rounded border border-gray-300'>
        <h2 className='text=[14px] border-b border-gray-300 px-4 py-2 font-semibold'>Embed Code</h2>

        <div className='px-4 py-3'>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                copied
                    ? 'bg-green-500 text-white'
                    : 'bg-cyan-500 text-white hover:bg-cyan-600 active:scale-95'
            }`}
        >
            {copied ? 'COPIED' : 'COPY'}
        </button>
          <textarea
            readOnly
            rows={6}
            className='mt-3 w-full rounded border border-gray-300 p-3 text-gray-500 text-[10px]'
            value={embedCode}
          />
        </div>
      </div>
      {article.authorUrl && (
        <div className='mt-2 rounded border border-gray-300 p-2'>
          <p>
            <strong>Source:</strong>{' '}
            <a href={article.authorUrl} target='_blank' rel='noreferrer' className='text-blue-600'>
              {article.authorUrl}
            </a>
          </p>
        </div>
      )}

      {article.facebookUrl && (
        <div className='mt-2 rounded border border-gray-300 p-2'>
          <p>
            <strong>Facebook:</strong>{' '}
            <a href={article.facebookUrl} target='_blank' rel='noreferrer' className='text-blue-600'>
              {article.facebook}
            </a>
          </p>
        </div>
      )}

      {article.twitterUrl && (
        <div className='mt-2 rounded border border-gray-300 p-2'>
          <p>
            <strong>Twitter:</strong>{' '}
            <a href={article.twitterUrl} target='_blank' rel='noreferrer' className='text-blue-600'>
              {article.twitter}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
