
import React from 'react';
import { Priority } from '@/types/task';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

const PriorityBadge = ({ priority, className }: PriorityBadgeProps) => {
  const getPriorityClass = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return '';
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border',
        getPriorityClass(priority),
        className
      )}
    >
      <span className={`priority-dot priority-${priority}`}></span>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </div>
  );
};

export default PriorityBadge;
