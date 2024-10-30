import type { RollupSummary } from '../types';
import { format, parseISO } from 'date-fns';

export async function exportToSlides(rollup: RollupSummary) {
  // In a real app, this would generate and download a PowerPoint/Google Slides
  // For now, we'll create a simple HTML-based slide deck
  const slides = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Work Summary - ${rollup.period}</title>
      <style>
        body { font-family: system-ui, sans-serif; margin: 0; }
        .slide { height: 100vh; padding: 2rem; page-break-after: always; }
        .title { font-size: 2.5rem; margin-bottom: 2rem; }
        .stat { font-size: 1.5rem; margin: 1rem 0; }
        .highlight { font-size: 1.25rem; margin: 0.5rem 0; }
      </style>
    </head>
    <body>
      <div class="slide">
        <h1 class="title">Work Summary</h1>
        <h2>${format(parseISO(rollup.startDate), 'MMMM d, yyyy')} - ${format(parseISO(rollup.endDate), 'MMMM d, yyyy')}</h2>
        <div class="stat">Tasks: ${rollup.stats.completedTasks}/${rollup.stats.totalTasks} completed</div>
        <div class="stat">Meetings: ${rollup.stats.totalMeetings}</div>
        <div class="stat">Emails: ${rollup.stats.totalEmails}</div>
      </div>
      <div class="slide">
        <h1 class="title">Key Highlights</h1>
        ${rollup.stats.keyHighlights.map(highlight => `
          <p class="highlight">• ${highlight}</p>
        `).join('')}
      </div>
    </body>
    </html>
  `;

  // Create a Blob and trigger download
  const blob = new Blob([slides], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `summary-${rollup.period.toLowerCase().replace(/\s+/g, '-')}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}