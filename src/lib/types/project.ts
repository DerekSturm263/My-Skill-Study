import { Sharable } from "./general"

export default interface Project extends Sharable {
  checklist: ChecklistItem[],
  value: Element
}

export type ChecklistItem = {
  title: string,
  skills: string[]
}
