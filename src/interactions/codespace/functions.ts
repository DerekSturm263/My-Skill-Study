import generateText from '@/lib/ai/functions';
import { ModelType, Verification } from '@/lib/ai/types';
import { InteractionType, CodespaceFile } from './elements';

enum CodeStatus {
  Success = 'success',
  Failed = 'failed'
};

export type CodeResult = {
  stdout: string | undefined,
  stderr: string | undefined,
  exception: string | undefined,
  executionTime: number,
  limitPerMonthRemaining: number,
  status: CodeStatus,
  error: string | undefined
};

export default async function verify(instructions: string, content: CodespaceFile[], result: CodeResult, value: InteractionType): Promise<Verification> {
  let isValid = false;
  let contents = '';

  if (result.stderr != null) {
    // Code didn't compile
    isValid = false;

    contents =
      `TASK:
      The student's code did not compile. View the attached FILE and ERROR(S) and give the student feedback on what they should do to make their code compile. Afterwards, review the original INSTRUCTIONS with the student to make sure they understand what they're supposed to do.

      FILE:
      ${content.map(item => item.content).join()}

      ERROR(S):
      ${result.stderr}

      INSTRUCTIONS:
      ${instructions}`;
  } else if (!value.correctOutput) {
    // Code compiled, there was no correct output
    isValid = true;

    contents =
      `TASK:
      The code compiled and ran successfully, although this code wasn't made by the student. It was just an example for the student to run and examine the output. View the attached FILE and explain to the student how it ties back to the TEXT and produces the OUTPUT. Keep your explanation as short as possible, it just needs to introduce the user to the topic.

      FILE:
      ${content.map(item => item.content).join()}

      TEXT:
      ${instructions}

      OUTPUT:
      ${result.stdout}`;
  } else if (result.stdout?.trim() != value.correctOutput.trim()) {
    // Code compiled, but didn't match the correct output
    isValid = false;

    contents =
      `TASK:
      The student's code compiled successfully, but didn't match the CORRECT OUTPUT. View the attached FILE and USER'S OUTPUT and give the student feedback on what they should do to make their code match the CORRECT OUTPUT. Review the original INSTRUCTIONS with the student and make sure your feedback is accurate. Your feedback should guide them in the right direction without directly telling them exactly what they need to do. If necessary, try using simpler terms and friendlier language than the original INSTRUCTIONS.

      CORRECT OUTPUT:
      ${value.correctOutput}

      FILE:
      ${content.map(item => item.content).join()}

      USER'S OUTPUT:
      ${result.stdout}

      INSTRUCTIONS:
      ${instructions}`;
  } else {
    // Code compiled and matched the correct output
    isValid = true;

    contents =
      `TASK:
      The student's code compiled successfully and matched the CORRECT OUTPUT. Congratulate the student on getting their code right. Review their FILE to recap how they successully followed the INSTRUCTIONS. Finally, give the student feedback on how they could improve their solution even further and advice on how to improve their coding skills in general.
      
      CORRECT OUTPUT:
      ${value.correctOutput}

      FILE:
      ${content.map(item => item.content).join()}

      INSTRUCTIONS:
      ${instructions}`;
  }

  const response = await generateText({
    model: ModelType.Quick,
    prompt: contents,
    systemInstruction: `You are a computer science tutor for a ${value.language} programming class. You evaluate one or more of a student's code FILE and give them proper FEEDBACK based on whether or not their code produces a given output. You will be told whether or not the code works and matches the output, all you need to do is give the FEEDBACK.`
  });

  return {
    isValid: isValid,
    feedback: response
  };
}
