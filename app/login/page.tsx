'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    if (formData.email) {
      localStorage.setItem('email', formData.email);
    }
  }, [formData.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Login failed');
        return;
      }
      localStorage.setItem('token', data.token);
      toast.success('Login successful');

      router.push('/articles');
    } catch (err) {
      setMessage('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='w-full max-w-[540px] rounded border border-gray-200 bg-white'>
        {/* Header */}
        <div className='border-b py-5 border-gray-200'>
          <h2 className='text-center text-2xl font-semibold text-gray-800'>Login</h2>
        </div>

        {/* Form */}
        <div className='p-6'>
          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* Email */}
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-600'>Email address</label>

              <input
                type='email'
                name='email'
                placeholder='Email'
                value={formData.email}
                onChange={handleChange}
                required
                className='h-11 w-full rounded border border-gray-300 px-4 outline-none focus:border-blue-500'
              />
            </div>

            {/* Password */}
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-600'>Password</label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  placeholder='Password'
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className='h-11 w-full rounded border border-gray-300 px-4 pr-10 outline-none focus:border-blue-500'
                />

                {showPassword ? (
                  <FiEye
                    onClick={() => setShowPassword(false)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500'
                  />
                ) : (
                  <FiEyeOff
                    onClick={() => setShowPassword(true)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500'
                  />
                )}
              </div>
            </div>

            {/* Remember */}
            <div className='flex items-center gap-2'>
              <input type='checkbox' className='h-5 w-5 rounded border-gray-300' />

              <span className='text-sm font-medium text-gray-700'>Remember me</span>
            </div>

            {/* Button */}
            <button
              type='submit'
              disabled={loading}
              className='h-11 w-full rounded border border-blue-300 bg-blue-600 text-white font-semibold hover:bg-blue-300 disabled:opacity-60'
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>

            {message && <p className='text-center text-sm text-red-500'>{message}</p>}

            {/* Optional */}
          </form>
        </div>
      </div>
    </div>
  );
}
