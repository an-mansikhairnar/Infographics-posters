import { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="ie-boot">Loading sign in…</div>}>
      <LoginForm />
    </Suspense>
  );
}
