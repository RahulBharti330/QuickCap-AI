import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, AIAssistance } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes raw input text to extract structured task data.
 */
export const analyzeTaskInput = async (inputText: string): Promise<AIAnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("Gemini API Key is missing.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Act as a local Windows background service intelligence layer. Analyze this user input: "${inputText}".
    
    Rules:
    1. **Shopping Detection**: If the input is a URL (especially Amazon/Shopify) or mentions "buy", categorize as "Shopping". Extract the product name as the Title.
    2. **Complex Tasks**: If the task is broad (e.g., "Prepare for interview", "Plan wedding"), generate 3-5 concrete, chronological subtasks.
    3. **Context**: Infer 'Work', 'Personal', 'Dev', or 'Health' if not Shopping.
    4. **Links**: Extract any URLs into the links array.
    
    Output JSON only.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Actionable task title" },
          description: { type: Type.STRING, description: "Brief context or summary" },
          category: { type: Type.STRING, description: "Category" },
          priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
          subtasks: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Suggested subtasks"
          },
          remark: { type: Type.STRING, description: "A witty, hacker-like, or motivational remark (max 10 words)" },
          links: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Extracted URLs"
          }
        },
        required: ["title", "category", "priority", "subtasks", "remark"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as AIAnalysisResult;
};

/**
 * Provides a deep-dive strategy for a specific task.
 */
export const getTaskAssistance = async (taskTitle: string): Promise<AIAssistance> => {
  if (!process.env.API_KEY) throw new Error("API Key missing");

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide actionable assistance for the task: "${taskTitle}".
    I need:
    1. 3 concrete, strategic steps to complete it efficiently.
    2. A "Pro Tip" or hack related to this task.
    3. A specific Google Search Query I should use to learn more.
    4. 2 keyword-based resource suggestions (e.g., "Documentation", "Local Store").
    
    Output JSON only.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          proTip: { type: Type.STRING },
          searchQuery: { type: Type.STRING },
          resources: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["steps", "proTip", "searchQuery", "resources"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response");
  return JSON.parse(text) as AIAssistance;
};

export const generateNotificationMessage = async (type: 'reminder' | 'completion', taskTitle: string): Promise<string> => {
    if (!process.env.API_KEY) return type === 'reminder' ? `Time to focus on: ${taskTitle}` : "Great job!";

    const prompt = type === 'reminder' 
      ? `Write a humorous, slightly nagging but friendly 1-sentence reminder for the task: "${taskTitle}".`
      : `Write a high-energy, 1-sentence praise for completing: "${taskTitle}".`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });
        return response.text || (type === 'reminder' ? "Reminder!" : "Done!");
    } catch (e) {
        return type === 'reminder' ? "Don't forget this!" : "Task Completed!";
    }
}