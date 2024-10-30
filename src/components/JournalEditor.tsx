import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { JournalEntry } from '../types';
import { ImageUploader } from './ImageUploader';
import { AISummaryButton } from './AISummaryButton';

interface Props {
  entry: JournalEntry;
  onSave: (content: string) => void;
  onAddImage: (image: { url: string; caption: string }) => void;
  onRemoveImage: (imageId: string) => void;
  onGenerateSummary: () => void;
  isGeneratingSummary: boolean;
}

export function JournalEditor({
  entry,
  onSave,
  onAddImage,
  onRemoveImage,
  onGenerateSummary,
  isGeneratingSummary,
}: Props) {
  const [content, setContent] = useState(entry.content);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <AISummaryButton
          onGenerateSummary={onGenerateSummary}
          isLoading={isGeneratingSummary}
        />
      </div>

      <textarea
        className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write about your day..."
      />

      <ImageUploader
        images={entry.images}
        onAddImage={onAddImage}
        onRemoveImage={onRemoveImage}
      />

      <button
        onClick={() => onSave(content)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Save size={20} />
        Save Entry
      </button>
    </div>
  );
}