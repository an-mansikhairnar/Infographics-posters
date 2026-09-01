'use client';
import { MetaFormData } from '@/app/interfaces/MetaFormData';
import { COLORS } from '@/app/theme';
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

interface MetaFormProps {
  value?: MetaFormData;
  onDataChange?: (data: MetaFormData) => void;
  onSubmit?: (data: MetaFormData) => void;
}

const inputClass =
  'text-sm w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200';

export default function MetaForm({ value, onDataChange, onSubmit }: MetaFormProps) {
  // const [formData, setFormData] = useState<MetaFormData>({
  //   metaTitle: '',
  //   metaKey: '',
  //   metaDescription: '',
  // });
  const [formData, setFormData] = useState<MetaFormData>(value ?? { metaTitle: '', metaKey: '', metaDescription: '' });
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const nextFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(nextFormData);
    onDataChange?.(nextFormData);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <div className='w-full max-w-xl bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden'>
      <div className='px-6 py-4' style={{ backgroundColor: COLORS.primary }}>
        {' '}
        <h1 className='text-white text-lg text-sm'>MetaData Option</h1>
      </div>
      <form className='px-6 py-6 space-y-5' onSubmit={handleSubmit}>
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Meta Title</label>
          <textarea
            rows={2}
            name='metaTitle'
            placeholder='Meta Title'
            value={formData.metaTitle}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Meta key</label>
          <textarea
            rows={2}
            name='metaKey'
            placeholder='Meta key'
            value={formData.metaKey}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Meta Description</label>
          <textarea
            rows={2}
            name='metaDescription'
            placeholder='Meta Description'
            value={formData.metaDescription}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </form>
    </div>
  );
}
