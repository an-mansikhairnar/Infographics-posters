'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import Image from 'next/image';
import CheckoutComponent from '../component/CheckoutComponent/CheckoutComponent';

const initialOptions = {
  clientId: 'AVxkOR_shXf8aMaFXhn_MZsdnTghNp4sORTdWfzbSumv4PvOdrxdWQtiZ0SulbQM2mlHbaXYdfFdwfyW',
  currency: 'USD',
  intent: 'capture',
  'disable-funding': 'card',
};
export default function SubmitInfographicsPage() {
  return (
    <div className='flex-1 rounded border border-gray-300 bg-white p-4 m-4 text-[14px]'>
      <div className='grid grid-cols-1 gap-5 lg:grid-cols-[70%_28%]'>
        {/* Left Content */}
        <div>
          {/* Banner */}
          <div className='relative h-[185px] overflow-hidden rounded-lg'>
            <Image src='/assets/AdobeStock.png' alt='Banner' fill priority className='object-cover' />

            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='px-4 text-center text-white'>
                <h1 className='text-2xl md:text-2xl font-normal'>Unlock the Power of Visual Communication with Our</h1>

                <h2 className='mt-2 text-2xl md:text-2xl font-normal'>Expert Infographic Design Services</h2>
              </div>
            </div>
          </div>

          {/* Intro Content */}
          <div className='mt-4 text-[14px] text-gray-800'>
            <p>
              At Infographics Posters, we are thrilled to introduce a brand new feature that empowers you to bring your ideas to life
              through custom infographics. Whether you are an entrepreneur, educator, marketer or simply someone with a story to tell, our
              expert designers are here to transform your content into visually captivating and informative infographics.
            </p>

            <p className='mt-4'>
              Creating your own custom infographic is now easier than ever! Simply provide us with your content, references, and any
              specific design preferences you have in mind. Our skilled designers will take your inputs and craft a stunning infographic
              that conveys your message with clarity and creativity.
            </p>
          </div>

          {/* Why Choose Us */}
          <h2 className='mt-6 text-[20px] font-bold text-gray-900'>Why Choose Us?</h2>

          <div className='mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
            <div className='rounded border border-gray-300 p-5'>
              <Image
                className='mb-4 text-3xl'
                src='/assets/icons/ic-professional-design.svg'
                alt='Tailored to Your Needs'
                width={35}
                height={35}
              />

              <h3 className='mb-3 font-bold'>Tailored to Your Needs</h3>

              <p className='text-sm'>
                Our custom infographics are tailored to your unique requirements, ensuring that your message is effectively communicated.
              </p>
            </div>

            <div className='rounded border border-gray-300 p-5'>
              <Image className='mb-4 text-3xl' src='/assets/icons/ic-visual-impact.svg' alt='Visual Impact' width={35} height={35} />

              <h3 className='mb-3 font-bold'>Visual Impact</h3>

              <p className='text-sm'>
                A picture is worth a thousand words. With eye-catching visuals, your information will leave a lasting impression on your
                audience.
              </p>
            </div>

            <div className='rounded border border-gray-300 p-5'>
              <Image
                className='mb-4 text-3xl'
                src='/assets/icons/ic-professional-design.svg'
                alt='Professional Design'
                width={35}
                height={35}
              />

              <h3 className='mb-3 font-bold'>Professional Design</h3>

              <p className='text-s'>
                Our designers are experts at creating compelling designs that align with your brand and captivate your target audience.
              </p>
            </div>

            <div className='rounded border border-gray-300 p-5'>
              <Image className='mb-4 text-3xl' src='/assets/icons/ic-simplified.svg' alt='Information Simplified' width={35} height={35} />

              <h3 className='mb-3 font-bold'>Information Simplified</h3>

              <p className='text-s'>
                We specialize in transforming complex data into easily understandable visuals, making your content more engaging.
              </p>
            </div>
          </div>

          {/* How To Get Started */}
          <h2 className='mt-8 mb-3 text-[20px] font-bold text-gray-900'>How To Get Started?</h2>

          <ul className=' list-disc space-y-2 pl-6 text-[14px]'>
            <li className='m-0'>
              Submit Your Content: Send us the content you want to convert into an infographic. This can include text, data, images, and any
              references you would like to us consider.
            </li>
            <li className='m-0'>
              Share Your Vision: If you have a specific design style or color scheme in mind, let us know! Our designers will incorporate
              your preferences into the final product.
            </li>
            <li className='m-0'>
              Leave the Rest to Us: Once we have your inputs, our talented designers will get to work, transforming your content into an
              impactful infographic.
            </li>
            <li className='m-0'>
              Review and Finalize: We will send you the finished infographic for your review. If any adjustments are needed, we will make
              sure everything is perfect before finalizing.
            </li>
          </ul>

          <p className='text-[14px] leading-7 text-gray-800'>
            Turn your ideas into compelling visuals that tell a story, convey data, and engage your audience. Experience the difference of
            custom infographics with Infographics Posters today!
          </p>

          <p className='text-[14px] leading-7 text-gray-800'>Go ahead, let your infographics poster reveal your creativity!</p>

          {/* Submission Details */}
          <h2 className='mt-8 text-[20px] font-bold text-gray-900'>Submitting Infographics Details</h2>

          <p className='mt-4 text-[14px]'>To design your infographic from us, please make sure it adheres to the following guidelines:</p>

          <ul className='mt-4 list-disc space-y-2 pl-6 text-[14px]'>
            <li className='m-0'>It should not be based on subjects like porn and gambling.</li>
            <li className='m-0'>We do not encourage adding anything that contain nudity or obscene images.</li>
            <li className='m-0'>It should have short plus creative title.</li>
            <li className='m-0'>
              Description of the infographic should be around 200 words. Make sure that it is informative and explains the concept.
            </li>
          </ul>
          {/* Payment Section */}
          <h2 className='mt-8 text-[20px] font-bold text-gray-900'>Payment Processing and Publishing</h2>

          <p className='mt-4 text-[14px]'>
            After you make the payment of $75, you will be redirected to the infographics submission form. Upon payment for our infographic
            design service, you can expect to receive the final infographic within 2-3 working days. Your satisfaction is our priority, and
            if for any reason you are not pleased with the result, we offer a money-back guarantee.
          </p>
        </div>

        <div>
          <div className='lg:col-span-4'>
            <div className='overflow-hidden rounded-lg border border-gray-300'>
              <div className='bg-gray-100 p-3 text-[12px] font-semibold'>Now Pay Only $75</div>
              <div className='p-4'>
                <PayPalScriptProvider options={initialOptions}>
                  <CheckoutComponent amount='75.00' />
                </PayPalScriptProvider>

                <p className='mt-2 text-center text-sm'>The safer, easier way to pay</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
