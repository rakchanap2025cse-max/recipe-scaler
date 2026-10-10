export interface Ingredient {
  id: string;
  name: string;
  quantity: string; // string representation during input to allow typing decimals like "0."
  unit: string;
}

export interface ScaledIngredient {
  name: string;
  originalQuantity: number;
  scaledQuantity: number;
  unit: string;
}

export interface RecipeFormData {
  dishName: string;
  originalServings: string;
  desiredServings: string;
  ingredients: Ingredient[];
}

export interface ScaledResult {
  dishName: string;
  originalServings: number;
  desiredServings: number;
  scaleFactor: number;
  scaledIngredients: ScaledIngredient[];
  timestamp: number;
}

export interface FormErrors {
  dishName?: string;
  originalServings?: string;
  desiredServings?: string;
  ingredients?: {
    [index: number]: {
      name?: string;
      quantity?: string;
    };
  };
  general?: string;
}

export const UNIT_OPTIONS = [
  'grams (g)',
  'cups',
  'tablespoons (tbsp)',
  'teaspoons (tsp)',
  'pieces',
  'milliliters (ml)',
  'kilograms (kg)',
  'liters (L)',
  'ounces (oz)',
  'pounds (lbs)',
  'cloves',
  'slices',
  'pinches',
  'custom',
] as const;
