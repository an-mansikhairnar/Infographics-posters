import { auth } from '@/auth';

export type CreatorIdentity = { userId: number };

export async function getCreatorIdentity(): Promise<CreatorIdentity | null> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id || !/^\d+$/.test(id)) return null;
  const userId = Number(id);
  if (!Number.isSafeInteger(userId)) return null;
  return { userId };
}
