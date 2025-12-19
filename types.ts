export enum View {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  VOCAB = 'VOCAB',
  GRAMMAR = 'GRAMMAR',
  GAME = 'GAME',
  SETTINGS = 'SETTINGS'
}

export enum Language {
  SPANISH = 'Spanish',
  FRENCH = 'French',
  GERMAN = 'German',
  ITALIAN = 'Italian',
  JAPANESE = 'Japanese',
  MANDARIN = 'Mandarin Chinese',
  ENGLISH = 'English',
  KHMER = 'Khmer'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Flashcard {
  word: string;
  translation: string;
  example: string;
}

export interface GameQuestion {
  sentence: string;
  correctWord: string;
  options: string[];
  translation: string;
  explanation: string;
}

export interface UserSettings {
  targetLanguage: Language;
  nativeLanguage: Language;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
}