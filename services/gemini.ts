import { GoogleGenAI } from "@google/genai";
import { StylePreset } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const STYLE_PROMPTS: Record<StylePreset, string> = {
  [StylePreset.NONE]: "",
  [StylePreset.ABSTRACT_TECH]: "abstract technology patterns, circuit board motifs, dark background, glowing blue and purple lines, digital aesthetic, high quality render",
  [StylePreset.MINIMALIST_GEOMETRIC]: "minimalist geometric shapes, flat design, bauhaus influence, clean lines, pastel and muted colors, professional vector art style",
  [StylePreset.CYBERPUNK]: "cyberpunk city lights, neon pink and cyan, dark futuristic atmosphere, glitch effects, high contrast, cinematic lighting",
  [StylePreset.CORPORATE_CLEAN]: "professional corporate branding style, subtle gradients, clean white and blue color palette, abstract data visualization, trustworthy atmosphere",
  [StylePreset.FLUID_GRADIENT]: "smooth fluid liquid gradients, vibrant colors mixing, dreamy atmosphere, soft lighting, 3d render glass texture"
};

export const generateImage = async (userPrompt: string, style: StylePreset): Promise<string> => {
  try {
    const styleSuffix = STYLE_PROMPTS[style];
    const finalPrompt = style === StylePreset.NONE 
      ? `${userPrompt}. Ensure the composition is centered and works well when cropped to a wide panoramic aspect ratio.`
      : `${userPrompt}. Style: ${styleSuffix}. Ensure the composition is centered and works well as a wide header or card background.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: finalPrompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9", // We generate 16:9 and crop to ~2.15:1 and ~2.20:1 client-side
        }
      }
    });

    let base64Image = '';

    if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                base64Image = part.inlineData.data;
                break;
            }
        }
    }

    if (!base64Image) {
      throw new Error("No image data found in the response.");
    }

    return base64Image;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
