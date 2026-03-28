import generateText from "@/lib/ai/functions";

import { ModelType, Verification } from "@/lib/ai/types";
import { ElementType, ChoiceType } from "./components";

export default async function verify(question: string, userResponse: string[], value: ElementType): Promise<Verification> {
  let isValid = false;
  let contents = '';

  const overlappingAnswers = userResponse.filter(item1 => value.items.filter(item2 => item2.isCorrect).some(item3 => item1 == item3.value));

  if (value.items.filter((item) => item.isCorrect).length == 1) {
    isValid = overlappingAnswers.length > 0;

    contents =
    `TASK:
    ${isValid ?
      `The student's response was correct. Congratulate the student on getting their answer right. Review how the QUESTION was solved, why the USER RESPONSE was correct, and why the INCORRECT ANSWERS were incorrect.` :
      `The student's response was incorrect. View the USER'S RESPONSE and the original QUESTION and give the student feedback on why their answer was one of the INCORRECT ANSWERS. Give the student some guidance on how they should work towards getting the CORRECT ANSWER.`
    }

    QUESTION:
    ${question}

    USER'S RESPONSE:
    ${userResponse.join(', ')}

    CORRECT ANSWER:
    ${value.items.filter(item => item.isCorrect).map(item => item.value).join(', ')}

    INCORRECT ANSWERS:
    ${value.items.filter(item => !item.isCorrect).map(item => item.value).join(', ')}`;
  } else if (value.choiceType == ChoiceType.NeedsAllCorrect) {
    isValid = overlappingAnswers.length == value.items.filter(item => item.isCorrect).length && overlappingAnswers.length == userResponse.length;

    contents =
    `TASK:
    ${isValid ?
      `The student's response was correct, they got all the CORRECT ANSWERS. Congratulate the student on getting their answers right. Review how the QUESTION was solved, why the USER RESPONSE was correct, and why the INCORRECT ANSWERS were incorrect.` :
      `The student's response was incorrect, they didn't get all the CORRECT ANSWERS. View the USER'S RESPONSE and the original QUESTION and give the student feedback on why their answer was wrong. Pay attention to if any of the USER's RESPONSES were part of the INCORRECT ANSWERS or if they just didn't get all the CORRECT ANSWERS. If they selected one of the INCORRECT ANSWERS, tell the user why it's wrong. Give the student some guidance on how they should work towards getting the CORRECT ANSWER.`
    }

    QUESTION:
    ${question}

    USER'S RESPONSE:
    ${userResponse.join(', ')}

    CORRECT ANSWERS:
    ${value.items.map(item => item.value).join(', ')}

    INCORRECT ANSWERS:
    ${value.items.filter(item => !item.isCorrect).map(item => item.value).join(', ')}`;
  } else {
    isValid = overlappingAnswers.length > 0 && userResponse.length == overlappingAnswers.length;

    contents =
    `TASK:
    ${isValid ?
      `The student's response was correct, they got at least one of the CORRECT ANSWERS. Congratulate the student on getting an answer right. Review how the QUESTION was solved, why the USER RESPONSE was correct, and why the other CORRECT ANSWERS that weren't part of the USER'S RESPONSE were also correct.` :
      `The student's response was incorrect, they didn't get at least one of the CORRECT ANSWERS or one of their responses was an INCORRECT ANSWER. View the USER'S RESPONSE and the original QUESTION and give the student feedback on why their answer was one of the INCORRECT ANSWERS. Pay attention to if any of the USER'S RESPONSES were part of the INCORRECT ANSWERS. Give the student some guidance on how they should work towards getting the CORRECT ANSWER.`
    }

    QUESTION:
    ${question}

    USER'S RESPONSE:
    ${userResponse.join(', ')}

    CORRECT ANSWERS:
    ${value.items.map(item => item.value).join(', ')}

    INCORRECT ANSWERS:
    ${value.items.filter(item => !item.isCorrect).map(item => item.value).join(', ')}`;
  }

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
