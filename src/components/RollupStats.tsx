import React from 'react';
import { CheckSquare, Mail, Users, BarChart } from 'lucide-react';

interface Props {
  stats: {
    totalTasks: number;
    completedTasks: number;
    totalMeetings: number;
    totalEmails: number;
    keyHighlights: string[];
  };
}

export function RollupStats({ stats }: Props) {
  const completion = stats.totalTasks ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckSquare className="text-purple-600" />
            <h4 className="font-medium">Tasks</h4>
          </div>
          <p className="text-2xl font-bold text-purple-600">{completion}%</p>
          <p className="text-sm text-gray-600">
            {stats.completedTasks}/{stats.totalTasks} completed
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-blue-600" />
            <h4 className="font-medium">Meetings</h4>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.totalMeetings}</p>
          <p className="text-sm text-gray-600">total meetings</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="text-green-600" />
            <h4 className="font-medium">Emails</h4>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.totalEmails}</p>
          <p className="text-sm text-gray-600">emails processed</p>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <BarChart className="text-amber-600" />
            <h4 className="font-medium">Productivity</h4>
          </div>
          <p className="text-2xl font-bold text-amber-600">
            {Math.round((stats.completedTasks + stats.totalMeetings) / 8)}
          </p>
          <p className="text-sm text-gray-600">items per day</p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Key Highlights</h4>
        <ul className="space-y-2">
          {stats.keyHighlights.map((highlight, index) => (
            <li key={index} className="text-sm text-gray-600">
              • {highlight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}