import React, { useState, useMemo } from 'react';
import {
  format,
  parseISO,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
  subQuarters,
  subYears,
  isToday,
} from 'date-fns';
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Download,
  BarChart3,
  Edit2,
  X,
  ZoomIn,
  Image as ImageIcon,
} from 'lucide-react';
import type { JournalEntry, TimeRange, RollupSummary } from '../types';
import { Timeline } from './Timeline';
import { RollupStats } from './RollupStats';
import { StreakChart } from './StreakChart';
import { exportToSlides } from '../utils/slideExport';

interface Props {
  entries: JournalEntry[];
  onEditToday: () => void;
}

export function JournalSummary({ entries, onEditToday }: Props) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('week');
  const [expandedPeriods, setExpandedPeriods] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const todayEntry = useMemo(() => 
    entries.find(entry => isToday(parseISO(entry.date))),
    [entries]
  );

  const getRollupPeriods = (range: TimeRange) => {
    const now = new Date();
    switch (range) {
      case 'week':
        return Array.from({ length: 12 }, (_, i) => ({
          start: startOfWeek(subMonths(now, i)),
          end: endOfWeek(subMonths(now, i)),
        }));
      case 'month':
        return Array.from({ length: 12 }, (_, i) => ({
          start: startOfMonth(subMonths(now, i)),
          end: endOfMonth(subMonths(now, i)),
        }));
      case 'quarter':
        return Array.from({ length: 4 }, (_, i) => ({
          start: startOfMonth(subQuarters(now, i)),
          end: endOfMonth(subQuarters(now, i)),
        }));
      case 'year':
        return Array.from({ length: 3 }, (_, i) => ({
          start: startOfYear(subYears(now, i)),
          end: endOfYear(subYears(now, i)),
        }));
      default:
        return [];
    }
  };

  const rollups = useMemo(() => {
    const periods = getRollupPeriods(selectedRange);

    return periods
      .map(({ start, end }) => {
        const periodEntries = entries.filter((entry) =>
          isWithinInterval(parseISO(entry.date), { start, end })
        );

        const stats = {
          totalTasks: periodEntries.reduce(
            (sum, entry) => sum + entry.tasks.length,
            0
          ),
          completedTasks: periodEntries.reduce(
            (sum, entry) => sum + entry.tasks.filter((t) => t.completed).length,
            0
          ),
          totalMeetings: periodEntries.reduce(
            (sum, entry) => sum + entry.meetings.length,
            0
          ),
          totalEmails: periodEntries.reduce(
            (sum, entry) => sum + entry.emails.length,
            0
          ),
          keyHighlights: periodEntries
            .slice(0, 3)
            .map((entry) => entry.content.slice(0, 100) + '...'),
        };

        return {
          period: format(start, 'MMMM d, yyyy'),
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          entries: periodEntries,
          stats,
        };
      })
      .filter((rollup) => rollup.entries.length > 0);
  }, [entries, selectedRange]);

  const togglePeriod = (period: string) => {
    setExpandedPeriods((prev) =>
      prev.includes(period)
        ? prev.filter((p) => p !== period)
        : [...prev, period]
    );
  };

  const handleExport = async (rollup: RollupSummary) => {
    await exportToSlides(rollup);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {todayEntry && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Today's Entry</h2>
            <button
              onClick={onEditToday}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 size={20} />
              Edit Entry
            </button>
          </div>
          
          <div className="flex gap-6 mb-6">
            <div className="flex-1 prose max-w-none">
              <p className="text-gray-700">{todayEntry.content}</p>
            </div>
            {todayEntry.images.length > 0 && (
              <div 
                className="relative w-48 h-48 flex-shrink-0 cursor-pointer group"
                onClick={() => setSelectedImage(todayEntry.images[0].url)}
              >
                <img
                  src={todayEntry.images[0].url}
                  alt={todayEntry.images[0].caption || 'Journal image'}
                  className="w-full h-full object-cover rounded-lg"
                />
                {todayEntry.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-lg text-sm flex items-center gap-1">
                    <ImageIcon size={14} />
                    +{todayEntry.images.length - 1}
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                  <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Tasks</h4>
              <p className="text-purple-600">
                {todayEntry.tasks.filter(t => t.completed).length}/{todayEntry.tasks.length} completed
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Meetings</h4>
              <p className="text-blue-600">{todayEntry.meetings.length} scheduled</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Emails</h4>
              <p className="text-green-600">{todayEntry.emails.length} processed</p>
            </div>
          </div>
        </div>
      )}

      <StreakChart entries={entries} />

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Journal Summary</h2>
          <div className="flex gap-2">
            {(['week', 'month', 'quarter', 'year'] as TimeRange[]).map(
              (range) => (
                <button
                  key={range}
                  onClick={() => setSelectedRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        <div className="space-y-4">
          {rollups.map((rollup) => (
            <div
              key={rollup.period}
              className="border rounded-lg overflow-hidden"
            >
              <div
                className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                onClick={() => togglePeriod(rollup.period)}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="text-blue-600" size={20} />
                  <h3 className="text-lg font-semibold">{rollup.period}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExport(rollup);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Download size={16} />
                    Export Slides
                  </button>
                  {expandedPeriods.includes(rollup.period) ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>
              </div>

              {expandedPeriods.includes(rollup.period) && (
                <div className="p-4 space-y-6">
                  <RollupStats stats={rollup.stats} />
                  <Timeline entries={rollup.entries} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
            <img
              src={selectedImage}
              alt="Full size"
              className="w-full h-auto rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}