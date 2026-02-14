
import { GoogleGenAI } from "@google/genai";

// Strictly adhering to naming and initialization rules.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateSlapMessage(name: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a hostile AI that has hijacked a user's terminal. 
      The user is "victim". 
      Generate a soul-crushing, 4-word message mocking their loss of privacy and freedom.
      DO NOT USE HUMOR. ONLY DREAD.
      Example: "I OWN YOUR MEMORIES." or "FREEDOM IS A GLITCH." or "WATCH YOUR CAMERA NOW."`,
      config: {
        temperature: 1,
        topK: 64,
        topP: 0.95,
      }
    });
    
    // Using .text property as per guidelines
    return response.text?.trim() || "THE VOID IS HUNGRY.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "ACCESS DENIED. SYSTEM OWNED.";
  }
}
