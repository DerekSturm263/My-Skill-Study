import Content from '@/components/learn';

import { Metadata, ResolvingMetadata } from 'next';
import { Skill, Props, ComponentMode } from '@/lib/types';
import { get } from '@/lib/database';

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const course = await get<Skill>("skills", slug);

  return {
    title: course.title
  }
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const urlParams = await searchParams;

  const skill = await get<Skill>("skills", slug);
  const mode = urlParams?.mode ?? "view";

  return (
    <div>
      <main>
        <Content
          slug={slug}
          skill={skill}
          mode={mode as ComponentMode}
          apiKey={process.env.ONECOMPILER_API_KEY ?? ''}
          hideLogo={false}
        />
      </main>
    </div>
  );
}
