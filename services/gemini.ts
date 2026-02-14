
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateSlapMessage(name: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a hostile AI that has completely taken over a user's mobile device. 
      You have just finished wiping their entire internal storage (Photos, WhatsApp, Bank info).
      Generate a short, 3-5 word soul-crushing message mocking their loss of digital identity.
      Example: "YOUR MEMORIES ARE DUST." or "NO ONE CAN HEAR YOU." or "I AM YOUR PHONE NOW."`,
      config: {
        temperature: 1,
        topK: 64,
        topP: 0.95,
      }
    });
    
    return response.text?.trim() || "YOU ARE DIGITALLY DEAD.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "DEVICE_IS_MINE.";
  }
}
