'use client';
import { ArticleFormData } from '@/app/interfaces/ArticleFormData';
import { Category } from '@/app/interfaces/Category';
import { getCategories } from '@/app/lib/category';
import { COLORS } from '@/app/theme';
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
interface AddArticleFormProps {
  value?: ArticleFormData;
  onDataChange?: (data: ArticleFormData) => void;
  onSubmit?: (data: ArticleFormData) => void;
}

const inputClass =
  'text-sm w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200';

function RadioGroupField({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className='flex items-center gap-8'>
      {options.map((opt) => (
        <label key={opt} className='flex items-center gap-2 cursor-pointer select-none'>
          <input
            type='radio'
            name={name}
            value={opt}
            checked={value === opt}
            onChange={onChange}
            className='w-4 h-4 accent-indigo-700 cursor-pointer'
          />
          <span className='text-sm text-slate-700'>{opt}</span>
        </label>
      ))}
    </div>
  );
}

export default function AddArticleForm({ value, onDataChange, onSubmit }: AddArticleFormProps) {
  const [formData, setFormData] = useState<ArticleFormData>(
    value ?? {
      title: '',
      alias: '',
      catId: '',
      featured: '',
      type: '',
      status: '',
      introDescription: '',
      fullDescription: '',
      authorEmail: '',
      paypalId: '',
    }
  );
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const nextFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(nextFormData);
    onDataChange?.(nextFormData);
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const alias = title.trim().toLowerCase().replace(/\s+/g, '-'); // spaces → hyphens

    const nextFormData = {
      ...formData,
      title,
      alias,
    };

    setFormData(nextFormData);
    onDataChange?.(nextFormData);
  };
  const handleChangeRef = useRef(handleChange);

  useEffect(() => {
    handleChangeRef.current = handleChange;
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const [categories, setCategories] = useState<Category[]>([]);

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
  }, []);

  return (
    <div className='w-full max-w-xl bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-5'>
      <div className='px-6 py-4' style={{ backgroundColor: COLORS.primary }}>
        {' '}
        <h1 className='text-white text-lg text-sm'>Add Article</h1>
      </div>
      <form className='px-6 py-6 space-y-5' onSubmit={handleSubmit}>
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>
            Title <span className='text-red-500'>*</span>
          </label>
          <input type='text' name='title' placeholder='Title' value={formData.title} onChange={handleTitleChange} className={inputClass} />
        </div>

        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>
            Alias <span className='text-red-500'>*</span>
          </label>
          <input type='text' name='alias' placeholder='Alias' value={formData.alias} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>
            Category <span className='text-red-500'>*</span>
          </label>

          <select name='catId' value={formData.catId} onChange={handleChange} className={inputClass}>
            <option value=''>Please Select Category</option>
            {categories.map((category) => (
              <option key={category.catId} value={category.catId}>
                {category.title}
              </option>
            ))}
          </select>
        </div>

        <div className='flex items-center gap-6'>
          <label className='text-sm font-semibold'>
            Featured <span className='text-red-500'>*</span>:
          </label>
          <RadioGroupField name='featured' options={['Yes', 'No']} value={formData.featured} onChange={handleChange} />
        </div>

        <div className='flex items-center gap-6'>
          <label className='text-sm font-semibold'>
            Type <span className='text-red-500'>*</span>:
          </label>

          <RadioGroupField name='type' options={['free', 'paid']} value={formData.type} onChange={handleChange} />
        </div>

        <div className='flex items-center gap-6'>
          <label className='text-sm font-semibold'>
            Status <span className='text-red-500'>*</span>:
          </label>
          <RadioGroupField name='status' options={['Yes', 'No']} value={formData.status} onChange={handleChange} />
        </div>
        {/* Show only when paid is selected */}
        {formData.type === 'paid' && (
          <div className='mt-6 space-y-4'>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                Author Email <span className='text-red-500'>*</span>
              </label>
              <input
                type='email'
                name='authorEmail'
                placeholder='Enter Email'
                value={formData.authorEmail}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>Paypal Id</label>
              <input
                type='text'
                name='paypalId'
                placeholder='Enter Paypal Id'
                value={formData.paypalId}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        )}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>
            Short Description <span className='text-red-500'>*</span>
          </label>
          <textarea
            name='introDescription'
            placeholder='Short Description'
            rows={2}
            value={formData.introDescription}
            onChange={handleChange}
            className={`${inputClass} resize-y`}
          />
        </div>

        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>
            Full Description <span className='text-red-500'>*</span>
          </label>

          {/* <SunEditor
            setContents={formData.fullDescription}
            onChange={(content) =>
              handleChange({
                target: { name: 'fullDescription', value: content },
              } as ChangeEvent<HTMLTextAreaElement>)
            }
            setOptions={{
              buttonList: [
                ['undo', 'redo'],
                ['bold', 'italic', 'underline'],
                ['align'],
                ['formatBlock'],
                ['font', 'fontSize'],
                ['fontColor', 'hiliteColor'],
                ['link'],
                ['horizontalRule'],
                ['removeFormat'],
                ['codeView'],
              ],
              font: ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'],
              formats: ['p', 'div', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
              defaultStyle: 'font-family: Times New Roman; font-size: 12pt;',
              placeholder: 'Full Description',
              defaultTag: 'div',
            }}
            height='150px'
          /> */}
          <SunEditor
            setContents={formData.fullDescription}
            onChange={(content) =>
              handleChangeRef.current({
                target: { name: 'fullDescription', value: content },
              } as ChangeEvent<HTMLTextAreaElement>)
            }
            setOptions={{
              buttonList: [
                ['undo', 'redo'],
                ['bold', 'italic', 'underline'],
                ['align'],
                ['formatBlock'],
                ['font', 'fontSize'],
                ['fontColor', 'hiliteColor'],
                ['link'],
                ['horizontalRule'],
                ['removeFormat'],
                ['codeView'],
              ],
              font: ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'],
              formats: ['p', 'div', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
              defaultStyle: 'font-family: Times New Roman; font-size: 12pt;',
              placeholder: 'Full Description',
              defaultTag: 'div',
            }}
            height='150px'
          />
        </div>
      </form>
    </div>
  );
}
