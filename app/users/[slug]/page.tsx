import User from '@/lib/types/user';

import { SlugProps, URLProps, ViewMode } from '@/lib/types/general';
import { Metadata, ResolvingMetadata } from 'next';
import { SharablePage } from '@/components/sharables';
import { get } from '@/lib/miscellaneous/database';

export async function generateMetadata({ params }: { params: SlugProps }, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const course = await get<User>("users", slug);

  return {
    title: course.title
  }
}

export default async function Page({ params, searchParams }: { params: SlugProps, searchParams: URLProps }) {
  const { slug } = await params;
  const urlParams = await searchParams;

  const valueWithId = await get<User>("users", slug);
  const value = valueWithId as User;
  const id = valueWithId._id.toString();
  
  const mode = urlParams?.mode ?? "view";

  return (
    <div>
      <main>
        <SharablePage
          slug={slug}
          sharable={value}
          mode={mode as ViewMode}
          type="users"
        >
        </SharablePage>
      </main>
    </div>
  );
}
