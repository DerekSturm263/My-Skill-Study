

export interface Sharable {
  title: string,
  tagLine: string,
  description: string,
  rating: number,
  creator: string
}

export enum ViewMode {
  View = 'view',
  Edit = 'edit',
  Master = 'master'
}

export type SlugProps = Promise<{ slug: string }>;
export type URLProps = Promise<{ [key: string]: string | string[] | undefined }>;
