import React from 'react';
import { Calendar } from 'lucide-react';
import { Meeting } from '../types';
import { format } from 'date-fns';

interface Props {
  meetings: Meeting[];
}

export function MeetingList({ meetings }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Today's Meetings</h3>
      <div className="space-y-3">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="p-4 bg-white rounded-lg shadow-sm border">
            <div className="flex items-start gap-3">
              <Calendar className="text-purple-600 mt-1" size={20} />
              <div>
                <h4 className="font-medium">{meeting.title}</h4>
                <p className="text-sm text-gray-600">
                  {format(new Date(meeting.startTime), 'h:mm a')} -{' '}
                  {format(new Date(meeting.endTime), 'h:mm a')}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {meeting.attendees.join(', ')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}