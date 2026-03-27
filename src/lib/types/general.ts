import { SvgIconComponent } from "@mui/icons-material";
import { Verification } from "../ai/types";
import { SchemaUnion } from "@google/genai";
import { JSX } from "react";

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

export interface Element {
  requiresCompletion: boolean
}

export type ElementWrapper = {
  type: string,
  value: Element
}

export type ElementProps<T extends Element> = {
  text: string,
  originalValue: T,
  chapterIndex: number,
  pageIndex: number,
  totalPagesInChapter: number,
  isThinking: boolean,
  pagesCompleted: boolean[][],
  mode: ViewMode,
  setText: (text: string) => void,
  evaluateAndReply: (promise: Promise<Verification>) => void,
  setCurrentElementIndex: (index: number) => void
}

export interface ElementPackageBase {
  id: string,
  prettyName: string,
  description: string,
  category: string,
  icon: SvgIconComponent,
  schema: SchemaUnion
}

export interface ElementPackage<T extends Element> extends ElementPackageBase {
  defaultValue: T,
  Component: (props: ElementProps<T>) => JSX.Element
}
