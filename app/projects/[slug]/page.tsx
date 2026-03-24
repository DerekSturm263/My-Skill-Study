import Project from '@/lib/types/project';

import { Metadata, ResolvingMetadata } from 'next';
import { ViewMode, PageProps } from '@/lib/types/general';
import { SharablePage } from '@/components/sharables';
import { get } from '@/lib/miscellaneous/database';

export async function generateMetadata({ params, searchParams }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const course = await get<Project>("projects", slug);

  return {
    title: course.title
  }
}

export default async function Page({ params, searchParams }: PageProps) {
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
          mode={mode as ViewMode}
          hideLogo={false}
          type="projects"
        >
        </SharablePage>
      </main>
    </div>
  );
}
