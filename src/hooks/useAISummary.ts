import { useState } from 'react';
import type { JournalEntry } from '../types';

export function useAISummary(entry: JournalEntry) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    setIsGenerating(true);
    try {
      // In a real app, you'd call your AI service here
      const summary = `Based on your calendar and emails today:

1. Attended ${entry.meetings.length} meetings:
${entry.meetings.map(m => `   - ${m.title}`).join('\n')}

2. Key email interactions:
${entry.emails.map(e => `   - ${e.subject}`).join('\n')}

3. Task Progress:
   - Completed: ${entry.tasks.filter(t => t.completed).length}
   - Pending: ${entry.tasks.filter(t => !t.completed).length}

Summary: Today was productive with multiple team collaborations and project updates.`;

      return summary;
    } catch (error) {
      console.error('Failed to generate summary:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateSummary,
    isGenerating,
  };
}