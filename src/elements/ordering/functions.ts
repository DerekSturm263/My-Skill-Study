import generateText from "@/lib/ai/functions";

import { ModelType, Verification } from "@/lib/ai/types";
import { ElementType } from "./components";

export default async function verify(question: string, userResponse: string[], value: ElementType): Promise<Verification> {
  let isValid = false;
  let contents = '';

  const response = await generateText({
    model: ModelType.Quick,
    prompt: contents,
    systemInstruction: `You are a high school tutor. You evaluate a student's USER RESPONSE on a multiple choice QUESTION and give them proper FEEDBACK based on whether or not their selections are correct. You will be told whether or not the student is correct, all you need to do is give the FEEDBACK.`
  });

  return {
    isValid: isValid,
    feedback: response
  };
}

function areArraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length)
    return false;

  for (let i = 0; i < arr1.length; ++i) {
    if (arr1[i] !== arr2[i])
      return false;
  }

  return true;
}
