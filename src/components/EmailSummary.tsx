import React from 'react';
import { Mail } from 'lucide-react';
import { Email } from '../types';

interface Props {
  emails: Email[];
}

export function EmailSummary({ emails }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Email Summary</h3>
      <div className="space-y-3">
        {emails.map((email) => (
          <div key={email.id} className="p-4 bg-white rounded-lg shadow-sm border">
            <div className="flex items-start gap-3">
              <Mail className="text-blue-600 mt-1" size={20} />
              <div>
                <h4 className="font-medium">{email.subject}</h4>
                <p className="text-sm text-gray-600">From: {email.from}</p>
                <p className="mt-2 text-gray-700">{email.summary}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}