import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, Language } from '../types';

const apiKey = process.env.API_KEY || '';
// Initialize with just the API key. 
// Note: We create new instances in functions if we need specific configs, 
// but for general use, we can share or recreate.
// To avoid key issues if the env isn't ready immediately, we'll instantiate inside calls or check usage.

const ai = new GoogleGenAI({ apiKey });

export const generateRecipeFromIngredients = async (
  ingredients: string,
  preferences: string,
  language: Language
): Promise<Recipe> => {
  const modelId = 'gemini-2.5-flash';

  const langInstruction = language === Language.ARABIC 
    ? "Generate the content strictly in Arabic." 
    : "Generate the content in English.";

  const prompt = `
    You are a world-class chef named Chef Ghisipies.
    Create a detailed recipe based on these ingredients: ${ingredients}.
    Additional preferences: ${preferences}.
    
    ${langInstruction}
    
    Return the response in a structured JSON format matching this schema:
    {
      "title": "Recipe Name",
      "description": "A short, appetizing description.",
      "prepTime": "e.g. 15 mins",
      "cookTime": "e.g. 30 mins",
      "servings": 4,
      "difficulty": "Easy",
      "calories": "e.g. 500 kcal",
      "ingredients": ["1 cup flour", "2 eggs"],
      "instructions": ["Step 1", "Step 2"],
      "tips": ["Chef tip 1"],
      "cuisine": "Italian"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            prepTime: { type: Type.STRING },
            cookTime: { type: Type.STRING },
            servings: { type: Type.NUMBER },
            difficulty: { type: Type.STRING },
            calories: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            cuisine: { type: Type.STRING },
          },
          required: ["title", "ingredients", "instructions"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as Recipe;
    }
    throw new Error("No text returned from model");
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw error;
  }
};

export const generateDishImage = async (dishDescription: string): Promise<string | null> => {
  const modelId = 'gemini-2.5-flash-image';
  
  const prompt = `Professional food photography of ${dishDescription}, high resolution, studio lighting, appetizing, 4k.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      // Flash image model doesn't support 'generateImages' method in this SDK version typically used for text-to-image 
      // unless using Imagen specific models. 
      // However, per instructions: "General Image Generation ... Tasks: 'gemini-2.5-flash-image'".
      // And "Call generateContent to generate images with nano banana series models".
    });

    // Extract image from response parts
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
       for (const part of response.candidates[0].content.parts) {
         if (part.inlineData) {
           return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
         }
       }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null; // Fail gracefully for images
  }
};

export const chatWithChef = async (history: {role: string, parts: {text: string}[]}[], message: string, language: Language) => {
  const modelId = 'gemini-2.5-flash';
  
  const systemInstruction = `You are Chef Ghisipies, a friendly and expert culinary assistant. 
  Answer cooking questions, suggest substitutes, and give tips. 
  Keep answers concise and helpful. 
  ${language === Language.ARABIC ? "Reply in Arabic." : "Reply in English."}`;

  try {
    const chat = ai.chats.create({
      model: modelId,
      history: history,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
};
