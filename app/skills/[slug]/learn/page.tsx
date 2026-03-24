import Content from '@/components/learn';
import Skill from '@/lib/types/skill';

import { SlugProps, URLProps, ViewMode } from '@/lib/types/general';
import { Metadata, ResolvingMetadata } from 'next';
import { get } from '@/lib/miscellaneous/database';

export async function generateMetadata({ params }: { params: SlugProps }, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const course = await get<Skill>("skills", slug);

  return {
    title: course.title
  }
}

export default async function Page({ params, searchParams }: { params: SlugProps, searchParams: URLProps }) {
  const { slug } = await params;
  const urlParams = await searchParams;

  const valueWithId = await get<Skill>("skills", slug);
  const value = valueWithId as Skill;
  const id = valueWithId._id.toString();
  
  const mode = urlParams?.mode ?? "view";

  return (
    <div>
      <main>
        <Content
          skill={value}
          id={id}
          mode={mode as ViewMode}
        />
      </main>
    </div>
  );
}
