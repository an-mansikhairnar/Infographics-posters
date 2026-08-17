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
import { ClientInfographic } from '../interfaces/ClientInfographics';
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));
export default function ClientInfographicsPage() {
  const [contactDetail, setContactDetails] = useState<ClientInfographic[]>([]);
  const [clientInfoDelete, setClientInfoDelete] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch('/api/contact', {
          method: 'GET',
        });

        const data = await response.json();
        setContactDetails(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchContact();
  }, []);

  const filteredClientInfo = contactDetail.filter((contactDetail) => {
    const search = searchTerm.toLowerCase();

    return (
      contactDetail.id?.toString().includes(search) ||
      contactDetail.title?.toLowerCase().includes(search) ||
      contactDetail.client_name?.toLowerCase().includes(search) ||
      contactDetail.fullDescription?.toString().toLowerCase().includes(search) ||
      contactDetail.email?.toLowerCase().includes(search) ||
      contactDetail.created?.toLowerCase().includes(search)
    );
  });
  const { currentItems, currentPage, totalPages, goToPage } = usePagination(filteredClientInfo, 20);
  const openConfirmDialog = (id: number) => {
    setClientInfoDelete(id);
    setOpen(true);
  };

  const closeConfirmDialog = () => {
    setOpen(false);
    setClientInfoDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (clientInfoDelete === null) return;

    try {
      const response = await fetch(`/api/contact/${clientInfoDelete}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete client inforgraphics');
      }

      alert(data.message);

      // Remove deleted category from table
      setContactDetails((prev) => prev.filter((clientInfo) => clientInfo.id !== clientInfoDelete));

      closeConfirmDialog();
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  return (
    <>
      <div className='flex justify-between items-center px-2 py-2 border bg-white border-gray-300 rounded-lg shadow-sm'>
        <h2 className='text-xl font-semibold text-gray-800'>Client-Infographics-list</h2>
      </div>
      {/* 
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} /> */}

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
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Client Infographics</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Client Name</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Title</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Description</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Email</th>
                <th className='px-4 py-4 text-left font-bold text-gray-800 border-r border-slate-200'>Created</th>
                <th className='px-4 py-3 text-center font-bold text-gray-800 border-r border-slate-200'>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((contact) => (
                <tr key={contact.id} className='border-b border-slate-200 hover:bg-slate-50'>
                  <td className='px-5 py-5 border-r border-slate-100 align-middle'>{contact.id}</td>
                  <td className='px-5 py-5 border-r border-slate-100'>
                    <img src={contact.imgUrl} alt={contact.title} className='w-16 h-20 object-cover rounded-sm border border-slate-200' />
                  </td>
                  <td className='px-5 py-5 border-r border-slate-100 align-middle'>{contact.title}</td>
                  <td className='px-5 py-5 border-r border-slate-100 align-middle'>{contact.client_name}</td>
                  <td className='px-5 py-5 border-r border-slate-100 align-middle text-center'>{contact.fullDescription}</td>
                  <td className='px-5 py-5 border-r border-slate-100 align-middle'>{contact.email}</td>
                  <td className='px-5 py-5 border-r border-slate-100 align-middle'>{contact.created?.split('T')[0]}</td>
                  <td className='px-5 py-5 align-middle'>
                    <div className='flex items-center gap-2'>
                      <button className='text-red-600 hover:text-red-800' onClick={() => openConfirmDialog(contact.id)}>
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
