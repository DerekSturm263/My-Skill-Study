import { Metadata, ResolvingMetadata } from 'next';
import { Skill, Props, ComponentMode } from '@/lib/types';
import { get } from '@/lib/database';
import { SharablePage } from '@/components/sharables';

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
        <SharablePage
          slug={slug}
          sharable={skill}
          mode={mode as ComponentMode}
          hideLogo={false}
          type="users"
        >
        </SharablePage>
      </main>
    </div>
  );
}
