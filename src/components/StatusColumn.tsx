
import React from 'react';
import { Task, Status } from '@/types/task';
import TaskCard from './TaskCard';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatusColumnProps {
  status: Status;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddClick: () => void;
}

const StatusColumn = ({ status, tasks, onTaskClick, onAddClick }: StatusColumnProps) => {
  const getStatusTitle = (status: Status) => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <h3 className="font-medium text-sm mr-2">{getStatusTitle(status)}</h3>
          <Badge variant="outline" className="text-xs">
            {tasks.length}
          </Badge>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={onAddClick}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="space-y-3 flex-1 overflow-auto">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onTaskClick} />
        ))}
      </div>
    </div>
  );
};

export default StatusColumn;
