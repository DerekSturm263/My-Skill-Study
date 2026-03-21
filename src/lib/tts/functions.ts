'use server'

import { TextToSpeechClient } from '@google-cloud/text-to-speech';

const client = new TextToSpeechClient({ apiKey: process.env.GOOGLE_TTS_API_KEY });

export default async function speakText() {
  return client.streamingSynthesize();
}
