import Files from '@/elements/files/components';
import Drawing from '@/elements/drawing/components';
import Graph from '@/elements/graph/components';
import DAW from '@/elements/daw/components';
import Codespace from '@/elements/codespace/components';
import ThreeDModeling from '@/elements/3d_modeling/components';
import GameEngine from '@/elements/game_engine/components';
import ShortAnswer from '@/elements/short_answer/components';
import TrueOrFalse from '@/elements/true_or_false/components';
import MultipleChoice from '@/elements/multiple_choice/components';
import Ordering from '@/elements/ordering/components';
import Matching from '@/elements/matching/components';
import DragAndDrop from '@/elements/drag_and_drop/components';
import Embed from '@/elements/embed/components';

import { Dispatch, JSX, SetStateAction } from "react";
import { SvgIconComponent } from "@mui/icons-material"
import { Verification } from "../ai/types"
import { SchemaUnion } from "@google/genai"
import { ViewMode } from "./general"

export interface Element {
  requiresCompletion: boolean
}

export type ElementWrapper = {
  type: string,
  value: Element,
  id: string
}

export type TextProps = {
  originalValue: string,
  currentValue: string,
  chapterIndex: number,
  pageIndex: number,
  totalPagesInChapter: number,
  isThinking: boolean,
  pagesCompleted: boolean[][],
  mode: ViewMode,
  setCurrentValue: (newValue: string) => void,
  setIsThinking: Dispatch<SetStateAction<boolean>>,
  setCurrentPageIndex: Dispatch<SetStateAction<number>>
}

export type ElementProps<T extends Element> = {
  text: string,
  value: T,
  isDisabled: boolean,
  setText: (text: string) => void,
  evaluateAndReply: (promise: Promise<Verification>) => void,
  setValue: Dispatch<SetStateAction<T>>,
  setIsDisabled: Dispatch<SetStateAction<boolean>>
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

export const elementMap: Record<string, ElementPackageBase> = {
  "files": Files,
  "drawing": Drawing,
  "graph": Graph,
  "daw": DAW,
  "codespace": Codespace,
  "3dModeling": ThreeDModeling,
  "gameEngine": GameEngine,
  "shortAnswer": ShortAnswer,
  "trueOrFalse": TrueOrFalse,
  "multipleChoice": MultipleChoice,
  "ordering": Ordering,
  "matching": Matching,
  "dragAndDrop": DragAndDrop,
  "embed": Embed
};
