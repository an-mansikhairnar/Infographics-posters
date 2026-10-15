// 'use client';

// import { useState } from 'react';
// import type { FormEvent } from 'react';
// import { signIn, useSession } from 'next-auth/react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { FaGoogle, FaFacebookF, FaInstagram } from 'react-icons/fa';
// type Provider = 'google' | 'facebook' | 'instagram';

// function safeCallback(value: string | null): string {
//   return value?.startsWith('/') && !value.startsWith('//') ? value : '/infographic-maker';
// }

// function authErrorMessage(code: string | null): string | null {
//   if (!code) return null;
//   if (code === 'OAuthAccountNotLinked') return 'That social account is already connected to another account.';
//   if (code === 'OAuthCreateAccount')
//     return 'Unable to create your account with this provider. Please try again or use another sign-in method.';
//   return 'Authentication could not be completed. Please try again.';
// }

// export default function LoginForm() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { data: session, status } = useSession();
//   const user = session?.user;
//   const [mode, setMode] = useState<'login' | 'register'>('login');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [busy, setBusy] = useState(false);
//   const [error, setError] = useState<string | null>(authErrorMessage(searchParams.get('error')));
//   const callbackUrl = safeCallback(searchParams.get('callbackUrl'));
//   const providers = [
//     { id: 'google', label: 'Google', Icon: FaGoogle },
//     { id: 'facebook', label: 'Facebook', Icon: FaFacebookF },
//     { id: 'instagram', label: 'Instagram', Icon: FaInstagram },
//   ] as const;

