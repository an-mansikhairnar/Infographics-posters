// 'use client';
// import { UploadImageFormData } from '@/app/interfaces/UploadImageFormData';
// import { useState, useEffect } from 'react';
// import type { ChangeEvent, FormEvent } from 'react';
// interface UploadImageFormProps {
//   initialValues: UploadImageFormData | null;
//   onDataChange: (data: UploadImageFormData) => void;
//   onSubmit?: (data: UploadImageFormData) => void;
// }
// const inputClass =
//   'text-sm w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200';

// const fileButtonClass = 'text-sm border border-gray-300 rounded-md px-1 py-1 bg-gray-50 hover:bg-gray-100 cursor-pointer';

// const BASE_URL = 'https://images.infographicsposters.com';
// const FULL_IMG_BASE = '/images/stories/infographics';
// const THUMB_IMG_BASE = '/images/stories/infographics-thumb';

// const FOLDER_OPTIONS = ['IP3501-IP4000', 'IP4001-IP4500'];

// export default function UploadImageForm({ initialValues, onDataChange, onSubmit }: UploadImageFormProps) {
// const [formData, setFormData] = useState<UploadImageFormData>(
//   initialValues ?? {
//     imgFolder: FOLDER_OPTIONS[1],
//     fullImageUrl: '',
//     thumbImageUrl: '',
//     imageAltText: '',
//     fullImageFile: null,
//     thumbImageFile: null,
//   }
// );
//   const buildUrl = (base: string, folder: string, fileName: string) => (fileName ? `${BASE_URL}${base}/${folder}/${fileName}` : '');

//   // Push initial state up so parent never sees `undefined`
//   useEffect(() => {
//     onDataChange?.(formData);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     const nextFormData = { ...formData, [name]: value };
//     setFormData(nextFormData);
//     onDataChange?.(nextFormData);
//   };

//   const handleFolderChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     const folder = e.target.value;
//     const nextFormData: UploadImageFormData = {
//       ...formData,
//       imgFolder: folder,
//       fullImageUrl: buildUrl(FULL_IMG_BASE, folder, formData.fullImageFile?.name ?? ''),
//       thumbImageUrl: buildUrl(THUMB_IMG_BASE, folder, formData.thumbImageFile?.name ?? ''),
//     };
//     setFormData(nextFormData);
//     onDataChange?.(nextFormData);
//   };

//   const handleFileChange = (field: 'fullImageFile' | 'thumbImageFile') => (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] ?? null;
//     const fileName = file?.name ?? '';

//     const nextFormData: UploadImageFormData = {
//       ...formData,
//       [field]: file,
//       ...(field === 'fullImageFile'
//         ? { fullImageUrl: buildUrl(FULL_IMG_BASE, formData.imgFolder, fileName) }
//         : { thumbImageUrl: buildUrl(THUMB_IMG_BASE, formData.imgFolder, fileName) }),
//     };

//     setFormData(nextFormData);
//     onDataChange?.(nextFormData);
//   };

//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     onSubmit?.(formData);
//   };

//   return (
//     <div className='w-full max-w-xl bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-5'>
//       <div className='bg-[#3f51b5] px-6 py-4'>
//         <h1 className='text-white text-lg text-sm'>Images</h1>
//       </div>
//       <form className='px-6 py-6 space-y-5' onSubmit={handleSubmit}>
//         <div>
//           <label className='block text-sm font-medium text-gray-700 mb-1.5'>
//             Select Folder For Images:- <span className='text-red-500'>*</span>
//           </label>
//           <select name='imgFolder' value={formData.imgFolder} onChange={handleFolderChange} className={inputClass}>
//             {FOLDER_OPTIONS.map((folder) => (
//               <option key={folder} value={folder}>
//                 {folder}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className='block text-sm font-medium text-gray-700 mb-1.5'>
//             Full Image <span className='text-red-500'>*</span>
//           </label>
//           <div className='flex items-center gap-3'>
//             <label className={fileButtonClass}>
//               Choose file
//               <input type='file' accept='image/*' onChange={handleFileChange('fullImageFile')} className='hidden' />
//             </label>
//             <span className='text-sm text-gray-500 truncate'>
//               {formData.fullImageFile ? formData.fullImageFile.name : 'No file chosen'}
//             </span>
//           </div>
//           {formData.fullImageUrl && <p className='text-xs text-gray-500 mt-1 break-all'>{formData.fullImageUrl}</p>}
//         </div>

//         <div>
//           <label className='block text-sm font-medium text-gray-700 mb-1.5'>
//             Thumb Image <span className='text-red-500'>*</span>
//           </label>
//           <div className='flex items-center gap-3'>
//             <label className={fileButtonClass}>
//               Choose file
//               <input type='file' accept='image/*' onChange={handleFileChange('thumbImageFile')} className='hidden' />
//             </label>
//             <span className='text-sm text-gray-500 truncate'>
//               {formData.thumbImageFile ? formData.thumbImageFile.name : 'No file chosen'}
//             </span>
//           </div>
//           <p className='text-xs text-gray-500 mt-1'>( Upload an image with dimensions 372x574 pixels..)</p>
//           {formData.thumbImageUrl && <p className='text-xs text-gray-500 mt-1 break-all'>{formData.thumbImageUrl}</p>}
//         </div>

