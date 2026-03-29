import { ElementType as TextType } from "@/components/text";
import { ElementWrapper } from "./element";
import { Sharable } from "./general";

export default interface Skill extends Sharable {
  learn: Learn,
  practice: Practice,
  quiz: Quiz
}

export type Learn = {
  chapters: Chapter[]
}

export type Chapter = {
  title: string,
  pages: Page[],
  id: string
}

export interface Page {
  text: TextType,
  elements: ElementWrapper[],
  id: string,
  isComplete: boolean
}

export type Practice = {
  subSkills: SmallChapter[]
}

export type Quiz = {
  questions: SmallChapter[]
}

export interface SmallChapter {
  title: string,
  page: Page,
  id: string
}

export type PageIndex = {
  chapter: number,
  page: number
}