//   async function submit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     setBusy(true);
//     setError(null);
//     try {
//       const result = await signIn('credentials', {
//         email,
//         password,
//         mode,
//         redirect: false,
//         redirectTo: callbackUrl,
//       });
//       if (result?.error) {
//         setError(
//           result.code === 'credentials'
//             ? mode === 'register'
//               ? 'An account with this email already exists, or the password is invalid.'
//               : 'Invalid email or password.'
//             : 'Authentication could not be completed. Please try again.'
//         );
//         return;
//       }
//       router.replace(callbackUrl);
//       router.refresh();
//     } catch (cause) {
//       setError(cause instanceof Error ? cause.message : 'Unable to sign in.');
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function authenticateProvider(provider: Provider) {
//     setBusy(true);
//     setError(null);
//     try {
//       await signIn(provider, { redirectTo: callbackUrl });
//     } catch (cause) {
//       setError(cause instanceof Error ? cause.message : 'Unable to start social sign in.');
//       setBusy(false);
//     }
//   }

//   if (status === 'loading') return <div className="ie-boot">Checking your account…</div>;

//   return (
//     <main className="mx-auto my-12 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
//       <h1 className="text-2xl font-bold text-slate-900">
//         {user ? 'Connect a sign-in method' : mode === 'login' ? 'Sign in to Infographic Studio' : 'Create your account'}
//       </h1>
//       <p className="mt-2 text-sm text-slate-600">
//         {user
//           ? `Signed in${user.email ? ` as ${user.email}` : ''}. Choose a provider to link it to this account.`
//           : 'Your designs are saved to your account and available across devices.'}
//       </p>

//       {!user && (
//         <form className="mt-6 space-y-4" onSubmit={(event) => void submit(event)}>
//           <label className="block text-sm font-medium text-slate-700">
//             Email
//             <input
//               className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
//               type="email"
//               autoComplete="email"
//               required
//               value={email}
//               onChange={(event) => setEmail(event.target.value)}
//             />
//           </label>
//           <label className="block text-sm font-medium text-slate-700">
//             Password
//             <input
//               className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
//               type="password"
//               autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
//               minLength={mode === 'register' ? 8 : undefined}
//               required
//               value={password}
//               onChange={(event) => setPassword(event.target.value)}
//             />
//           </label>
//           <button className="w-full rounded-lg bg-cyan-700 px-4 py-2 font-semibold text-white disabled:opacity-60" disabled={busy}>
//             {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
//           </button>
//           <button
//             className="w-full text-sm text-cyan-800 underline"
//             type="button"
//             onClick={() => {
//               setMode(mode === 'login' ? 'register' : 'login');
//               setError(null);
//             }}>
//             {mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}
//           </button>
//         </form>
//       )}

//       <div className="mt-6 space-y-3">
//         {providers.map(({ id, label, Icon }) => (
//           <button
//             key={id}
//             type="button"
//             onClick={() => void authenticateProvider(id)}
//             disabled={busy}
//             className="group relative flex w-full items-center justify-center gap-3
//         rounded-xl border border-slate-200 bg-white px-4 py-3
//         text-sm font-semibold text-slate-700 shadow-sm
//         transition-all duration-200
//         hover:border-slate-300 hover:bg-slate-50 hover:shadow-md
//         active:scale-[0.99]
//         disabled:cursor-not-allowed disabled:opacity-50">
//             <Icon
//               className={`absolute left-4 h-5 w-5 ${
//                 id === 'google' ? 'text-[#4285F4]' : id === 'facebook' ? 'text-[#1877F2]' : 'text-[#E4405F]'
//               }`}
//               aria-hidden="true"
//             />

//             <span>
//               {user ? 'Link' : 'Continue with'} {label}
//             </span>
//           </button>
//         ))}
//       </div>
//       {error && (
//         <p className="mt-4 text-sm text-red-700" role="alert">
//           {error}
//         </p>
//       )}
//     </main>
//   );
// }

// 'use client';

// import { useState } from 'react';
// import type { FormEvent } from 'react';
// import { signIn, useSession } from 'next-auth/react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { FaGoogle, FaFacebookF, FaInstagram, FaEye, FaEyeSlash } from 'react-icons/fa';
// type Provider = 'google' | 'facebook' | 'instagram';

// function safeCallback(value: string | null): string {
//   return value?.startsWith('/') && !value.startsWith('//') ? value : '/infographic-maker';
// }

// function authErrorMessage(code: string | null): string | null {
//   if (!code) return null;
//   if (code === 'OAuthAccountNotLinked') return 'That social account is already connected to another account.';
//   if (code === 'OAuthCreateAccount')
//     return 'Unable to create your account with this provider. Please try again or use another sign-in method.';
//   return 'Authentication could not be completed. Please try again.';
// }

// export default function LoginForm() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { data: session, status } = useSession();
//   const user = session?.user;
//   const [mode, setMode] = useState<'login' | 'register'>('login');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [busy, setBusy] = useState(false);
//   const [error, setError] = useState<string | null>(authErrorMessage(searchParams.get('error')));
//   const callbackUrl = safeCallback(searchParams.get('callbackUrl'));
//   const providers = [
//     { id: 'google', label: 'Google', Icon: FaGoogle },
//     { id: 'facebook', label: 'Facebook', Icon: FaFacebookF },
//     { id: 'instagram', label: 'Instagram', Icon: FaInstagram },
//   ] as const;

//   async function submit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     setBusy(true);
//     setError(null);
//     try {
//       const result = await signIn('credentials', {
//         email,
//         password,
//         mode,
//         redirect: false,
//         redirectTo: callbackUrl,
//       });
//       if (result?.error) {
//         setError(
//           result.code === 'credentials'
//             ? mode === 'register'
//               ? 'An account with this email already exists, or the password is invalid.'
//               : 'Invalid email or password.'
//             : 'Authentication could not be completed. Please try again.'
//         );
//         return;
//       }
//       router.replace(callbackUrl);
//       router.refresh();
//     } catch (cause) {
//       setError(cause instanceof Error ? cause.message : 'Unable to sign in.');
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function authenticateProvider(provider: Provider) {
//     setBusy(true);
//     setError(null);
//     try {
//       await signIn(provider, { redirectTo: callbackUrl });
//     } catch (cause) {
//       setError(cause instanceof Error ? cause.message : 'Unable to start social sign in.');
//       setBusy(false);
//     }
//   }

//   function switchMode() {
//     setMode(mode === 'login' ? 'register' : 'login');
//     setShowPassword(false);
//     setError(null);
//   }

//   if (status === 'loading') return <div className="ie-boot">Checking your account…</div>;

//   return (
//     <main className="mx-auto my-12 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
//       <h1 className="text-2xl font-bold text-slate-900">
//         {user ? 'Connect a sign-in method' : mode === 'login' ? 'Sign in to Infographic Studio' : 'Create your account'}
//       </h1>
//       <p className="mt-2 text-sm text-slate-600">
//         {user
//           ? `Signed in${user.email ? ` as ${user.email}` : ''}. Choose a provider to link it to this account.`
//           : 'Your designs are saved to your account and available across devices.'}
//       </p>

//       {!user && (
//         <form className="mt-6 space-y-4" onSubmit={(event) => void submit(event)}>
//           <div>
//             <label htmlFor="login-email" className="block text-sm font-medium text-slate-700">
//               Email
//             </label>
//             <input
//               id="login-email"
//               className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700/20"
//               type="email"
//               autoComplete="email"
//               required
//               value={email}
//               onChange={(event) => setEmail(event.target.value)}
//             />
//           </div>

//           <div>
//             <label htmlFor="login-password" className="block text-sm font-medium text-slate-700">
//               Password
//             </label>
//             <div className="relative mt-1">
//               <input
//                 id="login-password"
//                 className="block w-full rounded-lg border border-slate-300 py-2 pl-3 pr-11 focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700/20"
//                 type={showPassword ? 'text' : 'password'}
//                 autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
//                 minLength={mode === 'register' ? 8 : undefined}
//                 required
//                 value={password}
//                 onChange={(event) => setPassword(event.target.value)}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((v) => !v)}
//                 aria-label={showPassword ? 'Hide password' : 'Show password'}
//                 aria-pressed={showPassword}
//                 className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-slate-500 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700/40">
//                 {showPassword ? <FaEyeSlash className="h-4 w-4" aria-hidden="true" /> : <FaEye className="h-4 w-4" aria-hidden="true" />}
//               </button>
//             </div>
//             {mode === 'register' && <p className="mt-1 text-xs text-slate-500">Use at least 8 characters.</p>}
//           </div>

//           <button
//             type="submit"
//             className="w-full rounded-lg bg-cyan-700 px-4 py-2 font-semibold text-white transition-colors hover:bg-cyan-800 disabled:opacity-60"
//             disabled={busy}>
//             {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
//           </button>
//         </form>
//       )}

//       {!user && (
//         <div className="my-6 flex items-center gap-3" role="separator">
//           <span className="h-px flex-1 bg-slate-200" />
//           <span className="text-xs uppercase tracking-wide text-slate-500">or</span>
//           <span className="h-px flex-1 bg-slate-200" />
//         </div>
//       )}

//       <div className={`space-y-3 ${user ? 'mt-6' : ''}`}>
//         {providers.map(({ id, label, Icon }) => (
//           <button
//             key={id}
//             type="button"
//             onClick={() => void authenticateProvider(id)}
//             disabled={busy}
//             className="group relative flex w-full items-center justify-center gap-3
//         rounded-xl border border-slate-200 bg-white px-4 py-3
//         text-sm font-semibold text-slate-700 shadow-sm
//         transition-all duration-200
//         hover:border-slate-300 hover:bg-slate-50 hover:shadow-md
//         active:scale-[0.99]
//         disabled:cursor-not-allowed disabled:opacity-50">
//             <Icon
//               className={`absolute left-4 h-5 w-5 ${
//                 id === 'google' ? 'text-[#4285F4]' : id === 'facebook' ? 'text-[#1877F2]' : 'text-[#E4405F]'
//               }`}
//               aria-hidden="true"
//             />

//             <span>
//               {user ? 'Link' : 'Continue with'} {label}
//             </span>
//           </button>
//         ))}
//       </div>

//       {error && (
//         <p className="mt-4 text-sm text-red-700" role="alert">
//           {error}
//         </p>
//       )}

//       {!user && (
//         <p className="mt-6 text-center text-sm text-slate-600">
//           {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
//           <button
//             type="button"
//             onClick={switchMode}
//             className="font-semibold text-cyan-700 hover:text-cyan-800 hover:underline focus:outline-none focus-visible:underline">
//             {mode === 'login' ? 'Create one' : 'Sign in'}
//           </button>
//         </p>
//       )}
//     </main>
//   );
// }

'use client';

import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FaGoogle,
  FaFacebookF,
  FaInstagram,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaUser,
  FaChartBar,
  FaExclamationCircle,
  FaCheckCircle,
  FaRegCircle,
} from 'react-icons/fa';
type Provider = 'google' | 'facebook' | 'instagram';
type Mode = 'login' | 'register';
type Field = 'firstName' | 'lastName' | 'email' | 'password';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 64;

const PASSWORD_RULES = [
  {
    id: 'length',
    label: `${PASSWORD_MIN}-${PASSWORD_MAX} characters`,
    test: (v: string) => v.length >= PASSWORD_MIN && v.length <= PASSWORD_MAX,
  },
  { id: 'nospace', label: 'No spaces', test: (v: string) => v.length > 0 && !/\s/.test(v) },
  { id: 'lower', label: 'One lowercase letter', test: (v: string) => /[a-z]/.test(v) },
  { id: 'upper', label: 'One uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
  { id: 'number', label: 'One number', test: (v: string) => /\d/.test(v) },
  { id: 'special', label: 'One special character (e.g. ! @ # $)', test: (v: string) => /[^A-Za-z0-9\s]/.test(v) },
] as const;

function safeCallback(value: string | null): string {
  return value?.startsWith('/') && !value.startsWith('//') ? value : '/infographic-maker';
}

function authErrorMessage(code: string | null): string | null {
  if (!code) return null;
  if (code === 'OAuthAccountNotLinked') return 'That social account is already connected to another account.';
  if (code === 'OAuthCreateAccount')
    return 'Unable to create your account with this provider. Please try again or use another sign-in method.';
  return 'Authentication could not be completed. Please try again.';
}

function validateEmail(value: string): string | undefined {
  const v = value.trim();
  if (!v) return 'Email is required.';
  if (v.length > 254 || !EMAIL_RE.test(v)) return 'Enter a valid email address, like you@example.com.';
  return undefined;
}

function validateName(value: string, label: string): string | undefined {
  const name = value.trim();
  if (!name) return `${label} is required.`;
  if (name.length > 100) return `${label} must be 100 characters or fewer.`;
  return undefined;
}

function validatePassword(value: string, mode: Mode): string | undefined {
  if (!value || !value.trim()) return 'Password is required.';
  if (value.length < PASSWORD_MIN) return `Password must be at least ${PASSWORD_MIN} characters.`;
  if (mode === 'register') {
    if (/\s/.test(value)) return 'Password cannot contain spaces.';
    if (value.length > PASSWORD_MAX) return `Password must be at most ${PASSWORD_MAX} characters.`;
    if (!/[a-z]/.test(value)) return 'Password must include a lowercase letter.';
    if (!/[A-Z]/.test(value)) return 'Password must include an uppercase letter.';
    if (!/\d/.test(value)) return 'Password must include a number.';
    if (!/[^A-Za-z0-9\s]/.test(value)) return 'Password must include a special character.';
  }
  return undefined;
}

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
      aria-hidden="true"
    />
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-red-600" role="alert">
      <FaExclamationCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const user = session?.user;
  const [mode, setMode] = useState<Mode>('login');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<Field, boolean>>({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(authErrorMessage(searchParams.get('error')));
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const callbackUrl = safeCallback(searchParams.get('callbackUrl'));
  const providers = [
    { id: 'google', label: 'Google', Icon: FaGoogle },
    { id: 'facebook', label: 'Facebook', Icon: FaFacebookF },
    { id: 'instagram', label: 'Instagram', Icon: FaInstagram },
  ] as const;

  // Errors are derived, so they stay in sync as the user types after a field has been touched.
  const firstNameError = touched.firstName ? validateName(firstName, 'First name') : undefined;
  const lastNameError = touched.lastName ? validateName(lastName, 'Last name') : undefined;
  const emailError = touched.email ? validateEmail(email) : undefined;
  const passwordError = touched.password ? validatePassword(password, mode) : undefined;
  const showPasswordRules = mode === 'register' && (touched.password || password.length > 0);

  function touch(field: Field) {
    setTouched((t) => (t[field] ? t : { ...t, [field]: true }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
    });

    const firstNameErr = mode === 'register' ? validateName(firstName, 'First name') : undefined;
    const lastNameErr = mode === 'register' ? validateName(lastName, 'Last name') : undefined;
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password, mode);
    if (firstNameErr || lastNameErr || emailErr || passwordErr) {
      setError(null);
      const invalidField = firstNameErr
        ? firstNameRef
        : lastNameErr
          ? lastNameRef
          : emailErr
            ? emailRef
            : passwordRef;
      invalidField.current?.focus();
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const result = await signIn('credentials', {
        firstName: mode === 'register' ? firstName.trim() : '',
        lastName: mode === 'register' ? lastName.trim() : '',
        email: email.trim(),
        password,
        mode,
        redirect: false,
        redirectTo: callbackUrl,
      });
      if (result?.error) {
        setError(
          result.code === 'credentials'
            ? mode === 'register'
              ? 'An account with this email already exists, or the password is invalid.'
              : 'Invalid email or password.'
            : 'Authentication could not be completed. Please try again.'
        );
        return;
      }
      router.replace(callbackUrl);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to sign in.');
    } finally {
      setBusy(false);
    }
  }

  async function authenticateProvider(provider: Provider) {
    setBusy(true);
    setError(null);
    try {
      await signIn(provider, { redirectTo: callbackUrl });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to start social sign in.');
      setBusy(false);
    }
  }

  function switchMode() {
    setMode(mode === 'login' ? 'register' : 'login');
    setPassword('');
    setShowPassword(false);
    setTouched({ firstName: false, lastName: false, email: false, password: false });
    setError(null);
  }

  if (status === 'loading') {
    return (
      <div className="ie-boot flex min-h-[60vh] items-center justify-center gap-3 text-sm text-slate-600">
        <span
          className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-cyan-700"
          aria-hidden="true"
        />
        Checking your account…
      </div>
    );
  }

  const inputClass = (hasError: boolean) =>
    `block w-full rounded-xl border bg-white py-2.5 pl-10 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:outline-none focus:ring-4 ${
      hasError
        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
        : 'border-slate-300 focus:border-cyan-700 focus:ring-cyan-700/10'
    }`;

  const leadingIconClass = (hasError: boolean) =>
    `pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${
      hasError ? 'text-red-400' : 'text-slate-400'
    }`;

  return (
    <div className="px-4 py-18">
      <main className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
            {user
              ? 'Connect a sign-in method'
              : mode === 'login'
                ? 'Sign in to Infographics Posters'
                : 'Create your account'}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {user
              ? `Signed in${user.email ? ` as ${user.email}` : ''}. Choose a provider to link it to this account.`
              : 'Your designs are saved to your account and available across devices.'}
          </p>
        </div>

        {error && (
          <div
            className="mt-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
            role="alert">
            <FaExclamationCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {!user && (
          <form className="mt-6 space-y-5" noValidate onSubmit={(event) => void submit(event)}>
            {mode === 'register' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="signup-first-name" className="block text-sm font-medium text-slate-700">
                    First name
                  </label>
                  <div className="relative mt-1.5">
                    <FaUser className={leadingIconClass(!!firstNameError)} aria-hidden="true" />
                    <input
                      ref={firstNameRef}
                      id="signup-first-name"
                      className={`${inputClass(!!firstNameError)} pr-3`}
                      type="text"
                      autoComplete="given-name"
                      maxLength={100}
                      placeholder="John"
                      aria-invalid={!!firstNameError}
                      aria-describedby={firstNameError ? 'signup-first-name-error' : undefined}
                      value={firstName}
                      onChange={(event) => {
                        setFirstName(event.target.value);
                        setError(null);
                      }}
                      onBlur={() => touch('firstName')}
                    />
                  </div>
                  <FieldError id="signup-first-name-error" message={firstNameError} />
                </div>
                <div>
                  <label htmlFor="signup-last-name" className="block text-sm font-medium text-slate-700">
                    Last name
                  </label>
                  <div className="relative mt-1.5">
                    <FaUser className={leadingIconClass(!!lastNameError)} aria-hidden="true" />
                    <input
                      ref={lastNameRef}
                      id="signup-last-name"
                      className={`${inputClass(!!lastNameError)} pr-3`}
                      type="text"
                      autoComplete="family-name"
                      maxLength={100}
                      placeholder="Doe"
                      aria-invalid={!!lastNameError}
                      aria-describedby={lastNameError ? 'signup-last-name-error' : undefined}
                      value={lastName}
                      onChange={(event) => {
                        setLastName(event.target.value);
                        setError(null);
                      }}
                      onBlur={() => touch('lastName')}
                    />
                  </div>
                  <FieldError id="signup-last-name-error" message={lastNameError} />
                </div>
              </div>
            )}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="relative mt-1.5">
                <FaEnvelope className={leadingIconClass(!!emailError)} aria-hidden="true" />
                <input
                  ref={emailRef}
                  id="login-email"
                  className={`${inputClass(!!emailError)} pr-3`}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'login-email-error' : undefined}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError(null);
                  }}
                  onBlur={() => touch('email')}
                />
              </div>
              <FieldError id="login-email-error" message={emailError} />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative mt-1.5">
                <FaLock className={leadingIconClass(!!passwordError)} aria-hidden="true" />
                <input
                  ref={passwordRef}
                  id="login-password"
                  className={`${inputClass(!!passwordError)} pr-11`}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  maxLength={128}
                  placeholder={mode === 'register' ? 'Create a password' : 'Enter your password'}
                  aria-invalid={!!passwordError}
                  aria-describedby={
                    [passwordError ? 'login-password-error' : '', showPasswordRules ? 'login-password-rules' : '']
                      .filter(Boolean)
                      .join(' ') || undefined
                  }
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError(null);
                  }}
                  onBlur={() => touch('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-slate-400 transition-colors hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700/40">
                  {showPassword ? (
                    <FaEyeSlash className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <FaEye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              <FieldError id="login-password-error" message={passwordError} />

              {showPasswordRules && (
                <ul id="login-password-rules" className="mt-2.5 space-y-1">
                  {PASSWORD_RULES.map((rule) => {
                    const met = rule.test(password);
                    const failed = !met && touched.password;
                    return (
                      <li
                        key={rule.id}
                        className={`flex items-center gap-2 text-xs transition-colors ${
                          met ? 'text-emerald-600' : failed ? 'text-red-600' : 'text-slate-500'
                        }`}>
                        {met ? (
                          <FaCheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <FaRegCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        <span>{rule.label}</span>
                        <span className="sr-only">{met ? '(met)' : '(not met)'}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-700/20 transition-all hover:bg-cyan-800 hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-700/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60">
              {busy && <Spinner />}
              {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        )}

        {!user && (
          <div className="my-6 flex items-center gap-3" role="separator">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">or</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>
        )}

        <div className={`space-y-3 ${user ? 'mt-6' : ''}`}>
          {providers.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => void authenticateProvider(id)}
              disabled={busy}
              className="group relative flex w-full items-center justify-center gap-3
        rounded-xl border border-slate-200 bg-white px-4 py-2.5
        text-sm font-semibold text-slate-700 shadow-sm
        transition-all duration-200
        hover:-translate-y-px hover:border-slate-300 hover:bg-slate-50 hover:shadow-md
        focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-700/15
        active:translate-y-0 active:scale-[0.99]
        disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0">
              <Icon
                className={`absolute left-4 h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                  id === 'google' ? 'text-[#4285F4]' : id === 'facebook' ? 'text-[#1877F2]' : 'text-[#E4405F]'
                }`}
                aria-hidden="true"
              />
              <span>
                {user ? 'Link' : 'Continue with'} {label}
              </span>
            </button>
          ))}
        </div>

        {!user && (
          <>
            <p className="mt-8 border-t border-slate-100 pt-6 text-center text-sm text-slate-600">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={switchMode}
                className="font-semibold text-cyan-700 transition-colors hover:text-cyan-800 hover:underline focus:outline-none focus-visible:underline">
                {mode === 'login' ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </>
        )}
      </main>
    </div>
  );
}