import React from 'react';
import { BookOpen, Calculator, Info, Sparkles } from 'lucide-react';

export const KitchenGuide: React.FC = () => {
  return (
    <div className="space-y-8 pt-4">
      {/* Formula Explanation Section */}
      <div
        id="scaling-formula"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm"
      >
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
          <Calculator className="w-4 h-4 text-emerald-700" />
          <span>Mathematical Principle</span>
        </div>
        <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-stone-900 mb-2">
          How Recipe Scaling Works
        </h3>
        <p className="text-sm text-stone-600 leading-relaxed max-w-3xl">
          When scaling a recipe for different crowd sizes, the proportion of each ingredient
          remains constant relative to the yield ratio. We multiply each original quantity by the
          quotient of desired servings divided by original servings.
        </p>

        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-[#F8F6F0] border border-stone-200/80 font-mono text-sm text-stone-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
              fx
            </div>
            <div>
              <span className="text-xs text-stone-500 block font-sans">Official Formula:</span>
              <span className="font-bold text-emerald-950 text-base">
                New Quantity = Original Quantity × (Desired Servings ÷ Original Servings)
              </span>
            </div>
          </div>
          <div className="text-xs font-sans text-stone-500 bg-white px-3 py-2 rounded-xl border border-stone-200/60 shrink-0">
            Example: 2 cups × (10 ÷ 4) = <strong>5 cups</strong>
          </div>
        </div>
      </div>

      {/* Measurement Quick Reference Table */}
      <div
        id="kitchen-guide"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm"
      >
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
          <BookOpen className="w-4 h-4 text-emerald-700" />
          <span>Quick Kitchen Reference</span>
        </div>
        <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-stone-900 mb-2">
          Common Cooking Measurement Equivalents
        </h3>
        <p className="text-sm text-stone-600 mb-6">
          Handy culinary conversions when reading recipes or measuring scaled amounts.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/70">
            <span className="text-xs font-bold text-emerald-900 block mb-1">1 Cup (US)</span>
            <ul className="text-xs text-stone-600 space-y-1">
              <li>· 16 Tablespoons</li>
              <li>· 48 Teaspoons</li>
              <li>· 8 Fluid Ounces</li>
              <li>· ~240 Milliliters</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/70">
            <span className="text-xs font-bold text-emerald-900 block mb-1">1 Tablespoon (tbsp)</span>
            <ul className="text-xs text-stone-600 space-y-1">
              <li>· 3 Teaspoons (tsp)</li>
              <li>· 0.5 Fluid Ounce</li>
              <li>· ~15 Milliliters</li>
              <li>· 1/16 Cup</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/70">
            <span className="text-xs font-bold text-emerald-900 block mb-1">Dry Weights</span>
            <ul className="text-xs text-stone-600 space-y-1">
              <li>· 1 kg = 1,000 grams</li>
              <li>· 1 lb = 16 ounces (oz)</li>
              <li>· 1 oz ≈ 28.35 grams</li>
              <li>· 1 lb ≈ 453.6 grams</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/70">
            <span className="text-xs font-bold text-emerald-900 block mb-1">Scaling Pro Tips</span>
            <ul className="text-xs text-stone-600 space-y-1">
              <li>· Scale salt & spices by 1.5× first</li>
              <li>· Watch baking pan surface area</li>
              <li>· Alcohol doesn't scale linearly</li>
              <li>· Adjust cooking times slightly</li>
            </ul>
          </div>
        </div>

        <div className="mt-5 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-2.5 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            <strong>Baking Note:</strong> When multiplying baking recipes by more than 3× or 4×,
            leavening agents (baking powder, baking soda, and yeast) should typically increase at a
            slightly smaller ratio (approx 1.25× to 1.5×) rather than straight multiplication.
          </span>
        </div>
      </div>
    </div>
  );
};
