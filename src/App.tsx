/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { KitchenGuide } from './components/KitchenGuide';
import { RecipeForm } from './components/RecipeForm';
import { ResultsCard } from './components/ResultsCard';
import { FormErrors, RecipeFormData, ScaledResult } from './types';
import {
  clearSavedStorage,
  INITIAL_FORM_DATA,
  loadSavedFormData,
  loadSavedResult,
  SAMPLE_RECIPES,
  saveFormData,
  saveResult,
  scaleRecipe,
  validateRecipe,
} from './utils/scaler';

export default function App() {
  const [formData, setFormData] = useState<RecipeFormData>(() => loadSavedFormData());
  const [result, setResult] = useState<ScaledResult | null>(() => loadSavedResult());
  const [errors, setErrors] = useState<FormErrors>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize form inputs to localStorage whenever they change
  useEffect(() => {
    saveFormData(formData);
  }, [formData]);

  // Synchronize result to localStorage whenever it changes
  useEffect(() => {
    if (result) {
      saveResult(result);
    }
  }, [result]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleFormChange = (nextData: RecipeFormData) => {
    setFormData(nextData);
    // If there were field errors, clear them as the user modifies values
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 4. Validation:
    // If either serving number is empty, zero, negative, or invalid, display clear error message.
    // Do not display calculated results when validation fails.
    // Validate ingredient quantities and ingredient names too.
    const validation = validateRecipe(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setResult(null); // CRITICAL requirement: "Do not display calculated results when validation fails."
      showToast('⚠️ Please fix the errors indicated on the form.');
      // Scroll to form errors
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    // Calculation
    setErrors({});
    const calculatedResult = scaleRecipe(formData);
    setResult(calculatedResult);
    showToast(`✓ Scaled "${calculatedResult.dishName}" to ${calculatedResult.desiredServings} servings!`);

    // On mobile, scroll to results card
    const resultsElement = document.getElementById('results-section');
    if (resultsElement && window.innerWidth < 1024) {
      setTimeout(() => {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setResult(null);
    setErrors({});
    clearSavedStorage();
    showToast('Form and saved results have been reset.');
  };

  const handleSelectSample = (sample: RecipeFormData) => {
    setFormData(sample);
    setErrors({});
    // Compute calculation immediately for seamless demo
    const calculated = scaleRecipe(sample);
    setResult(calculated);
    showToast(`Loaded sample recipe: ${sample.dishName}`);
  };

  const handleLoadRandomSample = () => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_RECIPES.length);
    handleSelectSample(SAMPLE_RECIPES[randomIndex].data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800">
      <Header onLoadSample={handleLoadRandomSample} />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 text-sm font-medium px-4 py-2.5 rounded-2xl shadow-lg border border-stone-800 flex items-center gap-2 animate-bounce"
        >
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Intro Bar */}
      <section className="bg-gradient-to-b from-[#F4EFE6] to-[#FAF8F5] border-b border-stone-200/60 py-10 sm:py-14 print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 block">
              Culinary Measurement Calculator
            </span>
            <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
              Scale any recipe with exact culinary precision.
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
              Adjust your dishes effortlessly whether cooking dinner for two or hosting a banquet
              for twenty. Handles decimal quantities, grams, cups, tablespoons, and pieces with automatic offline persistence.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-stone-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Formula: New Qty = Original × Desired ÷ Original
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Persistent in local storage
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                100% Offline Capable
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Interactive Workspace Grid: Form on left, Results on right */}
        <div id="scaler-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input Form */}
          <section className="lg:col-span-7" aria-label="Recipe configuration form">
            <RecipeForm
              formData={formData}
              errors={errors}
              onChange={handleFormChange}
              onSubmit={handleSubmit}
              onReset={handleReset}
              onSelectSample={handleSelectSample}
            />
          </section>

          {/* Right Column: Calculated Results */}
          <section className="lg:col-span-5 sticky top-24" aria-label="Calculation results">
            <ResultsCard result={result} />
          </section>
        </div>

        {/* Informative Kitchen Guide & Math Section */}
        <section className="border-t border-stone-200/80 pt-8 print:hidden" aria-label="Culinary scaling guide">
          <KitchenGuide />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-[#F4EFE6]/70 py-8 print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-serif-display font-bold text-stone-800 text-sm">Recipe Scaler</span>
            <span aria-hidden="true">·</span>
            <span>Client-side cooking calculator with offline persistence</span>
          </div>

          <div className="flex items-center gap-4 text-stone-500">
            <span>Formula: Qty × Desired ÷ Original</span>
            <span aria-hidden="true">·</span>
            <span>Light cream & green culinary theme</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
