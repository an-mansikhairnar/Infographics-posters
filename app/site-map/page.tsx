import Link from 'next/link';
import { categories } from '../constants/categories';

export default function SiteMapPage() {
  return (
    <div className='rounded border border-gray-300 bg-white p-8'>
      <ul className='list-disc pl-6 space-y-2'>
        <li className='text-black'>
          <Link href='/' className='text-blue-500 hover:underline'>
            Home
          </Link>
        </li>

        <li className='text-black'>
          <Link href='/submit-infographics' className='text-blue-500 hover:underline'>
            Submit Infographic
          </Link>
        </li>

        <li className='text-black'>
          <Link href='/contact' className='text-blue-500 hover:underline'>
            Contact Us
          </Link>
        </li>

        <li className='text-black'>
          <span className='font-semibold text-black'>Category</span>

          <ul className='mt-2 list-[circle] pl-8 space-y-2'>
            {categories.map((category) => (
              <li key={category} className='text-black'>
               <Link
                  href={`/?category=${encodeURIComponent(category)}`}
                  className='text-blue-500 hover:underline'
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
}
// import Link from 'next/link';
// import { categories } from '../constants/categories';

// export default function SiteMapPage() {
//   return (
//     <div className='rounded border border-gray-300 bg-white p-8'>
//       <ul className='list-disc pl-6 space-y-2'>
//         <li className='text-black'>
//           <Link href='/' className='text-blue-500 hover:underline'>
//             Home
//           </Link>
//         </li>

//         <li className='text-black'>
//           <Link
//             href='/submit-infographics'
//             className='text-blue-500 hover:underline'
//           >
//             Submit Infographic
//           </Link>
//         </li>

//         <li className='text-black'>
//           <Link href='/contact' className='text-blue-500 hover:underline'>
//             Contact Us
//           </Link>
//         </li>

//         <li className='text-black'>
//           <span className='font-semibold text-black'>Category</span>

//           <ul className='mt-2 list-[circle] pl-8 space-y-2'>
//             {categories.map((category) => (
//               <li key={category} className='text-black'>
//                 <Link
//                   href={`/?category=${encodeURIComponent(category)}`}
//                   className='text-blue-500 hover:underline'
//                 >
//                   {category}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </li>
//       </ul>
//     </div>
//   );
// }