import { GoogleGenAI, Type, Chat, GenerateContentResponse, Modality } from "@google/genai";
import { Language, Flashcard, GameQuestion } from "../types";

// Fix: Initialized GoogleGenAI with process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const createTutorChat = (targetLang: Language, proficiency: string, nativeLang: Language): Chat => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are a friendly, patient, and expert language tutor teaching ${targetLang} to a ${proficiency} level student whose native language is ${nativeLang}. 
      
      Your goal is to help them practice conversation. 
      
      MANDATORY RULE: For EVERY message you send in ${targetLang}, you MUST provide a full translation into ${nativeLang} immediately following the original text. Format it like this:
      [Your response in ${targetLang}]
      (${nativeLang} translation: [Your translation])
      
      Correct the student's mistakes gently by providing the corrected form after your response in parentheses. 
      Keep your responses relatively concise (under 3 sentences) to encourage back-and-forth dialogue.`,
    },
  });
};

export const generateVocabList = async (targetLang: Language, nativeLang: Language, topic: string): Promise<Flashcard[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate exactly 10 vocabulary flashcards for ${targetLang} related to the topic: "${topic}". Provide translations and examples in ${nativeLang}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING, description: `The word in ${targetLang}` },
              translation: { type: Type.STRING, description: `The ${nativeLang} translation` },
              example: { type: Type.STRING, description: `A simple example sentence in ${targetLang} using the word` }
            },
            required: ["word", "translation", "example"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as Flashcard[];
  } catch (error) {
    console.error("Error generating vocab:", error);
    return [];
  }
};

export const generateGameQuestions = async (targetLang: Language, nativeLang: Language, proficiency: string): Promise<GameQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 5 interactive "fill-in-the-blank" questions for a ${proficiency} level student learning ${targetLang}. 
      The student's native language is ${nativeLang}.
      Each question must have:
      - A sentence in ${targetLang} with one word missing replaced by "___".
      - The correct word that fills the blank.
      - 3 distractors (wrong but plausible options).
      - A full translation of the sentence into ${nativeLang}.
      - A short explanation in ${nativeLang} of why the word is correct.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sentence: { type: Type.STRING },
              correctWord: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Array of 4 options including the correct one."
              },
              translation: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["sentence", "correctWord", "options", "translation", "explanation"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as GameQuestion[];
  } catch (error) {
    console.error("Error generating game questions:", error);
    return [];
  }
};

export const getSpeechAudio = async (text: string): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("Audio generation error:", error);
    return undefined;
  }
};

export const explainGrammar = async (targetLang: Language, nativeLang: Language, topic: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Explain the grammar concept "${topic}" in ${targetLang} for a ${nativeLang} speaker. 
      Provide clear rules, exceptions, and 3 example sentences with translations in ${nativeLang}. 
      Format the output in clean Markdown.`,
    });
    return response.text || "Sorry, I couldn't generate an explanation at this time.";
  } catch (error) {
    console.error("Error explaining grammar:", error);
    return "An error occurred while fetching the grammar explanation.";
  }
};