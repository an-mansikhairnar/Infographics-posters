'use client';

import { FormEvent, useState } from 'react';
import MetaForm from '../components/MetaForm/MetaForm';
import { CategoryFormData } from '../interfaces/Category';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CategoryList from '../components/CategoryList/CategoryList';
import { toast } from 'react-hot-toast';

function RadioGroupField({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className='flex items-center gap-6'>
      {options.map((opt) => (
        <label key={opt} className='flex items-center gap-2 cursor-pointer'>
          <input type='radio' name={name} value={opt} checked={value === opt} onChange={onChange} className='accent-[#3f51b5]' />
          {opt}
        </label>
      ))}
    </div>
  );
}

export default function CategoryPage() {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const inputClass =
    'text-sm w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200';

  const [formData, setFormData] = useState<CategoryFormData>({
    title: '',
    alias: '',
    status: null,
    metaTitle: '',
    metaKey: '',
    metaDescription: '',
  });
  const [refreshCategory, setRefreshCategory] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const title = e.target.value;
    const alias = title.trim().toLowerCase().replace(/\s+/g, '-');

    setFormData((prev) => ({
      ...prev,
      title,
      alias,
    }));
  };

  const handleEdit = async (id: number) => {
    try {
      const response = await fetch(`/api/categories/${id}`);
      const data = await response.json();

      setEditId(id);

      setFormData({
        title: data.title ?? '',
        alias: data.alias ?? '',
        status: data.status ?? null,
        metaTitle: data.metaTitle ?? '',
        metaKey: data.metaKey ?? '',
        metaDescription: data.metaDescription ?? '',
      });
      setOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleOpen = () => {
    setEditId(null);

    setFormData({
      title: '',
      alias: '',
      status: null,
      metaTitle: '',
      metaKey: '',
      metaDescription: '',
    });

    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEditId(null);

    setFormData({
      title: '',
      alias: '',
      status: null,
      metaTitle: '',
      metaKey: '',
      metaDescription: '',
    });
  };
  const handleAdd = async () => {
    try {
      const isArticleValid = formData.title && formData.alias && formData.status;

      if (!isArticleValid) {
        toast.error('Please fill all mandatory fields.');
        return;
      }
      const combinedData = {
        ...formData,
      };

      const response = await fetch(`/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(combinedData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Update failed');
      toast.success('Category added succesfully');
      setRefreshCategory((prev) => prev + 1);
      setOpen(false);

      setFormData({
        title: '',
        alias: '',
        status: null,
        metaTitle: '',
        metaKey: '',
        metaDescription: '',
      });
      console.log('combinedData', combinedData);
    } catch (error) {
      console.error('handleUpdate error:', error);
      toast.error('Failed to add category');
    }
  };

  const handleUpdate = async () => {
    if (!editId) return;

    try {
      const combinedData = { ...formData };

      const response = await fetch(`/api/categories/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(combinedData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Update failed');
      toast.success('Category updated succesfully');

      setRefreshCategory((prev) => prev + 1);
      setOpen(false);
      setEditId(null);
      setFormData({
        title: '',
        alias: '',
        status: null,
        metaTitle: '',
        metaKey: '',
        metaDescription: '',
      });
    } catch (err) {
      console.error('handleUpdate error:', err);
      toast.error('Failed to update category');
    }
  };
  return (
    <>
      <div className='flex justify-between items-center px-2 py-2 border bg-white border-gray-300 rounded-lg shadow-sm'>
        <h2 className='text-xl font-semibold text-gray-800'>Category-list</h2>
        <button
          className='bg-[#3f51b5] hover:bg-[#32408f] text-white px-4 py-2 rounded-md transition-colors duration-300 text-sm'
          onClick={handleOpen}
        >
          {editId ? 'Update Category' : 'Add Category'}
        </button>
      </div>

      {/* <CategoryList /> */}
      <CategoryList onEdit={handleEdit} refreshKey={refreshCategory} />
      <Dialog open={open} onClose={handleClose} maxWidth='lg' fullWidth scroll='paper'>
        <DialogTitle sx={{ bgcolor: '#3f51b5', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Add Category
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <div className='grid grid-cols-2 gap-6 mt-2'>
            {/* Left Side */}
            <div className='w-full max-w-xl bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden'>
              <div className='bg-[#3f51b5] px-6 py-3'>
                <h1 className='text-white text-lg text-sm'>Add Category</h1>
              </div>

              <form className='px-6 py-6 space-y-5' onSubmit={handleSubmit}>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    Title <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    name='title'
                    placeholder='Title'
                    value={formData.title}
                    onChange={handleTitleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    Alias <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    name='alias'
                    placeholder='Alias'
                    value={formData.alias}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div className='flex items-center gap-6'>
                  <label className='text-sm'>
                    Status <span className='text-red-500'>*</span>:
                  </label>

                  <RadioGroupField
                    name='status'
                    options={['Yes', 'No']}
                    value={formData.status === null ? '' : formData.status === 1 ? 'Yes' : 'No'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value === 'Yes' ? 1 : 0,
                      }))
                    }
                  />
                </div>
              </form>
            </div>

            {/* Right Side */}
            <div>
              {/* <MetaForm value={formData} onDataChange={setFormData} />{' '} */}
              <MetaForm
                value={{
                  metaTitle: formData.metaTitle,
                  metaKey: formData.metaKey,
                  metaDescription: formData.metaDescription,
                }}
                onDataChange={(metaData) =>
                  setFormData((prev) => ({
                    ...prev,
                    ...metaData,
                  }))
                }
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#3f51b5' }}>
          <Button
            variant='contained'
            sx={{ bgcolor: '#ffffff', color: '#3f51b5', '&:hover': { bgcolor: '#ffffff', color: '#3f51b5' } }}
            onClick={handleClose}
          >
            Close
          </Button>

          <Button
            variant='contained'
            sx={{ bgcolor: '#ffffff', color: '#3f51b5', '&:hover': { bgcolor: '#ffffff', color: '#3f51b5' } }}
            onClick={editId ? handleUpdate : handleAdd}
          >
            {editId ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
