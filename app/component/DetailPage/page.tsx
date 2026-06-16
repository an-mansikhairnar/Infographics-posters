import { infographics } from '@/app/constants/infographics';
import Image from 'next/image';

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const infographic = infographics.find((item) => item.id === Number(id));

  if (!infographic) {
    return <div>Infographic not found</div>;
  }

  return (
    <div className='p-5 container bg-white border border-gray-300 rounded-sm m-6'>
      <div className='!text-cyan-500 font-bold text-[30px]'>{infographic?.title}</div> {/* font-bold mb-4 text-cyan-400 */}
      <div className='flex'>
        <p className='mt-2 mr-3 text-[11px]'>
          <span className='font-semibold'>Category:</span> {infographic?.category}
        </p>

        <p className=' mt-2 text-[11px]'>
          <span className='font-semibold'>Hits: </span> {infographic?.hits}
        </p>
      </div>
      <p className='mt-4 mb-4 text-[13px]'>{infographic?.description}</p>
      <div className='flex justify-center'>
        <Image src={infographic?.image} alt={infographic?.title} width={400} height={600} />
      </div>
      <div className='border border-gray-300 rounded-md overflow-hidden'>
        {/* Header */}
        <div className='bg-gray-100 border-b border-gray-300 px-4 py-2 font-semibold'>Embed Code</div>

        {/* Content */}
        <div className='p-4'>
          <button className='bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded'>COPY</button>

          <textarea
            className='w-full mt-3 border border-gray-300 rounded p-3 text-sm text-gray-600 resize-none'
            rows={6}
            readOnly
            value={`<a href="https://www.infographicsposters.com/..."><img src="..." /></a>`}
          />
        </div>

        {/* Source */}

        <div className='px-4 pb-4'>
          <div className='border border-gray-300 rounded-md overflow-hidden p-2'>
            <span className='font-semibold'>Source: </span>
            <a href='#' className='text-blue-600 hover:underline'>
              Lulu Wild
            </a>
          </div>
        </div>

        {/* Facebook */}
        <div className='px-4 pb-4'>
          <div className='border border-gray-300 rounded-md overflow-hidden p-2'>
            <span className='font-semibold'>Facebook: </span>
            <a href='#' className='text-blue-600 hover:underline'>
              @luluwilduk
            </a>
          </div>
        </div>

        {/* Instagram */}
        <div className='px-4 pb-4'>
          <div className='border border-gray-300 rounded-md overflow-hidden p-2'>
            <span className='font-semibold'>Instagram: </span>
            <a href='#' className='text-blue-600 hover:underline'>
              luluwilduk
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
