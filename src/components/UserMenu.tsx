import React, { useState } from 'react';
import { User, Settings, LogOut } from 'lucide-react';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <User className="text-white" size={16} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
            <User size={16} />
            Profile
          </button>
          <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
            <Settings size={16} />
            Settings
          </button>
          <hr className="my-1" />
          <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2">
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}