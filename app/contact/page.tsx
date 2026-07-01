'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ContactUsPage() {
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    subject: '',
    message: '',
    sendcopy: 0,
  });

  const [submitAttempt, setSubmitAttempt] = useState(false);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!form.fullname || !form.email || !form.subject || !form.message) {
  //     setSubmitAttempt(true);
  //     return;
  //   }

  //   // Or log the entire object
  //   console.log(form);
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault(); // Prevent page refresh

  //   try {
  //     const response = await fetch('/api/contact', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         name: form.fullname,
  //         email: form.email,
  //         message: form.message,
  //         subject: form.subject,
  //         sendcopy: form.sendcopy,
  //       }),
  //     });

  //     if (!form.fullname || !form.email || !form.subject || !form.message) {
  //       setSubmitAttempt(true);
  //       return;
  //     }

  //     setSubmitAttempt(false);

  //     const data = await response.json();
  //     console.log('Success:', data);
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate for the form
    if (!form.fullname || !form.email || !form.subject || !form.message) {
      setSubmitAttempt(true);
      return; 
    }

    setSubmitAttempt(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.fullname,
          email: form.email,
          message: form.message,
          subject: form.subject,
          sendcopy: form.sendcopy,
        }),
      });

      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div className='flex-1 p-5'>
      <div className='rounded border border-gray-300 bg-white p-5'>
        <h1 className='mb-2 text-2xl font-bold text-sky-500'>Contact</h1>

        <p className='mb-8 text-[12px] font-semibold text-black'>
          Send an email. All fields with <span className='text-red-500'>*</span> are required.
        </p>

        {submitAttempt && (
          <div className='mb-5 text-[12px] text-red-600'>
            All fields with <span>*</span> are required.
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Name */}
          <div className='grid grid-cols-1 items-center gap-3 md:grid-cols-12'>
            <label className='text-[12px] font-bold md:col-span-2'>
              Name <span className='text-red-500'>*</span>
            </label>

            <div className='md:col-span-10'>
              <input
                type='text'
                value={form.fullname}
                onChange={(e) => {
                  setForm({
                    ...form,
                    fullname: e.target.value,
                  });
                  setSubmitAttempt(false);
                }}
                className='h-11 w-full rounded border border-gray-300 px-3 focus:border-sky-500 focus:outline-none'
              />
              
            </div>
          </div>

          {/* Email */}
          <div className='grid grid-cols-1 items-center gap-3 md:grid-cols-12'>
            <label className='text-[12px] font-bold md:col-span-2'>
              Email <span className='text-red-500'>*</span>
            </label>

            <div className='md:col-span-10'>
              <input
                type='email'
                value={form.email}
                onChange={(e) => {
                  setForm({
                    ...form,
                    email: e.target.value,
                  });
                  setSubmitAttempt(false);
                }}
                className='h-11 w-full rounded border border-gray-300 px-3 focus:border-sky-500 focus:outline-none'
              />
            </div>
          </div>

          {/* Subject */}
          <div className='grid grid-cols-1 items-center gap-3 md:grid-cols-12'>
            <label className='text-[12px] font-bold md:col-span-2'>
              Subject <span className='text-red-500'>*</span>
            </label>

            <div className='md:col-span-10'>
              <input
                type='text'
                value={form.subject}
                onChange={(e) => {
                  setForm({
                    ...form,
                    subject: e.target.value,
                  });
                  setSubmitAttempt(false);
                }}
                className='h-11 w-full rounded border border-gray-300 px-3 focus:border-sky-500 focus:outline-none'
              />
            </div>
          </div>

          {/* Message */}
          <div className='grid grid-cols-1 gap-3 md:grid-cols-12'>
            <label className='pt-2 text-[12px] font-bold md:col-span-2'>
              Message <span className='text-red-500'>*</span>
            </label>

            <div className='md:col-span-10'>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => {
                  setForm({
                    ...form,
                    message: e.target.value,
                  });
                  setSubmitAttempt(false);
                }}
                className='w-full rounded border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
              />
            </div>
          </div>

          {/* Send Copy */}
          <div className='grid grid-cols-1 gap-3 md:grid-cols-12'>
            <div className='hidden md:block md:col-span-2'></div>

            <div className='md:col-span-10'>
              <label className='flex items-center gap-2 text-[12px] font-semibold'>
                <input
                  type='checkbox'
                  checked={form.sendcopy === 1}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      sendcopy: e.target.checked ? 1 : 0,
                    });
                    setSubmitAttempt(false);
                  }}
                  className='h-4 w-4'
                />
                Send copy to yourself
              </label>
            </div>
          </div>

          {/* Captcha Placeholder */}
          {/* <div className='grid grid-cols-1 gap-3 md:grid-cols-12'>
            <label className='text-[12px] font-bold md:col-span-2'>
              Captcha <span className='text-red-500'>*</span>
            </label>

            <div className='md:col-span-10'>
              <div className='flex h-20 w-[300px] items-center rounded border border-gray-300 bg-gray-50 px-4'>
                <span className='text-[12px] text-gray-500'>Google reCAPTCHA</span>
              </div>
            </div>
          </div> */}

          {/* {submitAttempt && (
            <div className="text-[12px] text-red-600">
              All fields with <span>*</span> are required.
            </div>
          )} */}

          {/* Submit */}
          {/* <div className="pt-2">
            <button
              type="submit"
              className="rounded bg-red-500 px-2 py-2 text-[12px] font-semibold text-white transition hover:bg-red-600"
            >
              Send Email
            </button>
          </div> */}
          {/* 
            <Link className='bg-cyan-500 text-white hover:bg-cyan-600 rounded-full px-12 py-2 text-[14px]' href='/send-email'>
          Send Email
        </Link> */}
          {/* <button type='submit' className='rounded-full bg-cyan-500 px-12 py-2 text-[14px] text-white hover:bg-cyan-600'>
            Send Email
          </button> */}

          <button type='submit' className='rounded-full bg-cyan-500 px-12 py-2 text-[14px] text-white hover:bg-cyan-600'>
            Send Email
          </button>
        </form>
      </div>
    </div>
  );
}
