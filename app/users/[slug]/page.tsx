import { Metadata, ResolvingMetadata } from 'next';
import { User, Props, ComponentMode } from '@/lib/types';
import { get } from '@/lib/database';
import { SharablePage } from '@/components/sharables';

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const course = await get<User>("users", slug);

  return {
    title: course.title
  }
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const urlParams = await searchParams;

  const user = await get<User>("users", slug);
  const mode = urlParams?.mode ?? "view";

  return (
    <div>
      <main>
        <SharablePage
          slug={slug}
          sharable={user}
          mode={mode as ComponentMode}
          hideLogo={false}
          type="users"
        >
        </SharablePage>
      </main>
    </div>
  );
}
