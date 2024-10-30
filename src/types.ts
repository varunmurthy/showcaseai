export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  tasks: Task[];
  emails: Email[];
  meetings: Meeting[];
  images: Image[];
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface Email {
  id: string;
  subject: string;
  from: string;
  summary: string;
}

export interface Meeting {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  attendees: string[];
}

export interface Image {
  id: string;
  url: string;
  caption: string;
}

export type TimeRange = 'week' | 'month' | 'quarter' | 'year';

export interface RollupSummary {
  period: string;
  startDate: string;
  endDate: string;
  entries: JournalEntry[];
  stats: {
    totalTasks: number;
    completedTasks: number;
    totalMeetings: number;
    totalEmails: number;
    keyHighlights: string[];
  };
}