import { InteractionType as TextType } from "@/interactions/text/elements";
import { InteractionWrapper, Sharable } from "./general";

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
  interactions: InteractionWrapper[]
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

