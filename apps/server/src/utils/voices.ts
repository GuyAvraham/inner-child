import type { Age } from '~/types';

// voice gallery: https://speech.microsoft.com/portal/voicegallery
export const voices = {
  en: {
    male: {
      young: 'en-US-AnaNeural',
      old: 'en-US-DavisNeural',
    },
    female: {
      young: 'en-US-AnaNeural',
      old: 'en-US-CoraNeural',
    },
  },
  he: {
    male: {
      young: 'en-US-AnaNeural', // if needed, find for he-IL and replace, now copy from en-US
      old: 'he-IL-AvriNeural',
    },
    female: {
      young: 'en-US-AnaNeural', // if needed, find for he-IL and replace, now copy from en-US
      old: 'he-IL-HilaNeural',
    },
  },
};

export function detectLanguage(text: string): 'he' | 'en' {
  // const englishRegex = /[\u0041-\u005A\u0061-\u007A]/; // Just in case if needed in future
  const hebrewRegex = /[\u0590-\u05FF]/;
  return hebrewRegex.test(text) ? 'he' : 'en';
}

/**
 * This function is used to get the voice id based on the text, gender and age.
 * @param text - The text to be spoken
 * @param gender - male or female
 * @param age - young or old
 * @returns The voice id
 *
 * @example getVoiceId('Hello', 'male', 'young') // returns 'en-US-AnaNeural'
 * @example getVoiceId('שלום', 'male', 'old') // returns 'he-IL-AvriNeural'
 */
export function getVoiceId(text: string, gender: 'male' | 'female', age: Age): string {
  const language = detectLanguage(text);
  return voices[language][gender][age];
}
