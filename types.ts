export interface Ingredient {
  item: string;
  amount?: string;
}

export interface Recipe {
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  calories?: string;
  ingredients: string[];
  instructions: string[];
  tips?: string[];
  cuisine: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum AppView {
  GENERATOR = 'GENERATOR',
  CHAT = 'CHAT',
  SAVED = 'SAVED' // Placeholder for future
}

export enum Language {
  ENGLISH = 'English',
  ARABIC = 'Arabic'
}