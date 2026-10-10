import React from 'react';
import { ChefHat, Sparkles } from 'lucide-react';

interface HeaderProps {
  onLoadSample: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoadSample }) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#"
          className="flex items-center gap-2.5 text-stone-900 group whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-md py-1"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-50 flex items-center justify-center shadow-xs">
            <ChefHat className="w-5 h-5 text-emerald-200" />
          </div>
          <span className="font-serif-display text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
            Recipe Scaler
          </span>
        </a>

        {/* Zone 2: Clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <a
            href="#scaler-section"
            className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0"
          >
            Scale Recipe
          </a>
          <a
            href="#results-section"
            className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0"
          >
            Latest Results
          </a>
          <a
            href="#kitchen-guide"
            className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0"
          >
            Kitchen Guide
          </a>
          <a
            href="#scaling-formula"
            className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0"
          >
            The Formula
          </a>
        </nav>

        {/* Zone 3: 1 Primary contextual action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-emerald-900 bg-emerald-100/80 hover:bg-emerald-200/80 rounded-xl transition-colors cursor-pointer border border-emerald-300/50 whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            title="Load an example recipe to test instantly"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Load Sample</span>
          </button>
        </div>
      </div>
    </header>
  );
};
