'use client';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { Article } from '../../interfaces/ArticleFormData';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import { usePagination } from '@/app/hooks/usePagination';
import Pagination from '@/app/components/Pagination/Pagination';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import BootstrapDialog from '@/app/components/BootstrapDialog/BootstrapDialog';

interface ArticleListTableProps {
  onEdit: (id: number) => void;
  refreshKey?: number;
}

export default function ArticleListTable({ onEdit, refreshKey = 0 }: ArticleListTableProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  // const { currentItems, currentPage, totalPages, goToPage } = usePagination(articles, 25);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, {
          method: 'GET',
        });

        const data: Article[] = await response.json();
        setArticles(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchArticles();
  }, [refreshKey]);

  const filteredArticles = articles.filter((article) => {
    const search = searchTerm.toLowerCase();

    return (
      article.articleId?.toString().includes(search) ||
      article.title?.toLowerCase().includes(search) ||
      article.alias?.toLowerCase().includes(search) ||
      article.featured?.toString().toLowerCase().includes(search) ||
      article.type?.toLowerCase().includes(search) ||
      article.created?.toLowerCase().includes(search)
    );
  });
  const { currentItems, currentPage, totalPages, goToPage } = usePagination(filteredArticles, 25);
  const openConfirmDialog = (id: number) => {
    setArticleToDelete(id);
    setOpen(true);
  };

  const closeConfirmDialog = () => {
    setOpen(false);
    setArticleToDelete(null);
  };
  const handleConfirmDelete = async () => {
    if (articleToDelete === null) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${articleToDelete}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setArticles((prev) => prev.filter((article) => article.articleId !== articleToDelete));
      toast.success('Article deleted successflly');
    } catch (error) {
      console.error(error);
      toast.error('Failed to deleted successflly');
    } finally {
      closeConfirmDialog();
    }
  };

  return (
    <>
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
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Thumb Image</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Title</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Alias</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Feature</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Type</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Created Date</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800'>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((article) => (
                <tr key={article.articleId} className='border-b border-slate-200 hover:bg-slate-50'>
                  <td className='px-4 py-3 border-r border-slate-100 align-middle'>{article.articleId}</td>

                  <td className='px-4 py-3 border-r border-slate-100 align-middle'>
                    {article.thumbImageUrl ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}${article.thumbImageUrl}`
                        }
                        alt={article.imageAltText}
                        width={64}
                        height={80}
                        className='w-16 h-20 rounded-sm border border-slate-200'
                      />
                    ) : (
                      <div className='w-16 h-20 bg-slate-100 rounded-sm border border-slate-200 flex items-center justify-center text-xs text-slate-400'>
                        No image
                      </div>
                    )}
                  </td>
                  <td className='px-4 py-3 border-r border-slate-100 align-middle'>{article.title}</td>
                  <td className='px-4 py-3 border-r border-slate-100 align-middle'>{article.alias}</td>
                  <td className='px-4 py-3 border-r border-slate-100 align-middle'>{article.featured}</td>
                  <td className='px-4 py-3 border-r border-slate-100 align-middle'>{article.type}</td>
                  <td className='px-4 py-3 border-r border-slate-100 align-middle'> {article.created?.split('T')[0]}</td>
                  <td className='px-4 py-3 align-middle'>
                    <div className='flex items-center gap-2'>
                      <button onClick={() => openConfirmDialog(article.articleId)} className='text-red-600 hover:text-red-800'>
                        <FiTrash2 size={20} />
                      </button>
                      <span className='text-slate-300'>|</span>
                      <button onClick={() => onEdit(article.articleId)} className='text-blue-700 hover:text-blue-900' aria-label='Edit'>
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
