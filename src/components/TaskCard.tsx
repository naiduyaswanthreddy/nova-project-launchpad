
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Task } from '@/types/task';
import PriorityBadge from './PriorityBadge';
import TaskTag from './TaskTag';
import { format } from 'date-fns';
import { MoreHorizontal, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTaskContext } from '@/contexts/TaskContext';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const { deleteTask } = useTaskContext();

  return (
    <Card className="task-card animate-fade-in">
      <CardHeader className="pb-2 flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">{task.title}</h3>
          <div className="flex gap-1 mt-1 flex-wrap">
            {task.tags.map((tag) => (
              <TaskTag key={tag.id} tag={tag} />
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <PriorityBadge priority={task.priority} />
          <Button variant="ghost" size="icon" className="h-8 w-8 ml-1" onClick={() => onEdit(task)}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        {task.dueDate ? (
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {format(task.dueDate, 'MMM dd, yyyy')}
          </div>
        ) : (
          <div />
        )}
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onEdit(task)}
            className="h-7 px-2 text-xs"
          >
            Edit
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => deleteTask(task.id)}
            className="h-7 px-2 text-xs text-destructive hover:text-destructive"
          >
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
