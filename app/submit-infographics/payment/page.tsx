import PaymentStep from './PaymentStep';

export const metadata = {
  title: 'Infographic payment',
};

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ temp_image?: string | string[] }>;
}) {
  const { temp_image } = await searchParams;
  const initialImageUrl = Array.isArray(temp_image) ? temp_image[0] : temp_image;

  return <PaymentStep initialImageUrl={initialImageUrl} />;
}
