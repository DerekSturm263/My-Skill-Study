import generateText from "@/lib/ai/functions";

import { ModelType, Verification } from "@/lib/ai/types";
import { ElementType } from "./components";

export default async function verify(question: string, userResponse: boolean, value: ElementType): Promise<Verification> {
  const isValid = userResponse == value.isCorrect;

  const response = await generateText({
    model: ModelType.Quick,
    prompt:
    `TASK:
    ${isValid ?
      `The student's response was correct. Congratulate the student on getting their answer right. Review how the QUESTION was solved and why the user's RESPONSE was correct.` :
      `The student's response aws incorrect. View the student's RESPONSE and the original QUESTION and give the student feedback on why their answer wasn't the CORRECT ANSWER. Give the student some guidance on how they should work towards getting the CORRECT ANSWER.`
    }

    QUESTION:
    ${question}

    RESPONSE:
    ${userResponse}

    CORRECT ANSWER:
    ${value.isCorrect}`,
    systemInstruction: `You are a high school tutor. You evaluate a student's RESPONSE to a true/false QUESTION and give them proper FEEDBACK based on whether or not their response is correct. You will be told whether or not the response is correct, all you need to do is give the FEEDBACK.`
  });

  return {
    isValid: isValid,
    feedback: response
  };
}
