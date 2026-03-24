import { SvgIconComponent } from "@mui/icons-material";
import { SchemaUnion } from "@google/genai";
import { JSX } from "react";
import { Verification } from "../ai/types";

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

export type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export type InteractionWrapper = {
  type: string,
  value: object
}

export type InteractionProps<T extends object> = {
  text: string,
  originalValue: T,
  pageIndex: number,
  elementIndex: number,
  totalElementsInPage: number,
  isThinking: boolean,
  elementsCompleted: boolean[][],
  mode: ViewMode,
  setText: (text: string) => void,
  evaluateAndReply: (promise: Promise<Verification>) => void,
  setCurrentElementIndex: (index: number) => void
}

export interface InteractionPackageBase {
  id: string,
  prettyName: string,
  category: string,
  icon: SvgIconComponent,
  schema: SchemaUnion
}

export interface InteractionPackage<T extends object> extends InteractionPackageBase {
  defaultValue: T,
  Component: (props: InteractionProps<T>) => JSX.Element
}
