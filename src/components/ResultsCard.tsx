import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  ChefHat,
  Copy,
  Printer,
  Sparkles,
  Utensils,
} from 'lucide-react';
import { ScaledResult } from '../types';
import { formatAsFraction, formatQuantityNumber } from '../utils/scaler';

interface ResultsCardProps {
  result: ScaledResult | null;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({ result }) => {
  const [useFractions, setUseFractions] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!result) {
    return (
      <div
        id="results-section"
        className="bg-white/70 rounded-3xl p-8 border border-dashed border-stone-300 text-center flex flex-col items-center justify-center min-h-[380px]"
      >
        <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
          <Utensils className="w-7 h-7 stroke-[1.5]" />
        </div>
        <h3 className="font-serif-display text-xl font-bold text-stone-800">
          No Scaled Recipe Yet
        </h3>
        <p className="text-sm text-stone-500 max-w-sm mt-1 mb-4">
          Fill in your dish name, serving sizes, and 3 ingredients, then click{' '}
          <strong className="text-stone-700">"Scale Recipe"</strong> to view your adjusted measurements.
        </p>
        <div className="text-xs text-stone-400 bg-stone-100/70 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
          <span>Formula:</span>
          <code className="text-stone-600 font-mono">
            New Qty = Original Qty × Desired ÷ Original
          </code>
        </div>
      </div>
    );
  }

  const handleCopy = async () => {
    const textLines = [
      `🍳 ${result.dishName.toUpperCase()}`,
      `Scaled for ${result.desiredServings} servings (originally ${result.originalServings} servings - ${result.scaleFactor.toFixed(2)}× multiplier)`,
      '',
      'Scaled Ingredients:',
      ...result.scaledIngredients.map((item, idx) => {
        const scaledFormatted = useFractions
          ? formatAsFraction(item.scaledQuantity)
          : formatQuantityNumber(item.scaledQuantity);
        const origFormatted = useFractions
          ? formatAsFraction(item.originalQuantity)
          : formatQuantityNumber(item.originalQuantity);
        return `${idx + 1}. ${item.name}: ${scaledFormatted} ${item.unit} (was ${origFormatted} ${item.unit})`;
      }),
      '',
      'Calculated with Recipe Scaler',
    ];

    try {
      await navigator.clipboard.writeText(textLines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formattedMultiplier =
    Number.isInteger(result.scaleFactor)
      ? `${result.scaleFactor}×`
      : `${result.scaleFactor.toFixed(2)}×`;

  return (
    <div
      id="results-section"
      className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm relative overflow-hidden transition-all print:border-none print:shadow-none print:p-0"
    >
      {/* Decorative top accent border */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 print:hidden" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            <ChefHat className="w-4 h-4 text-emerald-700" />
            <span>Scaled Recipe Output</span>
          </div>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {result.dishName}
          </h2>
          <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
            <span>Calculated for {result.desiredServings} servings</span>
            <span aria-hidden="true">·</span>
            <span>Scale factor {formattedMultiplier}</span>
          </div>
        </div>

        {/* Action buttons (Print, Copy, Fraction Toggle) */}
        <div className="flex items-center gap-2 flex-wrap print:hidden">
          {/* Fraction vs Decimal toggle */}
          <div className="flex items-center p-1 bg-stone-100 rounded-xl text-xs font-medium border border-stone-200/60">
            <button
              type="button"
              onClick={() => setUseFractions(false)}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                !useFractions
                  ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Decimals
            </button>
            <button
              type="button"
              onClick={() => setUseFractions(true)}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                useFractions
                  ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Fractions
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer shadow-xs"
            title="Copy scaled recipe to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer shadow-xs"
            title="Print recipe card"
          >
            <Printer className="w-3.5 h-3.5 text-stone-500" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Serving Comparison Banner */}
      <div className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60">
        <div className="text-center sm:text-left">
          <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-800">
            Original Yield
          </span>
          <p className="text-xl font-bold text-stone-900 tabular-nums">
            {result.originalServings}{' '}
            <span className="text-sm font-medium text-stone-600">servings</span>
          </p>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white text-emerald-900 text-xs font-semibold shadow-xs border border-emerald-200/80">
            <span>Scaled by</span>
            <span className="text-emerald-700 font-mono font-bold text-sm">
              {formattedMultiplier}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
          </div>
        </div>

        <div className="text-center sm:text-right">
          <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-800">
            Desired Yield
          </span>
          <p className="text-xl font-bold text-emerald-900 tabular-nums">
            {result.desiredServings}{' '}
            <span className="text-sm font-medium text-emerald-700">servings</span>
          </p>
        </div>
      </div>

      {/* Ingredient Results List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700">
            Scaled Ingredients (3 Items)
          </h3>
          <span className="text-xs text-stone-500">
            Formula applied: <code className="font-mono text-emerald-800">orig × {result.desiredServings} / {result.originalServings}</code>
          </span>
        </div>

        <div className="space-y-3">
          {result.scaledIngredients.map((item, index) => {
            const originalDisplay = useFractions
              ? formatAsFraction(item.originalQuantity)
              : formatQuantityNumber(item.originalQuantity);
            const scaledDisplay = useFractions
              ? formatAsFraction(item.scaledQuantity)
              : formatQuantityNumber(item.scaledQuantity);

            return (
              <div
                key={index}
                className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-emerald-50/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-stone-900">
                      {item.name}
                    </h4>
                    <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                      <span>Original:</span>
                      <span className="font-medium text-stone-700 tabular-nums">
                        {originalDisplay} {item.unit}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200/60">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block sm:hidden">
                      Calculated Quantity:
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-emerald-900 tabular-nums">
                      {scaledDisplay}
                    </span>{' '}
                    <span className="text-sm font-semibold text-emerald-800">
                      {item.unit}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Persistence Note Footer */}
      <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-2 print:hidden">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Saved to offline local storage. Will persist across reloads.
        </span>
        <span>
          Saved at {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};
