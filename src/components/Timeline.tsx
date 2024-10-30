import React from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, Mail, Users } from 'lucide-react';
import type { JournalEntry } from '../types';

interface Props {
  entries: JournalEntry[];
}

export function Timeline({ entries }: Props) {
  return (
    <div className="relative space-y-8 before:content-[''] before:absolute before:top-0 before:left-4 before:h-full before:w-0.5 before:bg-gray-200">
      {entries.map((entry) => (
        <div key={entry.id} className="relative pl-12">
          <div className="absolute left-0 p-2 bg-white border-2 border-blue-600 rounded-full">
            <Calendar size={16} className="text-blue-600" />
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{format(parseISO(entry.date), 'MMMM d, yyyy')}</h4>
            </div>
            <p className="text-gray-600 mb-4">{entry.content}</p>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="text-purple-600" size={16} />
                <span>{entry.meetings.length} meetings</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="text-blue-600" size={16} />
                <span>{entry.emails.length} emails</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {entry.tasks.filter(t => t.completed).length}/{entry.tasks.length}
                </span>
                <span>tasks done</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}