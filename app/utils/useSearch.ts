import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const useSearch = (initialQuery: string = '') => {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = () => {
    const trimmed = query.trim();
    router.push(trimmed ? `/?search=${encodeURIComponent(trimmed)}` : '/');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const clearSearch = () => {
    setQuery('');
    router.push('/');
  };

  return {
    query,
    setQuery,
    handleSearch,
    handleKeyDown,
    clearSearch,
  };
};
