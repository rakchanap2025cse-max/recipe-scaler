import { FormErrors, Ingredient, RecipeFormData, ScaledResult } from '../types';

export const STORAGE_KEYS = {
  FORM: 'recipe_scaler_form_data',
  RESULT: 'recipe_scaler_latest_result',
};

export const INITIAL_INGREDIENTS: Ingredient[] = [
  { id: '1', name: '', quantity: '', unit: 'cups' },
  { id: '2', name: '', quantity: '', unit: 'tablespoons (tbsp)' },
  { id: '3', name: '', quantity: '', unit: 'grams (g)' },
];

export const INITIAL_FORM_DATA: RecipeFormData = {
  dishName: '',
  originalServings: '',
  desiredServings: '',
  ingredients: INITIAL_INGREDIENTS,
};

export const SAMPLE_RECIPES: { label: string; data: RecipeFormData }[] = [
  {
    label: 'Fluffy Buttermilk Pancakes',
    data: {
      dishName: 'Fluffy Buttermilk Pancakes',
      originalServings: '4',
      desiredServings: '8',
      ingredients: [
        { id: '1', name: 'All-Purpose Flour', quantity: '2', unit: 'cups' },
        { id: '2', name: 'Granulated Sugar', quantity: '2.5', unit: 'tablespoons (tbsp)' },
        { id: '3', name: 'Whole Milk', quantity: '350', unit: 'milliliters (ml)' },
      ],
    },
  },
  {
    label: 'Fresh Chunky Guacamole',
    data: {
      dishName: 'Fresh Chunky Guacamole',
      originalServings: '2',
      desiredServings: '6',
      ingredients: [
        { id: '1', name: 'Ripe Hass Avocados', quantity: '2', unit: 'pieces' },
        { id: '2', name: 'Fresh Lime Juice', quantity: '1.5', unit: 'tablespoons (tbsp)' },
        { id: '3', name: 'Finely Chopped Red Onion', quantity: '0.5', unit: 'cups' },
      ],
    },
  },
  {
    label: 'Authentic Italian Basil Pesto',
    data: {
      dishName: 'Authentic Italian Basil Pesto',
      originalServings: '4',
      desiredServings: '10',
      ingredients: [
        { id: '1', name: 'Fresh Sweet Basil Leaves', quantity: '50', unit: 'grams (g)' },
        { id: '2', name: 'Pine Nuts (Toasted)', quantity: '30', unit: 'grams (g)' },
        { id: '3', name: 'Extra Virgin Olive Oil', quantity: '0.5', unit: 'cups' },
      ],
    },
  },
];

export function validateRecipe(data: RecipeFormData): {
  isValid: boolean;
  errors: FormErrors;
} {
  const errors: FormErrors = {};
  let isValid = true;

  // Validate Dish Name
  if (!data.dishName || data.dishName.trim() === '') {
    errors.dishName = 'Please enter a dish name.';
    isValid = false;
  }

  // Validate Original Servings
  const origServ = parseFloat(data.originalServings);
  if (!data.originalServings || data.originalServings.trim() === '') {
    errors.originalServings = 'Original servings cannot be empty.';
    isValid = false;
  } else if (isNaN(origServ)) {
    errors.originalServings = 'Original servings must be a valid number.';
    isValid = false;
  } else if (origServ <= 0) {
    errors.originalServings = 'Original servings must be greater than zero.';
    isValid = false;
  }

  // Validate Desired Servings
  const desServ = parseFloat(data.desiredServings);
  if (!data.desiredServings || data.desiredServings.trim() === '') {
    errors.desiredServings = 'Desired servings cannot be empty.';
    isValid = false;
  } else if (isNaN(desServ)) {
    errors.desiredServings = 'Desired servings must be a valid number.';
    isValid = false;
  } else if (desServ <= 0) {
    errors.desiredServings = 'Desired servings must be greater than zero.';
    isValid = false;
  }

  // Validate Ingredients (at least 3 ingredients or all provided)
  const ingredientErrors: { [index: number]: { name?: string; quantity?: string } } = {};
  let hasIngredientErrors = false;

  data.ingredients.forEach((ing, index) => {
    const ingRowError: { name?: string; quantity?: string } = {};

    if (!ing.name || ing.name.trim() === '') {
      ingRowError.name = `Ingredient ${index + 1} name is required.`;
      hasIngredientErrors = true;
    }

    const qty = parseFloat(ing.quantity);
    if (!ing.quantity || ing.quantity.trim() === '') {
      ingRowError.quantity = `Ingredient ${index + 1} quantity is required.`;
      hasIngredientErrors = true;
    } else if (isNaN(qty)) {
      ingRowError.quantity = `Quantity must be a valid number.`;
      hasIngredientErrors = true;
    } else if (qty <= 0) {
      ingRowError.quantity = `Quantity must be greater than zero.`;
      hasIngredientErrors = true;
    }

    if (Object.keys(ingRowError).length > 0) {
      ingredientErrors[index] = ingRowError;
    }
  });

  if (hasIngredientErrors) {
    errors.ingredients = ingredientErrors;
    isValid = false;
  }

  return { isValid, errors };
}

