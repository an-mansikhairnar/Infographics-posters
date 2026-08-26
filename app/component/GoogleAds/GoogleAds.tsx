'use client';

import { useEffect, useRef } from 'react';

declare global {
	interface Window {
		adsbygoogle: unknown[];
	}
}

interface GoogleAdsProps {
	adSlot: string;
}

export default function GoogleAds({ adSlot }: Readonly<GoogleAdsProps>) {
	const adRef = useRef<HTMLModElement>(null);

	useEffect(() => {
		const ad = adRef.current;
		if (!ad || ad.dataset.adsbygoogleStatus) return;

		try {
			const adsbygoogle = window.adsbygoogle || [];
			window.adsbygoogle = adsbygoogle;
			adsbygoogle.push({});
		} catch (error) {
			console.error('Failed to initialize Google AdSense:', error);
		}
	}, []);

	return (
		<ins
			ref={adRef}
			className='adsbygoogle my-4 block min-h-[100px] overflow-hidden'
			style={{ display: 'block' }}
			data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
			data-ad-slot={adSlot}
			data-ad-format='auto'
			data-full-width-responsive='true'
		/>
	);
}
