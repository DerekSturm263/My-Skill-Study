import { Sharable } from "./general"

export default interface Course extends Sharable {
  units: Unit[]
}

export type Unit = {
  title: string,
  modules: Module[]
}

export type Module = {
  type: ModuleType,
  id: string
}

export enum ModuleType {
  Skill = 'skill',
  Project = 'project'
}
