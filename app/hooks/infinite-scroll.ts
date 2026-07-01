import { useEffect, useRef, useState } from 'react';
import { useLoading } from '@/app/context/loader';

export function useInfiniteScroll(totalCount: number, resetKey: string, pageSize = 20) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const { loading, setLoading } = useLoading();
  const lastResetKey = useRef(resetKey);

  useEffect(() => {
    if (lastResetKey.current !== resetKey) {
      lastResetKey.current = resetKey;
      setVisibleCount(pageSize);
    }
  }, [resetKey, pageSize]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 200 && !loading && visibleCount < totalCount) {
        setLoading(true);
        setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + pageSize, totalCount));
          setLoading(false);
        }, 500);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalCount, visibleCount, loading, setLoading, pageSize]);

  return { visibleCount, loading };
}