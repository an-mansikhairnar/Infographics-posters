'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import UserAvatar from '@/app/component/UserAvatar/UserAvatar';

export default function AccountPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login?callbackUrl=%2Faccount');
    }
  }, [router, status]);

  if (status === 'loading') {
    return <div className="ie-boot">Loading your account…</div>;
  }
  if (!user) {
    return <div className="ie-boot">Redirecting to sign in…</div>;
  }

  const displayName =
    user.name ||
    (user.instagramUsername ? `@${user.instagramUsername}` : '') ||
    'Name not provided';

  return (
    <main className="mx-auto my-10 w-full max-w-3xl px-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center gap-4 border-b border-slate-200 pb-6 text-center sm:flex-row sm:text-left">
          <UserAvatar
            name={user.name}
            image={user.image}
            fallbackName={user.instagramUsername || user.email?.split('@')[0]}
            size="large"
          />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My account</h1>
            <p className="mt-1 text-slate-600">{displayName}</p>
          </div>
        </div>

        <dl className="divide-y divide-slate-200">
          <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
            <dt className="text-sm font-medium text-slate-500">Name</dt>
            <dd className="break-words text-sm text-slate-900">{user.name || 'Not provided'}</dd>
          </div>
          <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
            <dt className="text-sm font-medium text-slate-500">Email</dt>
            <dd className="break-words text-sm text-slate-900">{user.email || 'Not provided by this sign-in provider'}</dd>
          </div>
          <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
            <dt className="text-sm font-medium text-slate-500">Instagram</dt>
            <dd className="break-words text-sm text-slate-900">
              {user.instagramUsername ? `@${user.instagramUsername}` : 'Not connected'}
            </dd>
          </div>
        </dl>

        <div className="mt-4">
          <Link
            href="/infographic-maker"
            className="inline-flex rounded-full bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-800"
          >
            Go to your designs
          </Link>
        </div>
      </section>
    </main>
  );
}
