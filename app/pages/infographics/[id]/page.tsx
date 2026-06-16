import DetailPage from '@/app/component/DetailPage/page';

export default function InfographicDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  return <DetailPage params={params} />;
}
