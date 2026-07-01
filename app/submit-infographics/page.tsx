'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function SubmitInfographics() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className='flex-1 p-5'>
      <div className='rounded-lg border border-gray-300 bg-white p-5'>
        {/* Intro Section */}
        {!showForm && (
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-12'>
            <div className='lg:col-span-8'>
              <h2 className='mb-4 text-[30px] font-bold text-cyan-600'>Submit Infographics</h2>

              {/* Social Buttons */}
              <div className='mb-6 flex flex-wrap gap-2'>
                <Image src='/assets/pinterest.svg' alt='Pinterest' width={50} height={32} />
                <Image src='/assets/Facebook.svg' alt='Facebook' width={50} height={32} />
                <Image src='/assets/twitter.svg' alt='Twitter' width={50} height={32} />
                <Image src='/assets/linkedin.svg' alt='LinkedIn' width={50} height={32} />
              </div>

              <div className='space-y-4 text-[12px]'>
                <p>
                  Do you create infographics for fun? Or do you believe that infographics or information graphics are the best tools for
                  visual representation and interpretation of data, information and knowledge? Well, you will surely want to showcase your
                  creativity to the world. Well, go ahead and share your work with infographics posters. Submit your work here; we will
                  review your request for publishing.
                </p>

                <div>
                  <h3 className='font-semibold'>Infographics</h3>
                  <p>
                    Infographics are gaining popularity as visual presentations of information as they not only make information easy to
                    interpret but also convey it in a fun and pleasing manner. An infographics poster may contain data, graphs, statistics
                    and images that are out together to convey some message or principle.
                  </p>
                </div>

                <div>
                  <h3 className='font-semibold'>About Infographics Posters</h3>
                  <p>
                    Buzz around infographics is growing, so Infographics Posters provides a platform for infographic fans to come together
                    and share their work. Here, you will find infographics on diverse topics from food to travel, web designing to
                    technology, and fashion to gaming that are submitted by infographic creators like you.
                  </p>
                </div>

                <div>
                  <h3 className='font-semibold'>Benefits of Submitting Posters</h3>
                  <p>
                    With Infographics Posters, you will not only get an opportunity of showcasing your creativity to the online audience,
                    but there are several other benefits too, which includes –
                  </p>
                  <ul className='list-disc pl-5'>
                    <li>You will get an SEO friendly link to your infographics page (author URL).</li>
                    <li>Your infographics can help in getting traffic to your site.</li>
                    <li>You can use your infographics poster for branding promotion.</li>
                  </ul>
                </div>

                <div>
                  <h3 className='font-semibold'>Submitting Infographics Posters</h3>
                  <p>
                    Before publishing any infographics, we review it to make sure that it is fit to create the best possible user experience
                    for our visitors. So, for publishing your infographics with us, make sure it adheres to the following guidelines –
                  </p>
                  <ul className='list-disc pl-5'>
                    <li>It should not be based on subjects like porn and gambling.</li>
                    <li>It should not contain nudity or obscene images.</li>
                    <li>It must have short yet creative title.</li>
                    <li>
                      Description of the infographic should be around 100 words. Make sure that it is informative and explains the concept
                      behind your work.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className='font-semibold'>Payment Process and Publishing</h3>

                  <p>
                    After you make the payment of $30, you will be redirected to the infographics submission form. We will review your work
                    and publish it in 2 business days.
                  </p>
                </div>

                <p>Go ahead, let your infographics poster reveal your creativity!</p>
              </div>
            </div>

            {/* Payment Card */}
            <div className='lg:col-span-4'>
              <div className='overflow-hidden rounded-lg border border-gray-300'>
                <div className='bg-gray-100 p-3 text-[12px] font-semibold'>Now Pay Only $30</div>

                <div className='p-5'>
                  <div id='paypal-button-container' className='min-h-[120px]' />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Section */}
        {showForm && (
          <div>
            <h2 className='mb-2 text-3xl font-bold text-sky-500'>Add New Infographics</h2>

            <p className='mb-6 text-[12px] text-gray-500'>
              Send an email. Fields marked with
              <span className='text-red-500'> *</span> are required.
            </p>

            <form className='space-y-5'>
              {/* <FormField label='Title' required>
                <input type='text' placeholder='Title' className='w-full rounded border p-2' />
              </FormField>

              <FormField label='Category' required>
                <select className='w-full rounded border p-2'>
                  <option>Select Category</option>
                </select>
              </FormField>

              <FormField label='Email' required>
                <input type='email' placeholder='Email' className='w-full rounded border p-2' />
              </FormField>

              <FormField label='Description' required>
                <textarea rows={4} placeholder='Full description text' className='w-full rounded border p-2' />
              </FormField>

              <FormField label='Infographics URL' required>
                <input type='text' placeholder='Image URL' className='w-full rounded border p-2' />
              </FormField>

              <FormField label='Facebook'>
                <input type='text' placeholder='Facebook' className='w-full rounded border p-2' />
              </FormField>

              <FormField label='Facebook URL'>
                <input type='text' placeholder='Facebook URL' className='w-full rounded border p-2' />
              </FormField>

              <FormField label='Twitter'>
                <input type='text' placeholder='Twitter' className='w-full rounded border p-2' />
              </FormField>

              <FormField label='Twitter URL'>
                <input type='text' placeholder='Twitter URL' className='w-full rounded border p-2' />
              </FormField> */}

              <div className='flex justify-center gap-4'>
                <button type='submit' className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
                  Add Article
                </button>

                <button type='reset' className='rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600'>
                  Reset
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// type FormFieldProps = {
//   label: string;
//   required?: boolean;
//   children: React.ReactNode;
// };

// function FormField({
//   label,
//   required,
//   children,
// }: FormFieldProps) {
//   return (
//     <div className="grid grid-cols-1 gap-2 md:grid-cols-12 md:items-center">
//       <label className="text-[12px] font-medium md:col-span-2">
//         {label}
//         {required && (
//           <span className="ml-1 text-red-500">*</span>
//         )}
//       </label>

//       <div className="md:col-span-10">{children}</div>
//     </div>
//   );
// }
