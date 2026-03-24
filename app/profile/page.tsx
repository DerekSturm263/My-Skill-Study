import { Metadata, ResolvingMetadata } from 'next';
import { PageProps } from '@/lib/types/general';

export async function generateMetadata({ params, searchParams }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  return {
    title: "Profile"
  }
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const urlParams = await searchParams;

  return (
    <div>
      <main>
        
      </main>
    </div>
  );
}
