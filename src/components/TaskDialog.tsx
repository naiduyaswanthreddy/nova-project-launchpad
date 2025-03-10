
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TaskForm from './TaskForm';
import { Task } from '@/types/task';
import { useTaskContext } from '@/contexts/TaskContext';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  initialStatus?: string;
}

const TaskDialog = ({
  open,
  onOpenChange,
  task,
  initialStatus,
}: TaskDialogProps) => {
  const { addTask, updateTask } = useTaskContext();

  const handleSubmit = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (task) {
      updateTask({
        ...task,
        ...taskData,
      });
    } else {
      addTask({
        ...taskData,
        status: initialStatus as any || 'todo',
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        <TaskForm
          task={task}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
