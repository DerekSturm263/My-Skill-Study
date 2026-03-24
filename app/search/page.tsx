import { Metadata, ResolvingMetadata } from 'next';
import { SlugProps, URLProps } from '@/lib/types/general';

export async function generateMetadata({ searchParams }: { searchParams: URLProps }, parent: ResolvingMetadata): Promise<Metadata> {
  const urlParams = await searchParams;

  return {
    title: `"${urlParams.query}"`
  }
}

export default async function Page({ params, searchParams }: { params: SlugProps, searchParams: URLProps }) {
  const { slug } = await params;
  const urlParams = await searchParams;

  return (
    <div>
      <main>
        
      </main>
    </div>
  );
}
