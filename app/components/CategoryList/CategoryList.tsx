// 'use client';
// import { FiTrash2, FiEdit2 } from 'react-icons/fi';
// import { useEffect, useState } from 'react';
// import { Article } from '../../interfaces/ArticleFormData';
// import Button from '@mui/material/Button';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
// import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
// import Typography from '@mui/material/Typography';
// import { styled } from '@mui/material/styles';
// import Dialog from '@mui/material/Dialog';
// import { getCategories } from '@/app/lib/category';
// import { Category } from '@/app/interfaces/Category';
// const BootstrapDialog = styled(Dialog)(({ theme }) => ({
//   '& .MuiDialogContent-root': {
//     padding: theme.spacing(2),
//   },
//   '& .MuiDialogActions-root': {
//     padding: theme.spacing(1),
//   },
// }));

// interface ArticleListTableProps {
//   onEdit: (id: number) => void;
// }

// // export default function CategoryList({ onEdit }: ArticleListTableProps) {
// export default function CategoryList() {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
//   const [open, setOpen] = useState(false);

//   const openConfirmDialog = (id: number) => {
//     setCategoryToDelete(id);
//     setOpen(true);
//   };

//   const closeConfirmDialog = () => {
//     setOpen(false);
//     setCategoryToDelete(null);
//   };
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await getCategories();
//         setCategories(response.filter((item) => item.status === 1));
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const handleConfirmDelete = async () => {
//     console.log('🚀 ~ CategoryList.tsx:58 ~ handleConfirmDelete ~ categoryToDelete:', categoryToDelete);
//     if (categoryToDelete === null) return;

//     try {
//       const response = await fetch(`/api/categories/${categoryToDelete}`, {
//         method: 'DELETE',
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to delete category');
//       }

//       alert(data.message);

//       // Remove deleted category from table
//       setCategories((prev) => prev.filter((category) => category.catId !== categoryToDelete));

//       closeConfirmDialog();
//     } catch (error) {
//       console.error(error);
//       alert('Something went wrong');
//     }
//   };

//   return (
//     <div className='w-full bg-white mt-6 shadow-sm border border-slate-200 overflow-hidden'>
//       <div className='overflow-x-auto'>
//         <table className='w-full text-sm border-collapse'>
//           <thead>
//             <tr className='bg-white border-b border-slate-200 p-5'>
//               <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>#ID</th>
//               <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Title</th>
//               <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Alias</th>
//               <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Created</th>
//               <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Status</th>
//               <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Meta Keyword</th>
//               <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Meta Description</th>
//               <th className='px-4 py-4 text-left font-bold text-gray-800'>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {categories.map((category) => (
//               <tr key={category.catId} className='border-b border-slate-200 hover:bg-slate-50'>
//                 <td className='px-4 py-3 border-r border-slate-100 align-middle'>{category.catId}</td>
//                 {/* <td className='px-4 py-3 border-r border-slate-100 align-middle'>
//                   <Image
//                     src={category.fullImageUrl}
//                     alt={category.title}
//                     className='w-16 h-20 object-cover rounded-sm border border-slate-200'
//                   />
//                 </td> */}
//                 <td className='px-4 py-3 border-r border-slate-100 align-middle'>{category.title}</td>
//                 <td className='px-4 py-3 border-r border-slate-100 align-middle'>{category.alias}</td>
//                 <td className='px-4 py-3 border-r border-slate-100 align-middle'>{category.created?.split('T')[0]}</td>
//                 <td className='px-4 py-3 border-r border-slate-100 align-middle'>{category.status}</td>
//                 <td className='px-4 py-3 border-r border-slate-100 align-middle'> {category.metaKey}</td>
//                 <td className='px-4 py-3 border-r border-slate-100 align-middle'> {category.metaDescription}</td>

//                 <td className='px-4 py-3 align-middle'>
//                   <div className='flex items-center gap-2'>
//                     <button onClick={() => openConfirmDialog(category.catId)} className='text-red-600 hover:text-red-800'>
//                       <FiTrash2 size={20} />
//                     </button>
//                     <span className='text-slate-300'>|</span>
//                     {/* <button onClick={() => onEdit(category.catId)} className='text-blue-700 hover:text-blue-900' aria-label='Edit'> */}
//                     <FiEdit2 size={20} />
//                     {/* </button>  */}
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <BootstrapDialog open={open} onClose={closeConfirmDialog} aria-labelledby='delete-dialog-title'>
//         <DialogTitle sx={{ m: 0, p: 2, fontWeight: 600 }} id='delete-dialog-title'>
//           Delete Article
//           <IconButton
//             aria-label='close'
//             onClick={closeConfirmDialog}
//             sx={{
//               position: 'absolute',
//               right: 8,
//               top: 8,
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent dividers>
//           <Typography>Are you sure you want to delete this article?</Typography>
//         </DialogContent>

//         <DialogActions>
//           <Button variant='outlined' onClick={closeConfirmDialog}>
//             Cancel
//           </Button>

//           <Button variant='contained' color='error' onClick={handleConfirmDelete}>
//             Delete
//           </Button>
//         </DialogActions>
//       </BootstrapDialog>
//     </div>
//   );
// }
'use client';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import { getCategories } from '@/app/lib/category';
import { Category } from '@/app/interfaces/Category';
import { usePagination } from '@/app/hooks/usePagination';
import Pagination from '@/app/components/Pagination/Pagination';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));
interface CategoryListProps {
  onEdit: (id: number) => void;
  refreshKey?: number;
}
export default function CategoryList({ onEdit, refreshKey = 0 }: CategoryListProps) {
  // export default function CategoryList({ onEdit }: ArticleListTableProps) {
  // export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategory = categories.filter((article) => {
    const search = searchTerm.toLowerCase();

    return (
      article.catId?.toString().includes(search) ||
      article.title?.toLowerCase().includes(search) ||
      article.alias?.toLowerCase().includes(search) ||
      article.status?.toString().toLowerCase().includes(search) ||
      article.metaKey?.toLowerCase().includes(search) ||
      article.metaDescription?.toLowerCase().includes(search)
    );
  });
  const { currentItems, currentPage, totalPages, goToPage } = usePagination(filteredCategory, 25);

  const openConfirmDialog = (id: number) => {
    setCategoryToDelete(id);
    setOpen(true);
  };

  const closeConfirmDialog = () => {
    setOpen(false);
    setCategoryToDelete(null);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.filter((item) => item.status === 1));
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, [refreshKey]);

  const handleConfirmDelete = async () => {
    if (categoryToDelete === null) return;

    try {
      const response = await fetch(`/api/categories/${categoryToDelete}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete category');
      }

      alert(data.message);

      // Remove deleted category from table
      setCategories((prev) => prev.filter((category) => category.catId !== categoryToDelete));

      closeConfirmDialog();
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  return (
    <>
      {/* <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} /> */}
      <div className='flex items-center justify-between mb-4'>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />

        <input
          type='text'
          placeholder='Search...'
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            goToPage(1); // Go back to first page while searching
          }}
          className='w-72 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none'
        />
      </div>
      <div className='w-full bg-white shadow-sm border border-slate-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm border-collapse'>
            <thead>
              <tr className='bg-white border-b border-slate-200 p-5'>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>#ID</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Title</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Alias</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Created</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Status</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Meta Keyword</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Meta Description</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800'>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((category) => (
                <tr key={category.catId} className='border-b border-slate-200 hover:bg-slate-50'>
                  <td className='px-4 py-3 border-r border-slate-100 align-middle'>{category.catId}</td>
                  <td className='px-4 py-3 border-r border-slate-100 align-middle'>{category.title}</td>
                  <td className='px-4 py-3 border-r border-slate-100 align-middle'>{category.alias}</td>
                  <td className='px-4 py-3 border-r border-slate-100 align-middle'>{category.created?.split('T')[0]}</td>
                  <td className='px-4 py-3 border-r border-slate-100 align-middle'>{category.status}</td>
                  <td className='px-4 py-3 border-r border-slate-100 align-middle'> {category.metaKey}</td>
                  <td className='px-4 py-3 border-r border-slate-100 align-middle'> {category.metaDescription}</td>

                  <td className='px-4 py-3 align-middle'>
                    <div className='flex items-center gap-2'>
                      <button onClick={() => openConfirmDialog(category.catId)} className='text-red-600 hover:text-red-800'>
                        <FiTrash2 size={20} />
                      </button>
                      <span className='text-slate-300'>|</span>
                      {/* <FiEdit2 size={20} /> */}

                      <button onClick={() => onEdit(category.catId)} className='text-blue-700 hover:text-blue-900'>
                        <FiEdit2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <BootstrapDialog open={open} onClose={closeConfirmDialog} aria-labelledby='delete-dialog-title'>
          <DialogTitle sx={{ m: 0, p: 2, fontWeight: 600 }} id='delete-dialog-title'>
            Delete Article
            <IconButton
              aria-label='close'
              onClick={closeConfirmDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            <Typography>Are you sure you want to delete this article?</Typography>
          </DialogContent>

          <DialogActions>
            <Button variant='outlined' onClick={closeConfirmDialog}>
              Cancel
            </Button>

            <Button variant='contained' color='error' onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </div>
    </>
  );
}
