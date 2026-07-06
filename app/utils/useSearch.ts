import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type KeyboardEvent } from 'react';
import { useState } from 'react';

export const useSearch = (initialQuery: string = '', clearAfterSearch: boolean = false) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  const buildUrl = (nextQuery: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = nextQuery.trim();

    if (trimmed) {
      params.set('search', trimmed);
    } else {
      params.delete('search');
    }

    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  };

  const handleSearch = () => {
    router.push(buildUrl(query));

    if (clearAfterSearch) {
      setQuery('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    router.push(buildUrl(''));
  };

  return {
    query,
    setQuery,
    handleSearch,
    handleKeyDown,
    clearSearch,
  };
};
