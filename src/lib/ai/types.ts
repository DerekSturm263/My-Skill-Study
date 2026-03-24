import { SchemaUnion, Type } from '@google/genai';

export enum ModelType {
  Smart = 'gemini-flash-latest',
  Quick = 'gemini-flash-lite-latest',
  TTS = 'gemini-3.0-flash-preview-tts'
}

export type Payload = {
  model: ModelType,
  prompt: string,
  mimeType?: string,
  schema?: SchemaUnion,
  systemInstruction?: string,
  overrideInstruction?: string
}

export type Verification = {
  isValid: boolean;
  feedback: string;
};

export const verificationSchema = {
  type: Type.OBJECT,
  properties: {
    isValid: {
      type: Type.BOOLEAN
    },
    feedback: {
      type: Type.STRING
    }
  },
  required: [
    "isValid",
    "feedback"
  ],
  propertyOrdering: [
    "isValid",
    "feedback"
  ]
};
