import EditorSubmission from './EditorSubmission';

export const metadata = {
  title: 'Submit Infographics',
};

export default async function EditorSubmissionPage({
  searchParams,
}: {
  searchParams: Promise<{ temp_image?: string | string[] }>;
}) {
  const { temp_image } = await searchParams;
  const initialImageUrl = Array.isArray(temp_image) ? temp_image[0] : temp_image;

  return <EditorSubmission initialImageUrl={initialImageUrl} />;
}
