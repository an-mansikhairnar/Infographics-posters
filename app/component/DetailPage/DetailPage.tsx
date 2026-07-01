// import { infographics } from '@/app/constants/infographics';
// import Image from 'next/image';

// export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params;

//   const infographic = infographics.find((item) => item.id === Number(id));

//   if (!infographic) {
//     return <div>Infographic not found</div>;
//   }

//   return (
//     <div className='p-5 container bg-white border border-gray-300 rounded-sm m-6'>
//       <div className='!text-cyan-500 font-bold text-[30px]'>{infographic?.title}</div> {/* font-bold mb-4 text-cyan-400 */}
//       <div className='flex'>
//         <p className='mt-2 mr-3 text-[11px]'>
//           <span className='font-semibold'>Category:</span> {infographic?.category}
//         </p>

//         <p className=' mt-2 text-[11px]'>
//           <span className='font-semibold'>Hits: </span> {infographic?.hits}
//         </p>
//       </div>
//       <p className='mt-4 mb-4 text-[13px]'>{infographic?.description}</p>
//       <div className='flex justify-center'>
//         <Image src={infographic?.image} alt={infographic?.title} width={400} height={600} />
//       </div>
//       <div className='border border-gray-300 rounded-md overflow-hidden'>
//         {/* Header */}
//         <div className='bg-gray-100 border-b border-gray-300 px-4 py-2 font-semibold'>Embed Code</div>

//         {/* Content */}
//         <div className='p-4'>
//           <button className='bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded'>COPY</button>

//           <textarea
//             className='w-full mt-3 border border-gray-300 rounded p-3 text-sm text-gray-600 resize-none'
//             rows={6}
//             readOnly
//             value={`<a href="https://www.infographicsposters.com/..."><img src="..." /></a>`}
//           />
//         </div>

//         {/* Source */}

//         <div className='px-4 pb-4'>
//           <div className='border border-gray-300 rounded-md overflow-hidden p-2'>
//             <span className='font-semibold'>Source: </span>
//             <a href='#' className='text-blue-600 hover:underline'>
//               Lulu Wild
//             </a>
//           </div>
//         </div>

//         {/* Facebook */}
//         <div className='px-4 pb-4'>
//           <div className='border border-gray-300 rounded-md overflow-hidden p-2'>
//             <span className='font-semibold'>Facebook: </span>
//             <a href='#' className='text-blue-600 hover:underline'>
//               @luluwilduk
//             </a>
//           </div>
//         </div>

//         {/* Instagram */}
//         <div className='px-4 pb-4'>
//           <div className='border border-gray-300 rounded-md overflow-hidden p-2'>
//             <span className='font-semibold'>Instagram: </span>
//             <a href='#' className='text-blue-600 hover:underline'>
//               luluwilduk
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import Image from 'next/image';
// import { infographics } from '@/app/constants/infographics';
// import { Article } from '@/app/interfaces/infographics';

// export default function DetailPage() {
//   const params = useParams();
//   const id = params.id as string;

//   const [article, setArticle] = useState<Article>();

//   const infographic = infographics.find(
//     (item) => item.id === Number(id)
//   );

//   useEffect(() => {
//     const fetchArticleById = async () => {
//       try {
//         const res = await fetch(`/api/articles/${id}`);

//         if (!res.ok) {
//           throw new Error('Failed to fetch article');
//         }

//         const data = await res.json();

//         console.log('Article:', data);
//         setArticle(data);
//       } catch (error) {
//         console.error('Failed to fetch article:', error);
//       }
//     };

//     if (id) {
//       fetchArticleById();
//     }
//   }, [id]);

//   if (!infographic) {
//     return <div>Infographic not found</div>;
//   }

//   return (
//     <div className='container m-6 rounded-sm border border-gray-300 bg-white p-5'>
//       <div className='text-[30px] font-bold text-cyan-500'>
//         {article?.title}
//       </div>

//       {/* <div className='flex'>
//         <p className='mt-2 mr-3 text-[11px]'>
//           <span className='font-semibold'>Category:</span>{' '}
//           {article?.category }
//         </p>

//         <p className='mt-2 text-[11px]'>
//           <span className='font-semibold'>Hits:</span>{' '}
//           {article?.hits }
//         </p>
//       </div>

//       <p className='mt-4 mb-4 text-[13px]'>
//         {article?.description }
//       </p>

//       <div className='flex justify-center'>
//         <Image
//           src={article?.image || infographic.image}
//           alt={article?.title || infographic.title}
//           width={400}
//           height={600}
//         />
//       </div> */}

//       <div className='mt-6 overflow-hidden rounded-md border border-gray-300'>
//         {/* Header */}
//         <div className='border-b border-gray-300 bg-gray-100 px-4 py-2 font-semibold'>
//           Embed Code
//         </div>

//         {/* Content */}
//         <div className='p-4'>
//           <button className='rounded bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600'>
//             COPY
//           </button>