export function scaleRecipe(data: RecipeFormData): ScaledResult {
  const originalServings = parseFloat(data.originalServings);
  const desiredServings = parseFloat(data.desiredServings);
  const scaleFactor = desiredServings / originalServings;

  const scaledIngredients = data.ingredients.map((ing) => {
    const originalQuantity = parseFloat(ing.quantity);
    // Formula: New quantity = Original quantity × Desired servings ÷ Original servings
    const scaledQuantity = (originalQuantity * desiredServings) / originalServings;

    return {
      name: ing.name.trim(),
      originalQuantity,
      scaledQuantity,
      unit: ing.unit,
    };
  });

  return {
    dishName: data.dishName.trim(),
    originalServings,
    desiredServings,
    scaleFactor,
    scaledIngredients,
    timestamp: Date.now(),
  };
}

export function formatQuantityNumber(value: number): string {
  if (Number.isInteger(value)) {
    return value.toString();
  }
  // Round to up to 2 decimal places cleanly
  const rounded = Math.round(value * 100) / 100;
  return rounded.toString();
}

export function formatAsFraction(value: number): string {
  if (Number.isInteger(value)) {
    return value.toString();
  }

  const whole = Math.floor(value);
  const remainder = value - whole;

  // Approximate common cooking fractions within tolerance
  const fractions: [number, string][] = [
    [0.125, '⅛'],
    [0.25, '¼'],
    [0.333, '⅓'],
    [0.375, '⅜'],
    [0.5, '½'],
    [0.625, '⅝'],
    [0.667, '⅔'],
    [0.75, '¾'],
    [0.875, '⅞'],
  ];

  for (const [fracVal, glyph] of fractions) {
    if (Math.abs(remainder - fracVal) < 0.04) {
      return whole > 0 ? `${whole} ${glyph}` : glyph;
    }
  }

  return formatQuantityNumber(value);
}

// LocalStorage helpers
export function loadSavedFormData(): RecipeFormData {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FORM);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.ingredients) && parsed.ingredients.length >= 3) {
        return parsed;
      }
    }
  } catch {
    // Ignore parsing errors and return defaults
  }
  return INITIAL_FORM_DATA;
}

export function saveFormData(data: RecipeFormData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FORM, JSON.stringify(data));
  } catch {
    // Ignore storage errors in restrictive environments
  }
}

export function loadSavedResult(): ScaledResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESULT);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.dishName && Array.isArray(parsed.scaledIngredients)) {
        return parsed;
      }
    }
  } catch {
    // Ignore parsing errors
  }
  return null;
}

export function saveResult(result: ScaledResult): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RESULT, JSON.stringify(result));
  } catch {
    // Ignore storage errors
  }
}

export function clearSavedStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.FORM);
    localStorage.removeItem(STORAGE_KEYS.RESULT);
  } catch {
    // Ignore storage errors
  }
}
