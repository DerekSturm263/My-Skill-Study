import { Metadata, ResolvingMetadata } from 'next';
import { ComponentMode, Course, Props } from '@/lib/types';
import { get } from '@/lib/database';
import { SharablePage } from '@/components/sharables';

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const course = await get<Course>("courses", slug);

  return {
    title: course.title
  }
}

export default async function Page({ params, searchParams }: Props) {
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
          mode={mode as ComponentMode}
          hideLogo={false}
          type="courses"
        >
        </SharablePage>
      </main>
    </div>
  );
}
