import React, { useState, useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Mail, CheckSquare, LayoutDashboard, Settings, Bell } from 'lucide-react';
import { JournalEditor } from './components/JournalEditor';
import { TaskList } from './components/TaskList';
import { EmailSummary } from './components/EmailSummary';
import { MeetingList } from './components/MeetingList';
import { JournalSummary } from './components/JournalSummary';
import { SettingsPage } from './components/SettingsPage';
import { UserMenu } from './components/UserMenu';
import { useAISummary } from './hooks/useAISummary';
import type { JournalEntry, Image } from './types';

type Tab = 'summary' | 'daily' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('summary');
  const [entry, setEntry] = useState<JournalEntry>({
    id: '1',
    date: new Date().toISOString(),
    content: '',
    images: [],
    tasks: [
      { id: '1', title: 'Review project proposal', completed: false },
      { id: '2', title: 'Send weekly report', completed: true },
      { id: '3', title: 'Update documentation', completed: false },
    ],
    emails: [
      {
        id: '1',
        subject: 'Project Update Meeting Notes',
        from: 'sarah@company.com',
        summary: 'Key decisions from today\'s project review meeting attached.',
      },
      {
        id: '2',
        subject: 'New Feature Requirements',
        from: 'john@company.com',
        summary: 'Updated specifications for the upcoming release.',
      },
    ],
    meetings: [
      {
        id: '1',
        title: 'Team Standup',
        startTime: '2024-03-28T09:00:00Z',
        endTime: '2024-03-28T09:30:00Z',
        attendees: ['Team A', 'Team B'],
      },
      {
        id: '2',
        title: 'Client Review',
        startTime: '2024-03-28T14:00:00Z',
        endTime: '2024-03-28T15:00:00Z',
        attendees: ['Client', 'Project Manager', 'Tech Lead'],
      },
    ],
  });

  const [entries] = useState<JournalEntry[]>([entry]);
  const { generateSummary, isGenerating } = useAISummary(entry);

  const handleSave = useCallback((content: string) => {
    setEntry((prev) => ({ ...prev, content }));
    setActiveTab('summary');
  }, []);

  const handleToggleTask = useCallback((taskId: string) => {
    setEntry((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));
  }, []);

  const handleAddImage = useCallback((image: Image) => {
    setEntry((prev) => ({
      ...prev,
      images: [...prev.images, image],
    }));
  }, []);

  const handleRemoveImage = useCallback((imageId: string) => {
    setEntry((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }));
  }, []);

  const handleGenerateSummary = useCallback(async () => {
    try {
      const summary = await generateSummary();
      setEntry((prev) => ({ ...prev, content: summary }));
    } catch (error) {
      console.error('Failed to generate summary:', error);
    }
  }, [generateSummary]);

  const currentDate = useMemo(() => format(new Date(), 'EEEE, MMMM d, yyyy'), []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-gray-900">Showcase AI</h1>
              <div className="text-gray-500">{currentDate}</div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell size={20} />
              </button>
              <UserMenu />
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'summary'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <LayoutDashboard size={20} />
              Home
            </button>
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'daily'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <CalendarIcon size={20} />
              Daily View
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Settings size={20} />
              Settings
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'daily' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Today's Journal</h2>
                <JournalEditor
                  entry={entry}
                  onSave={handleSave}
                  onAddImage={handleAddImage}
                  onRemoveImage={handleRemoveImage}
                  onGenerateSummary={handleGenerateSummary}
                  isGeneratingSummary={isGenerating}
                />
              </section>

              <section className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="text-blue-600" />
                  <h2 className="text-xl font-semibold">Email Digest</h2>
                </div>
                <EmailSummary emails={entry.emails} />
              </section>
            </div>

            <div className="space-y-8">
              <section className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <CheckSquare className="text-green-600" />
                  <h2 className="text-xl font-semibold">Tasks</h2>
                </div>
                <TaskList tasks={entry.tasks} onToggle={handleToggleTask} />
              </section>

              <section className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarIcon className="text-purple-600" />
                  <h2 className="text-xl font-semibold">Calendar</h2>
                </div>
                <MeetingList meetings={entry.meetings} />
              </section>
            </div>
          </div>
        )}

        {activeTab === 'summary' && (
          <JournalSummary entries={entries} onEditToday={() => setActiveTab('daily')} />
        )}

        {activeTab === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
}