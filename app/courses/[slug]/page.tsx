import Course from '@/lib/types/course';

import { Metadata, ResolvingMetadata } from 'next';
import { ViewMode, PageProps } from '@/lib/types/general';
import { SharablePage } from '@/components/sharables';
import { get } from '@/lib/miscellaneous/database';

export async function generateMetadata({ params, searchParams }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const course = await get<Course>("courses", slug);

  return {
    title: course.title
  }
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const urlParams = await searchParams;

  const course = await get<Course>("courses", slug);
  const mode = urlParams?.mode ?? "view";

  return (
    <div>
      <main>
        <SharablePage
          slug={slug}
          sharable={course}
          mode={mode as ViewMode}
          hideLogo={false}
          type="courses"
        >
        </SharablePage>
      </main>
    </div>
  );
}
