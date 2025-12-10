export interface GeneratedImage {
  originalBase64: string;
  catalogueBase64: string | null; // 388x180
  productBase64: string | null;   // 590x268
  prompt: string;
  timestamp: number;
}

export interface GenerationConfig {
  prompt: string;
  stylePreset: StylePreset;
}

export enum StylePreset {
  NONE = 'None',
  ABSTRACT_TECH = 'Abstract Tech',
  MINIMALIST_GEOMETRIC = 'Minimalist Geometric',
  CYBERPUNK = 'Cyberpunk Neon',
  CORPORATE_CLEAN = 'Corporate Clean',
  FLUID_GRADIENT = 'Fluid Gradient'
}

export const CATALOGUE_WIDTH = 388;
export const CATALOGUE_HEIGHT = 180;
export const PRODUCT_WIDTH = 590;
export const PRODUCT_HEIGHT = 268;
