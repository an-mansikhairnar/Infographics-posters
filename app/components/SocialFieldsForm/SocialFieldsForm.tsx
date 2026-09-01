'use client';
import { SocialFieldsFormData } from '@/app/interfaces/SocialFieldsForm';
import { COLORS } from '@/app/theme';
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

interface SocialFieldsFormProps {
  value?: SocialFieldsFormData;
  onDataChange?: (data: SocialFieldsFormData) => void;
  onSubmit?: (data: SocialFieldsFormData) => void;
}

const inputClass =
  'text-sm w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200';

export default function SocialFieldsForm({ value, onDataChange, onSubmit }: SocialFieldsFormProps) {
  const [formData, setFormData] = useState<SocialFieldsFormData>(
    value ?? {
      authorUrl: '',
      author: '',
      facebook: '',
      facebookUrl: '',
      instagram: '',
      instagramUrl: '',
      twitter: '',
      twitterUrl: '',
    }
  );

  const [errors, setErrors] = useState({
    authorUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
  });

  const isValidUrl = (value: string) => {
    if (!value) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const nextFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(nextFormData);
    onDataChange?.(nextFormData);

    if (name in errors) {
      setErrors((prev) => ({
        ...prev,
        [name]: value && !isValidUrl(value) ? 'Enter Valid Url' : '',
      }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <div className='w-full max-w-xl bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-5'>
      <div className='px-6 py-4' style={{ backgroundColor: COLORS.primary }}>
        {' '}
        <h1 className='text-white text-lg text-sm'>Infographics Social Feilds</h1>
      </div>
      <form className='px-6 py-6 space-y-5' onSubmit={handleSubmit}>
        {/* Author Url */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>
            Author Url <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='authorUrl'
            placeholder='Author Url'
            value={formData.authorUrl}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.authorUrl && <p className='mt-1 text-sm font-medium text-red-500'>{errors.authorUrl}</p>}
        </div>

        {/* Author Name */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Author Name</label>
          <input
            type='text'
            name='author'
            placeholder='Author Name'
            value={formData.author}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Facebook */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Facebook</label>
          <input
            type='text'
            name='facebook'
            placeholder='Facebook'
            value={formData.facebook}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Facebook Url */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Facebook Url</label>
          <input
            type='text'
            name='facebookUrl'
            placeholder='Facebook Url'
            value={formData.facebookUrl}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.facebookUrl && <p className='mt-1 text-sm font-medium text-red-500'>{errors.facebookUrl}</p>}
        </div>

        {/* Instagram */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Instagram</label>
          <input
            type='text'
            name='instagram'
            placeholder='Instagram'
            value={formData.instagram}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Instagram Url */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Instagram Url</label>
          <input
            type='text'
            name='instagramUrl'
            placeholder='Instagram Url'
            value={formData.instagramUrl}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.instagramUrl && <p className='mt-1 text-sm font-medium text-red-500'>{errors.instagramUrl}</p>}
        </div>

        {/* Twitter */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Twitter</label>
          <input type='text' name='twitter' placeholder='Twitter' value={formData.twitter} onChange={handleChange} className={inputClass} />
        </div>

        {/* Twitter Url */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Twitter Url</label>
          <input
            type='text'
            name='twitterUrl'
            placeholder='Twitter Url'
            value={formData.twitterUrl}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.twitterUrl && <p className='mt-1 text-sm font-medium text-red-500'>{errors.twitterUrl}</p>}
        </div>
      </form>
    </div>
  );
}
