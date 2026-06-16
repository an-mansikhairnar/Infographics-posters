import { categories } from '../../constants/categories';

export default function CategoriesSidebar() {
  return (
    <aside className='w-[180px] border border-gray-300 bg-white'>
      <div className='flex items-center gap-2 bg-gray-100 border-b border-gray-300 px-4 py-2 text-gray-800 uppercase text-sm font-medium'>
        <span className='w-2 h-2 bg-black'></span>
        Categories
      </div>
      <div className='flex flex-col'>
        {categories.map((category) => (
          <button
            key={category}
            className='w-[177px] h-[30px] flex items-center text-left text-gray-500 font-medium px-4 border-b border-gray-200 border-r-2 border-r-transparent hover:text-cyan-500 hover:border-r-cyan-500 transition-colors text-[13px]'
          >
            {category}
          </button>
        ))}
      </div>
    </aside>
  );
}
