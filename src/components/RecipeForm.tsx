import React from 'react';
import { AlertCircle, RotateCcw, Scale, Sparkles, UtensilsCrossed } from 'lucide-react';
import { FormErrors, RecipeFormData, UNIT_OPTIONS } from '../types';
import { SAMPLE_RECIPES } from '../utils/scaler';

interface RecipeFormProps {
  formData: RecipeFormData;
  errors: FormErrors;
  onChange: (data: RecipeFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  onSelectSample: (recipe: RecipeFormData) => void;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({
  formData,
  errors,
  onChange,
  onSubmit,
  onReset,
  onSelectSample,
}) => {
  const handleDishNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...formData,
      dishName: e.target.value,
    });
  };

  const handleServingsChange = (field: 'originalServings' | 'desiredServings', value: string) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  const handleIngredientChange = (
    index: number,
    field: 'name' | 'quantity' | 'unit',
    value: string
  ) => {
    const nextIngredients = [...formData.ingredients];
    nextIngredients[index] = {
      ...nextIngredients[index],
      [field]: value,
    };
    onChange({
      ...formData,
      ingredients: nextIngredients,
    });
  };

  // Quick multipliers for desired servings
  const applyQuickMultiplier = (multiplier: number) => {
    const orig = parseFloat(formData.originalServings);
    if (!isNaN(orig) && orig > 0) {
      const scaled = Math.round(orig * multiplier * 10) / 10;
      handleServingsChange('desiredServings', scaled.toString());
    }
  };

  // Calculate live preview ratio if both numbers are valid
  const origNum = parseFloat(formData.originalServings);
  const desNum = parseFloat(formData.desiredServings);
  const previewRatio = !isNaN(origNum) && !isNaN(desNum) && origNum > 0 && desNum > 0
    ? (desNum / origNum).toFixed(2)
    : null;

  const hasAnyErrors = Object.keys(errors).length > 0;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm relative overflow-hidden">
      {/* Decorative subtle header tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            <UtensilsCrossed className="w-4 h-4 text-emerald-700" />
            <span>Recipe Details & Ingredients</span>
          </div>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Configure Your Recipe
          </h2>
          <p className="text-sm text-stone-500 mt-0.5">
            Enter your original recipe servings and 3 key ingredients to scale up or down.
          </p>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex items-center gap-1.5 flex-wrap sm:justify-end">
          <span className="text-xs font-medium text-stone-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" /> Quick fill:
          </span>
          {SAMPLE_RECIPES.map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => onSelectSample(sample.data)}
              className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 text-stone-600 transition-colors cursor-pointer border border-stone-200/60"
            >
              {sample.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Global Validation Alert Banner */}
      {hasAnyErrors && (
        <div
          role="alert"
          className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-rose-800">
              Please fix the following errors before scaling:
            </p>
            <ul className="mt-1.5 list-disc list-inside space-y-0.5 text-rose-700 text-xs sm:text-sm">
              {errors.dishName && <li>{errors.dishName}</li>}
              {errors.originalServings && <li>{errors.originalServings}</li>}
              {errors.desiredServings && <li>{errors.desiredServings}</li>}
              {errors.ingredients &&
                Object.entries(errors.ingredients).map(([idx, errObj]) => (
                  <React.Fragment key={idx}>
                    {errObj.name && <li>{errObj.name}</li>}
                    {errObj.quantity && (
                      <li>
                        Ingredient {Number(idx) + 1}: {errObj.quantity}
                      </li>
                    )}
                  </React.Fragment>
                ))}
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-6" noValidate>
        {/* Dish Name */}
        <div>
          <label
            htmlFor="dish-name"
            className="block text-sm font-semibold text-stone-800 mb-1.5"
          >
            Dish Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="dish-name"
            type="text"
            value={formData.dishName}
            onChange={handleDishNameChange}
            placeholder="e.g. Grandma's Chocolate Chip Cookies"
            className={`w-full px-4 py-3 rounded-xl border text-stone-900 placeholder:text-stone-400 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
              errors.dishName
                ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/30'
                : 'border-stone-200 focus:ring-emerald-700/20 focus:border-emerald-700'
            }`}
          />
          {errors.dishName && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.dishName}</p>
          )}
        </div>

        {/* Servings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl bg-stone-50/70 border border-stone-200/80">
          {/* Original Servings */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="original-servings"
                className="text-sm font-semibold text-stone-800"
              >
                Original Servings <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-stone-500">Base recipe size</span>
            </div>
            <input
              id="original-servings"
              type="number"
              step="any"
              min="0.1"
              value={formData.originalServings}
              onChange={(e) => handleServingsChange('originalServings', e.target.value)}
              placeholder="e.g. 4"
              className={`w-full px-4 py-2.5 rounded-xl border text-stone-900 placeholder:text-stone-400 bg-white focus:outline-none focus:ring-2 transition-all tabular-nums ${
                errors.originalServings
                  ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/30'
                  : 'border-stone-200 focus:ring-emerald-700/20 focus:border-emerald-700'
              }`}
            />
            {errors.originalServings ? (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                {errors.originalServings}
              </p>
            ) : (
              <p className="mt-1 text-xs text-stone-400">
                Number of portions the original recipe yields.
              </p>
            )}
          </div>

          {/* Desired Servings */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="desired-servings"
                className="text-sm font-semibold text-stone-800"
              >
                Desired Servings <span className="text-rose-500">*</span>
              </label>
              {previewRatio && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  {previewRatio}× ratio
                </span>
              )}
            </div>
            <input
              id="desired-servings"
              type="number"
              step="any"
              min="0.1"
              value={formData.desiredServings}
              onChange={(e) => handleServingsChange('desiredServings', e.target.value)}
              placeholder="e.g. 10"
              className={`w-full px-4 py-2.5 rounded-xl border text-stone-900 placeholder:text-stone-400 bg-white focus:outline-none focus:ring-2 transition-all tabular-nums ${
                errors.desiredServings
                  ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/30'
                  : 'border-stone-200 focus:ring-emerald-700/20 focus:border-emerald-700'
              }`}
            />
            {errors.desiredServings ? (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.desiredServings}</p>
            ) : (
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-[11px] text-stone-400">Quick scale:</span>
                <button
                  type="button"
                  onClick={() => applyQuickMultiplier(0.5)}
                  className="text-[11px] px-2 py-0.5 rounded bg-white hover:bg-stone-200 text-stone-600 border border-stone-200 cursor-pointer"
                >
                  ½× Half
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickMultiplier(2)}
                  className="text-[11px] px-2 py-0.5 rounded bg-white hover:bg-stone-200 text-stone-600 border border-stone-200 cursor-pointer"
                >
                  2× Double
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickMultiplier(3)}
                  className="text-[11px] px-2 py-0.5 rounded bg-white hover:bg-stone-200 text-stone-600 border border-stone-200 cursor-pointer"
                >
                  3× Triple
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3 Ingredients Section */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Three Recipe Ingredients
              </h3>
              <p className="text-xs text-stone-500">
                Provide ingredient names, quantities (decimals allowed), and measurement units.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {formData.ingredients.map((ingredient, index) => {
              const rowErrors = errors.ingredients?.[index];
              return (
                <div
                  key={ingredient.id || index}
                  className={`p-4 rounded-2xl border transition-all ${
                    rowErrors
                      ? 'bg-rose-50/20 border-rose-200'
                      : 'bg-stone-50/40 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
                      Ingredient #{index + 1}
                    </span>
                    <span className="text-xs text-stone-400">
                      {index === 0
                        ? 'e.g. Flour / Avocado / Basil'
                        : index === 1
                        ? 'e.g. Sugar / Lime / Garlic'
                        : 'e.g. Milk / Oil / Salt'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                    {/* Ingredient Name */}
                    <div className="sm:col-span-6">
                      <label
                        htmlFor={`ingredient-name-${index}`}
                        className="block text-xs font-semibold text-stone-700 mb-1"
                      >
                        Ingredient Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id={`ingredient-name-${index}`}
                        type="text"
                        value={ingredient.name}
                        onChange={(e) =>
                          handleIngredientChange(index, 'name', e.target.value)
                        }
                        placeholder={
                          index === 0
                            ? 'e.g. All-Purpose Flour'
                            : index === 1
                            ? 'e.g. Granulated Sugar'
                            : 'e.g. Whole Milk'
                        }
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 placeholder:text-stone-400 bg-white focus:outline-none focus:ring-2 transition-all ${
                          rowErrors?.name
                            ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                            : 'border-stone-200 focus:ring-emerald-700/20 focus:border-emerald-700'
                        }`}
                      />
                      {rowErrors?.name && (
                        <p className="mt-1 text-xs text-rose-600 font-medium">
                          {rowErrors.name}
                        </p>
                      )}
                    </div>

                    {/* Original Quantity (allows decimals) */}
                    <div className="sm:col-span-3">
                      <label
                        htmlFor={`ingredient-qty-${index}`}
                        className="block text-xs font-semibold text-stone-700 mb-1"
                      >
                        Original Qty <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id={`ingredient-qty-${index}`}
                        type="number"
                        step="any"
                        min="0.001"
                        value={ingredient.quantity}
                        onChange={(e) =>
                          handleIngredientChange(index, 'quantity', e.target.value)
                        }
                        placeholder="e.g. 2.5"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 placeholder:text-stone-400 bg-white focus:outline-none focus:ring-2 transition-all tabular-nums ${
                          rowErrors?.quantity
                            ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                            : 'border-stone-200 focus:ring-emerald-700/20 focus:border-emerald-700'
                        }`}
                      />
                      {rowErrors?.quantity && (
                        <p className="mt-1 text-xs text-rose-600 font-medium">
                          {rowErrors.quantity}
                        </p>
                      )}
                    </div>

                    {/* Measurement Unit */}
                    <div className="sm:col-span-3">
                      <label
                        htmlFor={`ingredient-unit-${index}`}
                        className="block text-xs font-semibold text-stone-700 mb-1"
                      >
                        Unit
                      </label>
                      <select
                        id={`ingredient-unit-${index}`}
                        value={ingredient.unit}
                        onChange={(e) =>
                          handleIngredientChange(index, 'unit', e.target.value)
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all cursor-pointer"
                      >
                        {UNIT_OPTIONS.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons: "Scale Recipe" and "Reset" */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-emerald-800 hover:bg-emerald-700 active:scale-[0.99] text-white font-semibold text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            <Scale className="w-5 h-5 text-emerald-200" />
            <span>Scale Recipe</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-[0.99] text-stone-700 font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-stone-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
            title="Reset form and clear stored results"
          >
            <RotateCcw className="w-4 h-4 text-stone-500" />
            <span>Reset</span>
          </button>
        </div>
      </form>
    </div>
  );
};
