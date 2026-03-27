import { ElementType as TextType } from "@/elements/text/components";
import { ElementWrapper as ElementWrapper, Sharable } from "./general";

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
  pages: Page[]
}

export type Page = {
  text: TextType,
  elements: ElementWrapper[]
}

export type Practice = {
  subSkills: SmallChapter[]
}

export type Quiz = {
  questions: SmallChapter[]
}

export type SmallChapter = {
  title: string,
  page: Page
}

