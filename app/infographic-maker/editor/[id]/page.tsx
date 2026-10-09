'use client';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

// fabric.js needs the browser, so the editor is never server-rendered.
const Editor = dynamic(() => import('@/app/component/infographic/Editor'), {
  ssr: false,
  loading: () => <div className="ie-boot">Loading editor…</div>,
});

export default function Page() {
  const { id } = useParams<{ id: string }>();
  return <Editor id={id} />;
}