//         <div>
//           <label className='block text-sm font-medium text-gray-700 mb-1.5'>
//             Image Alt Text <span className='text-red-500'>*</span>
//           </label>
//           <input
//             type='text'
//             name='imageAltText'
//             placeholder='Imagealt Text'
//             value={formData.imageAltText}
//             onChange={handleTextChange}
//             className={inputClass}
//           />
//         </div>
//       </form>
//     </div>
//   );
// }
'use client';
import { UploadImageFormData } from '@/app/interfaces/UploadImageFormData';
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-hot-toast';
interface UploadImageFormProps {
  value?: UploadImageFormData;
  onDataChange: (data: UploadImageFormData) => void;
  onSubmit?: (data: UploadImageFormData) => void;
}
const inputClass =
  'text-sm w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200';

const fileButtonClass = 'text-sm border border-gray-300 rounded-md px-1 py-1 bg-gray-50 hover:bg-gray-100 cursor-pointer';

const BASE_URL = 'https://images.infographicsposters.com';
const FULL_IMG_BASE = '/images/stories/infographics';
const THUMB_IMG_BASE = '/images/stories/infographics-thumb';

const FOLDER_OPTIONS = ['IP3501-IP4000', 'IP4001-IP4500'];

export default function UploadImageForm({ value, onDataChange, onSubmit }: UploadImageFormProps) {
  const [formData, setFormData] = useState<UploadImageFormData>(
    value ?? {
      imgFolder: FOLDER_OPTIONS[1],
      fullImageUrl: '',
      thumbImageUrl: '',
      imageAltText: '',
      fullImageFile: null,
      thumbImageFile: null,
    }
  );

  const buildUrl = (base: string, folder: string, fileName: string) => (fileName ? `${BASE_URL}${base}/${folder}/${fileName}` : '');

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);
    onDataChange?.(nextFormData);
  };

  const handleFolderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const folder = e.target.value;
    const nextFormData: UploadImageFormData = {
      ...formData,
      imgFolder: folder,
      fullImageUrl: buildUrl(FULL_IMG_BASE, folder, formData.fullImageFile?.name ?? ''),
      thumbImageUrl: buildUrl(THUMB_IMG_BASE, folder, formData.thumbImageFile?.name ?? ''),
    };
    setFormData(nextFormData);
    onDataChange?.(nextFormData);
  };

  const REQUIRED_THUMB_WIDTH = 372;
  const REQUIRED_THUMB_HEIGHT = 574;

  const checkImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image'));
      };

      img.src = objectUrl;
    });
  };

  // const handleFileChange = (field: 'fullImageFile' | 'thumbImageFile') => async (e: ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0] ?? null;

  //   if (!file) {
  //     const nextFormData: UploadImageFormData = { ...formData, [field]: null };
  //     setFormData(nextFormData);
  //     onDataChange?.(nextFormData);
  //     return;
  //   }

  //   // Validate dimensions only for the thumb image
  //   if (field === 'thumbImageFile') {
  //     try {
  //       const { width, height } = await checkImageDimensions(file);

  //       if (width !== REQUIRED_THUMB_WIDTH || height !== REQUIRED_THUMB_HEIGHT) {
  //         toast.error(
  //           `Thumb image must be exactly ${REQUIRED_THUMB_WIDTH}x${REQUIRED_THUMB_HEIGHT} pixels. This image is ${width}x${height}.`
  //         );
  //         e.target.value = ''; // reset the file input so the same invalid file can be reselected after fixing
  //         return;
  //       }
  //     } catch {
  //       toast.error('Could not read image dimensions. Please try another file.');
  //       e.target.value = '';
  //       return;
  //     }
  //   }

  //   const fileName = file.name;

  //   const nextFormData: UploadImageFormData = {
  //     ...formData,
  //     [field]: file,
  //     ...(field === 'fullImageFile'
  //       ? { fullImageUrl: buildUrl(FULL_IMG_BASE, formData.imgFolder, fileName) }
  //       : { thumbImageUrl: buildUrl(THUMB_IMG_BASE, formData.imgFolder, fileName) }),
  //   };

  //   setFormData(nextFormData);
  //   onDataChange?.(nextFormData);
  // };
  const handleFileChange = (field: 'fullImageFile' | 'thumbImageFile') => async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      const nextFormData: UploadImageFormData = { ...formData, [field]: null };
      setFormData(nextFormData);
      onDataChange?.(nextFormData);
      return;
    }

    // Validate dimensions only for the thumb image
    if (field === 'thumbImageFile') {
      try {
        const { width, height } = await checkImageDimensions(file);

        if (width !== REQUIRED_THUMB_WIDTH || height !== REQUIRED_THUMB_HEIGHT) {
          toast.error(
            `Thumb image must be exactly ${REQUIRED_THUMB_WIDTH}x${REQUIRED_THUMB_HEIGHT} pixels. This image is ${width}x${height}.`
          );
          e.target.value = ''; // reset the file input so the same invalid file can be reselected after fixing
          return;
        }
      } catch {
        toast.error('Could not read image dimensions. Please try another file.');
        e.target.value = '';
        return;
      }
    }

    const fileName = file.name;

    const nextFormData: UploadImageFormData = {
      ...formData,
      [field]: file,
      ...(field === 'fullImageFile'
        ? { fullImageUrl: buildUrl(FULL_IMG_BASE, formData.imgFolder, fileName) }
        : { thumbImageUrl: buildUrl(THUMB_IMG_BASE, formData.imgFolder, fileName) }),
    };

    setFormData(nextFormData);
    onDataChange?.(nextFormData);
  };
  // const handleFileChange = (field: 'fullImageFile' | 'thumbImageFile') => (e: ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0] ?? null;
  //   const fileName = file?.name ?? '';

  //   const nextFormData: UploadImageFormData = {
  //     ...formData,
  //     [field]: file,
  //     ...(field === 'fullImageFile'
  //       ? { fullImageUrl: buildUrl(FULL_IMG_BASE, formData.imgFolder, fileName) }
  //       : { thumbImageUrl: buildUrl(THUMB_IMG_BASE, formData.imgFolder, fileName) }),
  //   };

  //   setFormData(nextFormData);
  //   onDataChange?.(nextFormData);
  // };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(formData);
  };
  // Add this near the top, after buildUrl
  const getPreviewUrl = (file: File | null, savedUrl: string) => {
    if (file) return URL.createObjectURL(file);
    return savedUrl || '';
  };

  return (
    <div className='w-full max-w-xl bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-5'>
      <div className='bg-[#3f51b5] px-6 py-4'>
        <h1 className='text-white text-lg text-sm'>Images</h1>
      </div>
      <form className='px-6 py-6 space-y-5' onSubmit={handleSubmit}>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1.5'>
            Select Folder For Images:- <span className='text-red-500'>*</span>
          </label>
          <select name='imgFolder' value={formData.imgFolder} onChange={handleFolderChange} className={inputClass}>
            {FOLDER_OPTIONS.map((folder) => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
          </select>
        </div>

        {/* <div>
          <label className='block text-sm font-medium text-gray-700 mb-1.5'>
            Full Image <span className='text-red-500'>*</span>
          </label>
          <div className='flex items-center gap-3'>
            <label className={fileButtonClass}>
              Choose file
              <input type='file' accept='image/*' onChange={handleFileChange('fullImageFile')} className='hidden' />
            </label>
            <span className='text-sm text-gray-500 truncate'>
              {formData.fullImageFile ? formData.fullImageFile.name : 'No file chosen'}
            </span>
            {(formData.thumbImageFile || formData.thumbImageUrl) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getPreviewUrl(formData.thumbImageFile, formData.thumbImageUrl)}
                alt='Thumb preview'
                className='w-16 object-cover rounded-md border border-gray-200'
              />
            )}
          </div>
          {formData.fullImageUrl && <p className='text-xs text-gray-500 mt-1 break-all'>{formData.fullImageUrl}</p>}
        </div> */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1.5'>
            Full Image <span className='text-red-500'>*</span>
          </label>
          <div className='flex items-center gap-3'>
            <label className={fileButtonClass}>
              Choose file
              <input type='file' accept='image/*' onChange={handleFileChange('fullImageFile')} className='hidden' />
            </label>
            <span className='text-sm text-gray-500 truncate'>
              {formData.fullImageFile ? formData.fullImageFile.name : 'No file chosen'}
            </span>
            {(formData.fullImageFile || formData.fullImageUrl) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getPreviewUrl(formData.fullImageFile, formData.fullImageUrl)}
                alt='Full preview'
                className='w-16 object-cover rounded-md border border-gray-200'
              />
            )}
          </div>
          {/* {formData.fullImageUrl && <p className='text-xs text-gray-500 mt-1 break-all'>{formData.fullImageUrl}</p>} */}
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1.5'>
            Thumb Image <span className='text-red-500'>*</span>
          </label>
          <div className='flex items-center gap-3'>
            <label className={fileButtonClass}>
              Choose file
              <input type='file' accept='image/*' onChange={handleFileChange('thumbImageFile')} className='hidden' />
            </label>
            <span className='text-sm text-gray-500 truncate'>
              {formData.thumbImageFile ? formData.thumbImageFile.name : 'No file chosen'}
            </span>
            {(formData.thumbImageFile || formData.thumbImageUrl) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getPreviewUrl(formData.thumbImageFile, formData.thumbImageUrl)}
                alt='Thumb preview'
                className='w-16 object-cover rounded-md border border-gray-200'
              />
            )}
          </div>
          <p className='text-xs text-gray-500 mt-1'>( Upload an image with dimensions 372x574 pixels..)</p>
          {/* {formData.thumbImageUrl && <p className='text-xs text-gray-500 mt-1 break-all'>{formData.thumbImageUrl}</p>} */}
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1.5'>
            Image Alt Text <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='imageAltText'
            placeholder='Imagealt Text'
            value={formData.imageAltText}
            onChange={handleTextChange}
            className={inputClass}
          />
        </div>
      </form>
    </div>
  );
}