//           {/* <textarea
//             className='mt-3 w-full resize-none rounded border border-gray-300 p-3 text-sm text-gray-600'
//             rows={6}
//             readOnly
//             value={`<a href="https://www.infographicsposters.com/infographics/${id}">
//   <img src="${article?.image || infographic.image}" />
// </a>`}
//           /> */}
//         </div>

//         {/* Source */}
//         <div className='px-4 pb-4'>
//           <div className='rounded-md border border-gray-300 p-2'>
//             <span className='font-semibold'>Source: </span>
//             <a href='#' className='text-blue-600 hover:underline'>
//               Lulu Wild
//             </a>
//           </div>
//         </div>

//         {/* Facebook */}
//         <div className='px-4 pb-4'>
//           <div className='rounded-md border border-gray-300 p-2'>
//             <span className='font-semibold'>Facebook: </span>
//             <a href='#' className='text-blue-600 hover:underline'>
//               @luluwilduk
//             </a>
//           </div>
//         </div>

//         {/* Instagram */}
//         <div className='px-4 pb-4'>
//           <div className='rounded-md border border-gray-300 p-2'>
//             <span className='font-semibold'>Instagram: </span>
//             <a href='#' className='text-blue-600 hover:underline'>
//               luluwilduk
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Article } from '@/app/interfaces/infographics';
import { Category } from '@/app/interfaces/category';

export default function DetailPage() {
  const params = useParams();
  const id = params.id as string;
  console.log('🚀 ~ DetailPage.tsx:223 ~ DetailPage ~ id:', id);

  const [article, setArticle] = useState<Article | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/articles/${id}`);

        if (!res.ok) {
          throw new Error('Failed to fetch article');
        }

        const data: Article = await res.json();
        console.log('🚀 ~ DetailPage.tsx:241 ~ fetchArticle ~ data:', data);
        setArticle(data);
      } catch (error) {
        console.error('Failed to fetch article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  useEffect(() => {
    if (!article) return;

    const fetchCategory = async () => {
      try {
        const res = await fetch('/api/infographics');

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

  // const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');

  // const embedCode = article
  //   ? `<a href="https://www.infographicsposters.com/${categorySlug}/${article.alias}/${article.articleId}"><img src="https://www.infographicsposters.com/${article.fullImageUrl}" style="max-width:100%" alt="${article.title}" /></a><p>Filed at Infographicsposters.com in <a href="https://www.infographicsposters.com/${categorySlug}">${categoryName} Infographics</a> </p>`
  //   : '';
  const categorySlug = categoryName.toLowerCase();

  const fullImage = article?.fullImageUrl?.startsWith('/') ? article.fullImageUrl.slice(1) : article?.fullImageUrl;

  const embedCode = article
    ? `<a href="/${categorySlug}/${article.alias}/${article.articleId}"><img src="https://www.infographicsposters.com/${fullImage}" style="max-width:100%" alt="${article.title}" /></a><p>Filed at Infographicsposters.com in <a href="https://www.infographicsposters.com/${categorySlug}">${categoryName} Infographics</a> </p>`
    : '';
  const imageUrl = `${article?.imgPrefix.replace(/\/$/, '')}/${article?.fullImageUrl.replace(/^\//, '')}`;

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
    return <div className='p-5'>Loading...</div>;
  }

  if (!article) {
    return <div className='p-5'>Article not found.</div>;
  }

  return (
    <div className='container mx-5 my-6 rounded border border-gray-300 bg-white p-6'>
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

      {/* <div className='py-6'>
        <Image src={imageUrl} alt={article.imageAltText} width={0} height={0} sizes='100vw' className='w-full rounded' />{' '}
      </div> */}

      {/* <div className='flex flex-col flex-1 px-4 py-3 text-gray-700'>
        <div className='py-6'>
          <Image src={imageUrl} alt={article.imageAltText} width={0} height={0} sizes='100vw' className='w-full rounded' />
        </div>
      </div> */}

      {/* <div className='flex flex-col flex-1 px-4 py-3 text-gray-700'>
  <div className='py-6 text-center'>
    <a href={imageUrl}>
      <Image
        src={imageUrl}
        alt={article.imageAltText}
        width={633}
        height={0}
        sizes='100vw'
        className=' h-auto object-contain rounded mx-auto'
      />
    </a>
  </div>
</div> */}

      <div className='flex flex-col flex-1 px-4 py-3 text-gray-700'>
        <div className='py-6 text-center'>
          <a href={imageUrl}>
            <Image
              src={imageUrl}
              alt={article.imageAltText}
              width={633}
              height={900}
              sizes='(max-width: 768px) 100vw, 633px'
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
            className='text-shadow-lg/30 rounded bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600'
          >
            COPY {copied && ''}
          </button>

          <textarea readOnly rows={6} className='mt-3 w-full rounded border border-gray-300 p-3 text-gray-500' value={embedCode} />
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
