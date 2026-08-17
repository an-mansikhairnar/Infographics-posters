'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FacebookShareButton, LinkedinShareButton, PinterestShareButton, TwitterShareButton } from 'react-share';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import CheckoutComponent from '../component/CheckoutComponent/CheckoutComponent';
import { getCategories } from '../lib/categories';
import { Category } from '../interfaces/category';

export default function SubmitInfographics() {
  const [showForm, setShowForm] = useState(false);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const shareUrl = `${siteUrl}/submit-infographics.html`;
  const title = 'Submit Infographics';
  const media = `${siteUrl}/logo-infographics.png`;

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const isPaypalConfigured = Boolean(paypalClientId);

  const initialOptions = {
    clientId: paypalClientId!,
    currency: 'USD',
    intent: 'capture',
    'disable-funding': 'card',
  };

  const [submitAttempt, setSubmitAttempt] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    catId: '',
    email: '',
    description: '',
    imgUrl: '',
    // Optional social fields
    facebook: '',
    facebookUrl: '',
    twitter: '',
    twitterUrl: '',
    instagram: '',
    instagramUrl: '',
    // Optional
    liveUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSubmitAttempt(false);
  };

  const [paymentData, setPaymentData] = useState<{
    orderId: string;
    payerId: string;
    transactionId: string;
    amount: string;
    currency: string;
    state: string;
    address: string;
    clientName: string;
  } | null>(null);

  const addNewArticle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Payment is mandatory
    if (!paymentData) {
      alert('Please complete the payment first.');
      return;
    }

    // PayPal transaction is mandatory
    if (!paymentData.transactionId) {
      alert('PayPal payment was not completed.');
      return;
    }

    // Validate form
    if (!formData.title.trim() || !formData.catId || !formData.email.trim() || !formData.description.trim() || !formData.imgUrl.trim()) {
      setSubmitAttempt(true);
      return;
    }

    // Everything is valid
    setSubmitAttempt(false);

    try {
      const payload = {
        title: formData.title.trim(),
        catId: Number(formData.catId),
        email: formData.email.trim(),
        desc: formData.description.trim(),
        imgUrl: formData.imgUrl.trim(),
        // Optional social fields
        facebook: formData.facebook.trim() || '',
        facebookUrl: formData.facebookUrl.trim() || '',
        twitter: formData.twitter.trim() || '',
        twitterUrl: formData.twitterUrl.trim() || '',
        instagram: '',
        instagramUrl: '',
        // PayPal
        paypalTransaction: paymentData.transactionId,
        payerId: paymentData.payerId,
        paypalId: paymentData.orderId,
        clientName: paymentData.clientName,
        amount: Number(paymentData.amount),
        currency: paymentData.currency,
        state: paymentData.state,
        address: paymentData.address,
        liveUrl: '',
      };

      console.log('Sending payload:', payload);

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      console.log('API response:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit infographic');
      }

      alert('Congratulations! Your infographic was submitted successfully.');

      // Reset everything AFTER successful submission
      resetForm();
      setPaymentData(null);
      setShowForm(false);
      setSubmitAttempt(false);
    } catch (error) {
      console.error('Error:', error);

      alert(error instanceof Error ? error.message : 'Something went wrong.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      catId: '',
      email: '',
      description: '',
      imgUrl: '',
      facebook: '',
      facebookUrl: '',
      twitter: '',
      twitterUrl: '',
      instagram: '',
      instagramUrl: '',
      liveUrl: '',
    });

    setSubmitAttempt(false);
  };

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.filter((item) => item.status === 1));
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

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
                <PinterestShareButton url={shareUrl} media={media} description={title}>
                  <Image src='/assets/pinterest.svg' alt='Pinterest' width={50} height={32} className='cursor-pointer' />
                </PinterestShareButton>

                <FacebookShareButton url={shareUrl} hashtag='#Infographics'>
                  <Image src='/assets/Facebook.svg' alt='Facebook' width={50} height={32} className='cursor-pointer' />
                </FacebookShareButton>

                <TwitterShareButton url={shareUrl} title={title} hashtags={['Infographics']}>
                  <Image src='/assets/twitter.svg' alt='Twitter' width={50} height={32} className='cursor-pointer' />
                </TwitterShareButton>

                <LinkedinShareButton url={shareUrl} title={title} summary='Submit your infographic to Infographics Posters.'>
                  <Image src='/assets/linkedin.svg' alt='LinkedIn' width={50} height={32} className='cursor-pointer' />
                </LinkedinShareButton>
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
                  <ul className='list-disc pl-5 mt-2'>
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
                  <ul className='list-disc pl-5 mt-2'>
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

                <div className='p-4'>
                  {isPaypalConfigured ? (
                    <>
                      <PayPalScriptProvider options={initialOptions}>
                        <CheckoutComponent
                          amount='30.00'
                          onPaymentSuccess={(payment) => {
                            setPaymentData(payment);
                            setShowForm(true);
                          }}
                        />
                      </PayPalScriptProvider>

                      <p className='mt-2 text-center text-sm'>The safer, easier way to pay</p>
                    </>
                  ) : (
                    <div className='rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800'>
                      PayPal checkout is unavailable until a valid PayPal client ID is configured.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Section */}
        {showForm && (
          <div>
            <h2 className='mb-2 text-3xl font-bold text-sky-500'>Add New Infographics</h2>

            <p className='mb-6 text-[12px] text-black-500 font-medium'>
              Send an email. Fields marked with
              <span className='text-red-500'> *</span> are required.
            </p>

            <div className='w-full'>
              <form onSubmit={addNewArticle} className='mt-6'>
                {/* Title */}
                <div className='mb-4 grid grid-cols-1 gap-2 md:grid-cols-[16.666667%_83.333333%]'>
                  <label className='pt-2 text-sm font-medium text-gray-700'>
                    Title <span className='text-red-500'>*</span>
                  </label>

                  <input
                    type='text'
                    id='title'
                    name='title'
                    value={formData.title}
                    onChange={handleChange}
                    placeholder='Title'
                    className='w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  />
                </div>

                {/* Category */}
                <div className='mb-4 grid grid-cols-1 gap-2 md:grid-cols-[16.666667%_83.333333%]'>
                  <label className='pt-2 text-sm font-medium text-gray-700'>
                    Category <span className='text-red-500'>*</span>
                  </label>

                  <select
                    id='catId'
                    name='catId'
                    value={formData.catId}
                    onChange={handleChange}
                    className='w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  >
                    <option value='' disabled>
                      Please select category
                    </option>

                    {categories.map((category) => (
                      <option key={category.catId} value={category.catId}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Email */}
                <div className='mb-4 grid grid-cols-1 gap-2 md:grid-cols-[16.666667%_83.333333%]'>
                  <label className='pt-2 text-sm font-medium text-gray-700'>
                    Email <span className='text-red-500'>*</span>
                  </label>

                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='Email'
                    className='w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  />
                </div>

                {/* Description */}
                <div className='mb-4 grid grid-cols-1 gap-2 md:grid-cols-[16.666667%_83.333333%]'>
                  <label className='pt-2 text-sm font-medium text-gray-700'>
                    Description <span className='text-red-500'>*</span>
                  </label>

                  <textarea
                    id='description'
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                    rows={2}
                    maxLength={300}
                    placeholder='Full description text'
                    className='w-full resize-none rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  />
                </div>

                {/* Infographics URL */}
                <div className='mb-4 grid grid-cols-1 gap-2 md:grid-cols-[16.666667%_83.333333%]'>
                  <label className='pt-2 text-sm font-medium text-gray-700'>
                    Infographics URL <span className='text-red-500'>*</span>
                  </label>

                  <input
                    type='text'
                    id='imgUrl'
                    name='imgUrl'
                    value={formData.imgUrl}
                    onChange={handleChange}
                    placeholder='Image URL'
                    className='w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  />
                </div>

                {/* Facebook */}
                <div className='mb-4 grid grid-cols-1 gap-2 md:grid-cols-[16.666667%_83.333333%]'>
                  <label className='pt-2 text-sm font-medium text-gray-700'>Facebook</label>

                  <input
                    type='text'
                    id='facebook'
                    name='facebook'
                    value={formData.facebook}
                    onChange={handleChange}
                    placeholder='Facebook'
                    className='w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  />
                </div>

                {/* Facebook URL */}
                <div className='mb-4 grid grid-cols-1 gap-2 md:grid-cols-[16.666667%_83.333333%]'>
                  <label className='pt-2 text-sm font-medium text-gray-700'>Facebook URL</label>

                  <input
                    type='text'
                    id='facebookUrl'
                    name='facebookUrl'
                    value={formData.facebookUrl}
                    onChange={handleChange}
                    placeholder='Facebook URL'
                    className='w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  />
                </div>

                {/* Twitter */}
                <div className='mb-4 grid grid-cols-1 gap-2 md:grid-cols-[16.666667%_83.333333%]'>
                  <label className='pt-2 text-sm font-medium text-gray-700'>Twitter</label>

                  <input
                    type='text'
                    id='twitter'
                    name='twitter'
                    value={formData.twitter}
                    onChange={handleChange}
                    placeholder='Twitter'
                    className='w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  />
                </div>

                {/* Twitter URL */}
                <div className='mb-4 grid grid-cols-1 gap-2 md:grid-cols-[16.666667%_83.333333%]'>
                  <label className='pt-2 text-sm font-medium text-gray-700'>Twitter URL</label>

                  <input
                    type='text'
                    id='twitterUrl'
                    name='twitterUrl'
                    value={formData.twitterUrl}
                    onChange={handleChange}
                    placeholder='Twitter URL'
                    className='w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  />
                </div>

                {/* Validation */}
                {submitAttempt && (
                  <div className='mb-4 text-sm text-red-600'>
                    All fields with an <span className='text-red-500'>*</span> are required.
                  </div>
                )}

                {/* Buttons */}
                <div className='mt-6 flex justify-center gap-3'>
                  <button type='submit' className='rounded bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700'>
                    Add Article
                  </button>

                  <button
                    type='button'
                    onClick={resetForm}
                    className='rounded bg-gray-500 px-6 py-2 text-sm font-medium text-white hover:bg-gray-600'
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
