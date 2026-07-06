'use client';

import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
export default function ContactUsPage() {
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    subject: '',
    message: '',
    sendcopy: 0,
  });

  const [submitAttempt, setSubmitAttempt] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullname || !form.email || !form.subject || !form.message || !captchaToken) {
      setSubmitAttempt(true);
      return;
    }

    setSubmitAttempt(false);

    try {
      const response = await fetch('https://server.infographicsposters.com/contactUs/mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactUsFormData: {
            name: form.fullname,
            email: form.email,
            subject: form.subject,
            message: form.message,
            sendcopy: form.sendcopy === 1,
          },
        }),
      });

      const text = await response.text();
      console.log('Status:', response.status);
      console.log(text);

      if (!response.ok) {
        throw new Error(text);
      }
    } catch (err) {
      console.error(err);
    }
  };

  <ReCAPTCHA
    sitekey='YOUR_SITE_KEY'
    onChange={(token) => setCaptchaToken(token)}
    onExpired={() => {
      setCaptchaToken(null);
      alert('Captcha expired. Please verify again.');
    }}
    onErrored={() => {
      setCaptchaToken(null);
      alert('Captcha failed to load. Please try again.');
    }}
  />;
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
                className='h-11 text-[12px] w-full rounded border border-gray-300 px-3 focus:border-sky-500 focus:outline-none'
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
                className='h-11 text-[12px] w-full rounded border border-gray-300 px-3 focus:border-sky-500 focus:outline-none'
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
                className='h-11 text-[12px] w-full rounded border border-gray-300 px-3 focus:border-sky-500 focus:outline-none'
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
                className='w-full text-[12px] rounded border border-gray-300 px-3 py-2 focus:border-sky-500 focus:outline-none'
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

          {/* Captcha */}
          <div className='grid grid-cols-1 gap-3 md:grid-cols-12'>
            <label className='text-[12px] font-bold md:col-span-2'>
              Captcha <span className='text-red-500'>*</span>
            </label>

            <div className='md:col-span-10'>
              <ReCAPTCHA
                sitekey='6LfheU8UAAAAAFe7JHD6__tzdHKk1KCkmneGAtOd'
                onChange={(token) => {
                  setCaptchaToken(token);
                  setSubmitAttempt(false);
                }}
                onExpired={() => setCaptchaToken(null)}
              />

              {submitAttempt && !captchaToken && <p className='mt-2 text-[12px] text-red-600'>Please complete the captcha.</p>}
            </div>
          </div>

          <button type='submit' className='rounded bg-red-600 px-2 py-2 text-[14px] text-white hover:bg-red-700 font-semibold'>
            Send Email
          </button>
        </form>
      </div>
    </div>
  );
}
