// import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// interface PaginationProps {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
//   if (totalPages <= 1) return null;

//   return (
//     <div className='flex items-center justify-center gap-4 py-4'>
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         className='px-3 py-1.5 text-sm rounded-md border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50'
//       >
//         <FiChevronLeft size={18} />
//       </button>

//       <span className='text-sm text-gray-700'>
//         Page {currentPage} of {totalPages}
//       </span>

//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         className='px-3 py-1.5 text-sm rounded-md border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50'
//       >
//         <FiChevronRight size={18} />
//       </button>
//     </div>
//   );
// }

import { FiChevronLeft, FiChevronRight, FiChevronUp } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const arrowBtnClass =
    'w-9 h-9 flex items-center justify-center rounded-md border transition-colors ' +
    'border-gray-300 text-gray-800 hover:bg-gray-50 ' +
    'disabled:text-gray-300 disabled:border-gray-200 disabled:cursor-not-allowed disabled:hover:bg-transparent';

  return (
    <div className='flex items-center gap-2 py-4'>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className={arrowBtnClass}>
        <FiChevronLeft size={18} />
      </button>

      <div className='relative'>
        <select
          value={currentPage}
          onChange={(e) => onPageChange(Number(e.target.value))}
          className='appearance-none text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-md pl-4 pr-9 py-2 min-w-[180px] outline-none focus:border-blue-500 cursor-pointer'
        >
          {pages.map((page) => (
            <option key={page} value={page}>
              {page}
            </option>
          ))}
        </select>
        <FiChevronUp
          size={14}
          className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
        />
      </div>

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className={arrowBtnClass}>
        <FiChevronRight size={18} />
      </button>
    </div>
  );
}
// import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// interface PaginationProps {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
//   if (totalPages <= 1) return null;

//   const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

//   const btnClass =
//     'w-9 h-9 flex items-center justify-center rounded-md border transition-colors ' +
//     'border-gray-300 text-gray-800 hover:bg-gray-50 ' +
//     'disabled:text-gray-300 disabled:border-gray-200 disabled:cursor-not-allowed disabled:hover:bg-transparent';

//   return (
//     <div className='flex items-center justify-center gap-3 py-4'>
//       <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className={btnClass}>
//         <FiChevronLeft size={18} />
//       </button>

//       <div className='relative'>
//         <select
//           value={currentPage}
//           onChange={(e) => onPageChange(Number(e.target.value))}
//           className='appearance-none text-sm font-medium text-gray-800 border border-gray-300 rounded-md pl-4 pr-8 py-2 min-w-[90px] outline-none focus:border-blue-500 cursor-pointer'
//         >
//           {pages.map((page) => (
//             <option key={page} value={page}>
//               {page}
//             </option>
//           ))}
//         </select>
//         <span className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs'>▾</span>
//       </div>

//       <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className={btnClass}>
//         <FiChevronRight size={18} />
//       </button>
//     </div>
//   );
// }
