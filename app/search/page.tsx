import { Metadata, ResolvingMetadata } from 'next';
import { Props } from '@/lib/types';

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const urlParams = await searchParams;

  return {
    title: `"${urlParams.terms}"`
  }
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const urlParams = await searchParams;

  return (
    <div>
      <main>
        
      </main>
    </div>
  );
}
