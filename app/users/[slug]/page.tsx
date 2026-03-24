import User from '@/lib/types/user';

import { Metadata, ResolvingMetadata } from 'next';
import { PageProps, ViewMode } from '@/lib/types/general';
import { SharablePage } from '@/components/sharables';
import { get } from '@/lib/miscellaneous/database';

export async function generateMetadata({ params, searchParams }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const course = await get<User>("users", slug);

  return {
    title: course.title
  }
}

export default async function Page({ params, searchParams }: PageProps) {
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
          mode={mode as ViewMode}
          hideLogo={false}
          type="users"
        >
        </SharablePage>
      </main>
    </div>
  );
}
