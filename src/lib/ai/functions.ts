'use server'

import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from '@google/genai';
import { ModelType, Payload } from './types';

const ai = new GoogleGenAI({});

const globalSystemInstruction =
`Your response should read like it's being spoken out loud by a professional. The audience is a Video Game Production student. Assume that they have no prior knowledge on the subject since they are a beginner. When using complex or technical jargon, make sure to define it immediately in easy-to-understand terms. Assume that the user reads at a 10th grade level. Keep your response as concise as possible without sacrificing usefulness.

  Wherever applicable, use technical documentation techniques. These should be included to make the text easy to follow and to highlight important information, terminology, formulas, syntaxes, etc. When doing this, use Markdown formatting. Remember that you need to sound like someone speaking, so don't include tables, headers, or other tags that may seem unnatural for spoken language. Here are some valid techniques to use:
  - Bold Text
  - Italics
  - Ordered Lists
  - Unordered Lists

  Code blocks should always be surrounded by triple backticks. Short pieces of code (including types and keywords) should always be surrounded by single backticks.
  Math formulas, equations, and variables should always be written using LATEX formatting.
                
  Do not include any greetings or salutations with your response.`;

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  }
];

export default async function generateText(payload: Payload): Promise<string> {
  const response = await ai.models.generateContent({
    model: payload.model,
    contents: payload.prompt,
    config: {
      temperature: 0,
      responseMimeType: payload.mimeType ?? 'text/plain',
      responseSchema: payload.schema ?? undefined,
      systemInstruction: payload.overrideInstruction ?? [ payload.systemInstruction ?? '', globalSystemInstruction ],
      safetySettings: safetySettings
    }
  });
  
  return response.text ?? '';
}

/*export async function readTextAloud(text: string): Promise<Buffer<ArrayBufferLike>> {
    const response = await ai.models.generateContent({
        model: ttsModel,
        contents:
            `TASK:
            Say the given TEXT.
            
            TEXT:
            ${text}`,
        config: {
            temperature: 0.5,
            systemInstruction: [
                `You are a high school tutor. You say TEXT out loud for the user to listen to. You should always speak in a professional and engaging tone.`
            ],
            safetySettings: safetySettings,
            responseModalities: [ 'AUDIO' ],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: {
                        voiceName: "Kore"
                    }
                }
            }
        }
    });

    const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    const audioBuffer = Buffer.from(data, 'base64');

    return audioBuffer;
}*/
