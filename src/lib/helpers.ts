import { ElementID } from "./types";

export function getChapterLength(elementID: ElementID): number {
  return elementID.learn.chapters[elementID.chapterIndex].elements.length;
}

export function getAbsoluteIndex(elementID: ElementID): number {
  let index = 0;

  for (let i = 0; i < elementID.chapterIndex; ++i) {
    index += elementID.learn.chapters[i].elements.length;
  }

  return index + elementID.elementIndex;
}

export function getInteractionValue<T extends object>(elementID: ElementID): T {
  let value = elementID.learn.chapters[elementID.chapterIndex].elements[elementID.elementIndex].value;
  if (value == null)
    value = {} as T;

  return value as T;
}
