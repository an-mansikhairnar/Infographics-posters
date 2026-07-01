// export default function Loader() {
//   return (
//     <div className="flex justify-center items-center py-10">
//       <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';

export default function Loader() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 100000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!showLoader) return null;

  return (
    <div className="flex justify-center items-center py-10">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
    </div>
  );
}