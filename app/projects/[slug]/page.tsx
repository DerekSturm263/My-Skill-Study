import { Metadata, ResolvingMetadata } from 'next';
import { ComponentMode, Project, Props } from '@/lib/types';
import { get } from '@/lib/database';
import { SharablePage } from '@/components/sharables';

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const course = await get<Project>("projects", slug);

  return {
    title: course.title
  }
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const urlParams = await searchParams;

  const project = await get<Project>("projects", slug);
  const mode = urlParams?.mode ?? "view";

  return (
    <div>
      <main>
        <SharablePage
          slug={slug}
          sharable={project}
          mode={mode as ComponentMode}
          hideLogo={false}
          type="projects"
        >
        </SharablePage>
      </main>
    </div>
  );
}
