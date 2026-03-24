import Content from '@/components/learn';
import Skill from '@/lib/types/skill';

import { Metadata, ResolvingMetadata } from 'next';
import { PageProps, ViewMode } from '@/lib/types/general';
import { get } from '@/lib/miscellaneous/database';

export async function generateMetadata({ params, searchParams }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const course = await get<Skill>("skills", slug);

  return {
    title: course.title
  }
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const urlParams = await searchParams;

  const skill = await get<Skill>("skills", slug);
  const mode = urlParams?.mode ?? "view";

  return (
    <div>
      <main>
        <Content
          skill={skill}
          mode={mode as ViewMode}
        />
      </main>
    </div>
  );
}
