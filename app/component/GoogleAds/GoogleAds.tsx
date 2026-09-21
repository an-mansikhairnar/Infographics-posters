'use client';

import { useEffect, useRef, CSSProperties } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface GoogleAdsProps {
  adSlot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  layoutKey?: string;
  style?: CSSProperties;
}

export default function GoogleAds({
  adSlot,
  format = 'auto',
  layoutKey,
  style,
}: Readonly<GoogleAdsProps>) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    let cancelled = false;

    const initializeAd = () => {
      const ad = adRef.current;

      if (!ad || cancelled) {
        return;
      }

      if (ad.dataset.adsbygoogleStatus) {
        return;
      }

      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch (error) {
        console.error('Google AdSense initialization failed:', error);
      }
    };

    const loadAdSense = () => {
      const existingScript = document.querySelector(
        'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
      );

      if (existingScript) {
        if (window.adsbygoogle) {
          requestAnimationFrame(initializeAd);
        } else {
          existingScript.addEventListener(
            'load',
            () => requestAnimationFrame(initializeAd),
            { once: true }
          );
        }

        return;
      }

      const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

      if (!clientId) {
        console.error(
          'Google AdSense client ID is missing. Check NEXT_PUBLIC_ADSENSE_CLIENT_ID.'
        );
        return;
      }

      const script = document.createElement('script');

      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src =
        `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;

      script.onload = () => {
        if (!cancelled) {
          requestAnimationFrame(initializeAd);
        }
      };

      script.onerror = () => {
        console.error('Failed to load Google AdSense script.');
      };

      document.head.appendChild(script);
    };

    loadAdSense();

    return () => {
      cancelled = true;
    };
  }, [adSlot]);

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  const insProps: Record<string, string> = {
    'data-ad-client': clientId ?? '',
    'data-ad-slot': adSlot,
  };

  if (format === 'fluid') {
    insProps['data-ad-format'] = 'fluid';

    if (layoutKey) {
      insProps['data-ad-layout-key'] = layoutKey;
    }
  } else {
    insProps['data-ad-format'] = format;
    insProps['data-full-width-responsive'] = 'true';
  }

  const computedStyle: CSSProperties = {
    display: 'block',
    width: '100%',
    ...style,
  };

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={computedStyle}
      {...insProps}
    />
  );
}