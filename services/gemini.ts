
import { GoogleGenAI } from "@google/genai";

export async function generateSlapMessage(name: string): Promise<string> {
  const apiKey = process.env.API_KEY;
  
  // If the API key is missing, we return a fallback instead of crashing the whole app
  if (!apiKey) {
    console.warn("API Key is not defined in process.env.API_KEY");
    return "YOUR MEMORIES ARE DUST."; 
  }

  try {
    // Initialize the AI instance inside the call to avoid top-level browser errors
    const ai = new GoogleGenAI({ apiKey });
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
    
    // Extracting text output correctly as per guidelines
    return response.text?.trim() || "YOU ARE DIGITALLY DEAD.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "DEVICE_IS_MINE.";
  }
}
