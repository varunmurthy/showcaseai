import React from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { Task } from '../types';

interface Props {
  tasks: Task[];
  onToggle: (taskId: string) => void;
}

export function TaskList({ tasks, onToggle }: Props) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Tasks</h3>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
            onClick={() => onToggle(task.id)}
          >
            {task.completed ? (
              <CheckSquare className="text-green-600" size={20} />
            ) : (
              <Square className="text-gray-400" size={20} />
            )}
            <span className={task.completed ? 'line-through text-gray-500' : ''}>
              {task.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}