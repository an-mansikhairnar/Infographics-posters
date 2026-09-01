'use client';
import { FiTrash2 } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { usePagination } from '@/app/hooks/usePagination';
import Pagination from '@/app/components/Pagination/Pagination';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import { MyInfographic } from '../interfaces/DesignInfographics';
import { toast } from 'react-hot-toast';
import BootstrapDialog from '@/app/components/BootstrapDialog/BootstrapDialog';

export default function DesignInfographicsPage() {
  const [MyInfographic, setMyInfographics] = useState<MyInfographic[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMyInfographics = MyInfographic.filter((info) => {
    const search = searchTerm.toLowerCase();

    return (
      info.infoId?.toString().includes(search) ||
      info.infographicTitle?.toLowerCase().includes(search) ||
      info.infographicDetails?.toLowerCase().includes(search) ||
      info.category?.toString().toLowerCase().includes(search) ||
      info.fullName?.toLowerCase().includes(search) ||
      info.email?.toLowerCase().includes(search)
    );
  });
  const { currentItems, currentPage, totalPages, goToPage } = usePagination(filteredMyInfographics, 25);
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/my-info`, {
          method: 'GET',
        });

        const data = await response.json();
        setMyInfographics(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchContact();
  }, []);

  const [myInfoToDelete, setMyInfoToDelete] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const openConfirmDialog = (id: number) => {
    setMyInfoToDelete(id);
    setOpen(true);
  };

  const closeConfirmDialog = () => {
    setOpen(false);
    setMyInfoToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (myInfoToDelete === null) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/my-info/${myInfoToDelete}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete category');
      }

      toast.success('Infographics deleted successfully');

      // Remove deleted category from table
      setMyInfographics((prev) => prev.filter((myInfo) => myInfo.infoId !== myInfoToDelete));

      closeConfirmDialog();
    } catch (error) {
      console.error(error);
      toast.error('Failed to deleted Infographics');
    }
  };

  return (
    <>
      <div className='flex justify-between items-center px-2 py-2 border bg-white border-gray-300 rounded-lg shadow-sm'>
        <h2 className='text-xl font-semibold text-gray-800'>Design-Infographics-list</h2>
      </div>

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
              <tr className='bg-white border-b border-slate-200'>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>#ID</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>My Infographics</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Title</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Details</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Alias</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Full Name</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Email</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Created</th>
                <th className='px-4 py-4 text-center font-bold text-gray-800'>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((info) => (
                <tr key={info.infoId} className='border-b border-slate-200 hover:bg-slate-50'>
                  <td className='px-4 py-4 border-r border-slate-100'>{info.infoId}</td>

                  <td className='px-4 py-4 border-r border-slate-100'>
                    <img
                      src={info.linkAssets}
                      alt={info.infographicTitle}
                      className='w-16 h-20 object-cover rounded border border-slate-200'
                    />
                  </td>

                  <td className='px-4 py-4 border-r border-slate-100'>{info.infographicTitle}</td>

                  <td className='px-4 py-4 border-r border-slate-100 max-w-xs truncate'>{info.infographicDetails}</td>

                  <td className='px-4 py-4 border-r border-slate-100'>{info.category}</td>

                  <td className='px-4 py-4 border-r border-slate-100'>{info.fullName}</td>

                  <td className='px-4 py-4 border-r border-slate-100'>{info.email}</td>

                  <td className='px-4 py-4 border-r border-slate-100'>{info.created?.split('T')[0]}</td>

                  <td className='px-4 py-4'>
                    <div className='flex justify-center'>
                      <button className='text-red-600 hover:text-red-800' onClick={() => openConfirmDialog(info.infoId)}>
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
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
