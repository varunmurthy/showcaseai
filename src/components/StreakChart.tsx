import React, { useMemo } from 'react';
import { format, eachDayOfInterval, subDays, isEqual, parseISO, startOfDay } from 'date-fns';
import { Calendar, Flame } from 'lucide-react';
import type { JournalEntry } from '../types';

interface Props {
  entries: JournalEntry[];
  days?: number;
}

export function StreakChart({ entries, days: dayCount = 30 }: Props) {
  const days = useMemo(() => {
    const today = new Date();
    const startDate = subDays(today, dayCount);
    
    return eachDayOfInterval({ start: startDate, end: today }).map(date => {
      const entry = entries.find(e => 
        isEqual(startOfDay(parseISO(e.date)), startOfDay(date))
      );
      
      return {
        date,
        hasEntry: Boolean(entry),
        content: entry?.content || '',
      };
    });
  }, [entries, dayCount]);

  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].hasEntry) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [days]);

  const longestStreak = useMemo(() => {
    let longest = 0;
    let current = 0;
    
    for (const day of days) {
      if (day.hasEntry) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 0;
      }
    }
    
    return longest;
  }, [days]);

  const getIntensityClass = (hasEntry: boolean, content: string) => {
    if (!hasEntry) return 'bg-gray-100';
    const contentLength = content.length;
    if (contentLength > 500) return 'bg-green-600';
    if (contentLength > 250) return 'bg-green-500';
    if (contentLength > 100) return 'bg-green-400';
    return 'bg-green-300';
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Flame className="text-orange-500" size={20} />
            <span className="font-medium text-gray-900">{currentStreak} Day Streak</span>
          </div>
          <span className="text-gray-400">|</span>
          <div className="text-sm text-gray-600">
            Longest: {longestStreak} days
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-gray-100" />
            <div className="w-3 h-3 rounded-sm bg-green-300" />
            <div className="w-3 h-3 rounded-sm bg-green-400" />
            <div className="w-3 h-3 rounded-sm bg-green-500" />
            <div className="w-3 h-3 rounded-sm bg-green-600" />
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2">
        {days.map((day, index) => (
          <div
            key={index}
            className={`flex-shrink-0 w-6 h-6 rounded-sm ${getIntensityClass(day.hasEntry, day.content)}`}
            title={`${format(day.date, 'MMM d, yyyy')}${day.hasEntry ? '\n' + day.content.slice(0, 100) + '...' : '\nNo entry'}`}
          />
        ))}
      </div>
    </div>
  );
}