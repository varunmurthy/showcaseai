import React from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  onGenerateSummary: () => void;
  isLoading: boolean;
}

export function AISummaryButton({ onGenerateSummary, isLoading }: Props) {
  return (
    <button
      onClick={onGenerateSummary}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Sparkles size={20} />
      {isLoading ? 'Generating Summary...' : 'Auto-Summarize My Day'}
    </button>
  );
}