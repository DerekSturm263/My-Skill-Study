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
  elements: Element[]
}

export type Element = {
  text: TextType,
  interactions: InteractionWrapper[]
}

export type Practice = {
  subSkills: SubSkill[]
}

export type SubSkill = {
  title: string,
  value: object
}

export type Quiz = {
  questions: Element[]
}
